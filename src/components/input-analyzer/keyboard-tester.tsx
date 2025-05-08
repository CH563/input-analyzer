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
  Printer,
  Info, // ScrollLock icon
  HelpCircle, // Pause icon
  Home,
  ExternalLink, // End icon
  Lock,
  Table, // NumLock icon
} from 'lucide-react';

interface KeyProps {
  label: string | React.ReactNode;
  keyCode: string;
  activeKey: string | null;
  className?: string;
  isIcon?: boolean;
}

// Adjusted key size to h-10 (40px) and min-w-[2.5rem] (40px) for 1U
const Key: React.FC<KeyProps> = ({ label, keyCode, activeKey, className, isIcon }) => {
  const isActive = activeKey === keyCode;
  return (
    <div
      className={cn(
        'flex items-center justify-center h-10 min-w-[2.5rem] p-1.5 border rounded-md shadow-sm transition-all duration-75 ease-in-out',
        'bg-card text-card-foreground border-border',
        isActive ? 'bg-accent text-accent-foreground scale-105 transform ring-2 ring-accent ring-offset-2 ring-offset-background' : 'hover:bg-muted',
        className,
        isIcon ? 'text-md' : 'text-xs font-medium' // Adjusted icon text size if needed, text-xs for labels
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

// Key widths in 1U (unit) multiples, where 1U = 2.5rem (40px)
const KEY_WIDTH_UNIT = '2.5rem';
const calcWidth = (units: number) => `calc(${units} * ${KEY_WIDTH_UNIT} - ((${units} - 1) * 0.375rem))`; // 0.375rem is approx space-x-1.5 / 2

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
  Space: <Square className="w-full h-5" />, // Adjusted for flexible width
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
  // 98-key layout typically has 1U for most keys, and standard widths for modifiers.
  // Adjust className for width based on typical keycap sizes.
  // 1U = 2.5rem
  // Backspace = 2U
  // Tab = 1.5U
  // CapsLock = 1.75U
  // Enter = 2.25U
  // ShiftLeft = 2.25U
  // ShiftRight = 2.75U (sometimes smaller in compact layouts, for 98-key usually 1.75U or 2.75U. Let's go with 1.75U for compactness)
  // Ctrl/Alt/Meta = 1.25U or 1U. For 98-key, often 1U.
  // Space = 6.25U or flexible
  const keyboardLayout = [
    // Row 1 (Function keys, Escape) - Standard 1U keys
    [
      { code: 'Escape', label: keyIconMap.Escape || 'Esc', className: 'w-[calc(1.5*2.5rem)]' }, // Often 1.5U
      // F1-F4
      ...Array.from({ length: 4 }, (_, i) => ({
        code: `F${i + 1}`,
        label: getFKeyLabel(`F${i + 1}`)
      })),
      // F5-F8
      ...Array.from({ length: 4 }, (_, i) => ({
        code: `F${i + 5}`,
        label: getFKeyLabel(`F${i + 5}`),
        className: i === 0 ? 'ml-2' : undefined, // Small gap for grouping
      })),
      // F9-F12
      ...Array.from({ length: 4 }, (_, i) => ({
        code: `F${i + 9}`,
        label: getFKeyLabel(`F${i + 9}`),
        className: i === 0 ? 'ml-2' : undefined, // Small gap for grouping
      })),
    ],
    // Row 2 (Numbers, Backquote, Backspace) - Standard 1U keys, Backspace is 2U
    [
      { code: 'Backquote', label: '`' },
      ...Array.from({ length: 9 }, (_, i) => ({ code: `Digit${i + 1}`, label: getDigitKeyLabel(`Digit${i + 1}`) })),
      { code: 'Digit0', label: getDigitKeyLabel('Digit0') },
      { code: 'Minus', label: '-' },
      { code: 'Equal', label: '=' },
      { code: 'Backspace', label: keyIconMap.Backspace, className: 'min-w-[calc(2*2.5rem)] flex-grow' }, // 2U
    ],
    // Row 3 (QWERTY, Tab, Brackets, Backslash) - Tab 1.5U, Backslash 1.5U
    [
      { code: 'Tab', label: keyIconMap.Tab, className: 'min-w-[calc(1.5*2.5rem)]' }, // 1.5U
      ...['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => ({ code: `Key${key}`, label: key })),
      { code: 'BracketLeft', label: '[' },
      { code: 'BracketRight', label: ']' },
      { code: 'Backslash', label: '\\', className: 'min-w-[calc(1.5*2.5rem)] flex-grow' }, // 1.5U
    ],
    // Row 4 (ASDFGHJKL, CapsLock, Enter, Semicolon, Quote) - CapsLock 1.75U, Enter 2.25U
    [
      { code: 'CapsLock', label: keyIconMap.CapsLock, className: 'min-w-[calc(1.75*2.5rem)]' }, // 1.75U
      ...['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => ({ code: `Key${key}`, label: key })),
      { code: 'Semicolon', label: ';' },
      { code: 'Quote', label: "'" },
      { code: 'Enter', label: keyIconMap.Enter, className: 'min-w-[calc(2.25*2.5rem)] flex-grow' }, // 2.25U
    ],
    // Row 5 (ZXCVBNM, Shift, Comma, Period, Slash) - ShiftLeft 2.25U, ShiftRight 1.75U (for 98-key compact)
    [
      { code: 'ShiftLeft', label: keyIconMap.ShiftLeft, className: 'min-w-[calc(2.25*2.5rem)]' }, // 2.25U
      ...['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(key => ({ code: `Key${key}`, label: key })),
      { code: 'Comma', label: ',' },
      { code: 'Period', label: '.' },
      { code: 'Slash', label: '/' },
      { code: 'ShiftRight', label: keyIconMap.ShiftRight, className: 'min-w-[calc(1.75*2.5rem)] flex-grow' }, // 1.75U for 98 key compactness
    ],
    // Row 6 (Ctrl, Meta, Alt, Space, Arrows) - Ctrl/Meta/Alt 1U. Space flexible
    [
      { code: 'ControlLeft', label: keyIconMap.ControlLeft, className: 'min-w-[calc(1.25*2.5rem)]' }, // 1.25U
      { code: 'MetaLeft', label: keyIconMap.MetaLeft, className: 'min-w-[calc(1.25*2.5rem)]' },    // 1.25U
      { code: 'AltLeft', label: keyIconMap.AltLeft, className: 'min-w-[calc(1.25*2.5rem)]' },      // 1.25U
      { code: 'Space', label: keyIconMap.Space, className: 'flex-grow min-w-[calc(5.5*2.5rem)]' }, // Adjusted space, was 16rem
      { code: 'AltRight', label: keyIconMap.AltRight, className: 'min-w-[calc(1*2.5rem)]' },        // 1U
      { code: 'MetaRight', label: keyIconMap.MetaRight, className: 'min-w-[calc(1*2.5rem)]' },      // 1U (Often Fn on 98-key)
      { code: 'ControlRight', label: keyIconMap.ControlRight, className: 'min-w-[calc(1.25*2.5rem)]' }, // 1.25U
    ],
  ];

  // Right-hand cluster (PrtSc, Nav, Arrows, Numpad) for a 98-key layout
  // This is often more compact. PrtSc, Del, Home, End, PgUp, PgDn might be in a column or 2x3 grid.
  // Numpad is slightly condensed. Arrow keys are often integrated below Enter/Shift.
  // For 98-key, numpad is usually there, and arrow keys are to the right of main block.
  // Nav keys (Ins, Del, Home, End, PgUp, PgDn) are usually above the numpad or in a vertical strip.

  const rightClusterLayout = [
    // Column 1: PrtSc, ScrollLock (or other fn), Pause (or other fn)
    { code: 'PrintScreen', label: keyIconMap.PrintScreen },
    { code: 'ScrollLock', label: keyIconMap.ScrollLock },
    { code: 'Pause', label: keyIconMap.Pause },

    // Column 2: Insert, Home, PageUp
    { code: 'Insert', label: keyIconMap.Insert },
    { code: 'Home', label: keyIconMap.Home },
    { code: 'PageUp', label: keyIconMap.PageUp },

    // Column 3: Delete, End, PageDown
    { code: 'Delete', label: keyIconMap.DeleteForward }, // Already DeleteForward in map
    { code: 'End', label: keyIconMap.End },
    { code: 'PageDown', label: keyIconMap.PageDown },

    // Column 4: Numpad Top Row
    { code: 'NumLock', label: keyIconMap.NumLock },
    { code: 'NumpadDivide', label: keyIconMap.NumpadDivide },
    { code: 'NumpadMultiply', label: keyIconMap.NumpadMultiply },
    { code: 'NumpadSubtract', label: keyIconMap.NumpadSubtract },
    
    // Column 5: Numpad 7,8,9 and Add
    { code: 'Numpad7', label: '7' },
    { code: 'Numpad8', label: '8' },
    { code: 'Numpad9', label: '9' },
    { code: 'NumpadAdd', label: keyIconMap.NumpadAdd, className: 'row-span-2 h-auto' }, // Spans 2 rows

    // Column 6: Numpad 4,5,6
    { code: 'Numpad4', label: '4' },
    { code: 'Numpad5', label: '5' },
    { code: 'Numpad6', label: '6' },
    // NumpadAdd placeholder (spanned by previous)
    
    // Column 7: Numpad 1,2,3 and Enter
    { code: 'Numpad1', label: '1' },
    { code: 'Numpad2', label: '2' },
    { code: 'Numpad3', label: '3' },
    { code: 'NumpadEnter', label: keyIconMap.NumpadEnter, className: 'row-span-2 h-auto' }, // Spans 2 rows

    // Column 8: Numpad 0 and Decimal
    { code: 'Numpad0', label: '0', className: 'col-span-2 w-auto min-w-[calc(2*2.5rem)]' }, // Spans 2 columns
    { code: 'NumpadDecimal', label: keyIconMap.NumpadDecimal },
    // NumpadEnter placeholder (spanned by previous)

    // Arrow keys are separate from this grid, usually.
    // For 98-key, arrows are often in a cluster, right of CtrlRight or integrated under ShiftRight.
    // Let's place them as a distinct block.
  ];


  return (
    <div className="p-2 bg-background rounded-lg shadow-inner space-y-1.5 flex flex-col items-center max-w-fit mx-auto">
      {/* Main keyboard section */}
      <div className="space-y-1.5">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={`main-row-${rowIndex}`} className="flex space-x-1.5 justify-start"> {/* Changed to justify-start */}
            {row.map((keyConfig, keyIndex) => {
              const isIcon = typeof keyConfig.label !== 'string' && React.isValidElement(keyConfig.label);
              return <Key key={`${keyConfig.code}-${rowIndex}-${keyIndex}`} label={keyConfig.label} keyCode={keyConfig.code} activeKey={activeKey} className={keyConfig.className} isIcon={isIcon} />;
            })}
          </div>
        ))}
      </div>

      {/* Combined Right Cluster: Nav, Arrows, Numpad for 98-key style */}
      {/* This will be a grid: 4 columns for numpad, 1 column for nav keys or a 3x3 block for nav */}
      {/* Arrows are typically a cluster. In 98-key, they are often right of RCtrl. */}
      <div className="flex pt-1.5 space-x-1.5">
        {/* Left part of the right cluster (PrtScn block, Nav block) */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex space-x-1.5">
             {/* PrtSc, ScrollLock, Pause in a column */}
            <div className="flex flex-col space-y-1.5">
              {rightClusterLayout.slice(0, 3).map(k => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />;
              })}
            </div>
             {/* Ins, Home, PgUp in a column */}
            <div className="flex flex-col space-y-1.5">
              {rightClusterLayout.slice(3, 6).map(k => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />;
              })}
            </div>
             {/* Del, End, PgDn in a column */}
            <div className="flex flex-col space-y-1.5">
              {rightClusterLayout.slice(6, 9).map(k => {
                const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
                return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={k.className} isIcon={isIcon} />;
              })}
            </div>
          </div>
           {/* Arrow Keys Cluster */}
          <div className="flex flex-col items-center space-y-1.5 pt-1.5">
            {/* Up Arrow */}
            <Key key="ArrowUp" label={keyIconMap.ArrowUp} keyCode="ArrowUp" activeKey={activeKey} isIcon={true} />
            {/* Left, Down, Right Arrows */}
            <div className="flex space-x-1.5">
              <Key key="ArrowLeft" label={keyIconMap.ArrowLeft} keyCode="ArrowLeft" activeKey={activeKey} isIcon={true} />
              <Key key="ArrowDown" label={keyIconMap.ArrowDown} keyCode="ArrowDown" activeKey={activeKey} isIcon={true} />
              <Key key="ArrowRight" label={keyIconMap.ArrowRight} keyCode="ArrowRight" activeKey={activeKey} isIcon={true} />
            </div>
          </div>
        </div>
        
        {/* Numpad (4 columns wide, 5 rows tall including multi-row keys) */}
        <div className="grid grid-cols-4 grid-rows-5 gap-1.5 ml-1.5"> {/* Added ml-1.5 for spacing */}
          {/* Row 1: NumLock, NumpadDivide, NumpadMultiply, NumpadSubtract */}
          {rightClusterLayout.slice(9, 13).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
          })}

          {/* Row 2: Numpad7, Numpad8, Numpad9 */}
          {rightClusterLayout.slice(13, 16).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
          })}
          {/* NumpadAdd (spans 2 rows, placed in grid) */}
          {(() => { const k = rightClusterLayout[16]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className, 'row-start-2 row-end-4 col-start-4')} isIcon={isIcon} />; })()}

          {/* Row 3: Numpad4, Numpad5, Numpad6 */}
          {rightClusterLayout.slice(17, 20).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
          })}
          
          {/* Row 4: Numpad1, Numpad2, Numpad3 */}
          {rightClusterLayout.slice(20, 23).map(k => {
            const isIcon = typeof k.label !== 'string' && React.isValidElement(k.label);
            return <Key key={k.code} label={k.label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />;
          })}
          {/* NumpadEnter (spans 2 rows, placed in grid) */}
           {(() => { const k = rightClusterLayout[23]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className, 'row-start-4 row-end-6 col-start-4')} isIcon={isIcon} />; })()}


          {/* Row 5: Numpad0 (spans 2 cols), NumpadDecimal */}
          {(() => { const k = rightClusterLayout[24]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className, 'col-span-2')} isIcon={isIcon} />; })()}
          {(() => { const k = rightClusterLayout[25]; const label = k.label; const isIcon = typeof label !== 'string' && React.isValidElement(label); return <Key key={k.code} label={label} keyCode={k.code} activeKey={activeKey} className={cn(k.className)} isIcon={isIcon} />; })()}
        </div>
      </div>
    </div>
  );
};
