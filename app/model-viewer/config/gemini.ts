const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyA5laFKVZJKJipSVdwM-9zIEZnqNxTtKkI';

export const getGeminiResponse = async (message: string) => {
  if (!message.trim()) {
    throw new Error('Mensagem não pode estar vazia');
  }

  if (!API_KEY) {
    throw new Error('Chave da API não configurada');
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Você é SYNTH-01, um robô avançado de IA criado pela Synthetica. 
              Responda a seguinte mensagem de forma amigável e profissional, mas SEM cumprimentos ou saudações iniciais: ${message}`
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      let errorMessage = `Erro HTTP: ${response.status}`;
      
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = `${errorMessage} - ${errorData.error.message || 'Erro desconhecido'}`;
        }
      } catch (e) {
        console.error('Erro ao processar resposta de erro:', e);
      }

      if (response.status === 401) {
        throw new Error('Chave da API inválida ou expirada');
      } else if (response.status === 429) {
        throw new Error('Limite de requisições excedido. Tente novamente em alguns minutos');
      } else if (response.status === 404) {
        throw new Error('Modelo não encontrado. Verifique a configuração da API');
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Resposta inválida do serviço Gemini');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('Erro detalhado do Gemini:', {
      name: error?.name || 'Unknown error',
      message: error?.message || 'No error message available',
      stack: error?.stack || 'No stack trace available'
    });

    // Repassando o erro para ser tratado no componente
    throw error;
  }
}; 