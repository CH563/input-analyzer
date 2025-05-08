
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Command, // Icon for macOS Command key / Windows "Win" key fallback
  CornerDownLeft,
  Delete,
  Minus,
  Option, // Icon for macOS Option key
  Square, // Used for Space bar
  Plus,
  ChevronLeft,
  ChevronRight,
  AlignLeft,
  Columns,
  Printer,
  Info, // ScrollLock icon
  HelpCircle, // Pause icon / Fallback for unknown Meta
  Home,
  ExternalLink, // End icon
  Lock,
  Table, // NumLock icon
} from 'lucide-react';

interface KeyProps {
  label: string | React.ReactNode;
  keyCode: string; // This is the 'code' from the KeyboardEvent
  uniqueKey: string; // This will be the actual React key for list rendering
  activeKey: string | null;
  className?: string;
  isIcon?: boolean;
}

// Adjusted key size to h-10 (40px) and min-w-[2.5rem] (40px) for 1U
const Key: React.FC<KeyProps> = ({ label, keyCode, uniqueKey, activeKey, className, isIcon }) => {
  const isActive = activeKey === keyCode;
  return (
    <div
      data-key-code={keyCode} // Added for easier debugging / selection
      className={cn(
        'flex items-center justify-center h-10 min-w-[2.5rem] p-1.5 border rounded-md shadow-sm transition-all duration-100 ease-in-out transform',
        'bg-card text-card-foreground border-border',
        isActive 
          ? 'bg-accent text-accent-foreground scale-105 ring-2 ring-accent ring-offset-2 ring-offset-background -translate-y-0.5' 
          : 'hover:bg-muted hover:-translate-y-px', 
        className,
        isIcon ? 'text-md' : 'text-xs font-medium'
      )}
      style={{ flexBasis: '2.5rem' }} // For flex items
    >
      {label}
    </div>
  );
};

interface KeyboardLayoutProps {
  activeKey: string | null;
}

