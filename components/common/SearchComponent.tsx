"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import useDataFetch from '@/hooks/useDataFetch';
import useTranslation from '@/hooks/useTranslation';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
function SearchComponent({ placeholder }: { placeholder: string, }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const { data: languageData } = useDataFetch(`/admin/languages`);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation()
  // Get search parameter from URL on component mount
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParams]);

  // Initialize selected language from URL params
  useEffect(() => {
    const languageParam = searchParams.get('language');
    setSelectedLanguage(languageParam || '');
  }, [searchParams]);

  const searchFunction = useCallback((searchValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchValue === '') {
      params.delete('search');
    } else {
      params.set('search', searchValue);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  // Debounced search function using the reusable hook
  const debouncedSearch = useDebounce(searchFunction, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };
  // Handle language selection
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value === 'all' ? '' : value);
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('language');
    } else {
      params.set('language', value);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <div>
      <div className="">
        {/* Filter and Search Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="md:!w-48 !w-full">
            <Select value={selectedLanguage || 'all'} onValueChange={handleLanguageChange}>
              <SelectTrigger className='md:!w-[180px] w-full !h-12.5 focus-visible:ring-0'>
                <SelectValue placeholder={t("language")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t("language")}</SelectItem>
                {
                  languageData?.data?.map((item: any) => (
                    <SelectItem key={item?.id} value={item?.id}>{item?.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1">
            <input
              value={search}
              onChange={handleSearch}
              type="text"
              className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:focus:ring-blue-500"
              placeholder={placeholder}
            />
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchComponent
