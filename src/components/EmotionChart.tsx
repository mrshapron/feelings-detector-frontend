
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

interface EmotionChartPoint {
  end_time: number;
  [emotionLabel: string]: number;
}

interface EmotionChartProps {
  data: EmotionChartPoint[];
  title: string;
  height?: number;
  currentTime?: number;
  isActiveSpeaker?: boolean;
}

const EmotionChart: React.FC<EmotionChartProps> = ({
  data,
  title,
  height = 200,
  currentTime,
  isActiveSpeaker = false
}) => {
  const maxEndTime = Math.max(...data.map(d => d.end_time as number));
  const getCurrentTimePosition = () => {
    if (currentTime === undefined || !data.length) return null;

    const timeData = data.map(point => ({
      ...point,
      timeValue: point.end_time || 0
    }));

    const closestPoint = timeData.reduce((closest, current) =>
      Math.abs(current.timeValue - currentTime) < Math.abs(closest.timeValue - currentTime)
        ? current
        : closest
    );

    return closestPoint.end_time;
  };

  const currentTimePosition = getCurrentTimePosition();

  // Styling based on speaker activity
  const getLineStyle = (index: number) => {
    if (isActiveSpeaker) {
      return {
        strokeWidth: 3,
        stroke: `hsl(${(index * 60) % 360}, 80%, 50%)`,
        opacity: 1
      };
    } else {
      return {
        strokeWidth: 1.5,
        stroke: `hsl(${(index * 60) % 360}, 40%, 60%)`,
        opacity: 0.6
      };
    }
  };

  const chartOpacity = isActiveSpeaker ? 1 : 0.7;

  return (
    <div 
      className={`p-6 glass-card rounded-lg card-hover animate-fade-in transition-all duration-300 ${
        isActiveSpeaker ? 'ring-2 ring-blue-400 shadow-lg' : ''
      }`}
      style={{ opacity: chartOpacity }}
    >
      <h3 className={`text-lg font-medium mb-4 transition-all duration-300 ${
        isActiveSpeaker ? 'text-blue-600 font-semibold' : 'text-gray-600'
      }`}>
        {title} {isActiveSpeaker && '🎤'}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="end_time"
            type="number"
            domain={[0, maxEndTime]}
            tick={{ fontSize: 12 }}
            stroke="#888"
            tickFormatter={(value) => {
              const mins = Math.floor(value / 60);
              const secs = Math.floor(value % 60);
              return `${mins}:${secs.toString().padStart(2, '0')}`;
            }}
          />
          <YAxis tick={{ fontSize: 12 }} stroke="#888" />
          <Tooltip />
          <Legend />

          {currentTime !== undefined && (
            <ReferenceLine
              x={currentTime.toFixed(2)}
              stroke={isActiveSpeaker ? "#ff4444" : "#ff6b6b"}
              strokeWidth={isActiveSpeaker ? 3 : 2}
              strokeDasharray="5 5"
            />
          )}

          {data.length > 0 &&
            Object.keys(data[0])
              .filter(key => key !== 'end_time')
              .map((key, i) => {
                const lineStyle = getLineStyle(i);
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    strokeWidth={lineStyle.strokeWidth}
                    stroke={lineStyle.stroke}
                    opacity={lineStyle.opacity}
                    dot={false}
                  />
                );
              })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionChart;
