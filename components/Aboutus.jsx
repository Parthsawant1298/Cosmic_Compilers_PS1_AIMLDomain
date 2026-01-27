"use client"
import Testimonials from "@/components/Testimonial"

// Button component
const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function AboutUsPage({ backgroundImage = null }) {
  // Default background image
  const defaultBackgroundImage = "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80"
  
  // Use provided image or default
  const displayBackgroundImage = backgroundImage || defaultBackgroundImage
  
  // Background styles
  const backgroundStyles = {
    backgroundImage: `url(${displayBackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
  return (
    <div className="min-h-screen relative overflow-hidden" style={{backgroundColor: '#FFFFFF'}}>
      {/* Hero Section */}
      <section 
        className="relative h-[300px] sm:h-[400px] md:h-[350px] lg:h-[625px] overflow-hidden pt-16 sm:pt-20 md:pt-16"
        style={backgroundStyles}
      >

        <div className="container mx-auto px-4 sm:px-6 relative z-20 h-full">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold text-black text-center">
              ABOUT
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  background: 'linear-gradient(to right, #22c55e, #16a34a, #22c55e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                US
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-4 sm:py-6 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
            {/* Hero Image */}
            <div className="order-2 lg:order-1 flex justify-center">
              <img
                src="/images/about.webp"
                alt="Tribal Connect FRA digitization and mapping platform"
                className="w-full max-w-sm sm:max-w-md lg:max-w-none rounded-lg shadow-lg border shadow-lg h-[300px] min-h-[300px] sm:h-[400px] sm:min-h-[400px] md:h-[500px] md:min-h-[500px] lg:h-[600px] lg:min-h-[600px] object-cover"
                style={{
                  borderColor: 'rgba(34, 197, 94, 0.3)',
                  boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.1)'
                }}
                onError={(e) => {
                  e.target.src = "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
                }}
              />
            </div>

            {/* Hero Content */}
            <div className="order-1 lg:order-2 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
                  Welcome to <span style={{color: '#22c55e'}}>Tribal Connect</span>
                </h1>
                <div className="space-y-4 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                  <p>
                    Tribal Connect is a government-backed initiative dedicated to digitizing and implementing the Forest Rights Act (FRA), 2006. We empower forest-dwelling communities by providing AI-powered tools for document digitization, spatial mapping, and decision support systems that connect tribal rights holders with essential government schemes.
                  </p>
                  <p>
                    Our platform addresses the critical challenges of scattered, non-digitized FRA records through comprehensive automation. By leveraging cutting-edge AI technology, satellite imagery, and multi-agency collaboration, we ensure that tribal communities receive their rightful entitlements and access to development programs.
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-4 sm:mb-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">10,000+</div>
                  <div className="text-gray-700 text-xs sm:text-sm">
                    FRA Claims
                    <br />
                    Digitized
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">500+</div>
                  <div className="text-gray-700 text-xs sm:text-sm">
                    Villages
                    <br />
                    Mapped
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">15</div>
                  <div className="text-gray-700 text-xs sm:text-sm">
                    States
                    <br />
                    Covered
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-6 sm:py-8 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 relative z-10" style={{backgroundColor: '#FFFFFF'}}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-stretch">
            {/* Process Content */}
            <div className="flex flex-col justify-between space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 order-1 lg:order-1">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                Our <span style={{color: '#22c55e'}}>Technology & Partnerships</span>
              </h2>

              {/* Content Sections */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 flex-grow flex flex-col justify-center">
                {/* AI Technology */}
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900">
                    AI-Powered Digitization
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                    Our advanced AI systems process multi-language FRA documents, extract critical information, and create digital databases. This technology ensures accuracy, speed, and accessibility of tribal rights records across India's diverse linguistic landscape.
                  </p>
                </div>

                {/* Spatial Mapping */}
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900">
                    FRA Atlas & WebGIS Platform
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                    Interactive mapping platform integrating satellite imagery, GPS coordinates, and FRA claim data. This comprehensive spatial database enables real-time monitoring, conflict resolution, and evidence-based decision making for forest governance.
                  </p>
                </div>

                {/* Government Collaboration */}
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900">
                    Multi-Agency Collaboration
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                    Tribal Connect facilitates seamless collaboration between Ministry of Tribal Affairs, forest departments, state governments, and tribal communities. Our platform serves as a unified interface for FRA implementation across all stakeholders.
                  </p>
                </div>
              </div>
            </div>

            {/* Process Image */}
            <div className="order-2 lg:order-2">
              <img
                src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
                alt="Tribal Connect AI technology and government partnerships"
                className="w-full h-64 sm:h-72 md:h-80 lg:h-full object-cover rounded-lg shadow-lg border shadow-lg"
                style={{
                  borderColor: 'rgba(34, 197, 94, 0.3)',
                  boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.1)'
                }}
                onError={(e) => {
                  console.log('Process image failed, trying backup');
                  e.target.src = "https://via.placeholder.com/800x600/DAA520/FFFFFF?text=Technical+Services+Process";
                  e.target.onerror = () => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjREFBNTIwIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iYm9sZCI+VGVjaG5pY2FsIFNlcnZpY2VzPC90ZXh0Pgo8L3N2Zz4K";
                  };
                }}
              />
            </div>
          
          </div>
        </div>
      </section>
        <Testimonials />
    </div>
  )
}