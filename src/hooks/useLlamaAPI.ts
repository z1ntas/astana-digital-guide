
import { useState } from 'react';

interface LlamaResponse {
  content: string;
  error?: string;
}

interface LlamaAPIConfig {
  endpoint: string;
  model: string;
}

export const useLlamaAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Конфигурация по умолчанию для локальной Llama
  const defaultConfig: LlamaAPIConfig = {
    endpoint: 'http://localhost:11434/api/generate', // Ollama по умолчанию
    model: 'llama3' // или другая модель
  };

  const generateResponse = async (
    prompt: string, 
    context?: string,
    config: Partial<LlamaAPIConfig> = {}
  ): Promise<LlamaResponse> => {
    setIsLoading(true);
    setError(null);

    const apiConfig = { ...defaultConfig, ...config };

    try {
      // Формируем промпт с контекстом для госслужбы
      const systemPrompt = `Ты - АстанаГид, цифровой помощник для государственных служащих города Астаны. 
      Отвечай на вопросы по административным процедурам, документообороту, этическим нормам и регламентам.
      Будь профессиональным, но дружелюбным. Отвечай на том же языке, на котором задан вопрос.
      ${context ? `Контекст категории: ${context}` : ''}`;

      const fullPrompt = `${systemPrompt}\n\nВопрос пользователя: ${prompt}`;

      const response = await fetch(apiConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: apiConfig.model,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        content: data.response || 'Извините, не удалось получить ответ.'
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      console.error('Ошибка Llama API:', errorMessage);
      
      setError(errorMessage);
      
      // Возвращаем fallback ответ
      return {
        content: 'Извините, сервис временно недоступен. Попробуйте позже.',
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse,
    isLoading,
    error,
    setError
  };
};
