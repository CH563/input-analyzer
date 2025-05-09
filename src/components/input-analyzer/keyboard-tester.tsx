
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Command, 
  CornerDownLeft,
  Delete,
  Minus,
  Option, 
  Square, 
  Plus,
  ChevronLeft,
  ChevronRight,
  AlignLeft,
  Columns,
  Printer,
  Info, 
  HelpCircle, 
  Home,
  ExternalLink, 
  Lock,
  Table, 
} from 'lucide-react';

interface KeyProps {
  label: string | React.ReactNode;
  keyCode: string; 
  uniqueKey: string; 
  activeKey: string | null;
  isPressed: boolean; // Added to track if the key has been pressed at least once
  className?: string;
  isIcon?: boolean;
}

const Key: React.FC<KeyProps> = ({ label, keyCode, uniqueKey, activeKey, isPressed, className, isIcon }) => {
  const isActive = activeKey === keyCode;
  return (
    <div
      data-key-code={keyCode} 
      className={cn(
        'flex items-center justify-center h-10 min-w-[2.5rem] p-1.5 border rounded-md shadow-sm transition-all duration-100 ease-in-out transform',
        isActive 
          ? 'bg-accent text-accent-foreground scale-105 ring-2 ring-accent ring-offset-2 ring-offset-background -translate-y-0.5' 
          : isPressed
            ? 'bg-secondary text-secondary-foreground' // Style for pressed but not currently active
            : 'bg-card text-card-foreground border-border hover:bg-muted hover:-translate-y-px', // Style for never pressed
        className,
        isIcon ? 'text-md' : 'text-xs font-medium'
      )}
      style={{ flexBasis: '2.5rem' }} 
    >
      {label}
    </div>
  );
};

interface KeyboardLayoutProps {
  activeKey: string | null;
  pressedKeys: Set<string>; // Pass the set of all pressed keys
}

const keyIconMap: Record<string, React.ReactNode> = {
  Backspace: <Delete />,
  Tab: <Columns />,
  Enter: <CornerDownLeft />,
  ShiftLeft: <ArrowUp className="transform rotate-[-0deg]" />, 
  ShiftRight: <ArrowUp className="transform rotate-[-0deg]" />, 
  ControlLeft: <span className="text-xs">Ctrl</span>, 
  ControlRight: <span className="text-xs">Ctrl</span>, 
  AltLeftMac: <Option />, 
  AltRightMac: <Option />, 
  MetaLeftMac: <Command />, 
  MetaRightMac: <Command />, 
  CapsLock: <Lock />,
  Escape: <span className="text-xs">Esc</span>,
  Space: <Square className="w-full h-5" />,
  ArrowUp: <ArrowUp />,
  ArrowDown: <ArrowDown />,
  ArrowLeft: <ArrowLeft />,
  ArrowRight: <ArrowRight />,
  ContextMenu: <AlignLeft />,
  PrintScreen: <Printer />,
  ScrollLock: <Info />,
  Pause: <HelpCircle />,
  Insert: <Plus />,
  Home: <Home />,
  PageUp: <ChevronLeft className="transform rotate-90" />,
  DeleteForward: <Delete />, 
  End: <ExternalLink />,
  PageDown: <ChevronRight className="transform rotate-90" />,
  NumLock: <Table />,
  NumpadDivide: <span className="text-lg">/</span>,
  NumpadMultiply: <span className="text-lg">*</span>,
  NumpadSubtract: <Minus />,
  NumpadAdd: <Plus />,
  NumpadEnter: <CornerDownLeft />,
  NumpadDecimal: <span className="text-lg">.</span>,
};

const getFKeyLabel = (key: string) => key.replace('F', '');
const getDigitKeyLabel = (key: string) => key.replace('Digit', '');


