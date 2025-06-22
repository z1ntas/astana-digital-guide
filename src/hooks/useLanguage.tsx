
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'kz';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ru: {
    'header.title': 'АстанаГид',
    'header.subtitle': 'Цифровой наставник госслужащих',
    'header.help': 'Справка',
    
    'chat.title': 'Чат с помощником',
    'chat.clear': 'Очистить',
    'chat.welcome': 'Здравствуйте! Я АстанаГид - ваш цифровой помощник по вопросам государственной службы. Как могу помочь?',
    'chat.inputPlaceholder': 'Введите ваш вопрос...',
    'chat.quickActionsTitle': 'Популярные вопросы:',
    
    'quickActions.vacation': 'Как оформить отпуск?',
    'quickActions.businessTrip': 'Процедура служебной командировки',
    'quickActions.documents': 'Требования к документообороту',
    'quickActions.ethics': 'Этические нормы государственной службы',
    
    'categories.documents.name': 'Документооборот',
    'categories.documents.description': 'Регистрация, оформление и согласование документов',
    'categories.hr.name': 'HR-процедуры',
    'categories.hr.description': 'Отпуска, больничные, кадровые вопросы',
    'categories.ethics.name': 'Этика и нормы',
    'categories.ethics.description': 'Этические требования и нормы поведения',
    'categories.approvals.name': 'Согласования',
    'categories.approvals.description': 'Процедуры согласования проектов и решений',
    'categories.citizens.name': 'Обращения граждан',
    'categories.citizens.description': 'Работа с обращениями и жалобами граждан',
    'categories.trips.name': 'Командировки',
    'categories.trips.description': 'Оформление и отчетность по командировкам',
    
    'sidebar.categories': 'Категории',
    'sidebar.recentQuestions': 'Недавние вопросы',
    'sidebar.recent1': 'Как подать заявление на отпуск?',
    'sidebar.recent2': 'Порядок согласования служебной записки',
    'sidebar.recent3': 'Требования к деловому этикету'
  },
  kz: {
    'header.title': 'АстанаГид',
    'header.subtitle': 'Мемлекеттік қызметшілердің цифрлық жетекшісі',
    'header.help': 'Анықтама',
    
    'chat.title': 'Көмекшімен сөйлесу',
    'chat.clear': 'Тазалау',
    'chat.welcome': 'Сәлеметсіз бе! Мен АстанаГид - мемлекеттік қызмет мәселелері бойынша сіздің цифрлық көмекшіңізбін. Қала көмектесе аламын?',
    'chat.inputPlaceholder': 'Сұрағыңызды енгізіңіз...',
    'chat.quickActionsTitle': 'Жиі қойылатын сұрақтар:',
    
    'quickActions.vacation': 'Демалысты қалай ресімдеу керек?',
    'quickActions.businessTrip': 'Қызметтік іссапар рәсімі',
    'quickActions.documents': 'Құжат айналымының талаптары',
    'quickActions.ethics': 'Мемлекеттік қызметтің этикалық нормалары',
    
    'categories.documents.name': 'Құжат айналымы',
    'categories.documents.description': 'Құжаттарды тіркеу, ресімдеу және келісу',
    'categories.hr.name': 'HR-рәсімдер',
    'categories.hr.description': 'Демалыс, ауырып қалу парақшалары, кадр мәселелері',
    'categories.ethics.name': 'Этика және нормалар',
    'categories.ethics.description': 'Этикалық талаптар және мінез-құлық нормалары',
    'categories.approvals.name': 'Келісімдер',
    'categories.approvals.description': 'Жобалар мен шешімдерді келісу рәсімдері',
    'categories.citizens.name': 'Азаматтардың өтініштері',
    'categories.citizens.description': 'Азаматтардың өтініштері мен шағымдарымен жұмыс',
    'categories.trips.name': 'Іссапарлар',
    'categories.trips.description': 'Іссапарларды ресімдеу және есеп беру',
    
    'sidebar.categories': 'Санаттар',
    'sidebar.recentQuestions': 'Соңғы сұрақтар',
    'sidebar.recent1': 'Демалысқа өтініш қалай беру керек?',
    'sidebar.recent2': 'Қызметтік жазбаны келісу тәртібі',
    'sidebar.recent3': 'Іскерлік этикетке қойылатын талаптар'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