const keyIconMap: Record<string, React.ReactNode> = {
  Backspace: <Delete />,
  Tab: <Columns />,
  Enter: <CornerDownLeft />,
  ShiftLeft: <ArrowUp className="transform rotate-[-0deg]" />, // Generic shift icon
  ShiftRight: <ArrowUp className="transform rotate-[-0deg]" />, // Generic shift icon
  ControlLeft: <span className="text-xs">Ctrl</span>, // Text label for Ctrl
  ControlRight: <span className="text-xs">Ctrl</span>, // Text label for Ctrl
  AltLeftMac: <Option />, // macOS Option key
  AltRightMac: <Option />, // macOS Option key
  MetaLeftMac: <Command />, // macOS Command key
  MetaRightMac: <Command />, // macOS Command key
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


export const KeyboardTester: React.FC<KeyboardLayoutProps> = ({ activeKey }) => {
  const [currentOs, setCurrentOs] = useState<'mac' | 'win' | 'linux' | 'unknown'>('unknown');

  useEffect(() => {
    const getOS = (): 'mac' | 'win' | 'linux' | 'unknown' => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'unknown';
      // navigator.userAgentData is more modern but not universally supported, fallback to userAgent and platform
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
      return keyIconMap[`Meta${side}Mac`] || <Command />; // Fallback for Linux/Unknown (Super key often uses similar icon or Command icon)
    }
    return keyCode; // Should not happen
  };


  const keyboardLayout = [
    // Row 1 (Function keys, Escape)
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
    // Row 2 (Numbers, Backquote, Backspace)
    [
      { code: 'Backquote', label: '`', uniqueSuffix: 'main' },
      ...Array.from({ length: 9 }, (_, i) => ({ code: `Digit${i + 1}`, label: getDigitKeyLabel(`Digit${i + 1}`), uniqueSuffix: `digit${i+1}` })),
      { code: 'Digit0', label: getDigitKeyLabel('Digit0'), uniqueSuffix: 'digit0' },
      { code: 'Minus', label: '-', uniqueSuffix: 'main' },
      { code: 'Equal', label: '=', uniqueSuffix: 'main' },
      { code: 'Backspace', label: keyIconMap.Backspace, className: 'min-w-[calc(2*2.5rem)] flex-grow', uniqueSuffix: 'main' },
    ],
    // Row 3 (QWERTY, Tab, Brackets, Backslash)
    [
      { code: 'Tab', label: keyIconMap.Tab, className: 'min-w-[calc(1.5*2.5rem)]', uniqueSuffix: 'main' },
      ...['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => ({ code: `Key${key}`, label: key, uniqueSuffix: `key${key}` })),
      { code: 'BracketLeft', label: '[', uniqueSuffix: 'main' },
      { code: 'BracketRight', label: ']', uniqueSuffix: 'main' },
      { code: 'Backslash', label: '\\', className: 'min-w-[calc(1.5*2.5rem)] flex-grow', uniqueSuffix: 'main' },
    ],
    // Row 4 (ASDFGHJKL, CapsLock, Enter, Semicolon, Quote)
    [
      { code: 'CapsLock', label: keyIconMap.CapsLock, className: 'min-w-[calc(1.75*2.5rem)]', uniqueSuffix: 'main' },
      ...['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => ({ code: `Key${key}`, label: key, uniqueSuffix: `key${key}` })),
      { code: 'Semicolon', label: ';', uniqueSuffix: 'main' },
      { code: 'Quote', label: "'", uniqueSuffix: 'main' },
      { code: 'Enter', label: keyIconMap.Enter, className: 'min-w-[calc(2.25*2.5rem)] flex-grow', uniqueSuffix: 'main' },
    ],
    // Row 5 (ZXCVBNM, Shift, Comma, Period, Slash)
    [
      { code: 'ShiftLeft', label: keyIconMap.ShiftLeft, className: 'min-w-[calc(2.25*2.5rem)]', uniqueSuffix: 'main' },
      ...['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(key => ({ code: `Key${key}`, label: key, uniqueSuffix: `key${key}` })),
      { code: 'Comma', label: ',', uniqueSuffix: 'main' },
      { code: 'Period', label: '.', uniqueSuffix: 'main' },
      { code: 'Slash', label: '/', uniqueSuffix: 'main' },
      { code: 'ShiftRight', label: keyIconMap.ShiftRight, className: 'min-w-[calc(1.75*2.5rem)] flex-grow', uniqueSuffix: 'main' },
    ],
    // Row 6 (Ctrl, Meta, Alt, Space) - Arrows moved to right cluster
    [
      { code: 'ControlLeft', label: getModifierLabel('Control', 'Left'), className: 'min-w-[calc(1.25*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'MetaLeft', label: getModifierLabel('Meta', 'Left'), className: 'min-w-[calc(1.25*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'AltLeft', label: getModifierLabel('Alt', 'Left'), className: 'min-w-[calc(1.25*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'Space', label: keyIconMap.Space, className: 'flex-grow min-w-[calc(5.5*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'AltRight', label: getModifierLabel('Alt', 'Right'), className: 'min-w-[calc(1*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'MetaRight', label: getModifierLabel('Meta', 'Right'), className: 'min-w-[calc(1*2.5rem)]', uniqueSuffix: 'fnKey_main' }, // Often Fn key or Right Meta
      { code: 'ControlRight', label: getModifierLabel('Control', 'Right'), className: 'min-w-[calc(1.25*2.5rem)]', uniqueSuffix: 'main' },
    ],
  ];

  const rightClusterLayout = [
    // Nav keys part 1 (PrtSc, ScrollLock, Pause)
    { code: 'PrintScreen', label: keyIconMap.PrintScreen, uniqueSuffix: 'nav' },
    { code: 'ScrollLock', label: keyIconMap.ScrollLock, uniqueSuffix: 'nav' },
    { code: 'Pause', label: keyIconMap.Pause, uniqueSuffix: 'nav' },

    // Nav keys part 2 (Insert, Home, PageUp)
    { code: 'Insert', label: keyIconMap.Insert, uniqueSuffix: 'nav' },
    { code: 'Home', label: keyIconMap.Home, uniqueSuffix: 'nav' },
    { code: 'PageUp', label: keyIconMap.PageUp, uniqueSuffix: 'nav' },

    // Nav keys part 3 (Delete, End, PageDown)
    { code: 'Delete', label: keyIconMap.DeleteForward, uniqueSuffix: 'nav' }, // JS event.code for Del key is "Delete"
    { code: 'End', label: keyIconMap.End, uniqueSuffix: 'nav' },
    { code: 'PageDown', label: keyIconMap.PageDown, uniqueSuffix: 'nav' },

    // Numpad: Top Row
    { code: 'NumLock', label: keyIconMap.NumLock, uniqueSuffix: 'numpad' },
    { code: 'NumpadDivide', label: keyIconMap.NumpadDivide, uniqueSuffix: 'numpad' },
    { code: 'NumpadMultiply', label: keyIconMap.NumpadMultiply, uniqueSuffix: 'numpad' },
    { code: 'NumpadSubtract', label: keyIconMap.NumpadSubtract, uniqueSuffix: 'numpad' },
    
    // Numpad: 7,8,9 and Add
    { code: 'Numpad7', label: '7', uniqueSuffix: 'numpad' },
    { code: 'Numpad8', label: '8', uniqueSuffix: 'numpad' },
    { code: 'Numpad9', label: '9', uniqueSuffix: 'numpad' },
    { code: 'NumpadAdd', label: keyIconMap.NumpadAdd, className: 'row-span-2 h-auto', uniqueSuffix: 'numpad' },

    // Numpad: 4,5,6 (NumpadAdd spans here)
    { code: 'Numpad4', label: '4', uniqueSuffix: 'numpad' },
    { code: 'Numpad5', label: '5', uniqueSuffix: 'numpad' },
    { code: 'Numpad6', label: '6', uniqueSuffix: 'numpad' },
    
    // Numpad: 1,2,3 and Enter
    { code: 'Numpad1', label: '1', uniqueSuffix: 'numpad' },
    { code: 'Numpad2', label: '2', uniqueSuffix: 'numpad' },
    { code: 'Numpad3', label: '3', uniqueSuffix: 'numpad' },
    { code: 'NumpadEnter', label: keyIconMap.NumpadEnter, className: 'row-span-2 h-auto', uniqueSuffix: 'numpad' },

    // Numpad: 0 and Decimal (NumpadEnter spans here)
    { code: 'Numpad0', label: '0', className: 'col-span-2 w-auto min-w-[calc(2*2.5rem)]', uniqueSuffix: 'numpad' },
    { code: 'NumpadDecimal', label: keyIconMap.NumpadDecimal, uniqueSuffix: 'numpad' },
  ];


  return (
    <div className="p-2 bg-background rounded-lg shadow-inner space-x-1.5 flex flex-row items-start max-w-fit mx-auto">
      {/* Main keyboard section */}
      <div className="space-y-1.5">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={`main-row-${rowIndex}`} className="flex space-x-1.5 justify-start">
            {row.map((keyConfig) => {
              const isIcon = typeof keyConfig.label !== 'string' && React.isValidElement(keyConfig.label);
              const uniqueKey = `${keyConfig.code}-${keyConfig.uniqueSuffix}-${rowIndex}`;
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={keyConfig.label} keyCode={keyConfig.code} activeKey={activeKey} className={keyConfig.className} isIcon={isIcon} />;
            })}
          </div>
        ))}
      </div>

      {/* Combined Right Cluster */}
      <div className="flex pt-1.5 space-x-1.5"> {/* Apply pt-1.5 to align with main keyboard's first row effectively */}
        {/* Nav Keys (3x3 block) & Arrow Keys */}
        <div className="flex flex-col space-y-1.5">
          {/* Nav keys in 3 columns */}
          <div className="flex space-x-1.5">
            <div className="flex flex-col space-y-1.5">
              {rightClusterLayout.slice(0, 3).map(k => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navcol1`;
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />;
              })}
            </div>
            <div className="flex flex-col space-y-1.5">
              {rightClusterLayout.slice(3, 6).map(k => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navcol2`;
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />;
              })}
            </div>
            <div className="flex flex-col space-y-1.5">
              {rightClusterLayout.slice(6, 9).map(k => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navcol3`;
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />;
              })}
            </div>
          </div>
          {/* Arrow Keys Cluster (below nav keys) */}
          <div className="flex flex-col items-center space-y-1.5 pt-1.5"> {/* Added pt-1.5 for spacing */}
            <Key key="ArrowUp-arrow" uniqueKey="ArrowUp-arrow" label={keyIconMap.ArrowUp} keyCode="ArrowUp" activeKey={activeKey} isIcon={true} />
            <div className="flex space-x-1.5">
              <Key key="ArrowLeft-arrow" uniqueKey="ArrowLeft-arrow" label={keyIconMap.ArrowLeft} keyCode="ArrowLeft" activeKey={activeKey} isIcon={true} />
              <Key key="ArrowDown-arrow" uniqueKey="ArrowDown-arrow" label={keyIconMap.ArrowDown} keyCode="ArrowDown" activeKey={activeKey} isIcon={true} />
              <Key key="ArrowRight-arrow" uniqueKey="ArrowRight-arrow" label={keyIconMap.ArrowRight} keyCode="ArrowRight" activeKey={activeKey} isIcon={true} />
            </div>
          </div>
        </div>
        
        {/* Numpad (4 columns wide, 5 rows tall including multi-row keys) */}
        <div className="grid grid-cols-4 grid-rows-5 gap-1.5">
          {/* Row 1: NumLock, NumpadDivide, NumpadMultiply, NumpadSubtract */}
          {rightClusterLayout.slice(9, 13).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad1`;
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
          })}

          {/* Row 2: Numpad7, Numpad8, Numpad9 */}
          {rightClusterLayout.slice(13, 16).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad2`;
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
          })}
          {/* NumpadAdd (spans 2 rows, placed in grid) */}
          {(() => { const k = rightClusterLayout[16]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-add`; return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className, 'row-start-2 row-end-4 col-start-4')} isIcon={isIcon} />; })()}

          {/* Row 3: Numpad4, Numpad5, Numpad6 */}
          {rightClusterLayout.slice(17, 20).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad3`;
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
          })}
          
          {/* Row 4: Numpad1, Numpad2, Numpad3 */}
          {rightClusterLayout.slice(20, 23).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad4`;
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
          })}
          {/* NumpadEnter (spans 2 rows, placed in grid) */}
           {(() => { const k = rightClusterLayout[23]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-enter`; return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className, 'row-start-4 row-end-6 col-start-4')} isIcon={isIcon} />; })()}

          {/* Row 5: Numpad0 (spans 2 cols), NumpadDecimal */}
          {(() => { const k = rightClusterLayout[24]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad0`; return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className, 'col-span-2')} isIcon={isIcon} />; })()}
          {(() => { const k = rightClusterLayout[25]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-dec`; return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />; })()}
        </div>
      </div>
    </div>
  );
};