export const KeyboardTester: React.FC<KeyboardLayoutProps> = ({ activeKey, pressedKeys }) => {
  const [currentOs, setCurrentOs] = useState<'mac' | 'win' | 'linux' | 'unknown'>('unknown');

  useEffect(() => {
    const getOS = (): 'mac' | 'win' | 'linux' | 'unknown' => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'unknown';
      const platformFromUAData = (window.navigator as any).userAgentData?.platform?.toLowerCase();
      const platformFromNavigator = window.navigator.platform.toLowerCase();
      const userAgent = window.navigator.userAgent.toLowerCase();

      const platform = platformFromUAData || platformFromNavigator;

      if (platform.startsWith('mac') || userAgent.includes('mac os') || userAgent.includes('macintosh')) {
        return 'mac';
      }
      if (platform.startsWith('win') || userAgent.includes('windows')) {
        return 'win';
      }
      if (platform.startsWith('linux') || userAgent.includes('linux')) {
        return 'linux';
      }
      return 'unknown';
    };
    setCurrentOs(getOS());
  }, []);

  const getModifierLabel = (baseCode: 'Alt' | 'Meta' | 'Control', side: 'Left' | 'Right'): React.ReactNode => {
    const keyCode = `${baseCode}${side}`;
    if (baseCode === 'Control') {
      return keyIconMap[`Control${side}`] || <span className="text-xs">Ctrl</span>;
    }
    if (baseCode === 'Alt') {
      if (currentOs === 'mac') return keyIconMap[`Alt${side}Mac`] || <Option />;
      return <span className="text-xs">Alt</span>;
    }
    if (baseCode === 'Meta') {
      if (currentOs === 'mac') return keyIconMap[`Meta${side}Mac`] || <Command />;
      if (currentOs === 'win') return <span className="text-xs">Win</span>;
      return keyIconMap[`Meta${side}Mac`] || <Command />; 
    }
    return keyCode; 
  };


  const keyboardLayout = [
    [
      { code: 'Escape', label: keyIconMap.Escape || 'Esc', className: 'min-w-[calc(1.5*2.5rem)]', uniqueSuffix: 'main' },
      ...Array.from({ length: 4 }, (_, i) => ({
        code: `F${i + 1}`,
        label: getFKeyLabel(`F${i + 1}`),
        uniqueSuffix: `f${i+1}`
      })),
      ...Array.from({ length: 4 }, (_, i) => ({
        code: `F${i + 5}`,
        label: getFKeyLabel(`F${i + 5}`),
        className: i === 0 ? 'ml-2' : undefined,
        uniqueSuffix: `f${i+5}`
      })),
      ...Array.from({ length: 4 }, (_, i) => ({
        code: `F${i + 9}`,
        label: getFKeyLabel(`F${i + 9}`),
        className: i === 0 ? 'ml-2' : undefined,
        uniqueSuffix: `f${i+9}`
      })),
    ],
    [
      { code: 'Backquote', label: '`', uniqueSuffix: 'main' },
      ...Array.from({ length: 9 }, (_, i) => ({ code: `Digit${i + 1}`, label: getDigitKeyLabel(`Digit${i + 1}`), uniqueSuffix: `digit${i+1}` })),
      { code: 'Digit0', label: getDigitKeyLabel('Digit0'), uniqueSuffix: 'digit0' },
      { code: 'Minus', label: '-', uniqueSuffix: 'main' },
      { code: 'Equal', label: '=', uniqueSuffix: 'main' },
      { code: 'Backspace', label: keyIconMap.Backspace, className: 'min-w-[calc(2*2.5rem)] flex-grow', uniqueSuffix: 'main' },
    ],
    [
      { code: 'Tab', label: keyIconMap.Tab, className: 'min-w-[calc(1.5*2.5rem)]', uniqueSuffix: 'main' },
      ...['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => ({ code: `Key${key}`, label: key, uniqueSuffix: `key${key}` })),
      { code: 'BracketLeft', label: '[', uniqueSuffix: 'main' },
      { code: 'BracketRight', label: ']', uniqueSuffix: 'main' },
      { code: 'Backslash', label: '\\', className: 'min-w-[calc(1.5*2.5rem)] flex-grow', uniqueSuffix: 'main' },
    ],
    [
      { code: 'CapsLock', label: keyIconMap.CapsLock, className: 'min-w-[calc(1.75*2.5rem)]', uniqueSuffix: 'main' },
      ...['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => ({ code: `Key${key}`, label: key, uniqueSuffix: `key${key}` })),
      { code: 'Semicolon', label: ';', uniqueSuffix: 'main' },
      { code: 'Quote', label: "'", uniqueSuffix: 'main' },
      { code: 'Enter', label: keyIconMap.Enter, className: 'min-w-[calc(2.25*2.5rem)] flex-grow', uniqueSuffix: 'main' },
    ],
    [
      { code: 'ShiftLeft', label: keyIconMap.ShiftLeft, className: 'min-w-[calc(2.25*2.5rem)]', uniqueSuffix: 'main' },
      ...['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(key => ({ code: `Key${key}`, label: key, uniqueSuffix: `key${key}` })),
      { code: 'Comma', label: ',', uniqueSuffix: 'main' },
      { code: 'Period', label: '.', uniqueSuffix: 'main' },
      { code: 'Slash', label: '/', uniqueSuffix: 'main' },
      { code: 'ShiftRight', label: keyIconMap.ShiftRight, className: 'min-w-[calc(1.75*2.5rem)] flex-grow', uniqueSuffix: 'main' },
    ],
    [
      { code: 'ControlLeft', label: getModifierLabel('Control', 'Left'), className: 'min-w-[calc(1.25*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'MetaLeft', label: getModifierLabel('Meta', 'Left'), className: 'min-w-[calc(1.25*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'AltLeft', label: getModifierLabel('Alt', 'Left'), className: 'min-w-[calc(1.25*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'Space', label: keyIconMap.Space, className: 'flex-grow min-w-[calc(5.5*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'AltRight', label: getModifierLabel('Alt', 'Right'), className: 'min-w-[calc(1*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'MetaRight', label: getModifierLabel('Meta', 'Right'), className: 'min-w-[calc(1*2.5rem)]', uniqueSuffix: 'fnKey_main' }, 
      { code: 'ControlRight', label: getModifierLabel('Control', 'Right'), className: 'min-w-[calc(1.25*2.5rem)]', uniqueSuffix: 'main' },
    ],
  ];

  const rightClusterLayout = [
    { code: 'PrintScreen', label: keyIconMap.PrintScreen, uniqueSuffix: 'nav' },
    { code: 'ScrollLock', label: keyIconMap.ScrollLock, uniqueSuffix: 'nav' },
    { code: 'Pause', label: keyIconMap.Pause, uniqueSuffix: 'nav' },

    { code: 'Insert', label: keyIconMap.Insert, uniqueSuffix: 'nav' },
    { code: 'Home', label: keyIconMap.Home, uniqueSuffix: 'nav' },
    { code: 'PageUp', label: keyIconMap.PageUp, uniqueSuffix: 'nav' },

    { code: 'Delete', label: keyIconMap.DeleteForward, uniqueSuffix: 'nav' }, 
    { code: 'End', label: keyIconMap.End, uniqueSuffix: 'nav' },
    { code: 'PageDown', label: keyIconMap.PageDown, uniqueSuffix: 'nav' },

    { code: 'NumLock', label: keyIconMap.NumLock, uniqueSuffix: 'numpad' },
    { code: 'NumpadDivide', label: keyIconMap.NumpadDivide, uniqueSuffix: 'numpad' },
    { code: 'NumpadMultiply', label: keyIconMap.NumpadMultiply, uniqueSuffix: 'numpad' },
    { code: 'NumpadSubtract', label: keyIconMap.NumpadSubtract, uniqueSuffix: 'numpad' },
    
    { code: 'Numpad7', label: '7', uniqueSuffix: 'numpad' },
    { code: 'Numpad8', label: '8', uniqueSuffix: 'numpad' },
    { code: 'Numpad9', label: '9', uniqueSuffix: 'numpad' },
    { code: 'NumpadAdd', label: keyIconMap.NumpadAdd, className: 'row-span-2 h-auto', uniqueSuffix: 'numpad' },

    { code: 'Numpad4', label: '4', uniqueSuffix: 'numpad' },
    { code: 'Numpad5', label: '5', uniqueSuffix: 'numpad' },
    { code: 'Numpad6', label: '6', uniqueSuffix: 'numpad' },
    
    { code: 'Numpad1', label: '1', uniqueSuffix: 'numpad' },
    { code: 'Numpad2', label: '2', uniqueSuffix: 'numpad' },
    { code: 'Numpad3', label: '3', uniqueSuffix: 'numpad' },
    { code: 'NumpadEnter', label: keyIconMap.NumpadEnter, className: 'row-span-2 h-auto', uniqueSuffix: 'numpad' },

    { code: 'Numpad0', label: '0', className: 'col-span-2 w-auto min-w-[calc(2*2.5rem)]', uniqueSuffix: 'numpad' },
    { code: 'NumpadDecimal', label: keyIconMap.NumpadDecimal, uniqueSuffix: 'numpad' },
  ];


  return (
    <div className="p-2 bg-background rounded-lg shadow-inner space-x-1.5 flex flex-row items-start max-w-fit mx-auto">
      <div className="space-y-1.5">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={`main-row-${rowIndex}`} className="flex space-x-1.5 justify-start">
            {row.map((keyConfig) => {
              const isIcon = typeof keyConfig.label !== 'string' && React.isValidElement(keyConfig.label);
              const uniqueKey = `${keyConfig.code}-${keyConfig.uniqueSuffix}-${rowIndex}`;
              const isPressed = pressedKeys.has(keyConfig.code);
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={keyConfig.label} keyCode={keyConfig.code} activeKey={activeKey} isPressed={isPressed} className={keyConfig.className} isIcon={isIcon} />;
            })}
          </div>
        ))}
      </div>

      <div className="flex space-x-1.5"> 
        <div className="flex flex-col space-y-1.5 mx-2">
          <div className="flex space-x-1.5">
            <div className="flex flex-col space-y-1.5">
              {rightClusterLayout.slice(0, 3).map(k => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navcol1`;
                const isPressed = pressedKeys.has(k.code);
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={isPressed} className={k.className} isIcon={isIcon} />;
              })}
            </div>
            <div className="flex flex-col space-y-1.5">
              {rightClusterLayout.slice(3, 6).map(k => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navcol2`;
                const isPressed = pressedKeys.has(k.code);
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={isPressed} className={k.className} isIcon={isIcon} />;
              })}
            </div>
            <div className="flex flex-col space-y-1.5">
              {rightClusterLayout.slice(6, 9).map(k => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navcol3`;
                const isPressed = pressedKeys.has(k.code);
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={isPressed} className={k.className} isIcon={isIcon} />;
              })}
              <div className="col-span-3 h-10"></div>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1.5"> 
            <Key key="ArrowUp-arrow" uniqueKey="ArrowUp-arrow" label={keyIconMap.ArrowUp} keyCode="ArrowUp" activeKey={activeKey} isPressed={pressedKeys.has("ArrowUp")} isIcon={true} />
            <div className="flex space-x-1.5">
              <Key key="ArrowLeft-arrow" uniqueKey="ArrowLeft-arrow" label={keyIconMap.ArrowLeft} keyCode="ArrowLeft" activeKey={activeKey} isPressed={pressedKeys.has("ArrowLeft")} isIcon={true} />
              <Key key="ArrowDown-arrow" uniqueKey="ArrowDown-arrow" label={keyIconMap.ArrowDown} keyCode="ArrowDown" activeKey={activeKey} isPressed={pressedKeys.has("ArrowDown")} isIcon={true} />
              <Key key="ArrowRight-arrow" uniqueKey="ArrowRight-arrow" label={keyIconMap.ArrowRight} keyCode="ArrowRight" activeKey={activeKey} isPressed={pressedKeys.has("ArrowRight")} isIcon={true} />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 grid-rows-5 gap-1.5">
          <div className="col-span-4 h-10"></div>
          {rightClusterLayout.slice(9, 13).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad1`;
            const isPressed = pressedKeys.has(k.code);
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={isPressed} className={cn(k.className)} isIcon={isIcon} />;
          })}

          {rightClusterLayout.slice(13, 16).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad2`;
            const isPressed = pressedKeys.has(k.code);
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={isPressed} className={cn(k.className)} isIcon={isIcon} />;
          })}
          {(() => { const k = rightClusterLayout[16]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-add`; const isPressed = pressedKeys.has(k.code); return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} isPressed={isPressed} className={cn(k.className, 'row-start-2 row-end-4 col-start-4')} isIcon={isIcon} />; })()}

          {rightClusterLayout.slice(17, 20).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad3`;
            const isPressed = pressedKeys.has(k.code);
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={isPressed} className={cn(k.className)} isIcon={isIcon} />;
          })}
          
          {rightClusterLayout.slice(20, 23).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad4`;
            const isPressed = pressedKeys.has(k.code);
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={isPressed} className={cn(k.className)} isIcon={isIcon} />;
          })}
           {(() => { const k = rightClusterLayout[23]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-enter`; const isPressed = pressedKeys.has(k.code); return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} isPressed={isPressed} className={cn(k.className, 'row-start-4 row-end-6 col-start-4')} isIcon={isIcon} />; })()}

          {(() => { const k = rightClusterLayout[24]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad0`; const isPressed = pressedKeys.has(k.code); return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} isPressed={isPressed} className={cn(k.className, 'col-span-2')} isIcon={isIcon} />; })()}
          {(() => { const k = rightClusterLayout[25]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-dec`; const isPressed = pressedKeys.has(k.code); return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} isPressed={isPressed} className={cn(k.className)} isIcon={isIcon} />; })()}
        </div>
      </div>
    </div>
  );
};

