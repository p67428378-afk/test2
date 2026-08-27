import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [currentShow, setCurrentShow] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [playlistQueue, setPlaylistQueue] = useState([]);

  const audioRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Initialize or update audio element properties
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsReconnecting(false);
      setRetryCount(0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Play next in queue if available
      playNext();
    };

    const handleError = () => {
      if (currentEpisode && retryCount < 3) {
        setIsReconnecting(true);
        const nextAttempt = retryCount + 1;
        setRetryCount(nextAttempt);
        const delay = Math.pow(2, nextAttempt) * 1000;
        retryTimeoutRef.current = setTimeout(() => {
          if (audioRef.current && currentEpisode?.audio_url) {
            audioRef.current.src = currentEpisode.audio_url;
            audioRef.current.load();
            audioRef.current.play().catch(() => {});
          }
        }, delay);
      } else {
        setIsReconnecting(false);
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [currentEpisode, retryCount]);

  // Adjust volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Adjust playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const playEpisode = useCallback(
    (episode, show = null, queue = []) => {
      if (!episode) return;
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);

      setCurrentEpisode(episode);
      if (show) {
        setCurrentShow(show);
      }
      if (queue && queue.length > 0) {
        setPlaylistQueue(queue);
      }

      if (audioRef.current) {
        audioRef.current.src = episode.audio_url || "";
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.volume = volume;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsReconnecting(false);
            setRetryCount(0);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    },
    [playbackSpeed, volume],
  );

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentEpisode) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [isPlaying, currentEpisode]);

  const seek = useCallback(
    (timeInSeconds) => {
      if (!audioRef.current) return;
      const clamped = Math.max(
        0,
        Math.min(timeInSeconds, duration || audioRef.current.duration || 0),
      );
      audioRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    },
    [duration],
  );

  const skip = useCallback(
    (seconds) => {
      if (!audioRef.current) return;
      const current = audioRef.current.currentTime || 0;
      const maxDur = duration || audioRef.current.duration || 0;
      const newTime = Math.max(0, Math.min(current + seconds, maxDur));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration],
  );

  const changeSpeed = useCallback((speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  const changeVolume = useCallback((vol) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const playNext = useCallback(() => {
    if (!playlistQueue || playlistQueue.length === 0 || !currentEpisode) return;
    const currentIndex = playlistQueue.findIndex(
      (ep) => ep.id === currentEpisode.id,
    );
    if (currentIndex >= 0 && currentIndex < playlistQueue.length - 1) {
      const nextEp = playlistQueue[currentIndex + 1];
      playEpisode(nextEp, currentShow, playlistQueue);
    }
  }, [playlistQueue, currentEpisode, currentShow, playEpisode]);

  return (
    <AudioContext.Provider
      value={{
        currentEpisode,
        currentShow,
        isPlaying,
        currentTime,
        duration: duration || currentEpisode?.duration_seconds || 0,
        volume,
        playbackSpeed,
        isReconnecting,
        playlistQueue,
        playEpisode,
        togglePlayPause,
        seek,
        skip,
        changeSpeed,
        changeVolume,
        playNext,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
