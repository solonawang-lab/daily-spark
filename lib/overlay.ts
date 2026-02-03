import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } from 'canvas';
import path from 'path';
import { Category } from './quotes';

// Image dimensions for phone wallpaper (iPhone 14 Pro)
const WIDTH = 1170;
const HEIGHT = 2532;

// Register all fonts (bundled with project)
const fontsDir = path.join(process.cwd(), 'fonts');

const FONTS = {
  'Inter-SemiBold': 'Inter-SemiBold.ttf',
  'Inter-Regular': 'Inter-Regular.ttf',
  'PlayfairDisplay-Bold': 'PlayfairDisplay-Bold.ttf',
  'PlayfairDisplay-Regular': 'PlayfairDisplay-Regular.ttf',
  'BebasNeue-Regular': 'BebasNeue-Regular.ttf',
  'Oswald-SemiBold': 'Oswald-SemiBold.ttf',
};

try {
  for (const [family, file] of Object.entries(FONTS)) {
    registerFont(path.join(fontsDir, file), { family });
  }
  console.log('Registered all fonts');
} catch (e) {
  console.warn('Failed to register fonts:', e);
}

// Font configurations per category
interface FontConfig {
  quoteFont: string;
  authorFont: string;
  quoteSize: number;
  authorSize: number;
  lineHeight: number;
  uppercase: boolean;
}

const FONT_CONFIGS: Record<Category, FontConfig> = {
  stoicism: {
    quoteFont: 'PlayfairDisplay-Bold',
    authorFont: 'PlayfairDisplay-Regular',
    quoteSize: 64,
    authorSize: 44,
    lineHeight: 1.4,
    uppercase: false,
  },
  productivity: {
    quoteFont: 'Inter-SemiBold',
    authorFont: 'Inter-Regular',
    quoteSize: 62,
    authorSize: 42,
    lineHeight: 1.5,
    uppercase: false,
  },
  success: {
    quoteFont: 'BebasNeue-Regular',
    authorFont: 'Inter-Regular',
    quoteSize: 82,
    authorSize: 46,
    lineHeight: 1.2,
    uppercase: true,
  },
  fitness: {
    quoteFont: 'Oswald-SemiBold',
    authorFont: 'Inter-Regular',
    quoteSize: 72,
    authorSize: 44,
    lineHeight: 1.3,
    uppercase: true,
  },
};

interface OverlayOptions {
  imageUrl: string;
  quote: string;
  author: string;
  category: Category;
  textColor?: string;
  shadowColor?: string;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

export async function createWallpaperWithOverlay(
  options: OverlayOptions
): Promise<Buffer> {
  const { imageUrl, quote, author, category, textColor = '#ffffff', shadowColor = 'rgba(0,0,0,0.8)' } = options;

  // Get font config for this category
  const fontConfig = FONT_CONFIGS[category] || FONT_CONFIGS.productivity;
  const { quoteFont, authorFont, quoteSize, authorSize, lineHeight, uppercase } = fontConfig;

  // Create canvas
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Load and draw background image
  try {
    const image = await loadImage(imageUrl);
    
    // Calculate scaling to cover the canvas
    const scale = Math.max(WIDTH / image.width, HEIGHT / image.height);
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const x = (WIDTH - scaledWidth) / 2;
    const y = (HEIGHT - scaledHeight) / 2;
    
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
  } catch {
    // Fallback: dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  // Add subtle dark overlay - enough for readability, light enough to show image
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Calculate sizes based on font config
  const actualLineHeight = quoteSize * lineHeight;
  const MAX_TEXT_WIDTH = WIDTH * 0.82;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Set quote font
  ctx.font = `${quoteSize}px "${quoteFont}", sans-serif`;
  
  // Apply uppercase if configured (for impact fonts like Bebas/Oswald)
  const displayQuote = uppercase ? quote.toUpperCase() : quote;
  const lines = wrapText(ctx, displayQuote, MAX_TEXT_WIDTH);
  
  // Calculate vertical position (golden ratio - slightly above center)
  const totalTextHeight = lines.length * actualLineHeight + authorSize + 80;
  const goldenRatio = 0.38;
  let startY = HEIGHT * goldenRatio - totalTextHeight / 2;

  // Draw each line with subtle shadow
  for (const line of lines) {
    ctx.fillStyle = shadowColor;
    ctx.fillText(line, WIDTH / 2 + 3, startY + 3);
    
    ctx.fillStyle = textColor;
    ctx.fillText(line, WIDTH / 2, startY);
    
    startY += actualLineHeight;
  }

  // Draw author
  ctx.font = `${authorSize}px "${authorFont}", sans-serif`;
  startY += 40;
  
  ctx.fillStyle = shadowColor;
  ctx.fillText(`— ${author}`, WIDTH / 2 + 2, startY + 2);
  
  ctx.fillStyle = textColor;
  ctx.fillText(`— ${author}`, WIDTH / 2, startY);

  // Return as PNG buffer
  return canvas.toBuffer('image/png');
}
