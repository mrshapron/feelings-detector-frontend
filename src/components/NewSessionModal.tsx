import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {apiClient} from "@/lib/apiClient.ts";

/**
 * Props for NewSessionModal.
 * @property open - Whether the modal is open.
 * @property onOpenChange - Callback to change modal open state.
 */
interface NewSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * NewSessionModal allows users to create a new session by uploading an audio file.
 * It handles file selection, validation, upload to Supabase, and session creation.
 */
const NewSessionModal = ({ open, onOpenChange }: NewSessionModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sessionTitle, setSessionTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles file input change, validates audio type, and sets session title.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Error",
          description: "Please select an audio file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      if (!sessionTitle) {
        setSessionTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  /**
   * Handles the upload process: uploads file to Supabase, creates session record,
   * and sends file to backend for processing.
   */
  const handleUpload = async () => {
    if (!selectedFile || !user) {
      toast({
        title: "Error",
        description: "Please select an audio file and ensure you're logged in",
        variant: "destructive",
      });
      return;
    }

    if (!sessionTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a session title",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", sessionTitle.trim());

      const response = await apiClient("/api/sessions/upload", {
        method: "POST",
        body: formData,
      });

      setIsUploading(false);
      onOpenChange(false);
      setSelectedFile(null);
      setSessionTitle('');

      toast({
        title: "Success",
        description: "Session created successfully! Processing audio...",
      });

      // Redirect to the new session
      navigate(`/session/${response.session_id}`);

    } catch (error: any) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  /**
   * Handles modal close and resets state.
   */
  const handleClose = () => {
    setSelectedFile(null);
    setSessionTitle('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-title">Session Title</Label>
            <Input
              id="session-title"
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="Enter session title"
              className="flex-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audio-file">Upload Audio File</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || !sessionTitle.trim() || isUploading}>
            {isUploading ? 'Creating Session...' : 'Create Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSessionModal;