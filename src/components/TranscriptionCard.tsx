
import React from 'react';
import { cn } from '@/lib/utils';

interface MessageProps {
  speaker: string;
  text: string;
  index: number;
  isHighlighted?: boolean;
}

const Message: React.FC<MessageProps> = ({ speaker, text, index, isHighlighted = false }) => {
  return (
    <div 
      className={cn(
        "p-4 rounded-lg mb-3 animate-slide-in transition-all duration-300",
        isHighlighted 
          ? "bg-yellow-100 border-2 border-yellow-400 shadow-md" 
          : "bg-white border border-gray-100 shadow-sm"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="font-medium text-sm mb-1">{speaker}:</div>
      <div className="text-gray-700">{text}</div>
    </div>
  );
};

interface TranscriptionCardProps {
  messages: {
    speaker: string;
    text: string;
  }[];
  title: string;
  currentTime?: number;
}

const TranscriptionCard: React.FC<TranscriptionCardProps> = ({ 
  messages, 
  title, 
  currentTime 
}) => {
  // Simple logic to highlight current message based on time
  // This assumes each message represents roughly equal time segments
  const getCurrentMessageIndex = () => {
    if (currentTime === undefined || !messages.length) return -1;
    
    // Estimate message duration (this could be improved with actual timestamps)
    const estimatedDurationPerMessage = 30; // 30 seconds per message
    const currentMessageIndex = Math.floor(currentTime / estimatedDurationPerMessage);
    
    return Math.min(currentMessageIndex, messages.length - 1);
  };

  const currentMessageIndex = getCurrentMessageIndex();

  return (
    <div className="glass-card rounded-lg overflow-hidden h-full flex flex-col animate-fade-in">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <Message 
            key={index}
            speaker={message.speaker}
            text={message.text}
            index={index}
            isHighlighted={index === currentMessageIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default TranscriptionCard;
