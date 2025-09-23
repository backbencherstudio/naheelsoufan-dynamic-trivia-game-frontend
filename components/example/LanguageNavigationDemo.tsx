"use client";
import { useDynamicLanguage } from '@/contexts/DynamicLanguageContext';
import { useLanguageNavigation } from '@/hooks/useLanguageNavigation';

/**
 * Demo component showing language-aware navigation
 */
const LanguageNavigationDemo = () => {
  const { currentLanguage, navigateWithLanguage, supportedCodes } = useLanguageNavigation();
  const { languages } = useDynamicLanguage();

  const demoRoutes = [
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'dashboard/difficulties', label: 'Difficulties' },
    { path: 'dashboard/language', label: 'Language' },
    { path: 'dashboard/questions', label: 'Questions' },
    { path: 'dashboard/players', label: 'Players' },
  ];

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Language Navigation Demo</h3>
        <p className="text-sm text-gray-600">Current Language: <span className="font-medium text-blue-600">{currentLanguage}</span></p>
        <p className="text-sm text-gray-600">Available Languages: {languages.map(l => l.name).join(', ')}</p>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Test Navigation (Maintains Current Language):</h4>
        <div className="grid grid-cols-2 gap-2">
          {demoRoutes.map((route) => (
            <button
              key={route.path}
              onClick={() => navigateWithLanguage(route.path)}
              className="px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 transition-colors"
            >
              {route.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-xs text-gray-500">
          💡 <strong>Tip:</strong> Click any button above to navigate while maintaining your selected language ({currentLanguage})!
        </p>
      </div>
    </div>
  );
};

export default LanguageNavigationDemo;
