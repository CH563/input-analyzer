'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  MdArrowDownward,
  MdArrowBack,
  MdArrowForward,
  MdArrowUpward,
  MdKeyboardReturn,
  MdBackspace,
  MdRemove,
  MdSpaceBar,
  MdAdd,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdMenu,
  MdKeyboardTab,
  MdPrint,
  MdLockOutline,
  MdPause,
  MdHome,
  MdVerticalAlignBottom,
  MdKeyboardCapslock,
  MdDialpad,
  MdWindow // For Windows Key
} from 'react-icons/md';


interface KeyProps {
  label: string | React.ReactNode;
  keyCode: string; 
  uniqueKey: string; 
  activeKey: string | null;
  isPressed: boolean; 
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
            ? 'bg-secondary text-secondary-foreground' 
            : 'bg-card text-card-foreground border-border hover:bg-muted hover:-translate-y-px', 
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
  pressedKeys: Set<string>; 
  everPressedKeys: Set<string>; 
}

const keyIconMap: Record<string, React.ReactNode> = {
  Backspace: <MdBackspace />,
  Tab: <MdKeyboardTab />,
  Enter: <MdKeyboardReturn />,
  ShiftLeft: <MdKeyboardArrowUp className="transform rotate-[-0deg]" />, 
  ShiftRight: <MdKeyboardArrowUp className="transform rotate-[-0deg]" />, 
  ControlLeft: <span className="text-xs">Ctrl</span>, 
  ControlRight: <span className="text-xs">Ctrl</span>, 
  // Mac specific text symbols will be handled in getModifierLabel
  CapsLock: <MdKeyboardCapslock />,
  Escape: <span className="text-xs">Esc</span>,
  Space: <MdSpaceBar className="w-full h-5" />,
  ArrowUp: <MdArrowUpward />,
  ArrowDown: <MdArrowDownward />,
  ArrowLeft: <MdArrowBack />,
  ArrowRight: <MdArrowForward />,
  ContextMenu: <MdMenu />,
  PrintScreen: <MdPrint />,
  ScrollLock: <MdLockOutline />, // Mapped from Lucide Info
  Pause: <MdPause />, // Mapped from Lucide HelpCircle
  Insert: <MdAdd />, // Mapped from Lucide Plus
  Home: <MdHome />,
  PageUp: <MdKeyboardArrowUp />, // Mapped from Lucide ChevronLeft rotated
  DeleteForward: <MdBackspace className="transform scale-x-[-1]" />, // Re-using backspace and flipping for Delete
  End: <MdVerticalAlignBottom />, // Mapped from Lucide ExternalLink
  PageDown: <MdKeyboardArrowDown />, // Mapped from Lucide ChevronRight rotated
  NumLock: <MdDialpad />, // Mapped from Lucide Table
  NumpadDivide: <span className="text-lg">/</span>,
  NumpadMultiply: <span className="text-lg">*</span>,
  NumpadSubtract: <MdRemove />,
  NumpadAdd: <MdAdd />,
  NumpadEnter: <MdKeyboardReturn />,
  NumpadDecimal: <span className="text-lg">.</span>,
};

const getFKeyLabel = (key: string) => key.replace('F', '');
const getDigitKeyLabel = (key: string) => key.replace('Digit', '');


