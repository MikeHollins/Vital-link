import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend
} from 'recharts';

type ChartType = 'bar' | 'line' | 'area';

interface ChartDisplayProps {
  type: ChartType;
  data: any[];
  dataKey: string;
  xAxisDataKey: string;
  yAxisWidth?: number;
  height?: number;
  color?: string;
  secondaryColor?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  goalKey?: string;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({
  type,
  data,
  dataKey,
  xAxisDataKey,
  yAxisWidth = 30,
  height = 300,
  color = 'primary',
  secondaryColor,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  goalKey
}) => {
  // Determine the color based on the color prop
  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return 'var(--chart-1)';
      case 'indigo':
        return 'var(--chart-2)';
      case 'yellow':
        return 'var(--chart-3)';
      case 'red':
        return 'var(--chart-4)';
      case 'green':
        return 'var(--chart-5)';
      default:
        return 'var(--chart-1)';
    }
  };
  
  const getSecondaryColorClass = () => {
    if (secondaryColor) {
      switch (secondaryColor) {
        case 'primary':
          return 'var(--chart-1)';
        case 'indigo':
          return 'var(--chart-2)';
        case 'yellow':
          return 'var(--chart-3)';
        case 'red':
          return 'var(--chart-4)';
        case 'green':
          return 'var(--chart-5)';
        default:
          return 'var(--chart-2)';
      }
    }
    return 'var(--chart-2)';
  };
  
  // Find goal value if goalKey is provided
  const goalValue = goalKey && data.length > 0 ? data[0][goalKey] : undefined;

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart 
            data={data}
            margin={{ top: 15, right: 20, left: 10, bottom: 15 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            <XAxis 
              dataKey={xAxisDataKey} 
              padding={{ left: 10, right: 10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              width={yAxisWidth} 
              tick={{ fontSize: 12 }}
            />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px'
              }}
            />}
            {showLegend && <Legend wrapperStyle={{ paddingTop: 10 }} />}
            {goalKey && goalValue && 
              <ReferenceLine y={goalValue} stroke="#F59E0B" strokeDasharray="3 3" />
            }
            <Bar dataKey={dataKey} fill={getColorClass()} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      case 'line':
        return (
          <LineChart 
            data={data}
            margin={{ top: 15, right: 20, left: 10, bottom: 15 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis 
              dataKey={xAxisDataKey} 
              padding={{ left: 10, right: 10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              width={yAxisWidth}
              tick={{ fontSize: 12 }}
            />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px'
              }}
            />}
            {showLegend && <Legend wrapperStyle={{ paddingTop: 10 }} />}
            {goalKey && goalValue && 
              <ReferenceLine y={goalValue} stroke="#F59E0B" strokeDasharray="3 3" />
            }
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={getColorClass()} 
              strokeWidth={2}
              dot={{ r: 4, fill: getColorClass() }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart 
            data={data}
            margin={{ top: 15, right: 20, left: 10, bottom: 15 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis 
              dataKey={xAxisDataKey}
              padding={{ left: 10, right: 10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              width={yAxisWidth}
              tick={{ fontSize: 12 }}
            />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px'
              }}
            />}
            {showLegend && <Legend wrapperStyle={{ paddingTop: 10 }} />}
            {goalKey && goalValue && 
              <ReferenceLine y={goalValue} stroke="#F59E0B" strokeDasharray="3 3" />
            }
            <defs>
              <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getColorClass()} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={getColorClass()} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={getColorClass()} 
              fillOpacity={1} 
              fill={`url(#color${color})`} 
            />
          </AreaChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChar}
    </ResponsiveContainer>
  );
};
