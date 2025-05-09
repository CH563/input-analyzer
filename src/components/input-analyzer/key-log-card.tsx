
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MdHistory, MdDeleteSweep, MdOutlineSummarize, MdOutlineSpeed, MdOutlineTimer, MdOutlineStar } from 'react-icons/md';
import { format } from 'date-fns';

interface KeyLogEntry {
  id: string;
  timestamp: number;
  displayValue: string;
  type: 'down' | 'up';
  delay?: number;
}

interface KeyLogCardProps {
  keyLog: KeyLogEntry[];
  totalKeyPresses: number;
  averageDelay: number | null;
  sessionDuration: string;
  mostFrequentKey: { key: string; count: number };
  onClearLog: () => void;
}

export const KeyLogCard: React.FC<KeyLogCardProps> = ({
  keyLog,
  totalKeyPresses,
  averageDelay,
  sessionDuration,
  mostFrequentKey,
  onClearLog,
}) => {
  return (
    <Card className="shadow-lg col-span-1">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-foreground flex items-center">
          <MdHistory className="h-5 w-5 mr-2 text-primary" />
          Key Log
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onClearLog}>
          <MdDeleteSweep className="h-4 w-4 mr-2" />
          Clear Log
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center">
          <Card className="p-2 shadow-sm">
            <CardHeader className="p-1 pb-0">
              <MdOutlineSummarize className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Total Presses</p>
            </CardHeader>
            <CardContent className="p-1">
              <p className="text-lg font-semibold text-primary">{totalKeyPresses}</p>
            </CardContent>
          </Card>
          <Card className="p-2 shadow-sm">
            <CardHeader className="p-1 pb-0">
              <MdOutlineSpeed className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Average Delay</p>
            </CardHeader>
            <CardContent className="p-1">
              <p className="text-lg font-semibold text-primary">
                {averageDelay === null ? 'N/A' : `${averageDelay}ms`}
              </p>
            </CardContent>
          </Card>
          <Card className="p-2 shadow-sm">
            <CardHeader className="p-1 pb-0">
              <MdOutlineTimer className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Session Time</p>
            </CardHeader>
            <CardContent className="p-1">
              <p className="text-lg font-semibold text-primary">{sessionDuration}</p>
            </CardContent>
          </Card>
          <Card className="p-2 shadow-sm">
            <CardHeader className="p-1 pb-0">
              <MdOutlineStar className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Most Used</p>
            </CardHeader>
            <CardContent className="p-1">
              <p className="text-lg font-semibold text-primary truncate" title={`${mostFrequentKey.key} (${mostFrequentKey.count})`}>
                {mostFrequentKey.key} <span className="text-xs text-muted-foreground">({mostFrequentKey.count})</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <ScrollArea className="h-[240px] w-full rounded-md border p-3 bg-muted/30">
          {keyLog.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No key presses logged yet.</p>
          ) : (
            <div className="space-y-2">
              {keyLog.slice().reverse().map((entry) => (
                <div key={entry.id} className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">
                    {format(new Date(entry.timestamp), 'HH:mm:ss')}.{String(entry.timestamp % 1000).padStart(3, '0')}
                  </span>
                  <div className='flex items-center gap-2'>
                    <span className={entry.type === 'down' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {entry.type === 'down' ? 'Pressed' : 'Released'}
                    </span>
                    <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">{entry.displayValue}</Badge>
                  </div>
                  <span className="w-[80px] text-right">
                    {entry.type === 'up' && entry.delay !== undefined ? `Delay: ${entry.delay}ms` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
