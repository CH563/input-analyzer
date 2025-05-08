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
  ShiftLeft: <ArrowUp className="transform rotate-[-0deg]" />, // Lucide doesn't have a dedicated shift icon
  ShiftRight: <ArrowUp className="transform rotate-[-0deg]" />,
  ControlLeft: <span className="text-xs">Ctrl</span>,
  ControlRight: <span className="text-xs">Ctrl</span>,
  AltLeft: <Option />,
  AltRight: <Option />,
  MetaLeft: <Command />,
  MetaRight: <Command />,
  CapsLock: <Lock />,
  Escape: <span className="text-xs">Esc</span>,
  Space: <Square className="w-24 h-6" />, // Represents space bar
  ArrowUp: <ArrowUp />,
  ArrowDown: <ArrowDown />,
  ArrowLeft: <ArrowLeft />,
  ArrowRight: <ArrowRight />,
  ContextMenu: <AlignLeft />,
  PrintScreen: <Printer />,
  ScrollLock: <Info />, // No direct icon, using Info
  Pause: <HelpCircle />, // No direct icon, using HelpCircle
  Insert: <Plus />,
  Home: <Home />,
  PageUp: <ChevronLeft className="transform rotate-90" />,
  DeleteForward: <Delete />,
  End: <ExternalLink />, // Using a generic icon
  PageDown: <ChevronRight className="transform rotate-90" />,
  NumLock: <Table />, // using table icon for numlock
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
  const renderKey = (label: string | React.ReactNode, keyCode: string, className?: string) => {
    const isIcon = typeof label !== 'string' && React.isValidElement(label);
    return <Key label={label} keyCode={keyCode} activeKey={activeKey} className={className} isIcon={isIcon} />;
  };
  
  const keyboardLayout = [
    // Row 1 (Function keys, Escape)
    [
      { code: 'Escape', label: keyIconMap.Escape || 'Esc', className: 'w-16' },
      ...Array.from({ length: 4 }, (_, i) => ({ code: `F${i + 1}`, label: getFKeyLabel(`F${i + 1}`) })),
      { code: 'F5', label: getFKeyLabel('F5'), className: 'ml-4' },
      ...Array.from({ length: 4 }, (_, i) => ({ code: `F${i + 5}`, label: getFKeyLabel(`F${i + 5}`) })),
      { code: 'F9', label: getFKeyLabel('F9'), className: 'ml-4' },
      ...Array.from({ length: 4 }, (_, i) => ({ code: `F${i + 9}`, label: getFKeyLabel(`F${i + 9}`) })),
    ],
    // Row 2 (Numbers, Backquote, Backspace)
    [
      { code: 'Backquote', label: '`' },
      ...Array.from({ length: 10 }, (_, i) => ({ code: `Digit${(i + 1) % 10}`, label: getDigitKeyLabel(`Digit${(i + 1) % 10}`) })),
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
      { code: 'MetaLeft', label: keyIconMap.MetaLeft, className: 'w-16' },
      { code: 'AltLeft', label: keyIconMap.AltLeft, className: 'w-16' },
      { code: 'Space', label: keyIconMap.Space, className: 'flex-grow min-w-[16rem]' },
      { code: 'AltRight', label: keyIconMap.AltRight, className: 'w-16' },
      { code: 'MetaRight', label: keyIconMap.MetaRight, className: 'w-16' },
      { code: 'ContextMenu', label: keyIconMap.ContextMenu, className: 'w-16' },
      { code: 'ControlRight', label: keyIconMap.ControlRight, className: 'w-20' },
    ],
  ];
  
  const navigationAndNumpadLayout = [
    // Navigation keys (Insert, Home, PageUp, Delete, End, PageDown) and Arrow keys
    [
      // Column 1: Insert, Home, PageUp
      [
        { code: 'Insert', label: keyIconMap.Insert },
        { code: 'Home', label: keyIconMap.Home },
        { code: 'PageUp', label: keyIconMap.PageUp },
      ],
      // Column 2: Delete, End, PageDown
      [
        { code: 'Delete', label: keyIconMap.DeleteForward || 'Del' },
        { code: 'End', label: keyIconMap.End },
        { code: 'PageDown', label: keyIconMap.PageDown },
      ],
      // Empty Column for spacing, then Arrow Keys
      [
        { code: 'Empty1', label: '', className:'invisible'}, // Spacer
        { code: 'ArrowUp', label: keyIconMap.ArrowUp },
        { code: 'Empty2', label: '', className:'invisible'}, // Spacer
      ],
      [
        { code: 'ArrowLeft', label: keyIconMap.ArrowLeft },
        { code: 'ArrowDown', label: keyIconMap.ArrowDown },
        { code: 'ArrowRight', label: keyIconMap.ArrowRight },
      ],
      // Numpad
      [
        { code: 'NumLock', label: keyIconMap.NumLock },
        { code: 'NumpadDivide', label: keyIconMap.NumpadDivide },
        { code: 'NumpadMultiply', label: keyIconMap.NumpadMultiply },
        { code: 'NumpadSubtract', label: keyIconMap.NumpadSubtract },
      ],
      [
        { code: 'Numpad7', label: '7' },
        { code: 'Numpad8', label: '8' },
        { code: 'Numpad9', label: '9' },
        { code: 'NumpadAdd', label: keyIconMap.NumpadAdd, className: 'row-span-2 h-auto' }, // Spans 2 rows
      ],
      [
        { code: 'Numpad4', label: '4' },
        { code: 'Numpad5', label: '5' },
        { code: 'Numpad6', label: '6' },
      ],
      [
        { code: 'Numpad1', label: '1' },
        { code: 'Numpad2', label: '2' },
        { code: 'Numpad3', label: '3' },
        { code: 'NumpadEnter', label: keyIconMap.NumpadEnter, className: 'row-span-2 h-auto' }, // Spans 2 rows
      ],
      [
        { code: 'Numpad0', label: '0', className: 'col-span-2 w-auto' }, // Spans 2 columns
        { code: 'NumpadDecimal', label: keyIconMap.NumpadDecimal },
      ],
    ],
  ];


  return (
    <div className="p-4 bg-background rounded-lg shadow-inner space-y-1.5">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-1.5 justify-center">
          {row.map((keyConfig) => renderKey(keyConfig.label, keyConfig.code, keyConfig.className))}
        </div>
      ))}
      <div className="flex justify-between pt-1.5 space-x-1.5">
        {/* Left side (PrintScreen, ScrollLock, Pause) */}
        <div className="space-y-1.5">
          <div className="flex space-x-1.5">
             {renderKey(keyIconMap.PrintScreen || 'PrtSc', 'PrintScreen')}
             {renderKey(keyIconMap.ScrollLock || 'ScrLk', 'ScrollLock')}
             {renderKey(keyIconMap.Pause || 'Pause', 'Pause')}
          </div>
        </div>
        {/* Right side (Navigation, Arrows, Numpad) */}
        <div className="flex space-x-1.5">
          {/* Navigation and Arrows Column Group */}
          <div className="flex flex-col space-y-1.5">
            <div className="flex space-x-1.5">
                {/* Insert, Home, PageUp Column */}
                <div className="flex flex-col space-y-1.5">
                    {navigationAndNumpadLayout[0][0].map(k => renderKey(k.label, k.code, k.className))}
                </div>
                {/* Delete, End, PageDown Column */}
                <div className="flex flex-col space-y-1.5">
                    {navigationAndNumpadLayout[0][1].map(k => renderKey(k.label, k.code, k.className))}
                </div>
            </div>
            {/* Arrow Keys */}
            <div className="flex justify-center space-x-1.5">
                {renderKey(navigationAndNumpadLayout[0][3][0].label, navigationAndNumpadLayout[0][3][0].code)}
                <div className="flex flex-col space-y-1.5 items-center">
                     {renderKey(navigationAndNumpadLayout[0][2][1].label, navigationAndNumpadLayout[0][2][1].code)}
                     {renderKey(navigationAndNumpadLayout[0][3][1].label, navigationAndNumpadLayout[0][3][1].code)}
                </div>
                {renderKey(navigationAndNumpadLayout[0][3][2].label, navigationAndNumpadLayout[0][3][2].code)}
            </div>
          </div>
          {/* Numpad Column Group */}
          <div className="grid grid-cols-4 grid-rows-5 gap-1.5">
            {renderKey(navigationAndNumpadLayout[0][4][0].label, navigationAndNumpadLayout[0][4][0].code, 'col-start-1')}
            {renderKey(navigationAndNumpadLayout[0][4][1].label, navigationAndNumpadLayout[0][4][1].code, 'col-start-2')}
            {renderKey(navigationAndNumpadLayout[0][4][2].label, navigationAndNumpadLayout[0][4][2].code, 'col-start-3')}
            {renderKey(navigationAndNumpadLayout[0][4][3].label, navigationAndNumpadLayout[0][4][3].code, 'col-start-4')}

            {renderKey(navigationAndNumpadLayout[0][5][0].label, navigationAndNumpadLayout[0][5][0].code, 'col-start-1 row-start-2')}
            {renderKey(navigationAndNumpadLayout[0][5][1].label, navigationAndNumpadLayout[0][5][1].code, 'col-start-2 row-start-2')}
            {renderKey(navigationAndNumpadLayout[0][5][2].label, navigationAndNumpadLayout[0][5][2].code, 'col-start-3 row-start-2')}
            {renderKey(navigationAndNumpadLayout[0][5][3].label, navigationAndNumpadLayout[0][5][3].code, 'col-start-4 row-start-2 row-span-2 h-auto')}
            
            {renderKey(navigationAndNumpadLayout[0][6][0].label, navigationAndNumpadLayout[0][6][0].code, 'col-start-1 row-start-3')}
            {renderKey(navigationAndNumpadLayout[0][6][1].label, navigationAndNumpadLayout[0][6][1].code, 'col-start-2 row-start-3')}
            {renderKey(navigationAndNumpadLayout[0][6][2].label, navigationAndNumpadLayout[0][6][2].code, 'col-start-3 row-start-3')}

            {renderKey(navigationAndNumpadLayout[0][7][0].label, navigationAndNumpadLayout[0][7][0].code, 'col-start-1 row-start-4')}
            {renderKey(navigationAndNumpadLayout[0][7][1].label, navigationAndNumpadLayout[0][7][1].code, 'col-start-2 row-start-4')}
            {renderKey(navigationAndNumpadLayout[0][7][2].label, navigationAndNumpadLayout[0][7][2].code, 'col-start-3 row-start-4')}
            {renderKey(navigationAndNumpadLayout[0][7][3].label, navigationAndNumpadLayout[0][7][3].code, 'col-start-4 row-start-4 row-span-2 h-auto')}

            {renderKey(navigationAndNumpadLayout[0][8][0].label, navigationAndNumpadLayout[0][8][0].code, 'col-start-1 row-start-5 col-span-2 w-auto')}
            {renderKey(navigationAndNumpadLayout[0][8][1].label, navigationAndNumpadLayout[0][8][1].code, 'col-start-3 row-start-5')}
          </div>
        </div>
      </div>
    </div>
  );
};
