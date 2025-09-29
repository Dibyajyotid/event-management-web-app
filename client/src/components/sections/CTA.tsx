import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <Calendar className="h-16 w-16 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discover Your Next Event?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of professionals who use EventHub to find amazing events, network with peers, and advance their
          careers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/events">
            <Button size="lg" variant="secondary" className="btn-animate">
              Browse Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button
              size="lg"
              variant="outline"
              className="btn-animate bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
