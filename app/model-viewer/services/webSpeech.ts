let currentUtterance: SpeechSynthesisUtterance | null = null;
let isProcessing = false;
const speechQueue: string[] = [];

function createUtterance(text: string, lang: string): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  return utterance;
}

async function processQueue(): Promise<void> {
  if (isProcessing || speechQueue.length === 0) return;

  isProcessing = true;
  const text = speechQueue.shift()!;

  try {
    await speakText(text);
  } catch (error) {
    console.error('Erro ao processar fila:', error);
  } finally {
    isProcessing = false;
    if (speechQueue.length > 0) {
      processQueue();
    }
  }
}

function speakText(text: string, lang = 'pt-BR'): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Garante que o sintetizador está em um estado limpo
      window.speechSynthesis.cancel();
      
      // Pequeno delay para garantir que o estado está limpo
      setTimeout(() => {
        const utterance = createUtterance(text, lang);
        
        utterance.onend = () => {
          currentUtterance = null;
          resolve();
        };

        utterance.onerror = (event) => {
          currentUtterance = null;
          // Se for uma interrupção intencional (nova fala), não considera erro
          if (event.error === 'interrupted' && speechQueue.length > 0) {
            resolve();
          } else {
            reject(new Error(`Erro ao reproduzir fala: ${event.error}`));
          }
        };

        currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      }, 100);
    } catch (error) {
      reject(new Error(`Erro ao inicializar fala: ${error}`));
    }
  });
}

export function speak(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Síntese de voz não suportada neste navegador'));
      return;
    }

    // Cancela qualquer fala em andamento
    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;
    
    // Configurações normais de voz
    utterance.pitch = 1.0; // Pitch normal
    utterance.rate = 1.0; // Velocidade normal
    utterance.volume = 1.0;

    // Tenta encontrar diferentes vozes disponíveis
    const voices = window.speechSynthesis.getVoices();
    
    // Lista de vozes preferidas em ordem de prioridade
    const preferredVoices = [
      'Microsoft Daniel - Portuguese (Brazil)',
      'Microsoft Maria - Portuguese (Brazil)',
      'Google português do Brasil',
      'Microsoft Helena - Portuguese (Brazil)',
      'Microsoft Zira - English (United States)'
    ];

    // Tenta encontrar uma das vozes preferidas
    let selectedVoice = voices.find(voice => 
      preferredVoices.includes(voice.name)
    );

    // Se não encontrar nenhuma das preferidas, tenta qualquer voz em português
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('pt')
      );
    }

    // Se ainda não encontrar, usa a primeira voz disponível
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      resolve();
    };

    utterance.onerror = (event) => {
      currentUtterance = null;
      // Ignora erros de cancelamento intencional
      if (event.error !== 'canceled') {
        reject(new Error(`Erro ao reproduzir fala: ${event.error}`));
      } else {
        resolve();
      }
    };

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    // Força a parada da síntese de voz
    window.speechSynthesis.resume();
    currentUtterance = null;
    isProcessing = false;
    speechQueue.length = 0;
  }
}

// Adiciona um listener global para garantir que a síntese de voz seja interrompida
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    stopSpeaking();
  });
} 