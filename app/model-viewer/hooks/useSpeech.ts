import { useState, useCallback, useEffect, useRef } from 'react';
import { speak, stopSpeaking } from '../services/webSpeech';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const speakingRef = useRef(false);
  const currentMessageRef = useRef<string | null>(null);

  // Limpa qualquer fala pendente quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (speakingRef.current) {
        stopSpeaking();
      }
    };
  }, []);

  const handleSpeak = useCallback(async (text: string) => {
    if (!text.trim()) {
      console.warn('Tentativa de reproduzir texto vazio');
      return;
    }

    // Evita reproduzir a mesma mensagem novamente
    if (text === currentMessageRef.current) {
      console.log('Mensagem já em reprodução:', text);
      return;
    }

    try {
      // Para qualquer fala anterior
      if (speakingRef.current) {
        stopSpeaking();
      }

      currentMessageRef.current = text;
      setIsSpeaking(true);
      speakingRef.current = true;
      setError(null);

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
      setIsSpeaking(false);
      speakingRef.current = false;
      currentMessageRef.current = null;
    }
  }, []);

  const handleStop = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
    speakingRef.current = false;
    currentMessageRef.current = null;
  }, []);

  const clearHistory = useCallback(() => {
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