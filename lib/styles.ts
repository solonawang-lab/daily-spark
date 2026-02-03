export type Style = 'minimalist' | 'nature' | 'dark' | 'vibrant';

export interface StyleConfig {
  label: string;
  emoji: string;
  prompt: string;
  textColor: string;
  shadowColor: string;
}

export const styles: Record<Style, StyleConfig> = {
  minimalist: {
    label: 'Minimalist',
    emoji: '◯',
    prompt: 'soft gradient background, geometric shapes, muted pastel colors, clean aesthetic, abstract minimal art',
    textColor: '#ffffff',
    shadowColor: 'rgba(0,0,0,0.6)',
  },
  nature: {
    label: 'Nature',
    emoji: '🌄',
    prompt: 'beautiful mountain landscape at golden hour, atmospheric fog, serene peaceful nature, sunset colors, cinematic',
    textColor: '#ffffff',
    shadowColor: 'rgba(0,0,0,0.7)',
  },
  dark: {
    label: 'Dark',
    emoji: '🌙',
    prompt: 'deep black background, subtle dark blue and purple gradients, elegant moody atmosphere, minimal stars, cosmic',
    textColor: '#ffffff',
    shadowColor: 'rgba(0,0,0,0.9)',
  },
  vibrant: {
    label: 'Vibrant',
    emoji: '🎨',
    prompt: 'bold colorful abstract art, energetic dynamic shapes, bright saturated colors, modern artistic, gradient mesh',
    textColor: '#ffffff',
    shadowColor: 'rgba(0,0,0,0.8)',
  },
};

export function getAllStyles(): Style[] {
  return ['minimalist', 'nature', 'dark', 'vibrant'];
}

export function getStylePrompt(style: Style, category: string): string {
  const basePrompt = styles[style].prompt;
  return `${basePrompt}, phone wallpaper, 9:16 aspect ratio, space for text in center, high quality, 4k, aesthetic`;
}
