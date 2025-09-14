import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import '../styles/gallery.css';

interface CertificatesItem {
  name: string;
  path: string;
  size: number;
  modified: string;
  thumbnail?: string;
}

interface CertificatesData {
  src: string;
  width: number;
  height: number;
}

export function CertificatesGalleryRuntimeClient() {
  const [images, setImages] = useState<CertificatesData[]>([]);
  const [fullSizeImages, setFullSizeImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const loadCertificatesImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch images from the API endpoint
        const response = await fetch('/api/certificates-images');

        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.status}`);
        }

        const galleryItems: CertificatesItem[] = await response.json();

        // Convert to photo album format
        const certificatesData: CertificatesData[] = [];
        const fullSizeData: { src: string }[] = [];

        for (const item of galleryItems) {
          try {
            // Get image dimensions by loading the image
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = item.path;
            });

            certificatesData.push({
              src: item.path,
              width: img.naturalWidth,
              height: img.naturalHeight,
            });

            fullSizeData.push({
              src: item.path,
            });
          } catch (error) {
            console.warn(`Failed to load ${item.name}:`, error);
            // Use default dimensions for failed items
            certificatesData.push({
              src: item.path,
              width: 800,
              height: 600,
            });

            fullSizeData.push({
              src: item.path,
            });
          }
        }

        setImages(certificatesData);
        setFullSizeImages(fullSizeData);
      } catch (err) {
        console.error('Error loading certificates images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');

        // Fallback to placeholder images
        const fallbackImages = [
          {
            src: '/placeholder-image.png',
            width: 800,
            height: 600,
          },
        ];

        setImages(fallbackImages);
        setFullSizeImages([{ src: fallbackImages[0].src }]);
      } finally {
        setLoading(false);
      }
    };

    loadCertificatesImages();
  }, []);

  if (loading) {
    return (
      <div className="relative overflow-hidden w-full h-full py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carmine-700 mx-auto mb-4"></div>
          <p className="text-stone-600">Načítám certifikáty...</p>
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
          <p className="text-red-600 mb-2">Chyba při načítání certifikátů</p>
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
    <div className="relative overflow-hidden w-full h-full py-8">
      <div className="certificates-gallery">
        <div className="certificates-grid">
          {images.map((item, idx) => (
            <div key={idx} className="certificate-item" onClick={() => setIndex(idx)}>
              <div className="certificate-frame">
                <img src={item.src} alt={`Certifikát ${idx + 1}`} className="certificate-image" />
                <div className="certificate-overlay">
                  <div className="certificate-icon">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <div className="certificate-label">
                    <span className="text-sm font-medium text-white">Zobrazit certifikát</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Lightbox
        index={index}
        slides={fullSizeImages}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
    </div>
  );
}
