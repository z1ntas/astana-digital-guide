
import React, { useState } from 'react';
import Header from '../components/Header';
import CategorySidebar from '../components/CategorySidebar';
import ChatInterface from '../components/ChatInterface';
import { LanguageProvider } from '../hooks/useLanguage';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsSidebarOpen(false); // Закрываем сайдбар на мобильных устройствах
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
        
        <div className="flex flex-1 relative">
          {/* Мобильная накладка */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Боковая панель */}
          <div className={`
            fixed lg:relative inset-y-0 left-0 z-20 
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <CategorySidebar 
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
          </div>
          
          {/* Основной контент */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatInterface 
              onCategorySelect={handleCategorySelect} 
              selectedCategory={selectedCategory}
            />
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Index;
