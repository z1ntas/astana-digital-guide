
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Settings, Check, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface LlamaSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (endpoint: string, model: string) => void;
}

const LlamaSettings: React.FC<LlamaSettingsProps> = ({ isOpen, onClose, onSettingsChange }) => {
  const [endpoint, setEndpoint] = useState('http://localhost:11434/api/generate');
  const [model, setModel] = useState('llama3');
  const [isConnected, setIsConnected] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Загружаем сохраненные настройки
    const savedEndpoint = localStorage.getItem('llama_endpoint');
    const savedModel = localStorage.getItem('llama_model');
    
    if (savedEndpoint) setEndpoint(savedEndpoint);
    if (savedModel) setModel(savedModel);
  }, []);

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionError(null);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: 'Тест',
          stream: false,
          options: {
            max_tokens: 5
          }
        })
      });

      if (response.ok) {
        setIsConnected(true);
        setConnectionError(null);
      } else {
        setIsConnected(false);
        setConnectionError(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Ошибка подключения:', error);
      setIsConnected(false);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setConnectionError('CORS ошибка - запустите браузер с --disable-web-security или используйте прокси');
      } else {
        setConnectionError(error.message || 'Неизвестная ошибка подключения');
      }
    } finally {
      setIsTestingConnection(false);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('llama_endpoint', endpoint);
    localStorage.setItem('llama_model', model);
    onSettingsChange(endpoint, model);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Настройки Llama API</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Адрес API (Endpoint)
            </label>
            <Input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="http://localhost:11434/api/generate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Модель
            </label>
            <Input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="llama3"
            />
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              disabled={isTestingConnection}
              className="w-full"
            >
              {isTestingConnection ? 'Проверка...' : 'Проверить подключение'}
            </Button>
            
            {isConnected && (
              <div className="flex items-center text-green-600 p-2 bg-green-50 rounded">
                <Check className="w-4 h-4 mr-2" />
                <span className="text-sm">Подключение успешно!</span>
              </div>
            )}

            {connectionError && (
              <div className="flex items-start text-red-600 p-2 bg-red-50 rounded">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">Ошибка подключения:</div>
                  <div className="mt-1">{connectionError}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button onClick={saveSettings} className="flex-1">
              Сохранить настройки
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Установка Ollama:</strong><br/>
              1. Скачайте: <code>curl -fsSL https://ollama.com/install.sh | sh</code><br/>
              2. Запустите модель: <code>ollama run llama3</code><br/>
              3. API доступен на localhost:11434
            </p>
          </div>

          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Решение CORS проблемы:</strong><br/>
              Если тест подключения не работает, попробуйте:<br/>
              • Запустить Chrome: <code>chrome --disable-web-security --user-data-dir=/tmp/chrome</code><br/>
              • Или установить CORS расширение для браузера
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LlamaSettings;
