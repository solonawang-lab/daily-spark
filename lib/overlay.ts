import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

// Image dimensions for phone wallpaper (iPhone 14 Pro)
const WIDTH = 1170;
const HEIGHT = 2532;

interface OverlayOptions {
  imageUrl: string;
  quote: string;
  author: string;
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
  const { imageUrl, quote, author, textColor = '#ffffff', shadowColor = 'rgba(0,0,0,0.7)' } = options;

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
  } catch (error) {
    // Fallback: dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  // Add slight dark overlay for better text readability
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Configure text style for quote
  const quoteFontSize = 64;
  const authorFontSize = 36;
  const maxTextWidth = WIDTH * 0.8;
  const lineHeight = quoteFontSize * 1.4;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw quote with word wrap
  ctx.font = `bold ${quoteFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  
  const quoteText = `"${quote}"`;
  const lines = wrapText(ctx, quoteText, maxTextWidth);
  
  // Calculate vertical position (center)
  const totalTextHeight = lines.length * lineHeight + authorFontSize + 40;
  let startY = (HEIGHT - totalTextHeight) / 2;

  // Draw each line with shadow
  for (const line of lines) {
    // Shadow
    ctx.fillStyle = shadowColor;
    ctx.fillText(line, WIDTH / 2 + 3, startY + 3);
    
    // Text
    ctx.fillStyle = textColor;
    ctx.fillText(line, WIDTH / 2, startY);
    
    startY += lineHeight;
  }

  // Draw author
  ctx.font = `${authorFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  startY += 30;
  
  // Shadow
  ctx.fillStyle = shadowColor;
  ctx.fillText(`— ${author}`, WIDTH / 2 + 2, startY + 2);
  
  // Text
  ctx.fillStyle = textColor;
  ctx.fillText(`— ${author}`, WIDTH / 2, startY);

  // Return as PNG buffer
  return canvas.toBuffer('image/png');
}
