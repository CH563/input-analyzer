
'use client';

import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyboardTester } from '@/components/input-analyzer/keyboard-tester';
import { MouseTester } from '@/components/input-analyzer/mouse-tester';
import { KeyStatusLegend } from '@/components/input-analyzer/key-status-legend';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, MonitorPlay, Timer } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function InputAnalyzerPage() {
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('N/A');
  const [lastMouseButton, setLastMouseButton] = useState<string>('N/A');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [activeMouseButton, setActiveMouseButton] = useState<string | null>(null);
  const [keyDownTimestamp, setKeyDownTimestamp] = useState<number | null>(null);
  const [keyPressDelay, setKeyPressDelay] = useState<number | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    let keyDisplayValue = event.key;
    const target = event.target as HTMLElement;
    const isEditable = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    if (event.code === 'Space') {
      keyDisplayValue = 'Space';
    } else if (event.code.startsWith('Key')) {
      keyDisplayValue = event.key.toUpperCase();
    } else if (event.code.startsWith('Digit')) {
      keyDisplayValue = event.key;
    } else if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
        let prefix = '';
        if (event.ctrlKey) prefix += 'Ctrl+';
        if (event.metaKey) prefix += 'Meta+';
        if (event.altKey) prefix += 'Alt+';
        if (event.shiftKey && !['Control', 'Alt', 'Meta', 'Shift'].includes(event.key)) {
             if (event.key.length > 1 && event.key !== 'Shift') prefix += 'Shift+';
        }
        
        let baseKey = event.key;
        if (event.code === 'Space') baseKey = 'Space';
        if (['Control', 'Alt', 'Meta', 'Shift'].includes(event.key)) {
            keyDisplayValue = event.key; 
        } else {
            keyDisplayValue = `${prefix}${baseKey}`;
        }
    }

    const codesToAlwaysPrevent = [
      'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Tab', 
      'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
    ];
    
    if (codesToAlwaysPrevent.includes(event.code) && !isEditable) {
      event.preventDefault();
    }
    
    if (event.key === '/' && !isEditable) {
        event.preventDefault();
    }

    if ((event.ctrlKey || event.metaKey)) {
        if (!isEditable) {
             const commonShortcutKeys = ['r', 's', 'p', 'f', 'g', 'h', 'j', 'k', 'l', 'a', 'w', 'q', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 't', 'y', 'u', 'i', 'o', 'd', 'e', '+', '-', '='];
             if (commonShortcutKeys.includes(event.key.toLowerCase()) || event.code.startsWith("Digit")) {
                 event.preventDefault();
                 const modifier = event.ctrlKey ? 'Ctrl' : 'Meta';
                 const displayKey = event.key.length === 1 ? event.key.toUpperCase() : event.key;
                 keyDisplayValue = `${modifier}+${displayKey}`;
             }
        }
    }
    if (event.key === 'Backspace' && !isEditable) {
        event.preventDefault();
    }

    setLastKeyPressed(keyDisplayValue);
    setActiveKey(event.code);
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(event.code);
      return newSet;
    });
    setTimeout(() => setActiveKey(null), 200);

    setKeyDownTimestamp(performance.now());
    setKeyPressDelay(null);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (keyDownTimestamp) {
      const upTime = performance.now();
      const delay = Math.round(upTime - keyDownTimestamp);
      setKeyPressDelay(delay);
      setKeyDownTimestamp(null);
    }
  }, [keyDownTimestamp]);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    let buttonName = 'N/A';
    switch (event.button) {
      case 0:
        buttonName = 'Left Click';
        break;
      case 1:
        buttonName = 'Middle Click';
        break;
      case 2:
        buttonName = 'Right Click';
        break;
      case 3:
        buttonName = 'Browser Back';
        break;
      case 4:
        buttonName = 'Browser Forward';
        break;
      default:
        buttonName = `Button ${event.button}`;
    }
    setLastMouseButton(buttonName);
    setActiveMouseButton(buttonName);

    if (event.button === 2) { 
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
            // event.preventDefault(); // This was moved to global contextmenu listener
        }
    }
    setTimeout(() => setActiveMouseButton(null), 200);
  }, []);
  
  const handleMouseUp = useCallback((_event: MouseEvent) => {
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => handleKeyDown(e);
    const handleGlobalKeyUp = (e: KeyboardEvent) => handleKeyUp(e);
    const handleGlobalMouseDown = (e: MouseEvent) => handleMouseDown(e);
    const handleGlobalMouseUp = (e: MouseEvent) => handleMouseUp(e);
    
    const preventContextMenuGlobal = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
            event.preventDefault();
        }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('keyup', handleGlobalKeyUp);
    document.addEventListener('mousedown', handleGlobalMouseDown); 
    document.addEventListener('mouseup', handleGlobalMouseUp); 
    document.addEventListener('contextmenu', preventContextMenuGlobal); 

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('keyup', handleGlobalKeyUp);
      document.removeEventListener('mousedown', handleGlobalMouseDown);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('contextmenu', preventContextMenuGlobal);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp]);

  return (
    <TooltipProvider>
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 md:p-8 selection:bg-accent selection:text-accent-foreground">
      <header className="mb-4 text-center w-full max-w-6xl flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MonitorPlay className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground text-left">Input Analyzer</h1>
            <p className="text-muted-foreground mt-1 text-sm text-left">
              Test your keyboard and mouse inputs.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <KeyStatusLegend />
          <ThemeSwitcher />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl mb-4">
        <Card className="shadow-lg">
          <CardHeader className="p-3">
            <CardTitle className="text-lg text-foreground">Last Key Pressed</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-xl font-mono text-accent min-h-[2.25rem] flex items-center justify-center p-2 bg-muted rounded-md break-all">
              {lastKeyPressed}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="p-3">
            <CardTitle className="text-lg text-foreground">Last Mouse Button</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-xl font-mono text-accent min-h-[2.25rem] flex items-center justify-center p-2 bg-muted rounded-md">
              {lastMouseButton}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="p-3">
            <CardTitle className="text-lg text-foreground flex items-center">
              <Timer className="h-4 w-4 mr-2" /> Key Press Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-xl font-mono text-accent min-h-[2.25rem] flex items-center justify-center p-2 bg-muted rounded-md">
              {keyPressDelay === null ? 'N/A' : `${keyPressDelay} ms`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-4 w-full max-w-6xl" />
      
      <div className="w-full max-w-6xl space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-xl text-foreground">Keyboard Visualizer</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Press keys to see them light up. Common browser shortcuts (e.g., Ctrl+R, F5) are prevented on this page.</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <KeyboardTester activeKey={activeKey} pressedKeys={pressedKeys} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-xl text-foreground">Mouse Visualizer</CardTitle>
             <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Click mouse buttons to see them light up. Right-click context menu is disabled on this page (except in input fields).</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="flex justify-center p-4 pt-0">
            <MouseTester activeMouseButton={activeMouseButton} />
          </CardContent>
        </Card>
      </div>

      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Input Analyzer. All rights reserved.</p>
      </footer>
    </div>
    </TooltipProvider>
  );
}
