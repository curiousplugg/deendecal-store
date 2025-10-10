'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'ur')}
        className="bg-transparent border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ fontFamily: language === 'ur' ? 'Arial, sans-serif' : 'inherit' }}
      >
        <option value="en">English</option>
        <option value="ur">اردو</option>
      </select>
    </div>
  );
}
