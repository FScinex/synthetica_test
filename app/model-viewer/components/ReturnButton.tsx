import Link from 'next/link';

export function ReturnButton() {
  return (
    <Link 
      href="/"
      className="absolute top-8 left-8 z-10 border border-white/50 text-white px-8 py-3 uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all duration-300"
    >
      Let's Go Back
    </Link>
  );
} 