
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MdInfoOutline } from 'react-icons/md';

interface LegendItemProps {
  colorClass: string;
  label: string;
  range: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ colorClass, label, range }) => (
  <div className="flex items-center space-x-2">
    <span className={`h-3 w-3 rounded-full block ${colorClass}`} />
    <span className="text-sm text-foreground">{label}:</span>
    <span className="text-sm text-muted-foreground">{range}</span>
  </div>
);

export const AboutKeyboardTestingCard: React.FC = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xl text-foreground flex items-center">
          <MdInfoOutline className="h-5 w-5 mr-2 text-primary" />
          About Keyboard Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 text-sm text-muted-foreground space-y-3">
        <p>
          Keyboard testing tools help you check various performance metrics of your keyboard, 
          including key response, latency, and rollover issues. Understanding these metrics can help you
          diagnose problems or choose the right keyboard for your needs.
        </p>
        <div>
          <h3 className="text-md font-semibold text-foreground mb-2">Response Time Quality:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <LegendItem colorClass="bg-green-500" label="Excellent" range="<5ms" />
            <LegendItem colorClass="bg-blue-500" label="Good" range="5-15ms" />
            <LegendItem colorClass="bg-yellow-500" label="Average" range="15-30ms" />
            <LegendItem colorClass="bg-red-500" label="Slow" range=">30ms" />
          </div>
        </div>
        <p>
          <strong className="text-foreground">Influencing Factors:</strong> Keyboard type (mechanical, membrane), 
          connection method (wired, wireless), drivers, operating system, and even system load can affect performance.
        </p>
      </CardContent>
    </Card>
  );
};
