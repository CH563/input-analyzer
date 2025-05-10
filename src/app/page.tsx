
'use client';

import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyboardTester } from '@/components/input-analyzer/keyboard-tester';
import { MouseTester } from '@/components/input-analyzer/mouse-tester';
import { KeyStatusLegend } from '@/components/input-analyzer/key-status-legend';
import { DataVisualizationCard } from '@/components/input-analyzer/data-visualization-card';
import { KeyLogCard } from '@/components/input-analyzer/key-log-card';
import { AboutKeyboardTestingCard } from '@/components/input-analyzer/about-keyboard-testing-card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { MdHelpOutline, MdDesktopWindows, MdAccessTime, MdRefresh } from 'react-icons/md';
import { format } from 'date-fns';

interface KeyLogEntry {
  id: string;
  timestamp: number;
  displayValue: string;
  type: 'down' | 'up';
  delay?: number;
  code: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function InputAnalyzerPage() {
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('N/A');
  const [lastMouseButton, setLastMouseButton] = useState<string>('N/A');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [everPressedKeys, setEverPressedKeys] = useState<Set<string>>(new Set());
  const [activeMouseButton, setActiveMouseButton] = useState<string | null>(null);
  
  const [singleKeyPressDuration, setSingleKeyPressDuration] = useState<number | null>(null);
  const [lastKeyDownTimestamp, setLastKeyDownTimestamp] = useState<number | null>(null);

  // New states for logging and visualization
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [keyLog, setKeyLog] = useState<KeyLogEntry[]>([]);
  const [keyPressDurations, setKeyPressDurations] = useState<number[]>([]);
  const [keyFrequency, setKeyFrequency] = useState<Record<string, number>>({});
  const [keyDownTimestampsMap, setKeyDownTimestampsMap] = useState<Map<string, number>>(new Map());


  useEffect(() => {
    setSessionStartTime(Date.now());
  }, []);

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
             const finalBaseKey = baseKey.length === 1 ? baseKey.toUpperCase() : baseKey;
             if (finalBaseKey === 'DEAD') { // Handle dead keys that don't produce a character alone
                keyDisplayValue = `${prefix}${event.code}`; // Fallback to code for dead keys
             } else {
                keyDisplayValue = `${prefix}${finalBaseKey}`;
             }
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
    setEverPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.add(event.code);
        return newSet;
    });
    setTimeout(() => setActiveKey(null), 200); 

    // For single key press duration card
    if (!pressedKeys.has(event.code)) { 
        setLastKeyDownTimestamp(performance.now());
        setSingleKeyPressDuration(null); 
    }

    // For logging and average duration
    if (!keyDownTimestampsMap.has(event.code)) {
      setKeyDownTimestampsMap(prevMap => new Map(prevMap).set(event.code, performance.now()));
    }
    setKeyLog(prevLog => [...prevLog, { id: generateId(), timestamp: Date.now(), displayValue: keyDisplayValue, type: 'down', code: event.code }]);
    setKeyFrequency(prevFreq => ({ ...prevFreq, [keyDisplayValue]: (prevFreq[keyDisplayValue] || 0) + 1 }));

  }, [pressedKeys, keyDownTimestampsMap]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(event.code);
      return newSet;
    });

    // For single key press duration card
    if (lastKeyDownTimestamp && pressedKeys.size === 1 && pressedKeys.has(event.code)) { 
      const upTime = performance.now();
      const delay = Math.round(upTime - lastKeyDownTimestamp);
      setSingleKeyPressDuration(delay);
      setLastKeyDownTimestamp(null);
    } else if (pressedKeys.size === 0) { 
        setLastKeyDownTimestamp(null);
    }

    // For logging and average duration
    const downTime = keyDownTimestampsMap.get(event.code);
    if (downTime) {
      const duration = performance.now() - downTime;
      const roundedDuration = Math.round(duration);
      
      const lastDownEntry = keyLog.slice().reverse().find(entry => entry.code === event.code && entry.type === 'down');
      const displayValueForUp = lastDownEntry ? lastDownEntry.displayValue : event.key;


      setKeyLog(prevLog => [...prevLog, { id: generateId(), timestamp: Date.now(), displayValue: displayValueForUp, type: 'up', delay: roundedDuration, code: event.code }]);
      setKeyPressDurations(prevDurations => [...prevDurations, roundedDuration]);
      setKeyDownTimestampsMap(prevMap => {
        const newMap = new Map(prevMap);
        newMap.delete(event.code);
        return newMap;
      });
    }
  }, [lastKeyDownTimestamp, pressedKeys, keyDownTimestampsMap, keyLog]);

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

    setTimeout(() => setActiveMouseButton(null), 200);
  }, []);
  
  const handleMouseUp = useCallback((_event: MouseEvent) => {
    // Potentially clear activeMouseButton if needed
  }, []);

  const handleResetStates = useCallback(() => {
    setPressedKeys(new Set());
    setEverPressedKeys(new Set());
    setLastKeyPressed('N/A');
    setSingleKeyPressDuration(null);
    setLastKeyDownTimestamp(null);
    // Reset new states as well
    setKeyLog([]);
    setKeyPressDurations([]);
    setKeyFrequency({});
    setKeyDownTimestampsMap(new Map());
    // setSessionStartTime(Date.now()); // Optionally reset session start time
  }, []);

  const handleClearLog = useCallback(() => {
    setKeyLog([]);
    setKeyPressDurations([]);
    setKeyFrequency({});
     // Optionally reset session start time or other derived stats if they are not always recalculated
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

  const averageDelay = useMemo(() => {
    if (keyPressDurations.length === 0) return null;
    const sum = keyPressDurations.reduce((acc, curr) => acc + curr, 0);
    return Math.round(sum / keyPressDurations.length);
  }, [keyPressDurations]);

  const sessionDuration = useMemo(() => {
    if (!sessionStartTime) return '00:00:00';
    const durationMs = Date.now() - sessionStartTime;
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [sessionStartTime, keyLog]); // Re-calculate when keyLog changes to update continuously

  const mostFrequentKey = useMemo(() => {
    if (Object.keys(keyFrequency).length === 0) return { key: 'N/A', count: 0 };
    return Object.entries(keyFrequency).reduce((mfk, [key, count]) => {
      return count > mfk.count ? { key, count } : mfk;
    }, { key: 'N/A', count: 0 });
  }, [keyFrequency]);


  return (
    <TooltipProvider>
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 md:p-8 selection:bg-accent selection:text-accent-foreground">
      <header className="mb-4 text-center w-full max-w-[1240px] flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MdDesktopWindows className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground text-left">Input Analyzer</h1>
            <p className="text-muted-foreground mt-1 text-sm text-left">
              Test your keyboard and mouse inputs.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleResetStates} className="h-6 w-6">
                <MdRefresh className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset All States</p>
            </TooltipContent>
          </Tooltip>
          <KeyStatusLegend />
          <ThemeSwitcher />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[1240px] mb-4">
        <Card className="shadow-lg">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-base text-foreground">Last Key Pressed</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <p className="text-lg font-mono text-accent min-h-[2rem] flex items-center justify-center p-1.5 bg-muted rounded-md break-all">
              {lastKeyPressed}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-base text-foreground">Last Mouse Button</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <p className="text-lg font-mono text-accent min-h-[2rem] flex items-center justify-center p-1.5 bg-muted rounded-md">
              {lastMouseButton}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-base text-foreground flex items-center">
              <MdAccessTime className="h-3.5 w-3.5 mr-1.5" /> Key Press Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <p className="text-lg font-mono text-accent min-h-[2rem] flex items-center justify-center p-1.5 bg-muted rounded-md">
              {singleKeyPressDuration === null ? 'N/A' : `${singleKeyPressDuration} ms`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-4 w-full max-w-[1240px]" />
      
      <div className="w-full max-w-[1240px] space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-xl text-foreground">Keyboard Visualizer</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <MdHelpOutline className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm md:max-w-md text-xs p-3">
                <p className="font-semibold mb-1.5 text-sm text-foreground">Keyboard Testing Guide:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Shows all keys currently held down (styled as 'Pressed').</li>
                  <li>Keys that have been pressed and released will also show as 'Pressed'.</li>
                  <li>The last key actively pressed will flash with the 'Active' style.</li>
                  <li>
                    <strong>Rollover Test:</strong> Press multiple keys simultaneously. The number of keys that light up indicates your keyboard's N-Key Rollover (NKRO) capability.
                  </li>
                  <li>
                    <strong>Ghosting Test:</strong> If an unpressed key lights up while you're holding down a combination of other keys, your keyboard may be experiencing ghosting.
                  </li>
                  <li>
                    <strong>Jamming/Masking Test:</strong> If you press a key while holding others and it doesn't light up, your keyboard might be jamming or has reached its rollover limit.
                  </li>
                  <li>Common browser shortcuts (e.g., Ctrl+R, F5) are generally disabled on this page to allow for more accurate testing of these keys.</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex gap-2 justify-center">
            <KeyboardTester activeKey={activeKey} pressedKeys={pressedKeys} everPressedKeys={everPressedKeys} />
            <MouseTester activeMouseButton={activeMouseButton} />
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-6 w-full max-w-[1240px]" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[1240px] mb-6">
        <DataVisualizationCard keyFrequency={keyFrequency} />
        <KeyLogCard
          keyLog={keyLog}
          totalKeyPresses={Object.values(keyFrequency).reduce((sum, count) => sum + count, 0)}
          averageDelay={averageDelay}
          sessionDuration={sessionDuration}
          mostFrequentKey={mostFrequentKey}
          onClearLog={handleClearLog}
        />
      </div>
      
      <div className="w-full max-w-[1240px]">
        <AboutKeyboardTestingCard />
      </div>


      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Input Analyzer. All rights reserved.</p>
      </footer>
    </div>
    </TooltipProvider>
  );
}
