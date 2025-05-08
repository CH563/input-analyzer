
'use client';

import React from 'react';
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
  Maximize2,
  Minimize2,
  Info,
  Home,
  ExternalLink,
  Printer,
  Search,
  Undo2,
  Redo2,
  Save,
  Copy,
  ClipboardPaste,
  Scissors,
  Settings,
  HelpCircle,
  Lock,
  Power,
  Volume2,
  VolumeX,
  Volume1,
  Moon,
  Sun,
  Keyboard,
  Monitor,
  Smartphone,
  Laptop,
  Table,
} from 'lucide-react';

interface KeyProps {
  label: string | React.ReactNode;
  keyCode: string;
  activeKey: string | null;
  className?: string;
  isIcon?: boolean;
}

const Key: React.FC<KeyProps> = ({ label, keyCode, activeKey, className, isIcon }) => {
  const isActive = activeKey === keyCode;
  return (
    <div
      className={cn(
        'flex items-center justify-center h-12 min-w-[3rem] p-2 border rounded-md shadow-sm transition-all duration-75 ease-in-out',
        'bg-card text-card-foreground border-border',
        isActive ? 'bg-accent text-accent-foreground scale-105 transform ring-2 ring-accent ring-offset-2 ring-offset-background' : 'hover:bg-muted',
        className,
        isIcon ? 'text-lg' : 'text-sm font-medium'
      )}
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
  ShiftLeft: <ArrowUp className="transform rotate-[-0deg]" />, 
  ShiftRight: <ArrowUp className="transform rotate-[-0deg]" />,
  ControlLeft: <span className="text-xs">Ctrl</span>,
  ControlRight: <span className="text-xs">Ctrl</span>,
  AltLeft: <Option />,
  AltRight: <Option />,
  MetaLeft: <Command />,
  MetaRight: <Command />,
  CapsLock: <Lock />,
  Escape: <span className="text-xs">Esc</span>,
  Space: <Square className="w-24 h-6" />, 
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
  DeleteForward: <Delete />, // Standard event.code for Delete key in navigation block is "Delete"
  End: <ExternalLink />, 
  PageDown: <ChevronRight className="transform rotate-90" />,
  NumLock: <Table />, 
  NumpadDivide: <span className="text-xl">/</span>,
  NumpadMultiply: <span className="text-xl">*</span>,
  NumpadSubtract: <Minus />,
  NumpadAdd: <Plus />,
  NumpadEnter: <CornerDownLeft />,
  NumpadDecimal: <span className="text-xl">.</span>,
};

const getFKeyLabel = (key: string) => key.replace('F', '');
const getDigitKeyLabel = (key: string) => key.replace('Digit', '');


export const KeyboardTester: React.FC<KeyboardLayoutProps> = ({ activeKey }) => {
  const keyboardLayout = [
    // Row 1 (Function keys, Escape)
    [
      { code: 'Escape', label: keyIconMap.Escape || 'Esc', className: 'w-16' },
      // F1-F4
      ...Array.from({ length: 4 }, (_, i) => ({ 
        code: `F${i + 1}`, 
        label: getFKeyLabel(`F${i + 1}`) 
      })),
      // F5-F8
      ...Array.from({ length: 4 }, (_, i) => ({ 
        code: `F${i + 5}`, 
        label: getFKeyLabel(`F${i + 5}`),
        className: i === 0 ? 'ml-4' : undefined,
      })),
      // F9-F12
      ...Array.from({ length: 4 }, (_, i) => ({ 
        code: `F${i + 9}`, 
        label: getFKeyLabel(`F${i + 9}`),
        className: i === 0 ? 'ml-4' : undefined,
      })),
    ],
    // Row 2 (Numbers, Backquote, Backspace)
    [
      { code: 'Backquote', label: '`' },
      ...Array.from({ length: 9 }, (_, i) => ({ code: `Digit${i + 1}`, label: getDigitKeyLabel(`Digit${i + 1}`) })),
      { code: 'Digit0', label: getDigitKeyLabel('Digit0') },
      { code: 'Minus', label: '-' },
      { code: 'Equal', label: '=' },
      { code: 'Backspace', label: keyIconMap.Backspace, className: 'flex-grow min-w-[4rem]' },
    ],
    // Row 3 (QWERTY, Tab, Brackets, Backslash)
    [
      { code: 'Tab', label: keyIconMap.Tab, className: 'w-16' },
      ...['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => ({ code: `Key${key}`, label: key })),
      { code: 'BracketLeft', label: '[' },
      { code: 'BracketRight', label: ']' },
      { code: 'Backslash', label: '\\', className: 'flex-grow min-w-[3rem]' },
    ],
    // Row 4 (ASDFGHJKL, CapsLock, Enter, Semicolon, Quote)
    [
      { code: 'CapsLock', label: keyIconMap.CapsLock, className: 'w-[4.5rem]' },
      ...['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => ({ code: `Key${key}`, label: key })),
      { code: 'Semicolon', label: ';' },
      { code: 'Quote', label: "'" },
      { code: 'Enter', label: keyIconMap.Enter, className: 'flex-grow min-w-[4.5rem]' },
    ],
    // Row 5 (ZXCVBNM, Shift, Comma, Period, Slash)
    [
      { code: 'ShiftLeft', label: keyIconMap.ShiftLeft, className: 'w-[5.5rem]' },
      ...['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(key => ({ code: `Key${key}`, label: key })),
      { code: 'Comma', label: ',' },
      { code: 'Period', label: '.' },
      { code: 'Slash', label: '/' },
      { code: 'ShiftRight', label: keyIconMap.ShiftRight, className: 'flex-grow min-w-[5.5rem]' },
    ],
    // Row 6 (Ctrl, Meta, Alt, Space, Arrows)
    [
      { code: 'ControlLeft', label: keyIconMap.ControlLeft, className: 'w-20' },
      { code: 'MetaLeft', label: keyIconMap.MetaLeft, className: 'w-16' }, // Or OSLeft on some systems
      { code: 'AltLeft', label: keyIconMap.AltLeft, className: 'w-16' },
      { code: 'Space', label: keyIconMap.Space, className: 'flex-grow min-w-[16rem]' },
      { code: 'AltRight', label: keyIconMap.AltRight, className: 'w-16' },
      { code: 'MetaRight', label: keyIconMap.MetaRight, className: 'w-16' }, // Or OSRight
      { code: 'ContextMenu', label: keyIconMap.ContextMenu, className: 'w-16' },
      { code: 'ControlRight', label: keyIconMap.ControlRight, className: 'w-20' },
    ],
  ];
  
  const navigationAndNumpadLayout = [
    // This array structure is a bit complex, it defines columns for navigation and then a grid for numpad
    // Each sub-array represents a conceptual column or area which will be manually placed using flex/grid in render
    [
      // Column 1: Insert, Home, PageUp (Navigation group 1)
      [
        { code: 'Insert', label: keyIconMap.Insert },
        { code: 'Home', label: keyIconMap.Home },
        { code: 'PageUp', label: keyIconMap.PageUp },
      ],
      // Column 2: Delete, End, PageDown (Navigation group 2)
      [
        { code: 'Delete', label: keyIconMap.DeleteForward }, // event.code is "Delete" for the key usually labelled Del or Delete
        { code: 'End', label: keyIconMap.End },
        { code: 'PageDown', label: keyIconMap.PageDown },
      ],
      // Arrow Keys placeholder (will be structured in render)
      // Up Arrow (placed above Left/Down/Right cluster)
      [ 
        { code: 'ArrowUp', label: keyIconMap.ArrowUp },
      ],
      // Left, Down, Right Arrows (placed in a row)
      [
        { code: 'ArrowLeft', label: keyIconMap.ArrowLeft },
        { code: 'ArrowDown', label: keyIconMap.ArrowDown },
        { code: 'ArrowRight', label: keyIconMap.ArrowRight },
      ],
      // Numpad: Rows are defined here, will be mapped to a CSS grid
      // Numpad Row 1 (NumLock, /, *, -)
      [ 
        { code: 'NumLock', label: keyIconMap.NumLock },
        { code: 'NumpadDivide', label: keyIconMap.NumpadDivide },
        { code: 'NumpadMultiply', label: keyIconMap.NumpadMultiply },
        { code: 'NumpadSubtract', label: keyIconMap.NumpadSubtract },
      ],
      // Numpad Row 2 (7, 8, 9, + (spans 2 rows))
      [ 
        { code: 'Numpad7', label: '7' },
        { code: 'Numpad8', label: '8' },
        { code: 'Numpad9', label: '9' },
        { code: 'NumpadAdd', label: keyIconMap.NumpadAdd, className: 'row-span-2 h-auto' }, 
      ],
      // Numpad Row 3 (4, 5, 6)
      [ 
        { code: 'Numpad4', label: '4' },
        { code: 'Numpad5', label: '5' },
        { code: 'Numpad6', label: '6' },
      ],
      // Numpad Row 4 (1, 2, 3, Enter (spans 2 rows))
      [ 
        { code: 'Numpad1', label: '1' },
        { code: 'Numpad2', label: '2' },
        { code: 'Numpad3', label: '3' },
        { code: 'NumpadEnter', label: keyIconMap.NumpadEnter, className: 'row-span-2 h-auto' }, 
      ],
      // Numpad Row 5 (0 (spans 2 columns), .)
      [ 
        { code: 'Numpad0', label: '0', className: 'col-span-2 w-auto' }, 
        { code: 'NumpadDecimal', label: keyIconMap.NumpadDecimal },
      ],
    ],
  ];


  return (
    <div className="p-4 bg-background rounded-lg shadow-inner space-y-1.5">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={`main-row-${rowIndex}`} className="flex space-x-1.5 justify-center">
          {row.map((keyConfig) => {
            const isIcon = typeof keyConfig.label !== 'string' && React.isValidElement(keyConfig.label);
            return <Key key={keyConfig.code} label={keyConfig.label} keyCode={keyConfig.code} activeKey={activeKey} className={keyConfig.className} isIcon={isIcon} />;
          })}
        </div>
      ))}
      <div className="flex justify-between pt-1.5 space-x-1.5">
        {/* Left side (PrintScreen, ScrollLock, Pause) */}
        <div className="space-y-1.5">
          <div className="flex space-x-1.5">
            {(() => { const label = keyIconMap.PrintScreen || 'PrtSc'; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key="PrintScreen" label={label} keyCode="PrintScreen" activeKey={activeKey} isIcon={isIcon} />; })()}
            {(() => { const label = keyIconMap.ScrollLock || 'ScrLk'; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key="ScrollLock" label={label} keyCode="ScrollLock" activeKey={activeKey} isIcon={isIcon} />; })()}
            {(() => { const label = keyIconMap.Pause || 'Pause'; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key="Pause" label={label} keyCode="Pause" activeKey={activeKey} isIcon={isIcon} />; })()}
          </div>
        </div>
        {/* Right side (Navigation, Arrows, Numpad) */}
        <div className="flex space-x-1.5">
          {/* Navigation and Arrows Column Group */}
          <div className="flex flex-col space-y-1.5">
            <div className="flex space-x-1.5">
                {/* Insert, Home, PageUp Column */}
                <div className="flex flex-col space-y-1.5">
                    {navigationAndNumpadLayout[0][0].map(k => {
                        const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                        return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />;
                    })}
                </div>
                {/* Delete, End, PageDown Column */}
                <div className="flex flex-col space-y-1.5">
                     {navigationAndNumpadLayout[0][1].map(k => {
                        const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                        return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />;
                    })}
                </div>
            </div>
            {/* Arrow Keys */}
             <div className="flex justify-center items-end space-x-1.5">
                {(() => { const k = navigationAndNumpadLayout[0][3][0]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />; })()}
                <div className="flex flex-col space-y-1.5 items-center">
                     {(() => { const k = navigationAndNumpadLayout[0][2][0]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />; })()}
                     {(() => { const k = navigationAndNumpadLayout[0][3][1]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />; })()}
                </div>
                {(() => { const k = navigationAndNumpadLayout[0][3][2]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />; })()}
            </div>
          </div>
          {/* Numpad Column Group */}
          <div className="grid grid-cols-4 grid-rows-5 gap-1.5">
            {/* Numpad Row 1 */}
            {navigationAndNumpadLayout[0][4].map(k => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
            })}
            {/* Numpad Row 2 & Add key spanning */}
            {navigationAndNumpadLayout[0][5].slice(0,3).map(k => { // 7, 8, 9
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
            })}
             {(() => { const k = navigationAndNumpadLayout[0][5][3]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className, 'row-start-2 row-end-4 col-start-4')} isIcon={isIcon} />; })()} {/* NumpadAdd */}
            
            {/* Numpad Row 3 */}
             {navigationAndNumpadLayout[0][6].map(k => { // 4, 5, 6
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
            })}

            {/* Numpad Row 4 & Enter key spanning */}
            {navigationAndNumpadLayout[0][7].slice(0,3).map(k => { // 1, 2, 3
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
            })}
            {(() => { const k = navigationAndNumpadLayout[0][7][3]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className, 'row-start-4 row-end-6 col-start-4')} isIcon={isIcon} />; })()} {/* NumpadEnter */}

            {/* Numpad Row 5 */}
            {(() => { const k = navigationAndNumpadLayout[0][8][0]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className, 'col-span-2')} isIcon={isIcon} />; })()} {/* Numpad0 */}
            {(() => { const k = navigationAndNumpadLayout[0][8][1]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />; })()} {/* NumpadDecimal */}
          </div>
        </div>
      </div>
    </div>
  );
};

