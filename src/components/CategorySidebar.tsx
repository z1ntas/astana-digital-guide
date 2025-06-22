
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, Scale, CheckCircle, Phone, Car } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface Category {
  id: string;
  icon: React.ReactNode;
  name: string;
  description: string;
}

interface CategorySidebarProps {
  onCategorySelect: (categoryId: string) => void;
  selectedCategory?: string;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  onCategorySelect,
  selectedCategory
}) => {
  const { t } = useLanguage();

  const categories: Category[] = [
    {
      id: 'documents',
      icon: <FileText className="w-5 h-5" />,
      name: t('categories.documents.name'),
      description: t('categories.documents.description')
    },
    {
      id: 'hr',
      icon: <Users className="w-5 h-5" />,
      name: t('categories.hr.name'),
      description: t('categories.hr.description')
    },
    {
      id: 'ethics',
      icon: <Scale className="w-5 h-5" />,
      name: t('categories.ethics.name'),
      description: t('categories.ethics.description')
    },
    {
      id: 'approvals',
      icon: <CheckCircle className="w-5 h-5" />,
      name: t('categories.approvals.name'),
      description: t('categories.approvals.description')
    },
    {
      id: 'citizens',
      icon: <Phone className="w-5 h-5" />,
      name: t('categories.citizens.name'),
      description: t('categories.citizens.description')
    },
    {
      id: 'trips',
      icon: <Car className="w-5 h-5" />,
      name: t('categories.trips.name'),
      description: t('categories.trips.description')
    }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t('sidebar.categories')}
      </h3>
      
      <div className="space-y-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedCategory === category.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 mb-1">
                  {category.name}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-800 mb-3">
          {t('sidebar.recentQuestions')}
        </h4>
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-left h-auto py-2 px-3"
          >
            <span className="text-sm text-gray-600 line-clamp-2">
              {t('sidebar.recent1')}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-left h-auto py-2 px-3"
          >
            <span className="text-sm text-gray-600 line-clamp-2">
              {t('sidebar.recent2')}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-left h-auto py-2 px-3"
          >
            <span className="text-sm text-gray-600 line-clamp-2">
              {t('sidebar.recent3')}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
