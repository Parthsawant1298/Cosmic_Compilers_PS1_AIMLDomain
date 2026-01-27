"use client";
import { ArrowRight, Zap, Target, Activity } from "lucide-react"
import Link from "next/link"

// Custom Button component
function Button({ children, size, variant, className, ...props }) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.375rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
    textDecoration: 'none',
    border: 'none',
    outline: 'none'
  }

  const sizeStyles = {
    lg: {
      padding: '0.75rem 2rem',
      fontSize: '1.125rem'
    },
    md: {
      padding: '0.5rem 1rem',
      fontSize: '1rem'
    }
  }

  const variantStyles = {
    default: {
      backgroundColor: '#22c55e',
      color: '#FFFFFF'
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#22c55e',
      border: '2px solid #22c55e'
    },
    white: {
      backgroundColor: '#FFFFFF',
      color: '#000000',
      border: '1px solid #E5E5E5'
    }
  }

  const currentSize = sizeStyles[size] || sizeStyles.md

  return (
    <button
      style={{
        ...baseStyles,
        ...currentSize,
        ...variantStyles[variant || 'default'],
        ...props.style
      }}
      {...props}
      onMouseEnter={(e) => {
        if (variant === 'default') e.currentTarget.style.backgroundColor = '#16a34a';
        if (variant === 'outline') e.currentTarget.style.backgroundColor = '#22c55e';
        if (variant === 'outline') e.currentTarget.style.color = '#FFFFFF';
        if (props.onMouseEnter) props.onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        // Reset styles based on variant
        if (variant === 'default') e.currentTarget.style.backgroundColor = '#22c55e';
        if (variant === 'outline') e.currentTarget.style.backgroundColor = 'transparent';
        if (variant === 'outline') e.currentTarget.style.color = '#22c55e';
        if (props.onMouseLeave) props.onMouseLeave(e);
      }}
    >
      {children}
    </button>
  )
}

export default function Hero() {

  return (
    <section className="relative py-12 lg:py-20 min-h-screen flex items-center bg-gray-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-green-50 skew-x-12 transform origin-top-right z-0 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-30 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm mb-2">
              India's First Predictive Policing Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Transform Crime Fighting with <span className="text-green-600">AI Intelligence</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
              Reduce crime by 25%, optimize resources by 30%, and ensure fair policing with our advanced AI-powered crime mapping and prediction system.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/demo">
                <Button size="lg" variant="default" className="w-full sm:w-auto shadow-lg shadow-green-200">
                  <span className="flex items-center gap-2">
                    Watch Live Demo
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="white" className="w-full sm:w-auto shadow-sm hover:shadow-md">
                  Request Pilot Program
                </Button>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-200 mt-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-green-600 font-bold text-xl sm:text-2xl">
                  <Target className="h-5 w-5" /> 87%
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium text-center lg:text-left">Prediction Accuracy</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-green-600 font-bold text-xl sm:text-2xl">
                  <Zap className="h-5 w-5" /> &lt;2s
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium text-center lg:text-left">Response Time</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-green-600 font-bold text-xl sm:text-2xl">
                  <Activity className="h-5 w-5" /> 15K+
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium text-center lg:text-left">Stations Ready</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-green-600 font-bold text-xl sm:text-2xl">
                  <ArrowRight className="h-5 w-5 rotate-45" /> 23%
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium text-center lg:text-left">Crime Reduction</div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-200 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/images/dashboard_mockup.jpg"
                alt="SafeCity Dashboard"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
                }}
              />
              {/* Floating Element */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-green-100 hidden md:block">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">Live Prediction Active</h4>
                    <p className="text-xs text-gray-500">Monitoring 24 sectors in real-time</p>
                  </div>
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}