import React from "react";

interface AudioPlayerProps {
  audioUrl: string;
  duration?: number;
  onTimeUpdate?: (time: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, duration, onTimeUpdate }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleLoadedMetadata = () => {
    setLoading(false);
  };

  const handleCanPlay = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    console.error("❌ Failed to load audio");
  };

  const handleTimeUpdate = () => {
    if (onTimeUpdate && audioRef.current) {
      onTimeUpdate(audioRef.current.currentTime);
    }
  };

  return (
    <div className="w-full">
      {loading && !error && (
        <div className="flex items-center justify-center h-16 text-gray-500">
          <span className="animate-spin mr-2 h-5 w-5 border-2 border-gray-300 border-t-black rounded-full"></span>
          Loading audio...
        </div>
      )}
      {error && (
        <p className="text-red-500">Audio could not be loaded. Please try again later.</p>
      )}
      <audio
        ref={audioRef}
        controls
        className="w-full mt-2"
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
      >
        Your browser does not support the audio element.
      </audio>
      {duration && (
        <p className="text-sm text-gray-500 mt-1">
          Approx. duration: {Math.floor(duration)} seconds
        </p>
      )}
    </div>
  );
};

export default AudioPlayer;
