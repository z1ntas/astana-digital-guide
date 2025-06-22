
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Menu, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'kz' : 'ru');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">АГ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {t('header.title')}
              </h1>
              <p className="text-sm text-gray-600">
                {t('header.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="font-medium"
          >
            {language === 'ru' ? 'ҚАЗ' : 'РУС'}
          </Button>
          
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-4 h-4 mr-2" />
            {t('header.help')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
