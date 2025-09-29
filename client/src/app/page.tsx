import { Hero } from "@/components/sections/Hero";
import { FeaturedEvents } from "@/components/sections/FeaturedEvents";
import { Categories } from "@/components/sections/Categories";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EventRecommendations } from "@/components/events/EventRecommendations";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        {/* <Stats /> */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <EventRecommendations />
          </div>
        </section>
        <FeaturedEvents />
        <Categories />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
