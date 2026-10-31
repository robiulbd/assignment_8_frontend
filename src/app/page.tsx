import HeroSlider from '@/components/shared/HeroSlider';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Other Home Page Content */}
      <section className="py-12 px-4 container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Featured Books</h2>
        <p className="text-muted-foreground">
          Explore our collection of top-rated books available for borrowing.
        </p>
      </section>
    </div>
  );
}