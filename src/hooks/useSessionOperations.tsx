import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { toast } from '@/hooks/use-toast';

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await apiClient(`/api/sessions/delete/${sessionId}`, {
        method: 'DELETE',
      });

      if (!res?.success) {
        throw new Error('Failed to delete session');
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Success',
        description: 'Session deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete session',
        variant: 'destructive',
      });
      console.error('Delete session error:', error);
    },
  });
};

export const useDeleteMultipleSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionIds: string[]) => {
      const res = await apiClient(`/api/sessions/delete/bulk`, {
        method: 'POST',
        body: JSON.stringify({ session_ids: sessionIds }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res?.success) {
        throw new Error('Failed to delete sessions');
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Success',
        description: 'Sessions deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete sessions',
        variant: 'destructive',
      });
      console.error('Delete sessions error:', error);
    },
  });
};
