import React from 'react';
import { marked } from "marked";
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import EmotionChartsGrid from '@/components/EmotionChartsGrid';
import TranscriptionCard from '@/components/TranscriptionCard';
import AudioPlayer from '@/components/AudioPlayer';
import CollapsibleSection from '@/components/CollapsibleSection';
import EmotionFilter from '@/components/EmotionFilter';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  useSessionEmotion,
  useSessionTranscript,
  useSessionSummary,
  useSessionMetadata, useSessionAudio
} from '@/hooks/useSessionsData';
import { usePollUntilReady } from '@/hooks/usePollUntilReady';
import { toast } from '@/hooks/use-toast';

const SessionSummary = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [selectedEmotions, setSelectedEmotions] = React.useState<string[]>([]);
  const [availableEmotions, setAvailableEmotions] = React.useState<string[]>([]);

  const {
    data: metadataResponse,
    isLoading: loadingMetadata,
    error: metadataError,
    refetch: refetchMetadata
  } = useSessionMetadata(id || '');

  const {
    data: summaryResponse,
    isLoading: loadingSummary,
    error: summaryError,
    refetch: refetchSummary
  } = useSessionSummary(id || '');

  const {
    data: transcriptResponse,
    isLoading: loadingTranscript,
    error: transcriptError,
    refetch: refetchTranscript
  } = useSessionTranscript(id || '');

  const {
    data: emotionResponse,
    isLoading: loadingEmotions,
    error: emotionsError,
    refetch: refetchEmotion
  } = useSessionEmotion(id || '');

  const {
    data: audioResponse,
    isLoading: loadingAudio,
    error: audioError,
    refetch: refetchAudio
  } = useSessionAudio(id || '');

  usePollUntilReady(metadataResponse?.status, refetchMetadata);
  usePollUntilReady(summaryResponse?.status, refetchSummary);
  usePollUntilReady(transcriptResponse?.status, refetchTranscript);
  usePollUntilReady(emotionResponse?.status, refetchEmotion);
  usePollUntilReady(audioResponse?.status, refetchAudio);

  const [resolvedTranscript, setResolvedTranscript] = React.useState<string | null>(null);
  const [resolvedSummary, setResolvedSummary] = React.useState<string | null>(null);
  const [resolvedEmotions, setResolvedEmotions] = React.useState<any | null>(null);
  const [resolvedAudio, setResolvedAudio] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (audioResponse?.status === 'completed' && audioResponse.data) {
      setResolvedAudio(audioResponse.data);
    }
  }, [audioResponse]);

  React.useEffect(() => {
    if (transcriptResponse?.status === 'completed' && transcriptResponse.data) {
      fetch(transcriptResponse.data)
        .then(res => res.text())
        .then(setResolvedTranscript)
        .catch(() => setResolvedTranscript(null));
    }
  }, [transcriptResponse]);

  React.useEffect(() => {
    if (summaryResponse?.status === 'completed' && summaryResponse.data) {
      fetch(summaryResponse.data)
        .then(res => res.text())
        .then(setResolvedSummary)
        .catch(() => setResolvedSummary(null));
    }
  }, [summaryResponse]);

  React.useEffect(() => {
    if (emotionResponse?.status === 'completed' && emotionResponse.data) {
      fetch(emotionResponse.data)
        .then(res => res.json())
        .then(setResolvedEmotions)
        .catch(() => setResolvedEmotions(null));
    }
  }, [emotionResponse]);

  React.useEffect(() => {
    if (resolvedEmotions && Array.isArray(resolvedEmotions) && resolvedEmotions.length > 0) {
      console.log('🔍 Processing resolved emotions:', resolvedEmotions);
      
      const emotions = new Set<string>();
      resolvedEmotions.forEach((entry: any) => {
        console.log('📊 Processing entry:', entry);
        if (entry.emotions && Array.isArray(entry.emotions)) {
          entry.emotions.forEach((emotion: any) => {
            if (emotion.label) {
              console.log('🎯 Found emotion:', emotion.label);
              emotions.add(emotion.label.toLowerCase());
            }
          });
        }
      });
      
      const emotionList = Array.from(emotions).sort();
      console.log('📝 Available emotions:', emotionList);
      setAvailableEmotions(emotionList);
      setSelectedEmotions(emotionList); // Start with all emotions selected
    }
  }, [resolvedEmotions]);

  const metadata = metadataResponse?.data;

  const handleBackToSessions = () => navigate('/sessions');

  const handleDownloadPDF = async () => {
    if (!resolvedSummary || !metadata) return;
    try {
      const response = await fetch(`/api/summary/${metadata.id}/download`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/pdf' },
      });
      if (!response.ok) throw new Error('Failed to generate PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${metadata.title}-summary.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: 'Success', description: 'PDF downloaded successfully' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Unknown duration';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(' ');
  };

  const renderMarkdown = (markdown: string) => {
    return marked.parse(markdown);
  };

  type TranscriptEntry = {
    speaker: string;
    text: string;
  };

  const parseTranscript = (json: string | null): TranscriptEntry[] => {
    if (!json) return [];

    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(
            (entry) => entry.speaker !== undefined && entry.text !== undefined
          )
          .map((entry) => ({
            speaker: typeof entry.speaker === "number"
              ? `Speaker ${entry.speaker}`
              : String(entry.speaker),
            text: entry.text,
          }));
      }
    } catch (error) {
      console.error("Failed to parse transcript JSON:", error);
    }

    return [];
  };

  type EmotionRaw = {
    speaker: string;
    text: string;
    start_time: number;
    end_time: number;
    emotions: { label: string; score: number }[];
  };

  type ChartPoint = {
    end_time: number;
    [emotionLabel: string]: number;
  };

  const generateEmotionChartData = (raw: EmotionRaw[]): { [speaker: string]: ChartPoint[] } => {
    console.log('🔧 Generating emotion chart data from:', raw);
    
    if (!raw || raw.length === 0) {
      console.log('❌ No raw emotion data available');
      return {};
    }

    const speakerData: { [speaker: string]: ChartPoint[] } = {};

    raw.forEach((entry, index) => {
      console.log(`📈 Processing entry ${index}:`, entry);
      
      const speakerKey = entry.speaker || 'Unknown Speaker';
      
      if (!speakerData[speakerKey]) {
        speakerData[speakerKey] = [];
      }

      const point: ChartPoint = {
        end_time: Number(entry.end_time.toFixed(2)),
      };

      for (const emotion of entry.emotions) {
        console.log(`🎭 Adding emotion ${emotion.label}: ${emotion.score}`);
        point[emotion.label.toLowerCase()] = parseFloat((emotion.score * 100).toFixed(2));
      }

      console.log('📊 Created chart point:', point);
      speakerData[speakerKey].push(point);
    });

    console.log('✅ Final speaker data:', speakerData);
    return speakerData;
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSelectAllEmotions = () => {
    setSelectedEmotions(availableEmotions);
  };

  const handleDeselectAllEmotions = () => {
    setSelectedEmotions([]);
  };

  if (loadingMetadata || metadataResponse?.status != 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Navbar />
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (metadataError || metadataResponse?.status != 'completed' || !metadata) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Session not found</h2>
            <p className="text-gray-600 mb-4">The session doesn't exist or you don't have access.</p>
            <Button onClick={handleBackToSessions}>Back to Sessions</Button>
          </div>
        </div>
      </div>
    );
  }

  const transcriptMessages = parseTranscript(resolvedTranscript);
  const emotionChartData = generateEmotionChartData(resolvedEmotions);
  
  console.log('🎯 Final emotion chart data being passed to component:', emotionChartData);
  console.log('🎭 Selected emotions:', selectedEmotions);
  console.log('📊 Available emotions:', availableEmotions);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto py-6 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{metadata.title}</h1>
          <div className="flex gap-2">
            <Button onClick={handleDownloadPDF} className="bg-black text-white hover:bg-black/90 flex items-center gap-2">
              <Download size={16} />
              Download PDF
            </Button>
            <Button onClick={handleBackToSessions} variant="outline">
              Back to Sessions
            </Button>
          </div>
        </div>

        {/* Audio Section - Always visible and not collapsible */}
        <div className="glass-card rounded-lg p-6 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Audio Playback</h2>
          {audioResponse?.status === 'not_started' && (
            <p className="text-gray-500 italic">Audio has not been uploaded yet.</p>
          )}
          {audioResponse?.status === 'processing' && (
            <p className="text-gray-500 animate-pulse">Audio is still being processed...</p>
          )}
          {(audioError || audioResponse?.status === 'failed') && (
            <p className="text-red-500">Failed to load audio file.</p>
          )}
          {audioResponse?.status === 'completed' && resolvedAudio && (
            <AudioPlayer
              audioUrl={resolvedAudio}
              duration={metadata.duration || undefined}
              onTimeUpdate={handleTimeUpdate}
            />
          )}
        </div>

        {/* Session Summary */}
        <CollapsibleSection title="Session Summary" defaultExpanded={true}>
          {summaryResponse?.status === 'not_started' ? (
            <p className="text-gray-500 italic">Summary has not been generated yet.</p>
          ) : summaryResponse?.status === 'processing' ? (
            <p className="text-gray-500 animate-pulse">Summary is still being generated...</p>
          ) : summaryError || summaryResponse?.status === 'failed' ? (
            <p className="text-red-500">Failed to load summary.</p>
          ) : (
            <div
              className="prose prose-gray max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(resolvedSummary || "") }}
            />
          )}
        </CollapsibleSection>

        {/* Emotion Analysis */}
        <CollapsibleSection title="Emotional Analysis" defaultExpanded={true}>
          {emotionResponse?.status === 'not_started' ? (
            <p className="text-gray-500 italic">Emotion analysis has not started.</p>
          ) : emotionResponse?.status === 'processing' ? (
            <p className="text-gray-500 animate-pulse">Analyzing emotions...</p>
          ) : emotionsError || emotionResponse?.status === 'failed' ? (
            <p className="text-red-500">Failed to load emotion data.</p>
          ) : availableEmotions.length > 0 ? (
            <>
              <EmotionFilter
                availableEmotions={availableEmotions}
                selectedEmotions={selectedEmotions}
                onEmotionToggle={handleEmotionToggle}
                onSelectAll={handleSelectAllEmotions}
                onDeselectAll={handleDeselectAllEmotions}
              />
              <EmotionChartsGrid
                chartData={emotionChartData}
                currentTime={currentTime}
                selectedEmotions={selectedEmotions}
                emotionData={resolvedEmotions}
              />
            </>
          ) : (
            <p className="text-gray-600">No emotion data available.</p>
          )}
        </CollapsibleSection>

        {/* Transcript */}
        <CollapsibleSection title="Transcript" defaultExpanded={true}>
          {transcriptResponse?.status === 'not_started' ? (
            <p className="text-gray-500 italic">Transcription has not started yet.</p>
          ) : transcriptResponse?.status === 'processing' ? (
            <p className="text-gray-500 animate-pulse">Transcribing audio...</p>
          ) : transcriptError || transcriptResponse?.status === 'failed' ? (
            <p className="text-red-500">Could not load transcript.</p>
          ) : transcriptMessages.length > 0 ? (
            <TranscriptionCard 
              messages={transcriptMessages} 
              title="" 
              currentTime={currentTime}
            />
          ) : (
            <p className="text-gray-600">No transcript available.</p>
          )}
        </CollapsibleSection>

        {/* Session Details */}
        <CollapsibleSection title="Session Details" defaultExpanded={false}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Date</h3>
              <p className="font-medium">{formatDate(metadata.created_at)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Duration</h3>
              <p className="font-medium">{formatDuration(metadata.duration)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Participants</h3>
              <p className="font-medium">{metadata.participants?.join(', ') || 'No participants listed'}</p>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default SessionSummary;
