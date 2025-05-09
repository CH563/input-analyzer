
'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { MdBarChart, MdTimeline } from 'react-icons/md';


interface DataVisualizationCardProps {
  keyFrequency: Record<string, number>;
}

const chartConfig = {
  keyUsage: {
    label: "Key Usage Frequency",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;


export const DataVisualizationCard: React.FC<DataVisualizationCardProps> = ({ keyFrequency }) => {
  const keyFrequencyData = useMemo(() => {
    return Object.entries(keyFrequency)
      .map(([name, value]) => ({ name, "Key Usage Frequency": value }))
      .sort((a, b) => b["Key Usage Frequency"] - a["Key Usage Frequency"])
      .slice(0, 15); // Display top 15 most frequent keys
  }, [keyFrequency]);

  return (
    <Card className="shadow-lg col-span-1">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xl text-foreground flex items-center">
          <MdBarChart className="h-5 w-5 mr-2 text-primary" />
          Data Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <Tabs defaultValue="key-frequency">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="key-frequency">Key Frequency</TabsTrigger>
            <TabsTrigger value="response-times" disabled>Response Times (Coming Soon)</TabsTrigger>
          </TabsList>
          <TabsContent value="key-frequency">
            {keyFrequencyData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={keyFrequencyData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis label={{ value: 'Usage Count', angle: -90, position: 'insideLeft', offset:10, style: {textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }} allowDecimals={false} tickMargin={5} />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Legend content={<ChartLegendContent />} />
                    <Bar dataKey="Key Usage Frequency" fill="var(--color-keyUsage)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No key press data yet. Start typing!
              </div>
            )}
          </TabsContent>
          <TabsContent value="response-times">
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Response time visualization is coming soon.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
