import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/replicate';
import { getRandomQuote, Category } from '@/lib/quotes';
import { Style, getStylePrompt, styles } from '@/lib/styles';
import { createWallpaperWithOverlay } from '@/lib/overlay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, style } = body as { category: Category; style: Style };

    // Validate inputs
    if (!category || !style) {
      return NextResponse.json(
        { error: 'Missing category or style' },
        { status: 400 }
      );
    }

    // Get a random quote for the category
    const quote = getRandomQuote(category);

    // Generate the image prompt
    const prompt = getStylePrompt(style, category);
    
    console.log('Generating image with prompt:', prompt);

    // Generate the base image via Replicate
    const imageUrl = await generateImage(prompt, style);

    console.log('Generated image:', imageUrl);

    // Get style colors
    const styleConfig = styles[style];

    // Create wallpaper with quote overlay (font varies by category)
    const wallpaperBuffer = await createWallpaperWithOverlay({
      imageUrl,
      quote: quote.text,
      author: quote.author,
      category,
      textColor: styleConfig.textColor,
      shadowColor: styleConfig.shadowColor,
    });

    // Convert to base64 for response
    const base64 = wallpaperBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log('Created wallpaper with overlay');

    return NextResponse.json({
      imageUrl: dataUrl,
      quote: quote.text,
      author: quote.author,
      category,
      style,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate wallpaper' },
      { status: 500 }
    );
  }
}
