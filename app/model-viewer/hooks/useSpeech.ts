import { useState, useCallback, useEffect, useRef } from 'react';
import { speak, stopSpeaking } from '../services/webSpeech';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const speakingRef = useRef(false);
  const currentMessageRef = useRef<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpa qualquer fala pendente quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (speakingRef.current) {
        stopSpeaking();
      }
      speakingRef.current = false;
      currentMessageRef.current = null;
    };
  }, []);

  const handleSpeak = useCallback(async (text: string) => {
    if (!text.trim()) {
      console.warn('Tentativa de reproduzir texto vazio');
      return;
    }

    try {
      // Limpa timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Para qualquer fala anterior
      if (speakingRef.current) {
        stopSpeaking();
      }

      // Reseta estados
      currentMessageRef.current = text;
      setIsSpeaking(true);
      speakingRef.current = true;
      setError(null);

      // Pequeno delay antes de iniciar nova fala
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 100);
      });

      console.log('Iniciando processo de fala...');
      await speak(text);
      console.log('Áudio reproduzido com sucesso');
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Erro ao reproduzir fala';
      
      // Ignora erros de interrupção quando estamos trocando de mensagem
      if (err instanceof Error && err.message.includes('interrupted')) {
        console.log('Fala interrompida para nova mensagem');
        return;
      }
      
      console.error('Erro detalhado no hook useSpeech:', err);
      setError(errorMessage);
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsSpeaking(false);
      speakingRef.current = false;
      currentMessageRef.current = null;
    }
  }, []);

  const handleStop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    stopSpeaking();
    setIsSpeaking(false);
    speakingRef.current = false;
    currentMessageRef.current = null;
  }, []);

  const clearHistory = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    currentMessageRef.current = null;
  }, []);

  return {
    isSpeaking,
    error,
    speak: handleSpeak,
    stop: handleStop,
    clearHistory
  };
} 