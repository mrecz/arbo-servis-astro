import type { APIRoute } from 'astro';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

interface CertificatesItem {
  name: string;
  path: string;
  size: number;
  modified: string;
  thumbnail?: string;
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
          const filePath = join(certificatesPath, file);
          const stats = await stat(filePath);
          return {
            name: file,
            path: `/certificates/${file}`,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            type: 'image' as const,
          };
        })
      );

      certificatesItems.push(...imageItems);
    } catch (error) {
      console.warn('Error reading images directory:', error);
    }

    // Sort by modification date (newest first)
    certificatesItems.sort(
      (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
    );

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
