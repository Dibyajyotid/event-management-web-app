export function Stats() {
  const stats = [
    {
      number: "10K+",
      label: "Events Hosted",
      description: "Successfully organized events",
    },
    {
      number: "50K+",
      label: "Happy Attendees",
      description: "Satisfied event participants",
    },
    {
      number: "500+",
      label: "Event Organizers",
      description: "Trusted by professionals",
    },
    {
      number: "25+",
      label: "Cities Covered",
      description: "Events across major cities",
    },
  ]

  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
