import { useEffect, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';

interface RobotSubtitleProps {
  message: string;
}

export function RobotSubtitle({ message }: RobotSubtitleProps) {
  const { speak, stop, clearHistory, isSpeaking, error } = useSpeech();
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    // Se a mensagem mudou, interrompe a fala atual
    if (message !== lastMessageRef.current) {
      stop();
      lastMessageRef.current = message;
      
      if (message) {
        // Pequeno delay para garantir que a fala anterior foi interrompida
        const timeoutId = setTimeout(() => {
          speak(message);
        }, 100);

        return () => {
          clearTimeout(timeoutId);
          stop();
          clearHistory();
        };
      }
    }

    return () => {
      stop();
      clearHistory();
    };
  }, [message, speak, stop, clearHistory]);

  if (!message) return null;

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg max-w-2xl text-center z-50">
      <div className="flex items-center justify-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
        <p className="text-sm">{message}</p>
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
} 