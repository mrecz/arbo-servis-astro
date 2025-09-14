import type { APIRoute } from 'astro';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

interface GalleryItem {
  name: string;
  path: string;
  size: number;
  modified: string;
  type: 'image' | 'video';
  thumbnail?: string;
}

export const GET: APIRoute = async () => {
  try {
    const imagesPath = join(process.cwd(), 'public', 'gallery', 'images');
    const videosPath = join(process.cwd(), 'public', 'gallery', 'videos');

    const galleryItems: GalleryItem[] = [];

    // Process images
    try {
      const imageFiles = await readdir(imagesPath);
      const validImageFiles = imageFiles.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

      const imageItems = await Promise.all(
        validImageFiles.map(async file => {
          const filePath = join(imagesPath, file);
          const stats = await stat(filePath);
          return {
            name: file,
            path: `/gallery/images/${file}`,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            type: 'image' as const,
          };
        })
      );

      galleryItems.push(...imageItems);
    } catch (error) {
      console.warn('Error reading images directory:', error);
    }

    // Process videos
    try {
      const videoFiles = await readdir(videosPath);
      const validVideoFiles = videoFiles.filter(file => /\.(mp4|webm|ogg|mov|avi)$/i.test(file));

      const videoItems = await Promise.all(
        validVideoFiles.map(async file => {
          const filePath = join(videosPath, file);
          const stats = await stat(filePath);
          return {
            name: file,
            path: `/gallery/videos/${file}`,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            type: 'video' as const,
          };
        })
      );

      galleryItems.push(...videoItems);
    } catch (error) {
      console.warn('Error reading videos directory:', error);
    }

    // Sort by modification date (newest first)
    galleryItems.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

    return new Response(JSON.stringify(galleryItems), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error reading gallery items:', error);
    return new Response(JSON.stringify({ error: 'Failed to load gallery items' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
