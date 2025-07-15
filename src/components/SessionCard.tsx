
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash } from 'lucide-react';

interface SessionCardProps {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
  onDelete?: (id: string) => void;
  showSelection?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ 
  id, 
  title, 
  date, 
  duration, 
  participants,
  isSelected = false,
  onSelectionChange,
  onDelete,
  showSelection = false,
}) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/session/${id}`);
  };

  const handleSelectionChange = (checked: boolean) => {
    onSelectionChange?.(id, checked);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };
  
  return (
    <div className="glass-card rounded-lg p-6 card-hover animate-fade-in transition-all duration-300 relative">
      {showSelection && (
        <div className="absolute top-4 left-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleSelectionChange}
          />
        </div>
      )}
      
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash size={16} />
        </Button>
      </div>

      <div className={showSelection ? 'ml-8 mr-8' : 'mr-8'}>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date:</span>
            <span>{date}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Duration:</span>
            <span>{duration}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Participants:</span>
            <span>{participants.join(', ')}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleViewDetails}
          className="w-full bg-black text-white hover:bg-black/90"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default SessionCard;