export const KeyboardTester: React.FC<KeyboardLayoutProps> = ({ activeKey, pressedKeys, everPressedKeys }) => {
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
    // const keyCode = `${baseCode}${side}`; // not used
    if (baseCode === 'Control') {
      return keyIconMap[`Control${side}`] || <span className="text-xs">Ctrl</span>;
    }
    if (baseCode === 'Alt') {
      if (currentOs === 'mac') return <span className="text-xs">⌥</span>; // Option key symbol
      return <span className="text-xs">Alt</span>;
    }
    if (baseCode === 'Meta') {
      if (currentOs === 'mac') return <span className="text-xs">⌘</span>; // Command key symbol
      if (currentOs === 'win') return <MdWindow />; 
      return <span className="text-xs">Meta</span>; // Fallback for Linux/Unknown
    }
    return `${baseCode}${side}`; 
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
    // Top navigation cluster (PrintScreen, ScrollLock, Pause) - 3 keys
    { code: 'PrintScreen', label: keyIconMap.PrintScreen, uniqueSuffix: 'navTop1' },
    { code: 'ScrollLock', label: keyIconMap.ScrollLock, uniqueSuffix: 'navTop2' },
    { code: 'Pause', label: keyIconMap.Pause, uniqueSuffix: 'navTop3' },
  
    // Middle navigation cluster (Insert, Home, PageUp) - 3 keys
    { code: 'Insert', label: keyIconMap.Insert, uniqueSuffix: 'navMid1' },
    { code: 'Home', label: keyIconMap.Home, uniqueSuffix: 'navMid2' },
    { code: 'PageUp', label: keyIconMap.PageUp, uniqueSuffix: 'navMid3' },
  
    // Bottom navigation cluster (Delete, End, PageDown) - 3 keys
    { code: 'Delete', label: keyIconMap.DeleteForward, uniqueSuffix: 'navBot1' }, // 'Delete' is often used for forward delete
    { code: 'End', label: keyIconMap.End, uniqueSuffix: 'navBot2' },
    { code: 'PageDown', label: keyIconMap.PageDown, uniqueSuffix: 'navBot3' },
  
    // Numpad starts here
    // Row 1: NumLock, NumpadDivide, NumpadMultiply, NumpadSubtract
    { code: 'NumLock', label: keyIconMap.NumLock, uniqueSuffix: 'numpadR1C1' },
    { code: 'NumpadDivide', label: keyIconMap.NumpadDivide, uniqueSuffix: 'numpadR1C2' },
    { code: 'NumpadMultiply', label: keyIconMap.NumpadMultiply, uniqueSuffix: 'numpadR1C3' },
    { code: 'NumpadSubtract', label: keyIconMap.NumpadSubtract, uniqueSuffix: 'numpadR1C4' },
    
    // Row 2: Numpad7, Numpad8, Numpad9, NumpadAdd (spans 2 rows)
    { code: 'Numpad7', label: '7', uniqueSuffix: 'numpadR2C1' },
    { code: 'Numpad8', label: '8', uniqueSuffix: 'numpadR2C2' },
    { code: 'Numpad9', label: '9', uniqueSuffix: 'numpadR2C3' },
    { code: 'NumpadAdd', label: keyIconMap.NumpadAdd, className: 'row-span-2 h-auto', uniqueSuffix: 'numpadR2C4' },
  
    // Row 3: Numpad4, Numpad5, Numpad6 (NumpadAdd continues here)
    { code: 'Numpad4', label: '4', uniqueSuffix: 'numpadR3C1' },
    { code: 'Numpad5', label: '5', uniqueSuffix: 'numpadR3C2' },
    { code: 'Numpad6', label: '6', uniqueSuffix: 'numpadR3C3' },
    
    // Row 4: Numpad1, Numpad2, Numpad3, NumpadEnter (spans 2 rows)
    { code: 'Numpad1', label: '1', uniqueSuffix: 'numpadR4C1' },
    { code: 'Numpad2', label: '2', uniqueSuffix: 'numpadR4C2' },
    { code: 'Numpad3', label: '3', uniqueSuffix: 'numpadR4C3' },
    { code: 'NumpadEnter', label: keyIconMap.NumpadEnter, className: 'row-span-2 h-auto', uniqueSuffix: 'numpadR4C4' },
  
    // Row 5: Numpad0 (spans 2 columns), NumpadDecimal (NumpadEnter continues here)
    { code: 'Numpad0', label: '0', className: 'col-span-2 w-auto min-w-[calc(2*2.5rem)]', uniqueSuffix: 'numpadR5C12' },
    { code: 'NumpadDecimal', label: keyIconMap.NumpadDecimal, uniqueSuffix: 'numpadR5C3' },
  ];


  return (
    <div className="p-2 bg-background rounded-lg shadow-inner space-x-1.5 flex flex-row items-start max-w-fit mx-auto">
      <div className="space-y-1.5">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={`main-row-${rowIndex}`} className="flex space-x-1.5 justify-start">
            {row.map((keyConfig, keyIndex) => {
              const isIcon = typeof keyConfig.label !== 'string' && React.isValidElement(keyConfig.label);
              const uniqueKey = `${keyConfig.code}-${keyConfig.uniqueSuffix}-${rowIndex}-${keyIndex}`;
              const hasBeenEverPressed = everPressedKeys.has(keyConfig.code);
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={keyConfig.label} keyCode={keyConfig.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={keyConfig.className} isIcon={isIcon} />;
            })}
          </div>
        ))}
      </div>

      <div className="flex space-x-1.5"> 
        {/* Navigation and Arrow Key Cluster */}
        <div className="flex flex-col space-y-4"> {/* Increased spacing */}
          {/* Top navigation group: PrtSc, ScrLk, Pause */}
          <div className="flex space-x-1.5">
            {rightClusterLayout.slice(0, 3).map((k, index) => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navTop-${index}`;
                const hasBeenEverPressed = everPressedKeys.has(k.code);
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={k.className} isIcon={isIcon} />;
            })}
          </div>
          {/* Middle navigation group: Ins, Home, PgUp */}
          <div className="flex space-x-1.5">
            {rightClusterLayout.slice(3, 6).map((k, index) => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navMid-${index}`;
                const hasBeenEverPressed = everPressedKeys.has(k.code);
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={k.className} isIcon={isIcon} />;
            })}
          </div>
           {/* Bottom navigation group: Del, End, PgDn */}
          <div className="flex space-x-1.5">
             {rightClusterLayout.slice(6, 9).map((k, index) => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navBot-${index}`;
                const hasBeenEverPressed = everPressedKeys.has(k.code);
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={k.className} isIcon={isIcon} />;
            })}
          </div>
          {/* Arrow keys, typically below nav cluster */}
          <div className="flex flex-col items-center space-y-1.5 pt-4"> {/* Added padding top for separation */}
            <Key key="ArrowUp-arrow" uniqueKey="ArrowUp-arrow" label={keyIconMap.ArrowUp} keyCode="ArrowUp" activeKey={activeKey} isPressed={everPressedKeys.has("ArrowUp")} isIcon={true} />
            <div className="flex space-x-1.5">
              <Key key="ArrowLeft-arrow" uniqueKey="ArrowLeft-arrow" label={keyIconMap.ArrowLeft} keyCode="ArrowLeft" activeKey={activeKey} isPressed={everPressedKeys.has("ArrowLeft")} isIcon={true} />
              <Key key="ArrowDown-arrow" uniqueKey="ArrowDown-arrow" label={keyIconMap.ArrowDown} keyCode="ArrowDown" activeKey={activeKey} isPressed={everPressedKeys.has("ArrowDown")} isIcon={true} />
              <Key key="ArrowRight-arrow" uniqueKey="ArrowRight-arrow" label={keyIconMap.ArrowRight} keyCode="ArrowRight" activeKey={activeKey} isPressed={everPressedKeys.has("ArrowRight")} isIcon={true} />
            </div>
          </div>
        </div>
        
        {/* Numpad Cluster */}
        <div className="grid grid-cols-4 grid-rows-5 gap-1.5 ml-2"> {/* Added margin-left for separation */}
          {/* Numpad Row 1 */}
          {rightClusterLayout.slice(9, 13).map((k, index) => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpadR1-${index}`;
            const hasBeenEverPressed = everPressedKeys.has(k.code);
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={cn(k.className)} isIcon={isIcon} />;
          })}

          {/* Numpad Row 2 (7,8,9, +) */}
          {rightClusterLayout.slice(13, 16).map((k, index) => { // 7, 8, 9
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpadR2-${index}`;
            const hasBeenEverPressed = everPressedKeys.has(k.code);
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={cn(k.className)} isIcon={isIcon} />;
          })}
          {(() => { const k = rightClusterLayout[16]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-add`; const hasBeenEverPressed = everPressedKeys.has(k.code); return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={cn(k.className, 'row-start-2 row-end-4 col-start-4')} isIcon={isIcon} />; })()}


          {/* Numpad Row 3 (4,5,6) NumpadAdd continues */}
          {rightClusterLayout.slice(17, 20).map((k, index) => { // 4, 5, 6
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpadR3-${index}`;
            const hasBeenEverPressed = everPressedKeys.has(k.code);
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={cn(k.className)} isIcon={isIcon} />;
          })}
          
          {/* Numpad Row 4 (1,2,3, Enter) */}
          {rightClusterLayout.slice(20, 23).map((k, index) => { // 1, 2, 3
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpadR4-${index}`;
            const hasBeenEverPressed = everPressedKeys.has(k.code);
            return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={cn(k.className)} isIcon={isIcon} />;
          })}
           {(() => { const k = rightClusterLayout[23]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-enter`; const hasBeenEverPressed = everPressedKeys.has(k.code); return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={cn(k.className, 'row-start-4 row-end-6 col-start-4')} isIcon={isIcon} />; })()}
           
          {/* Numpad Row 5 (0, .) NumpadEnter continues */}
          {(() => { const k = rightClusterLayout[24]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad0`; const hasBeenEverPressed = everPressedKeys.has(k.code); return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={cn(k.className, 'col-span-2')} isIcon={isIcon} />; })()}
          {(() => { const k = rightClusterLayout[25]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-dec`; const hasBeenEverPressed = everPressedKeys.has(k.code); return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} activeKey={activeKey} isPressed={hasBeenEverPressed} className={cn(k.className)} isIcon={isIcon} />; })()}
        </div>
      </div>
    </div>
  );
};
