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

  return (
    <div className="flex md:hidden">
      {/* Hamburger button */}
      <button
        ref={trigger}
        className={`group inline-flex w-8 h-8 text-slate-300 hover:text-white text-center items-center justify-center transition`}
        aria-controls="mobile-nav"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <span className="sr-only">Menu</span>
        <svg
          className="w-4 h-4 fill-current pointer-events-none"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] -translate-y-[5px] group-aria-expanded:rotate-[315deg] group-aria-expanded:translate-y-0"
            y="7"
            width="16"
            height="2"
            rx="1"
          />
          <rect
            className="origin-center group-aria-expanded:rotate-45 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)]"
            y="7"
            width="16"
            height="2"
            rx="1"
          />
          <rect
            className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] translate-y-[5px] group-aria-expanded:rotate-[135deg] group-aria-expanded:translate-y-0"
            y="7"
            width="16"
            height="2"
            rx="1"
          />
        </svg>
      </button>

      {/*Mobile navigation */}
      <div ref={mobileNav}>
        <nav
          id="mobile-nav"
          className={`absolute top-full h-screen pb-16 z-20 left-0 w-full overflow-scroll bg-white transform transition-all duration-200 ease-out ${
            mobileNavOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <ul className="px-5 py-2">
            <li>
              <a
                href="/nabizene-sluzby"
                className="flex font-medium text-slate-800 hover:text-green-600 py-2"
                onClick={() => setMobileNavOpen(false)}
              >
                Nabízené služby
              </a>
            </li>
            <li>
              <a
                href="/zajem-o-sluzbu"
                className="flex font-medium text-slate-800 hover:text-green-600 py-2"
                onClick={() => setMobileNavOpen(false)}
              >
                Zajímáte se o službu?
              </a>
            </li>
            <li>
              <a
                href="/o-nas"
                className="flex font-medium text-slate-800 hover:text-green-600 py-2"
                onClick={() => setMobileNavOpen(false)}
              >
                O nás
              </a>
            </li>
            <li>
              <a
                href="/cena"
                className="flex font-medium text-slate-800 hover:text-green-600 py-2"
                onClick={() => setMobileNavOpen(false)}
              >
                Cena
              </a>
            </li>
            <li>
              <a
                href="/reference"
                className="flex font-medium w-full text-slate-800 hover:text-green-600 py-2"
                onClick={() => setMobileNavOpen(false)}
              >
                Reference
              </a>
            </li>
            <li>
              <a
                href="/kontakt"
                className="flex font-medium text-green-600 py-2 group"
                onClick={() => setMobileNavOpen(false)}
              >
                Kontakt
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
