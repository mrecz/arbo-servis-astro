import type { APIRoute } from 'astro';
import { readdir } from 'fs/promises';
import { join } from 'path';

interface CertificatesItem {
  name: string;
  path: string;
}

export const GET: APIRoute = async () => {
  try {
    const certificatesPath = join(process.cwd(), 'public', 'certificates');

    const certificatesItems: CertificatesItem[] = [];

    // Process images
    try {
      const imageFiles = await readdir(certificatesPath);
      const validImageFiles = imageFiles.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

      const imageItems = await Promise.all(
        validImageFiles.map(async file => {
          return {
            name: file,
            path: `/certificates/${file}`,
          };
        })
      );

      certificatesItems.push(...imageItems);
    } catch (error) {
      console.warn('Error reading images directory:', error);
    }

    return new Response(JSON.stringify(certificatesItems), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error reading certificates items:', error);
    return new Response(JSON.stringify({ error: 'Failed to load certificates items' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
