import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient.ts';

interface Metadata {
  id: string;
  title: string;
  status: 'not_started' | 'queued' | 'processing' | 'ready' | 'error';
  summary: string;
  duration: number | null;
  participants: string[] | null;
  created_at: string;
  updated_at: string;
  // add any other fields you expect
}

export const useSessionsData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sessions', user?.id],
    queryFn: async () => {
      const res = await apiClient("/api/sessions/metadata");
      return res ?? []; // Ensure not undefined
    },
    enabled: !!user,
  });
};

type ApiResponse<T> = {
  status: 'not_started' | 'queued' | 'processing' | 'completed' | 'failed';
  data: T | null;
};

export const useSessionMetadata = (sessionId: string) => {
  const { user } = useAuth();

  return useQuery<ApiResponse<Metadata>, Error>({
    queryKey: ['session', sessionId, 'metadata'],
    queryFn: async () => {
      if (!user || !sessionId) return { status: 'Error', data: null };
      const res = await apiClient(`/api/sessions/metadata/${sessionId}`);
      return res ?? { status: 'Error', data: null };
    },
    enabled: !!user && !!sessionId,
  });
};

export const useSessionSummary = (sessionId: string) => {
  const { user } = useAuth();

  return useQuery<ApiResponse<string>, Error>({
    queryKey: ['session', sessionId, 'summary'],
    queryFn: async () => {
      if (!user || !sessionId) return { status: 'Error', data: null };
      const res = await apiClient(`/api/sessions/summary/${sessionId}`);
      return res ?? { status: 'Error', data: null };
    },
    enabled: !!user && !!sessionId,
    refetchInterval: false,
  });
};

export const useSessionTranscript = (sessionId: string) => {
  const { user } = useAuth();

  return useQuery<ApiResponse<string>, Error>({
    queryKey: ['session', sessionId, 'transcript'],
    queryFn: async () => {
      if (!user || !sessionId) return { status: 'Error', data: null };
      const res = await apiClient(`/api/sessions/transcript/${sessionId}`);
      return res ?? { status: 'Error', data: null };
    },
    enabled: !!user && !!sessionId,
    refetchInterval: false,
  });
};

export const useSessionEmotion = (sessionId: string) => {
  const { user } = useAuth();

  return useQuery<ApiResponse<any>, Error>({
    queryKey: ['session', sessionId, 'emotion'],
    queryFn: async () => {
      if (!user || !sessionId) return { status: 'Error', data: null };
      const res = await apiClient(`/api/sessions/emotions/${sessionId}`);
      return res ?? { status: 'Error', data: null };
    },
    enabled: !!user && !!sessionId,
    refetchInterval: false,
  });
};

export const useSessionAudio = (sessionId: string) => {
  const { user } = useAuth();

  return useQuery<ApiResponse<string>, Error>({
    queryKey: ['session', sessionId, 'audio'],
    queryFn: async () => {
      if (!user || !sessionId) return { status: 'Error', data: null };
      const res = await apiClient(`/api/sessions/audio/${sessionId}`)
      return res ?? { status: 'Error', data: null };
    },
    enabled: !!user && !!sessionId,
  });
};