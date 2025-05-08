
'use client';

import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyboardTester } from '@/components/input-analyzer/keyboard-tester';
import { MouseTester } from '@/components/input-analyzer/mouse-tester';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, MonitorPlay, Timer } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function InputAnalyzerPage() {
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('N/A');
  const [lastMouseButton, setLastMouseButton] = useState<string>('N/A');
  const [activeKey, setActiveKey] = useState<string | null>(null);
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
             // Add Shift only if it's not the Shift key itself being displayed, 
             // or if it's a combo that typically shows Shift (e.g. Shift+Tab)
             // For simple letter keys, event.key already reflects shifted state (e.g. 'A' vs 'a')
             // So, only add Shift for functional keys or when it's the primary modifier being tested
             if (event.key.length > 1 && event.key !== 'Shift') prefix += 'Shift+';
        }
        
        let baseKey = event.key;
        if (event.code === 'Space') baseKey = 'Space';
        // Avoid double-printing modifiers if event.key is a modifier itself
        if (['Control', 'Alt', 'Meta', 'Shift'].includes(event.key)) {
            keyDisplayValue = event.key; // Show the modifier itself
        } else {
            keyDisplayValue = `${prefix}${baseKey}`;
        }
    }


    const codesToAlwaysPrevent = [
      'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Tab', // Always prevent tabbing out of the page elements
      'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
    ];
    
    if (codesToAlwaysPrevent.includes(event.code) && !isEditable) {
      event.preventDefault();
    }
    
    if (event.key === '/' && !isEditable) {
        event.preventDefault();
    }

    // More specific prevention for Ctrl/Meta combos
    if ((event.ctrlKey || event.metaKey)) {
        // Prevent common browser shortcuts. Check if the target is not an input/textarea.
        if (!isEditable) {
             const commonShortcutKeys = ['r', 's', 'p', 'f', 'g', 'h', 'j', 'k', 'l', 'a', 'w', 'q', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 't', 'y', 'u', 'i', 'o', 'd', 'e', '+', '-', '='];
             if (commonShortcutKeys.includes(event.key.toLowerCase()) || event.code.startsWith("Digit")) {
                 event.preventDefault();
                 keyDisplayValue = `${event.ctrlKey ? 'Ctrl' : 'Meta'}+${event.key.toUpperCase()}`;
             }
        }
    }
     // Prevent Backspace from navigating back if not in an editable field
    if (event.key === 'Backspace' && !isEditable) {
        event.preventDefault();
    }


    setLastKeyPressed(keyDisplayValue);
    setActiveKey(event.code);
    setTimeout(() => setActiveKey(null), 200);

    // Key press duration
    setKeyDownTimestamp(performance.now());
    setKeyPressDelay(null);


  }, []); // Removed isEditable from dependencies as it's derived inside

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

    if (event.button === 2) { // Prevent context menu on right click
        const target = event.target as HTMLElement;
        // Allow context menu in input/textarea fields
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
            event.preventDefault();
        }
    }
    setTimeout(() => setActiveMouseButton(null), 200);
  }, []);
  
  const handleMouseUp = useCallback((_event: MouseEvent) => {
     // Can be used to remove active state if button is held
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => handleKeyDown(e);
    const handleGlobalKeyUp = (e: KeyboardEvent) => handleKeyUp(e);
    const handleGlobalMouseDown = (e: MouseEvent) => handleMouseDown(e);
    const handleGlobalMouseUp = (e: MouseEvent) => handleMouseUp(e);
    
    const preventContextMenuGlobal = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        // Allow context menu in input/textarea fields
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
            event.preventDefault();
        }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('keyup', handleGlobalKeyUp);
    document.addEventListener('mousedown', handleGlobalMouseDown); // Listen on document
    document.addEventListener('mouseup', handleGlobalMouseUp); // Listen on document
    document.addEventListener('contextmenu', preventContextMenuGlobal); // Listen on document

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8 selection:bg-accent selection:text-accent-foreground">
      <header className="mb-4 text-center"> {/* Reduced mb */}
        <div className="flex items-center justify-center space-x-3">
          <MonitorPlay className="h-10 w-10 text-primary" /> {/* Reduced size */}
          <h1 className="text-3xl font-bold text-foreground">Input Analyzer</h1> {/* Reduced size */}
        </div>
        <p className="text-muted-foreground mt-1 text-sm"> {/* Reduced margin and size */}
          Test your keyboard and mouse inputs with visual feedback.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-4"> {/* Changed to 3 cols, reduced gap & mb */}
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

      <Separator className="my-4 w-full max-w-4xl" /> {/* Reduced my */}
      
      <div className="w-full max-w-5xl space-y-6"> {/* Reduced space-y */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-4"> {/* Reduced p */}
            <CardTitle className="text-xl text-foreground">Keyboard Visualizer</CardTitle> {/* Reduced size */}
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Press keys to see them light up. Common browser shortcuts (e.g., Ctrl+R, F5) are prevented on this page.</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="p-4 pt-0"> {/* Reduced p */}
            <KeyboardTester activeKey={activeKey} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-4"> {/* Reduced p */}
            <CardTitle className="text-xl text-foreground">Mouse Visualizer</CardTitle> {/* Reduced size */}
             <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Click mouse buttons to see them light up. Right-click context menu is disabled on this page (except in input fields).</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="flex justify-center p-4 pt-0"> {/* Reduced p */}
            <MouseTester activeMouseButton={activeMouseButton} />
          </CardContent>
        </Card>
      </div>

      <footer className="mt-8 text-center text-xs text-muted-foreground"> {/* Reduced mt and size */}
        <p>&copy; {new Date().getFullYear()} Input Analyzer. All rights reserved.</p>
      </footer>
    </div>
    </TooltipProvider>
  );
}

