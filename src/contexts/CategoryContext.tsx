import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Category } from '@/types';

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const CategoryContext = createContext<CategoryContextType | null>(null);

const defaultCategories: Category[] = [
  { id: '1', name: 'Électronique', description: 'Appareils électroniques et accessoires', color: '#2DD4BF' },
  { id: '2', name: 'Vêtements', description: 'Mode et textile', color: '#60A5FA' },
  { id: '3', name: 'Alimentation', description: 'Produits alimentaires', color: '#FBBF24' },
  { id: '4', name: 'Maison', description: 'Équipements pour la maison', color: '#A78BFA' },
  { id: '5', name: 'Beauté', description: 'Cosmétiques et soins', color: '#F472B6' },
];

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem('app_categories');
    return stored ? JSON.parse(stored) : defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem('app_categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
