
'use client';

import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyboardTester } from '@/components/input-analyzer/keyboard-tester';
import { MouseTester } from '@/components/input-analyzer/mouse-tester';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, MonitorPlay } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function InputAnalyzerPage() {
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('N/A');
  const [lastMouseButton, setLastMouseButton] = useState<string>('N/A');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeMouseButton, setActiveMouseButton] = useState<string | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    let keyDisplayValue = event.key;
    const target = event.target as HTMLElement;
    const isEditable = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    // --- Key display normalization ---
    if (event.code === 'Space') {
      keyDisplayValue = 'Space';
    } else if (event.code.startsWith('Key')) { // e.g., KeyA, KeyB
      keyDisplayValue = event.key.toUpperCase();
    } else if (event.code.startsWith('Digit')) { // e.g., Digit1, Digit2
      keyDisplayValue = event.key; 
    } else if (event.ctrlKey || event.metaKey) {
      // For Ctrl/Meta combinations, ensure the base key is also normalized if needed
      let baseKey = event.key;
      if (event.code === 'Space') baseKey = 'Space';
      else if (event.code.startsWith('Key')) baseKey = event.key.toUpperCase();
      // ... any other specific normalizations for combo keys
      keyDisplayValue = `${event.ctrlKey ? 'Ctrl' : 'Meta'}+${baseKey}`;
    }
    // For other keys like 'Enter', 'Tab', 'ArrowUp', event.key is usually fine.


    // --- Prevent default behaviors ---
    // Prevent default for Ctrl/Meta combinations like Ctrl+R, Ctrl+S, Ctrl+P
    if (event.ctrlKey || event.metaKey) {
      const keyForCombo = event.key.toLowerCase();
      if (['r', 's', 'p', 'f', 'g', 'h', 'j', 'k', 'l', 'a', 'w', 'q', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 't', 'y', 'u', 'i', 'o', 'd', 'e'].includes(keyForCombo) || event.code.startsWith("Digit") || event.code === "Minus" || event.code === "Equal" ) {
        event.preventDefault();
      }
    }

    const codesToAlwaysPrevent = [
      'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
    ];
    
    const codesToPreventContextually = ['Tab', 'Enter', 'Backspace'];

    if (codesToAlwaysPrevent.includes(event.code)) {
      event.preventDefault();
    } else if (codesToPreventContextually.includes(event.code)) {
      if (!isEditable) {
        event.preventDefault();
      }
    }
    
    // For "/" key to prevent quick find in Firefox, unless in an input.
    if (event.key === '/' && !isEditable) {
        event.preventDefault();
    }
    
    // --- Update UI state for the key press ---
    setLastKeyPressed(keyDisplayValue);
    setActiveKey(event.code);
    setTimeout(() => setActiveKey(null), 200);

  }, []);

  const handleKeyUp = useCallback((_event: KeyboardEvent) => {
    // Can be used to remove active state if key is held, but timeout is simpler for now
  }, []);

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

    // Prevent context menu on right click globally for the testing page.
    if (event.button === 2) {
        event.preventDefault(); 
    }
    setTimeout(() => setActiveMouseButton(null), 200);
  }, []);
  
  const handleMouseUp = useCallback((_event: MouseEvent) => {
     // Can be used to remove active state if button is held
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    const preventContextMenuGlobal = (event: MouseEvent) => {
        event.preventDefault();
    };
    // Add contextmenu listener to window to catch all right-clicks
    window.addEventListener('contextmenu', preventContextMenuGlobal);


    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', preventContextMenuGlobal);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp]);

  return (
    <TooltipProvider>
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8 selection:bg-accent selection:text-accent-foreground">
      <header className="mb-6 text-center">
        <div className="flex items-center justify-center space-x-3">
          <MonitorPlay className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Input Analyzer</h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Test your keyboard and mouse inputs with visual feedback.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Last Key Pressed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono text-accent min-h-[3rem] flex items-center justify-center p-2 bg-muted rounded-md">
              {lastKeyPressed}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Last Mouse Button</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono text-accent min-h-[3rem] flex items-center justify-center p-2 bg-muted rounded-md">
              {lastMouseButton}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6 w-full max-w-4xl" />
      
      <div className="w-full max-w-5xl space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl text-foreground">Keyboard Visualizer</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Press keys to see them light up. Common browser shortcuts (e.g., Ctrl+R, F5) are prevented on this page.</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <KeyboardTester activeKey={activeKey} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl text-foreground">Mouse Visualizer</CardTitle>
             <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Click mouse buttons to see them light up. Right-click context menu is disabled on this page.</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="flex justify-center">
            <MouseTester activeMouseButton={activeMouseButton} />
          </CardContent>
        </Card>
      </div>

      <footer className="mt-10 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Input Analyzer. All rights reserved.</p>
      </footer>
    </div>
    </TooltipProvider>
  );
}
