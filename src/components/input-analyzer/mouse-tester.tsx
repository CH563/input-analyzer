'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { MousePointer2 } from 'lucide-react'; // For a fallback or general icon

interface MouseTesterProps {
  activeMouseButton: string | null;
}

export const MouseTester: React.FC<MouseTesterProps> = ({ activeMouseButton }) => {
  const isActive = (buttonName: string) => activeMouseButton === buttonName;

  return (
    <div className="p-4 bg-background rounded-lg shadow-inner hidden xl:inline-block">
      <svg
        width="120"
        height="auto"
        viewBox="0 0 120 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Mouse Body */}
        <path
          d="M60 0C26.86 0 0 26.86 0 60V140C0 173.14 26.86 200 60 200C93.14 200 120 173.14 120 140V60C120 26.86 93.14 0 60 0Z"
          className={cn(
            'fill-card stroke-border stroke-2 transition-colors duration-100',
            (isActive('Left Click') || isActive('Right Click') || isActive('Middle Click')) && 'stroke-accent'
          )}
        />

        {/* Left Click Button */}
        <path
          d="M0 60C0 26.86 26.86 0 60 0V70H0V60Z"
          className={cn(
            'fill-card stroke-border stroke-2 transition-colors duration-100',
            isActive('Left Click') ? 'fill-accent' : 'hover:fill-muted'
          )}
        />

        {/* Right Click Button */}
        <path
          d="M120 60C120 26.86 93.14 0 60 0V70H120V60Z"
          className={cn(
            'fill-card stroke-border stroke-2 transition-colors duration-100',
            isActive('Right Click') ? 'fill-accent' : 'hover:fill-muted'
          )}
        />
        
        {/* Divider Line */}
        <line x1="60" y1="0" x2="60" y2="70" className="stroke-border stroke-2" />

        {/* Scroll Wheel (Middle Click) */}
        <rect
          x="50"
          y="25"
          width="20"
          height="30"
          rx="10"
          className={cn(
            'fill-muted stroke-border stroke-1 transition-colors duration-100',
            isActive('Middle Click') ? 'fill-accent stroke-accent-foreground' : 'hover:fill-secondary'
          )}
        />
         {/* Scroll Wheel lines */}
        <line x1="55" y1="30" x2="55" y2="50" className="stroke-border stroke-1" />
        <line x1="65" y1="30" x2="65" y2="50" className="stroke-border stroke-1" />
        <line x1="60" y1="30" x2="60" y2="50" className="stroke-border stroke-1" />


        {/* Side buttons (optional, for Browser Back/Forward) */}
        {/* Browser Back */}
        <rect 
          x="5" 
          y="80" 
          width="15" 
          height="30" 
          rx="5" 
          className={cn(
            'fill-muted stroke-border stroke-1 transition-colors duration-100',
            isActive('Browser Back') ? 'fill-accent' : 'hover:fill-secondary'
          )}
        />
        {/* Browser Forward */}
        <rect 
          x="5" 
          y="120" 
          width="15" 
          height="30" 
          rx="5" 
          className={cn(
            'fill-muted stroke-border stroke-1 transition-colors duration-100',
            isActive('Browser Forward') ? 'fill-accent' : 'hover:fill-secondary'
          )}
        />

        {/* You can add more visual elements for other buttons if needed */}
      </svg>
       {/* Fallback Icon/Text if SVG fails or for other contexts */}
      {/* <MousePointer2 className="w-16 h-16 text-muted-foreground mt-4" /> */}
    </div>
  );
};
