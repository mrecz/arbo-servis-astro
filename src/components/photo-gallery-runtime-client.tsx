import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Video from 'yet-another-react-lightbox/plugins/video';
import '../styles/gallery.css';

interface GalleryItem {
  name: string;
  path: string;
  modified: string;
  type: 'image' | 'video';
}

interface PhotoData {
  src: string;
  width: number;
  height: number;
  type: 'image' | 'video';
  sources?: {
    src: string;
    type: string;
  }[];
}

export function PhotoGalleryRuntimeClient() {
  const [images, setImages] = useState<PhotoData[]>([]);
  const [fullSizeImages, setFullSizeImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch images from the API endpoint
        const response = await fetch('/api/gallery-images');

        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.status}`);
        }

        const galleryItems: GalleryItem[] = await response.json();

        // Initialize empty arrays
        setImages([]);
        setFullSizeImages([]);

        // Load images and videos progressively
        const loadItemProgressive = async (item: GalleryItem, index: number) => {
          try {
            if (item.type === 'image') {
              // Get image dimensions by loading the image
              const img = new Image();
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = item.path;
              });

              const newImageData = {
                src: item.path,
                width: img.naturalWidth,
                height: img.naturalHeight,
                type: 'image' as const,
              };

              const newFullSizeData = {
                src: item.path,
              };

              // Add the new image to the existing arrays
              setImages(prevImages => {
                const updatedImages = [...prevImages];
                updatedImages[index] = newImageData;
                return updatedImages;
              });

              setFullSizeImages(prevFullSize => {
                const updatedFullSize = [...prevFullSize];
                updatedFullSize[index] = newFullSizeData;
                return updatedFullSize;
              });
            } else if (item.type === 'video') {
              // For videos, we'll use default dimensions and create a video element
              // The actual dimensions will be determined by the video element
              const newVideoData = {
                src: item.path,
                width: 800, // Default width for videos
                height: 600, // Default height for videos
                type: 'video' as const,
              };

              // For Lightbox, we need to provide video format
              const newFullSizeData = {
                type: 'video',
                sources: [
                  {
                    src: item.path,
                    type: 'video/mp4',
                  },
                ],
              } as any;

              // Add the new video to the existing arrays
              setImages(prevImages => {
                const updatedImages = [...prevImages];
                updatedImages[index] = newVideoData;
                return updatedImages;
              });

              setFullSizeImages(prevFullSize => {
                const updatedFullSize = [...prevFullSize];
                updatedFullSize[index] = newFullSizeData;
                return updatedFullSize;
              });
            }
          } catch (error) {
            console.warn(`Failed to load ${item.type} ${item.name}:`, error);
            // Use default dimensions for failed items
            const fallbackData = {
              src: item.path,
              width: 800,
              height: 600,
              type: item.type,
            };

            // Handle fallback for both images and videos
            let fallbackFullSizeData;
            if (item.type === 'video') {
              fallbackFullSizeData = {
                type: 'video',
                sources: [
                  {
                    src: item.path,
                    type: 'video/mp4',
                  },
                ],
              } as any;
            } else {
              fallbackFullSizeData = {
                src: item.path,
              };
            }

            setImages(prevImages => {
              const updatedImages = [...prevImages];
              updatedImages[index] = fallbackData;
              return updatedImages;
            });

            setFullSizeImages(prevFullSize => {
              const updatedFullSize = [...prevFullSize];
              updatedFullSize[index] = fallbackFullSizeData;
              return updatedFullSize;
            });
          }
        };

        // Initialize arrays with the correct length
        const initialImages = new Array(galleryItems.length).fill(null);
        const initialFullSize = new Array(galleryItems.length).fill(null);
        setImages(initialImages);
        setFullSizeImages(initialFullSize);

        // Load all items concurrently
        const loadPromises = galleryItems.map((item, index) => loadItemProgressive(item, index));

        // Wait for all items to be processed (but they'll appear progressively)
        await Promise.allSettled(loadPromises);
      } catch (err) {
        console.error('Error loading gallery images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');

        // Fallback to placeholder images
        const fallbackImages = [
          {
            src: '/placeholder-image.png',
            width: 800,
            height: 600,
            type: 'image' as const,
          },
        ];

        setImages(fallbackImages);
        setFullSizeImages([{ src: fallbackImages[0].src }]);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryImages();
  }, []);

  if (loading) {
    return (
      <div className="relative overflow-hidden w-full h-full py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carmine-700 mx-auto mb-4"></div>
          <p className="text-stone-600">Načítám galerii...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden w-full h-full py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-2">Chyba při načítání galerie</p>
          <p className="text-stone-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-carmine-700 text-white rounded-lg hover:bg-carmine-800 transition-colors"
          >
            Zkusit znovu
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden w-full h-full py-20">
      <div className="styled-gallery">
        <div className="masonry-grid">
          {images.map((item, idx) => {
            // Show loading placeholder for items that haven't loaded yet
            if (!item) {
              return (
                <div key={idx} className="masonry-item">
                  <div className="gallery-image bg-stone-200 animate-pulse flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-carmine-700"></div>
                  </div>
                </div>
              );
            }

            return (
              <div key={idx} className="masonry-item" onClick={() => setIndex(idx)}>
                {item.type === 'video' ? (
                  <div className="video-wrapper">
                    <video
                      src={item.src}
                      className="gallery-video"
                      preload="metadata"
                      muted
                      loop
                      onMouseEnter={e => e.currentTarget.play()}
                      onMouseLeave={e => e.currentTarget.pause()}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="video-play-overlay">
                      <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <img src={item.src} alt={`Gallery item ${idx + 1}`} className="gallery-image" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Lightbox
        plugins={[Video]}
        index={index}
        slides={fullSizeImages.filter(img => img !== null)}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
    </div>
  );
}
