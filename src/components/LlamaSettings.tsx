
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Settings, Check, X } from 'lucide-react';
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
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: 'Тест подключения',
          stream: false,
          options: {
            max_tokens: 10
          }
        })
      });

      setIsConnected(response.ok);
    } catch (error) {
      console.error('Ошибка подключения:', error);
      setIsConnected(false);
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
      <Card className="w-full max-w-md p-6 bg-white">
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

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              disabled={isTestingConnection}
            >
              {isTestingConnection ? 'Проверка...' : 'Проверить подключение'}
            </Button>
            
            {isConnected && (
              <div className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-1" />
                <span className="text-sm">Подключено</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button onClick={saveSettings} className="flex-1">
              Сохранить
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Инструкция:</strong><br/>
            1. Установите Ollama: <code>curl -fsSL https://ollama.com/install.sh | sh</code><br/>
            2. Запустите модель: <code>ollama run llama3</code><br/>
            3. API будет доступен на localhost:11434
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LlamaSettings;
