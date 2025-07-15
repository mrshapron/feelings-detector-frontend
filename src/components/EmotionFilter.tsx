
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface EmotionFilterProps {
  availableEmotions: string[];
  selectedEmotions: string[];
  onEmotionToggle: (emotion: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const EmotionFilter: React.FC<EmotionFilterProps> = ({
  availableEmotions,
  selectedEmotions,
  onEmotionToggle,
  onSelectAll,
  onDeselectAll
}) => {
  const allSelected = selectedEmotions.length === availableEmotions.length;
  const noneSelected = selectedEmotions.length === 0;

  return (
    <div className="bg-white/50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Filter Emotions</h3>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            disabled={allSelected}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select All
          </button>
          <button
            onClick={onDeselectAll}
            disabled={noneSelected}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {availableEmotions.map((emotion) => (
          <label
            key={emotion}
            className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-white/50 p-2 rounded"
          >
            <Checkbox
              checked={selectedEmotions.includes(emotion)}
              onCheckedChange={() => onEmotionToggle(emotion)}
            />
            <span className="capitalize text-gray-700">{emotion}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default EmotionFilter;
