"use client";
import { Star, Quote } from "lucide-react"

// Custom Card component
function Card({ children, className, style, ...props }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '0.5rem',
        border: '1px solid #E5E5E5',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        ...style
      }}
      className={className}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function CardContent({ children, className, style, ...props }) {
  return (
    <div
      style={{
        padding: '1.5rem',
        ...style
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}

// Individual testimonial card component
function TestimonialCard({ testimonial, index }) {
  return (
    <Card>
      <CardContent
        style={{
          paddingTop: '2rem',
          paddingBottom: '1.5rem'
        }}
      >
        {/* Quote Icon */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            opacity: '0.1',
            transition: 'opacity 0.3s ease-in-out'
          }}
          className="quote-icon"
        >
          <Quote
            style={{
              height: '2rem',
              width: '2rem',
              color: '#22c55e'
            }}
          />
        </div>

        {/* Rating */}
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            marginBottom: '1rem'
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              style={{
                height: '1rem',
                width: '1rem',
                fill: '#22c55e',
                color: '#22c55e'
              }}
            />
          ))}
        </div>

        {/* Content */}
        <p
          style={{
            color: '#374151',
            marginBottom: '1.5rem',
            fontStyle: 'italic',
            lineHeight: '1.6',
            fontSize: '1rem'
          }}
        >
          "{testimonial.content}"
        </p>

        {/* Author */}
        <div
          style={{
            borderTop: '1px solid #E5E5E5',
            paddingTop: '1rem'
          }}
        >
          <h4
            style={{
              fontWeight: '600',
              color: '#000000',
              marginBottom: '0.25rem',
              fontSize: '1.125rem'
            }}
          >
            {testimonial.name}
          </h4>
          <p
            style={{
              fontSize: '1rem',
              color: '#6B7280',
              marginBottom: '0.25rem'
            }}
          >
            {testimonial.role}
          </p>
          <p
            style={{
              fontSize: '1rem',
              color: '#22c55e',
              fontWeight: '500'
            }}
          >
            {testimonial.company}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const testimonials = [
  {
    name: "DCP Rajesh Kumar",
    role: "Deputy Commissioner",
    company: "Delhi Police",
    content: "SafeCity reduced crime in our jurisdiction by 23% within the first quarter. The AI predictions are remarkably accurate and have completely transformed our patrolling strategy.",
  },
  {
    name: "Commissioner Priya Sharma",
    role: "Commissioner",
    company: "Mumbai Police",
    content: "Finally, a system that addresses bias in policing while improving efficiency. Game-changing technology that allows us to serve all communities fairly and effectively.",
  },
  {
    name: "SP Arjun Singh",
    role: "Superintendent of Police",
    company: "Rural Maharashtra",
    content: "The mobile app works perfectly even in remote areas. Our officers love the offline capability and how easy it is to file FIRs on the go.",
  }
]

export default function Testimonials() {
  return (
    <section
      style={{
        padding: '5rem 0',
        backgroundColor: '#FFFFFF'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '1rem',
              lineHeight: '1.2',
              trackingTight: 'tight'
            }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
          >
            Trusted by <span style={{ color: '#22c55e' }}>Law Enforcement Leaders</span>
          </h2>
          <p
            style={{
              color: '#374151',
              maxWidth: '32rem',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
            className="text-base sm:text-lg md:text-xl"
          >
            See why police forces across India are switching to SafeCity for their intelligent policing needs.
          </p>
        </div>

        {/* Row 1: Testimonials 1-3 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>

      </div>
    </section>
  )
}
