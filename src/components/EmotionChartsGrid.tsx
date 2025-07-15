
import React from 'react';
import EmotionChart from './EmotionChart';
import { cn } from '@/lib/utils';

interface EmotionChartPoint {
  end_time: number;
  [emotionLabel: string]: number;
}

interface EmotionChartsGridProps {
  chartData: { [speaker: string]: EmotionChartPoint[] };
  currentTime?: number;
  selectedEmotions: string[];
  className?: string;
  emotionData?: any[];
}

const EmotionChartsGrid: React.FC<EmotionChartsGridProps> = ({
  chartData,
  currentTime,
  selectedEmotions,
  className,
  emotionData = []
}) => {
  const speakers = Object.keys(chartData);
  const speakerCount = speakers.length;

  // Determine which speaker is currently active based on currentTime
  const getActiveSpeaker = (): string | null => {
    if (!currentTime || !emotionData || emotionData.length === 0) {
      return null;
    }

    console.log('🎯 Determining active speaker for time:', currentTime);
    console.log('📊 Available emotion data:', emotionData);

    // Find the emotion segment that contains the current time
    const activeSegment = emotionData.find((segment: any) => {
      const startTime = segment.start_time || 0;
      const endTime = segment.end_time || 0;
      const isActive = currentTime >= startTime && currentTime <= endTime;
      
      if (isActive) {
        console.log('🎤 Found active segment:', segment);
      }
      
      return isActive;
    });

    const activeSpeaker = activeSegment?.speaker || null;
    console.log('🔊 Active speaker:', activeSpeaker);
    
    return activeSpeaker;
  };

  const activeSpeaker = getActiveSpeaker();

  // Determine grid layout based on speaker count and screen size
  const getGridCols = () => {
    if (speakerCount === 1) return "grid-cols-1";
    if (speakerCount === 2) return "grid-cols-1 lg:grid-cols-2";
    if (speakerCount === 3) return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";
  };

  // Filter chart data to only include selected emotions
  const filterChartData = (data: EmotionChartPoint[]): EmotionChartPoint[] => {
    return data.map(point => {
      const filteredPoint: EmotionChartPoint = { end_time: point.end_time };
      
      selectedEmotions.forEach(emotion => {
        if (emotion in point) {
          filteredPoint[emotion] = point[emotion];
        }
      });
      
      return filteredPoint;
    });
  };

  if (speakerCount === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No emotion data available
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", getGridCols(), className)}>
      {speakers.map((speaker) => {
        const isActiveSpeaker = activeSpeaker === speaker;
        console.log(`📈 Speaker ${speaker} is ${isActiveSpeaker ? 'ACTIVE' : 'inactive'}`);
        
        return (
          <div key={speaker} className="w-full">
            <EmotionChart
              data={filterChartData(chartData[speaker])}
              title={`Speaker ${speaker} - Emotional Analysis`}
              height={250}
              currentTime={currentTime}
              isActiveSpeaker={isActiveSpeaker}
            />
          </div>
        );
      })}
    </div>
  );
};

export default EmotionChartsGrid;
