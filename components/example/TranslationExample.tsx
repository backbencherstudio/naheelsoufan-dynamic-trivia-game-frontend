"use client";
import { useDynamicLanguage } from '@/contexts/DynamicLanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Example component showing how to use translations
 */
const TranslationExample = () => {
  const { t, currentLanguage, isLoading, error } = useTranslation();
  const { languages } = useDynamicLanguage();
  
  console.log("check language", t('dashboard'));

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Loading translations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Translation System Status</h3>
        <p className="text-sm text-gray-600">Current Language: <span className="font-medium text-blue-600">{currentLanguage}</span></p>
        <p className="text-sm text-gray-600">Available Languages: {languages.map(l => l.name).join(', ')}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Common Translations:</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Dashboard:</span> <span className="text-blue-600">{t('dashboard')}</span></p>
            <p><span className="font-medium">Total Host:</span> <span className="text-blue-600">{t('total-host')}</span></p>
            <p><span className="font-medium">Total Questions:</span> <span className="text-blue-600">{t('total-questions')}</span></p>
            <p><span className="font-medium">Total Users:</span> <span className="text-blue-600">{t('total-users')}</span></p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Game Related:</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Languages:</span> <span className="text-green-600">{t('languages')}</span></p>
            <p><span className="font-medium">Questions:</span> <span className="text-green-600">{t('questions')}</span></p>
            <p><span className="font-medium">Players:</span> <span className="text-green-600">{t('players')}</span></p>
            <p><span className="font-medium">Games:</span> <span className="text-green-600">{t('games')}</span></p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-xs text-gray-500">
          💡 <strong>Tip:</strong> Change language from the header dropdown to see translations update in real-time!
        </p>
      </div>
    </div>
  );
};

export default TranslationExample;
