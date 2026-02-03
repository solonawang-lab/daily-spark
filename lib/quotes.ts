import quotesData from '@/data/quotes.json';

export type Category = 'stoicism' | 'productivity' | 'success' | 'fitness';

export interface Quote {
  text: string;
  author: string;
}

export function getRandomQuote(category: Category): Quote {
  const quotes = quotesData[category];
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

export function getAllCategories(): Category[] {
  return ['stoicism', 'productivity', 'success', 'fitness'];
}

export const categoryLabels: Record<Category, string> = {
  stoicism: 'Stoicism',
  productivity: 'Productivity', 
  success: 'Success',
  fitness: 'Fitness',
};

export const categoryEmojis: Record<Category, string> = {
  stoicism: '🏛️',
  productivity: '⚡',
  success: '🎯',
  fitness: '💪',
};
