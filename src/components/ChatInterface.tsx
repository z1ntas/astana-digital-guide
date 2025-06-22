import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ThumbsUp, ThumbsDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLanguage } from '../hooks/useLanguage';
import { searchKnowledgeBase } from '../utils/knowledgeBase';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
}

interface ChatInterfaceProps {
  onCategorySelect: (category: string) => void;
  selectedCategory?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onCategorySelect, selectedCategory }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  const getQuickActionsForCategory = (category?: string) => {
    if (!category) {
      return [
        { key: 'vacation', text: t('quickActions.vacation') },
        { key: 'businessTrip', text: t('quickActions.businessTrip') },
        { key: 'documents', text: t('quickActions.documents') },
        { key: 'ethics', text: t('quickActions.ethics') },
      ];
    }

    const categoryActions: Record<string, Array<{ key: string; text: string }>> = {
      documents: [
        { key: 'serviceNote', text: language === 'ru' ? 'Как оформить служебную записку?' : 'Қызметтік жазбаны қалай ресімдеу керек?' },
        { key: 'docRegistration', text: language === 'ru' ? 'Регистрация входящих документов' : 'Кіріс құжаттарды тіркеу' },
        { key: 'docApproval', text: language === 'ru' ? 'Порядок согласования документов' : 'Құжаттарды келісу тәртібі' },
        { key: 'docRequirements', text: language === 'ru' ? 'Требования к оформлению документов' : 'Құжаттарды ресімдеу талаптары' }
      ],
      hr: [
        { key: 'vacation', text: t('quickActions.vacation') },
        { key: 'sickLeave', text: language === 'ru' ? 'Как оформить больничный лист?' : 'Ауыру парақшасын қалай ресімдеу керек?' },
        { key: 'hrProcedures', text: language === 'ru' ? 'Кадровые процедуры' : 'Кадр рәсімдері' },
        { key: 'workSchedule', text: language === 'ru' ? 'Режим работы и график' : 'Жұмыс режимі мен кестесі' }
      ],
      ethics: [
        { key: 'ethics', text: t('quickActions.ethics') },
        { key: 'citizenWork', text: language === 'ru' ? 'Работа с гражданами' : 'Азаматтармен жұмыс' },
        { key: 'conflictInterest', text: language === 'ru' ? 'Конфликт интересов' : 'Мүдделер қақтығысы' },
        { key: 'ethicalNorms', text: language === 'ru' ? 'Этические требования' : 'Этикалық талаптар' }
      ],
      approvals: [
        { key: 'approvalProcess', text: language === 'ru' ? 'Процедура согласования' : 'Келісу рәсімі' },
        { key: 'docProject', text: language === 'ru' ? 'Согласование проекта документа' : 'Құжат жобасын келісу' },
        { key: 'signatures', text: language === 'ru' ? 'Виды подписей и виз' : 'Қол қою және виза түрлері' },
        { key: 'approvalTerms', text: language === 'ru' ? 'Сроки согласования' : 'Келісу мерзімдері' }
      ],
      citizens: [
        { key: 'citizenAppeals', text: language === 'ru' ? 'Обращения граждан' : 'Азаматтардың өтініштері' },
        { key: 'appealTerms', text: language === 'ru' ? 'Сроки рассмотрения обращений' : 'Өтініштерді қарау мерзімдері' },
        { key: 'complaints', text: language === 'ru' ? 'Работа с жалобами' : 'Шағымдармен жұмыс' },
        { key: 'citizenRights', text: language === 'ru' ? 'Права граждан' : 'Азаматтардың құқықтары' }
      ],
      trips: [
        { key: 'businessTrip', text: t('quickActions.businessTrip') },
        { key: 'tripDocuments', text: language === 'ru' ? 'Документы для командировки' : 'Іссапарға арналған құжаттар' },
        { key: 'tripExpenses', text: language === 'ru' ? 'Командировочные расходы' : 'Іссапар шығыстары' },
        { key: 'tripReport', text: language === 'ru' ? 'Отчет по командировке' : 'Іссапар бойынша есеп' }
      ]
    };

    return categoryActions[category] || [];
  };

  const quickActions = getQuickActionsForCategory(selectedCategory);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Приветственное сообщение
    const welcomeMessage: Message = {
      id: '1',
      text: t('chat.welcome'),
      isBot: true,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [language, t]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Имитация задержки обработки
    setTimeout(() => {
      const response = searchKnowledgeBase(text, language);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (actionKey: string) => {
    const actionText = quickActions.find(a => a.key === actionKey)?.text || '';
    handleSendMessage(actionText);
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  const clearChat = () => {
    const welcomeMessage: Message = {
      id: '1',
      text: t('chat.welcome'),
      isBot: true,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок чата */}
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <h2 className="text-xl font-semibold text-gray-800">{t('chat.title')}</h2>
        <Button variant="outline" size="sm" onClick={clearChat}>
          {t('chat.clear')}
        </Button>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.isBot ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.isBot && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <Card className={`max-w-xs lg:max-w-md p-3 ${
              message.isBot 
                ? 'bg-white border-gray-200' 
                : 'bg-blue-600 text-white border-blue-600'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
              
              {message.isBot && (
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 px-2 ${
                      message.feedback === 'positive' ? 'bg-green-100 text-green-600' : ''
                    }`}
                    onClick={() => handleFeedback(message.id, 'positive')}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 px-2 ${
                      message.feedback === 'negative' ? 'bg-red-100 text-red-600' : ''
                    }`}
                    onClick={() => handleFeedback(message.id, 'negative')}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </Card>

            {!message.isBot && (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <Card className="bg-white border-gray-200 p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Быстрые действия */}
      {(messages.length <= 1 || selectedCategory) && quickActions.length > 0 && (
        <div className="p-4 bg-white border-t">
          <p className="text-sm text-gray-600 mb-3">
            {selectedCategory 
              ? `${t('chat.quickActionsTitle')} ${t(`categories.${selectedCategory}.name`)}`
              : t('chat.quickActionsTitle')
            }
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.key}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto py-2"
                onClick={() => handleQuickAction(action.key)}
              >
                {action.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Поле ввода */}
      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('chat.inputPlaceholder')}
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage(inputValue);
              }
            }}
            disabled={isTyping}
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
