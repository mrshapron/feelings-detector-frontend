
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SessionDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  sessionCount: number;
  sessionTitles?: string[];
}

const SessionDeleteDialog: React.FC<SessionDeleteDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  sessionCount,
  sessionTitles = [],
}) => {
  const [confirmText, setConfirmText] = useState('');
  const isMultiple = sessionCount > 1;
  const requiredText = isMultiple ? 'Delete All' : 'Delete';
  const isConfirmValid = confirmText === requiredText;

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm();
      setConfirmText('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setConfirmText('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isMultiple ? 'Delete Multiple Sessions' : 'Delete Session'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isMultiple ? (
              <>
                You are about to delete {sessionCount} sessions. This action cannot be undone.
                {sessionTitles.length > 0 && (
                  <div className="mt-2">
                    <strong>Sessions to be deleted:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {sessionTitles.map((title, index) => (
                        <li key={index} className="text-sm">{title}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                You are about to delete this session. This action cannot be undone.
                {sessionTitles[0] && (
                  <div className="mt-2">
                    <strong>Session:</strong> {sessionTitles[0]}
                  </div>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4">
          <Label htmlFor="confirm-text">
            Type "{requiredText}" to confirm deletion:
          </Label>
          <Input
            id="confirm-text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={requiredText}
            className="mt-1"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmValid}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionDeleteDialog;
