import { useState, useRef, useEffect } from 'react';

export default function MobileMenu() {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const trigger = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLDivElement>(null);

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!mobileNav.current || !trigger.current) return;
      if (
        !mobileNavOpen ||
        mobileNav.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setMobileNavOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!mobileNavOpen || keyCode !== 27) return;
      setMobileNavOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileNavOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [mobileNavOpen]);

  return (
    <div className="flex md:hidden">
      {/* Hamburger button */}
      <button
        ref={trigger}
        className={`group relative inline-flex w-10 h-10 text-slate-300 hover:text-white text-center items-center justify-center transition-all duration-300 rounded-lg hover:bg-white/10 backdrop-blur-sm`}
        aria-controls="mobile-nav"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <span className="sr-only">Menu</span>
        <div className="relative w-6 h-6">
          <svg
            className="w-6 h-6 fill-current pointer-events-none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              className="origin-center transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] -translate-y-[6px] group-aria-expanded:rotate-[45deg] group-aria-expanded:translate-y-0"
              x="3"
              y="11"
              width="18"
              height="2"
              rx="1"
            />
            <rect
              className="origin-center transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] opacity-100 group-aria-expanded:opacity-0 group-aria-expanded:scale-0"
              x="3"
              y="11"
              width="18"
              height="2"
              rx="1"
            />
            <rect
              className="origin-center transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] translate-y-[6px] group-aria-expanded:rotate-[-45deg] group-aria-expanded:translate-y-0"
              x="3"
              y="11"
              width="18"
              height="2"
              rx="1"
            />
          </svg>
        </div>
        {/* Ripple effect */}
        <div
          className={`absolute inset-0 rounded-lg bg-white/20 scale-0 group-aria-expanded:scale-100 transition-transform duration-300 ease-out`}
        ></div>
      </button>

      {/*Mobile navigation */}
      <div ref={mobileNav}>
        <nav
          id="mobile-nav"
          className={`fixed top-28 md:top-40 left-0 w-full z-20 overflow-y-auto bg-white/95 border-b border-slate-200/30 shadow-lg transform transition-all duration-300 ease-out ${
            mobileNavOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            height: 'calc(100vh - 20rem)', // Dynamic height based on viewport
            maxHeight: 'calc(100vh - 7rem)', // Ensure it doesn't exceed viewport
            minHeight: '20rem', // Minimum height for portrait mode
            WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
            overscrollBehavior: 'contain', // Prevent scroll chaining
          }}
        >
          <ul className="px-6 py-8 space-y-1">
            <li>
              <a
                href="/"
                className="flex font-medium text-latte-800 hover:text-carmine-600 py-4 px-4 rounded-lg hover:bg-green-50/50 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  Úvod
                </span>
              </a>
            </li>
            <li className="border-b border-slate-900/20"></li>
            <li>
              <a
                href="/nabizene-sluzby"
                className="flex font-medium text-latte-800 hover:text-carmine-600 py-4 px-4 rounded-lg hover:bg-green-50/50 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  Nabízené služby
                </span>
              </a>
            </li>
            <li className="border-b border-slate-900/20"></li>
            <li>
              <a
                href="/zajem-o-sluzbu"
                className="flex font-medium text-latte-800 hover:text-carmine-600 py-4 px-4 rounded-lg hover:bg-carmine-50/50 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  Zajímáte se o službu?
                </span>
              </a>
            </li>
            <li className="border-b border-slate-900/20"></li>
            <li>
              <a
                href="/o-nas"
                className="flex font-medium text-latte-800 hover:text-carmine-600 py-4 px-4 rounded-lg hover:bg-carmine-50/50 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  O nás
                </span>
              </a>
            </li>
            <li className="border-b border-slate-900/20"></li>
            <li>
              <a
                href="/cena"
                className="flex font-medium text-latte-800 hover:text-carmine-600 py-4 px-4 rounded-lg hover:bg-carmine-50/50 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  Cena
                </span>
              </a>
            </li>
            <li className="border-b border-slate-900/20"></li>
            <li>
              <a
                href="/reference"
                className="flex font-medium text-latte-800 hover:text-carmine-600 py-4 px-4 rounded-lg hover:bg-carmine-50/50 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  Reference
                </span>
              </a>
            </li>
            <li className="border-b border-slate-900/20"></li>
            <li>
              <a
                href="/osvedceni"
                className="flex font-medium text-latte-800 hover:text-carmine-600 py-4 px-4 rounded-lg hover:bg-carmine-50/50 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  Osvědčení
                </span>
              </a>
            </li>
            <li className="pt-4 border-t border-slate-900/20"></li>
            <li>
              <a
                href="/kontakt"
                className="flex items-center font-medium text-carmine-600 py-4 px-4 rounded-lg hover:bg-carmine-100/50 transition-all duration-200 group"
                onClick={() => setMobileNavOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  Kontakt
                </span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
