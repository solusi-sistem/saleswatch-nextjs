'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Book, Search, X, FileText } from 'lucide-react';
import { supportData } from './data';

export default function SupportSection() {
  const firstCategoryKey = Object.keys(supportData)[0];
  const firstItemId = supportData[firstCategoryKey]?.items[0]?.id;
  const [selectedItem, setSelectedItem] = useState<string | null>(firstItemId);

  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({
    [firstCategoryKey]: true,
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(firstCategoryKey);
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    [firstItemId]: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Search functionality
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const results: any[] = [];
    Object.entries(supportData).forEach(([categoryKey, category]) => {
      category.items.forEach((item) => {
        if (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.content.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({
            categoryKey,
            categoryTitle: category.title,
            ...item,
          });
        }
      });
    });
    return results;
  }, [searchQuery]);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      if (prev[category]) {
        return {
          ...prev,
          [category]: false,
        };
      }

      return {
        [category]: true,
      };
    });
  };

  const handleCategoryClick = (categoryKey: string, itemId?: string) => {
    setSelectedCategory(categoryKey);
    setShowSearch(false);
    setSearchQuery('');

    setOpenCategories({
      [categoryKey]: true,
    });

    if (itemId) {
      setSelectedItem(itemId);
      setOpenAccordions({ [itemId]: true });
    } else {
      setSelectedItem(null);
      setOpenAccordions({});
    }
  };

  const toggleAccordion = (itemId: string) => {
    setOpenAccordions((prev) => {
      if (prev[itemId]) {
        return {};
      }

      return { [itemId]: true };
    });

    setSelectedItem(itemId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-4 space-y-2">
                {Object.entries(supportData).map(([key, category]) => {
                  const isActive = selectedCategory === key;
                  const IconComponent = category.icon;

                  return (
                    <div key={key} className="rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <button
                        onClick={() => toggleCategory(key)}
                        className={`w-full flex items-center justify-between p-4 transition-all duration-200
                                  ${isActive ? 'bg-[#061551]/5' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-[#061551] text-white' : 'bg-gray-100 text-gray-600'}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className={`font-semibold transition-colors ${isActive ? 'text-[#061551]' : 'text-gray-700'}`}>{category.title}</span>
                        </div>
                        <div className={`transition-transform duration-200 ${openCategories[key] ? 'rotate-180' : ''}`}>
                          <ChevronDown className={`w-5 h-5 ${isActive ? 'text-[#061551]' : 'text-gray-400'}`} />
                        </div>
                      </button>

                      <div className={`transition-all duration-300 ease-in-out ${openCategories[key] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                        <div className="bg-gray-50 border-t border-gray-200">
                          {category.items.map((item) => {
                            const isItemActive = selectedItem === item.id;

                            return (
                              <button
                                key={item.id}
                                onClick={() => handleCategoryClick(key, item.id)}
                                className={`w-full text-left px-6 py-3 text-sm transition-all border-b border-gray-100 
                     last:border-b-0 group
                     ${isItemActive ? 'bg-white text-[#061551] font-semibold border-l-4 border-l-[#061551]' : 'text-gray-600 hover:bg-white hover:text-[#061551]'}`}
                              >
                                <div className="flex items-center gap-2">
                                  <ChevronRight
                                    className={`w-4 h-4 transition-opacity
                ${isItemActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                  />
                                  <span>{item.title}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            {selectedCategory ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <span>Support</span>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-[#061551] font-medium">{supportData[selectedCategory].title}</span>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {supportData[selectedCategory].items.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg border-2 border-gray-200 hover:border-[#061551]/30 
                               transition-all duration-200 overflow-hidden hover:shadow-md"
                    >
                      <button onClick={() => toggleAccordion(item.id)} className="w-full flex items-start justify-between p-6 text-left group">
                        <div className="flex-1 pr-4">
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#061551] transition-colors">{item.title}</h3>
                        </div>  
                        <div className={`transition-transform duration-300 mt-1 ${openAccordions[item.id] ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-6 h-6 text-[#061551]" />
                        </div>
                      </button>

                      <div className={`transition-all duration-300 ease-in-out ${openAccordions[item.id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                        <div className="px-6 pb-6 text-gray-700 leading-relaxed whitespace-pre-line border-t border-gray-200 pt-4 bg-gray-50">{item.content}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-10 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">Masih butuh bantuan?</h3>
                      <p className="text-gray-600 text-sm mb-4">Tim support kami siap membantu Anda 24/7</p>
                      <button
                        className="bg-[#061551] hover:bg-[#061551]/90 text-white font-semibold px-6 py-3 
                                       rounded-lg transition-all duration-200 hover:shadow-lg"
                      >
                        Hubungi Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="bg-white rounded-xl shadow-lg border border-gray-200
                            flex items-center justify-center min-h-[600px]"
              >
                <div className="text-center p-12">
                  <div
                    className="w-24 h-24 bg-[#061551]/10 rounded-2xl 
                                flex items-center justify-center mx-auto mb-6"
                  >
                    <Book className="w-12 h-12 text-[#061551]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Pilih Kategori Bantuan</h3>
                  <p className="text-gray-600 max-w-md mx-auto">Silakan pilih kategori di sidebar atau gunakan search bar untuk menemukan jawaban yang Anda butuhkan</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
