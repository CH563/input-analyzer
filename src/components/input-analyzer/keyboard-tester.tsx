
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
  isActuallyActive: boolean;
  isVisuallyPressed: boolean;
  className?: string;
  isIcon?: boolean;
}

const Key: React.FC<KeyProps> = ({ label, keyCode, uniqueKey, isActuallyActive, isVisuallyPressed, className, isIcon }) => {
  return (
    <div
      data-key-code={keyCode} 
      className={cn(
        'flex items-center justify-center h-10 min-w-[2.5rem] p-1.5 border rounded-md shadow-sm transition-all duration-100 ease-in-out transform',
        isActuallyActive 
          ? 'bg-accent text-accent-foreground scale-105 ring-2 ring-accent ring-offset-2 ring-offset-background -translate-y-0.5' 
          : isVisuallyPressed 
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
  currentActiveKeys: Set<string>;
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
  CapsLock: <MdKeyboardCapslock />,
  Escape: <span className="text-xs">Esc</span>,
  Space: <MdSpaceBar className="w-full h-5" />,
  ArrowUp: <MdArrowUpward />,
  ArrowDown: <MdArrowDownward />,
  ArrowLeft: <MdArrowBack />,
  ArrowRight: <MdArrowForward />,
  ContextMenu: <MdMenu />,
  PrintScreen: <MdPrint />,
  ScrollLock: <MdLockOutline />, 
  Pause: <MdPause />, 
  Insert: <MdAdd />, 
  Home: <MdHome />,
  PageUp: <MdKeyboardArrowUp />, 
  DeleteForward: <MdBackspace className="transform scale-x-[-1]" />, 
  End: <MdVerticalAlignBottom />, 
  PageDown: <MdKeyboardArrowDown />, 
  NumLock: <MdDialpad />, 
  NumpadDivide: <span className="text-lg">/</span>,
  NumpadMultiply: <span className="text-lg">*</span>,
  NumpadSubtract: <MdRemove />,
  NumpadAdd: <MdAdd />,
  NumpadEnter: <MdKeyboardReturn />,
  NumpadDecimal: <span className="text-lg">.</span>,
};

const getFKeyLabel = (key: string) => key.replace('F', 'F');
const getDigitKeyLabel = (key: string) => key.replace('Digit', '');


export const KeyboardTester: React.FC<KeyboardLayoutProps> = ({ currentActiveKeys, everPressedKeys }) => {
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
    if (baseCode === 'Control') {
      return keyIconMap[`Control${side}`] || <span className="text-xs">Ctrl</span>;
    }
    if (baseCode === 'Alt') {
      if (currentOs === 'mac') return <span className="text-xs">⌥</span>; 
      return <span className="text-xs">Alt</span>;
    }
    if (baseCode === 'Meta') {
      if (currentOs === 'mac') return <span className="text-xs">⌘</span>; 
      if (currentOs === 'win') return <MdWindow />; 
      return <span className="text-xs">Meta</span>; 
    }
    return `${baseCode}${side}`; 
  };


  const keyboardLayout = [
    [
      { code: 'Escape', label: keyIconMap.Escape || 'Esc', className: 'min-w-[calc(1.5*2.5rem)]', uniqueSuffix: 'main' },
      ...Array.from({ length: 4 }, (_, i) => ({
        code: `F${i + 1}`,
        label: getFKeyLabel(`F${i + 1}`),
        className: i === 0 ? 'ml-6' : undefined,
        uniqueSuffix: `f${i+1}`
      })),
      ...Array.from({ length: 4 }, (_, i) => ({
        code: `F${i + 5}`,
        label: getFKeyLabel(`F${i + 5}`),
        className: i === 0 ? 'ml-6' : undefined,
        uniqueSuffix: `f${i+5}`
      })),
      ...Array.from({ length: 4 }, (_, i) => ({
        code: `F${i + 9}`,
        label: getFKeyLabel(`F${i + 9}`),
        className: i === 0 ? 'ml-6' : undefined,
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
      { code: 'AltLeft', label: getModifierLabel('Alt', 'Left'), className: 'min-w-[calc(1.25*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'MetaLeft', label: getModifierLabel('Meta', 'Left'), className: 'min-w-[calc(1.25*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'Space', label: keyIconMap.Space, className: 'flex-grow min-w-[calc(5.5*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'MetaRight', label: getModifierLabel('Meta', 'Right'), className: 'min-w-[calc(1*2.5rem)]', uniqueSuffix: 'fnKey_main' }, 
      { code: 'AltRight', label: getModifierLabel('Alt', 'Right'), className: 'min-w-[calc(1*2.5rem)]', uniqueSuffix: 'main' },
      { code: 'ControlRight', label: getModifierLabel('Control', 'Right'), className: 'min-w-[calc(1.25*2.5rem)]', uniqueSuffix: 'main' },
    ],
  ];

  const rightClusterLayout = [
    { code: 'PrintScreen', label: keyIconMap.PrintScreen, uniqueSuffix: 'navTop1' },
    { code: 'ScrollLock', label: keyIconMap.ScrollLock, uniqueSuffix: 'navTop2' },
    { code: 'Pause', label: keyIconMap.Pause, uniqueSuffix: 'navTop3' },
  
    { code: 'Insert', label: keyIconMap.Insert, uniqueSuffix: 'navMid1' },
    { code: 'Home', label: keyIconMap.Home, uniqueSuffix: 'navMid2' },
    { code: 'PageUp', label: keyIconMap.PageUp, uniqueSuffix: 'navMid3' },
  
    { code: 'Delete', label: 'DEL', uniqueSuffix: 'navBot1' }, 
    { code: 'End', label: 'END', uniqueSuffix: 'navBot2' },
    { code: 'PageDown', label: keyIconMap.PageDown, uniqueSuffix: 'navBot3' },
  
    { code: 'NumLock', label: keyIconMap.NumLock, uniqueSuffix: 'numpadR1C1' },
    { code: 'NumpadDivide', label: keyIconMap.NumpadDivide, uniqueSuffix: 'numpadR1C2' },
    { code: 'NumpadMultiply', label: keyIconMap.NumpadMultiply, uniqueSuffix: 'numpadR1C3' },
    { code: 'NumpadSubtract', label: keyIconMap.NumpadSubtract, uniqueSuffix: 'numpadR1C4' },
    
    { code: 'Numpad7', label: '7', uniqueSuffix: 'numpadR2C1' },
    { code: 'Numpad8', label: '8', uniqueSuffix: 'numpadR2C2' },
    { code: 'Numpad9', label: '9', uniqueSuffix: 'numpadR2C3' },
    { code: 'NumpadAdd', label: keyIconMap.NumpadAdd, className: 'row-span-2 h-auto', uniqueSuffix: 'numpadR2C4' },
  
    { code: 'Numpad4', label: '4', uniqueSuffix: 'numpadR3C1' },
    { code: 'Numpad5', label: '5', uniqueSuffix: 'numpadR3C2' },
    { code: 'Numpad6', label: '6', uniqueSuffix: 'numpadR3C3' },
    
    { code: 'Numpad1', label: '1', uniqueSuffix: 'numpadR4C1' },
    { code: 'Numpad2', label: '2', uniqueSuffix: 'numpadR4C2' },
    { code: 'Numpad3', label: '3', uniqueSuffix: 'numpadR4C3' },
    { code: 'NumpadEnter', label: keyIconMap.NumpadEnter, className: 'row-span-2 h-auto', uniqueSuffix: 'numpadR4C4' },
  
    { code: 'Numpad0', label: '0', className: 'col-span-2 w-auto min-w-[calc(2*2.5rem)]', uniqueSuffix: 'numpadR5C12' },
    { code: 'NumpadDecimal', label: keyIconMap.NumpadDecimal, uniqueSuffix: 'numpadR5C3' },
  ];


  return (
    <div className="p-2 bg-background rounded-lg shadow-inner space-x-1.5 flex flex-row items-start lg:w-[1040px] shrink-0">
      <div className="space-y-1.5">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={`main-row-${rowIndex}`} className="flex gap-x-1.5 justify-start">
            {row.map((keyConfig, keyIndex) => {
              const isIcon = typeof keyConfig.label !== 'string' && React.isValidElement(keyConfig.label);
              const uniqueKey = `${keyConfig.code}-${keyConfig.uniqueSuffix}-${rowIndex}-${keyIndex}`;
              const isActuallyActive = currentActiveKeys.has(keyConfig.code);
              const hasBeenEverPressed = everPressedKeys.has(keyConfig.code);
              const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={keyConfig.label} keyCode={keyConfig.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={keyConfig.className} isIcon={isIcon} />;
            })}
          </div>
        ))}
      </div>

      <div className="flex space-x-1.5"> 
        <div className="flex flex-col space-y-1.5 mx-2"> 
          <div className="flex space-x-1.5">
            {rightClusterLayout.slice(0, 3).map((k, index) => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navTop-${index}`;
                const isActuallyActive = currentActiveKeys.has(k.code);
                const hasBeenEverPressed = everPressedKeys.has(k.code);
                const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={k.className} isIcon={isIcon} />;
            })}
          </div>
          <div className="flex space-x-1.5">
            {rightClusterLayout.slice(3, 6).map((k, index) => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navMid-${index}`;
                const isActuallyActive = currentActiveKeys.has(k.code);
                const hasBeenEverPressed = everPressedKeys.has(k.code);
                const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={k.className} isIcon={isIcon} />;
            })}
          </div>
          <div className="flex space-x-1.5">
             {rightClusterLayout.slice(6, 9).map((k, index) => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                const uniqueKey = `${k.code}-${k.uniqueSuffix}-navBot-${index}`;
                const isActuallyActive = currentActiveKeys.has(k.code);
                const hasBeenEverPressed = everPressedKeys.has(k.code);
                const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
                return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={k.className} isIcon={isIcon} />;
            })}
          </div>
          <div className="h-10"></div>
          <div className="flex flex-col items-center space-y-1.5"> 
            <Key key="ArrowUp-arrow" uniqueKey="ArrowUp-arrow" label={keyIconMap.ArrowUp} keyCode="ArrowUp" isActuallyActive={currentActiveKeys.has("ArrowUp")} isVisuallyPressed={everPressedKeys.has("ArrowUp") && !currentActiveKeys.has("ArrowUp")} isIcon={true} />
            <div className="flex space-x-1.5">
              <Key key="ArrowLeft-arrow" uniqueKey="ArrowLeft-arrow" label={keyIconMap.ArrowLeft} keyCode="ArrowLeft" isActuallyActive={currentActiveKeys.has("ArrowLeft")} isVisuallyPressed={everPressedKeys.has("ArrowLeft") && !currentActiveKeys.has("ArrowLeft")} isIcon={true} />
              <Key key="ArrowDown-arrow" uniqueKey="ArrowDown-arrow" label={keyIconMap.ArrowDown} keyCode="ArrowDown" isActuallyActive={currentActiveKeys.has("ArrowDown")} isVisuallyPressed={everPressedKeys.has("ArrowDown") && !currentActiveKeys.has("ArrowDown")} isIcon={true} />
              <Key key="ArrowRight-arrow" uniqueKey="ArrowRight-arrow" label={keyIconMap.ArrowRight} keyCode="ArrowRight" isActuallyActive={currentActiveKeys.has("ArrowRight")} isVisuallyPressed={everPressedKeys.has("ArrowRight") && !currentActiveKeys.has("ArrowRight")} isIcon={true} />
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="h-10 mb-1.5 text-center text-md text-gray-400 font-medium leading-10">HKKB</div>
          <div className="grid grid-cols-4 grid-rows-5 gap-1.5"> 
            {rightClusterLayout.slice(9, 13).map((k, index) => {
              const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
              const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpadR1-${index}`;
              const isActuallyActive = currentActiveKeys.has(k.code);
              const hasBeenEverPressed = everPressedKeys.has(k.code);
              const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={cn(k.className)} isIcon={isIcon} />;
            })}

            {rightClusterLayout.slice(13, 16).map((k, index) => { 
              const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
              const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpadR2-${index}`;
              const isActuallyActive = currentActiveKeys.has(k.code);
              const hasBeenEverPressed = everPressedKeys.has(k.code);
              const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={cn(k.className)} isIcon={isIcon} />;
            })}
            {(() => { 
              const k = rightClusterLayout[16]; 
              const label = k.label; 
              const isIcon = typeof label !== 'string' && React.isValidElement(label); 
              const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-add`; 
              const isActuallyActive = currentActiveKeys.has(k.code);
              const hasBeenEverPressed = everPressedKeys.has(k.code);
              const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={cn(k.className, 'row-start-2 row-end-4 col-start-4')} isIcon={isIcon} />; 
            })()}

            {rightClusterLayout.slice(17, 20).map((k, index) => { 
              const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
              const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpadR3-${index}`;
              const isActuallyActive = currentActiveKeys.has(k.code);
              const hasBeenEverPressed = everPressedKeys.has(k.code);
              const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={cn(k.className)} isIcon={isIcon} />;
            })}
            
            {rightClusterLayout.slice(20, 23).map((k, index) => { 
              const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
              const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpadR4-${index}`;
              const isActuallyActive = currentActiveKeys.has(k.code);
              const hasBeenEverPressed = everPressedKeys.has(k.code);
              const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={k.label} keyCode={k.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={cn(k.className)} isIcon={isIcon} />;
            })}
            {(() => { 
              const k = rightClusterLayout[23]; 
              const label = k.label; 
              const isIcon = typeof label !== 'string' && React.isValidElement(label); 
              const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-enter`; 
              const isActuallyActive = currentActiveKeys.has(k.code);
              const hasBeenEverPressed = everPressedKeys.has(k.code);
              const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={cn(k.className, 'row-start-4 row-end-6 col-start-4')} isIcon={isIcon} />; 
            })()}
            
            {(() => { 
              const k = rightClusterLayout[24]; 
              const label = k.label; 
              const isIcon = typeof label !== 'string' && React.isValidElement(label); 
              const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad0`; 
              const isActuallyActive = currentActiveKeys.has(k.code);
              const hasBeenEverPressed = everPressedKeys.has(k.code);
              const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={cn(k.className, 'col-span-2')} isIcon={isIcon} />; 
            })()}
            {(() => { 
              const k = rightClusterLayout[25]; 
              const label = k.label; 
              const isIcon = typeof label !== 'string' && React.isValidElement(label); 
              const uniqueKey = `${k.code}-${k.uniqueSuffix}-numpad-dec`; 
              const isActuallyActive = currentActiveKeys.has(k.code);
              const hasBeenEverPressed = everPressedKeys.has(k.code);
              const isVisuallyPressed = hasBeenEverPressed && !isActuallyActive;
              return <Key key={uniqueKey} uniqueKey={uniqueKey} label={label} keyCode={k.code} isActuallyActive={isActuallyActive} isVisuallyPressed={isVisuallyPressed} className={cn(k.className)} isIcon={isIcon} />; 
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
