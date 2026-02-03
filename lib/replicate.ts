import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Mock images for testing (when Replicate billing not set up)
const MOCK_IMAGES: Record<string, string> = {
  minimalist: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=768&h=1344&fit=crop',
  nature: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=768&h=1344&fit=crop',
  dark: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=768&h=1344&fit=crop',
  vibrant: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=768&h=1344&fit=crop',
};

const USE_MOCK = process.env.USE_MOCK_IMAGES === 'true';

export async function generateImage(prompt: string, style?: string): Promise<string> {
  // Use mock images for testing
  if (USE_MOCK) {
    console.log('Using mock image for style:', style);
    return MOCK_IMAGES[style || 'dark'] || MOCK_IMAGES.dark;
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
