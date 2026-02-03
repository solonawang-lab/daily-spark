import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Mock images for testing (when Replicate billing not set up)
// Multiple images per style for variety - randomly selected
const MOCK_IMAGES: Record<string, string[]> = {
  minimalist: [
    // Soft gradients and pastels
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=768&h=1344&fit=crop', // Pink/blue gradient
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=768&h=1344&fit=crop', // Colorful gradient
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=768&h=1344&fit=crop', // Soft pink abstract
    'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=768&h=1344&fit=crop', // Pastel waves
    'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=768&h=1344&fit=crop', // Soft gradient blobs
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=768&h=1344&fit=crop', // 3D abstract shapes
  ],
  nature: [
    // Mountains, landscapes, golden hour
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=768&h=1344&fit=crop', // Mountains with clouds
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=768&h=1344&fit=crop', // Mountain peaks
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=768&h=1344&fit=crop', // Foggy mountains
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=768&h=1344&fit=crop', // Lake reflection
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=768&h=1344&fit=crop', // Waterfall forest
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=768&h=1344&fit=crop', // Sun rays nature
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=768&h=1344&fit=crop', // Ocean sunset
    'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=768&h=1344&fit=crop', // Tropical beach
  ],
  dark: [
    // Cosmic, moody, night sky
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=768&h=1344&fit=crop', // Dark blue gradient
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=768&h=1344&fit=crop', // Starry night sky
    'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=768&h=1344&fit=crop', // Dark mountains night
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=768&h=1344&fit=crop', // Nebula cosmos
    'https://images.unsplash.com/photo-1520034475321-cbe63696469a?w=768&h=1344&fit=crop', // Dark ocean
    'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=768&h=1344&fit=crop', // Night sky stars
    'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=768&h=1344&fit=crop', // Northern lights
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=768&h=1344&fit=crop', // Aurora borealis
  ],
  vibrant: [
    // Bold colors, energetic
    'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=768&h=1344&fit=crop', // Colorful abstract
    'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=768&h=1344&fit=crop', // Neon lights
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=768&h=1344&fit=crop', // Vibrant paint
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=768&h=1344&fit=crop', // Abstract colorful ink
    'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=768&h=1344&fit=crop', // Gradient waves
    'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=768&h=1344&fit=crop', // Colorful smoke
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=768&h=1344&fit=crop', // Pink purple abstract
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=768&h=1344&fit=crop', // Neon gradient
  ],
};

function getRandomMockImage(style: string): string {
  const images = MOCK_IMAGES[style] || MOCK_IMAGES.dark;
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

const USE_MOCK = process.env.USE_MOCK_IMAGES === 'true';

export async function generateImage(prompt: string, style?: string): Promise<string> {
  // Use mock images for testing
  if (USE_MOCK) {
    console.log('Using mock image for style:', style);
    return getRandomMockImage(style || 'dark');
  }

  // Using SDXL for high quality images
  const output = await replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
      input: {
        prompt: prompt,
        negative_prompt: "text, words, letters, watermark, signature, blurry, low quality, distorted",
        width: 768,
        height: 1344,  // ~9:16 ratio for phone wallpaper
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 30,
        guidance_scale: 7.5,
      }
    }
  );

  // Replicate returns an array of image URLs
  const images = output as string[];
  return images[0];
}
