"use client"

import { useState } from "react"

export default function ContactPage({ backgroundImage = null }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{backgroundColor: '#FFFFFF'}}>

      {/* Hero Section */}
      <section 
        className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[625px] overflow-hidden pt-16 sm:pt-20 md:pt-16"
        style={backgroundStyles}
      >

        <div className="container mx-auto px-4 sm:px-6 relative z-20 h-full">
          <div className="flex flex-col items-center justify-center h-full min-h-full">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold text-black text-center mb-4">
                CONTACT 
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
              <p className="text-black text-lg sm:text-xl max-w-2xl mx-auto font-semibold">
                Tribal Connect - Forest Rights Act Digitization Platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20">
          {/* Contact Form */}
          <div className="bg-white border border-gray-300 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg">
            <div className="mb-6 sm:mb-8">
              <h2 
                className="text-xs sm:text-sm mb-1.5 sm:mb-2 font-semibold tracking-wide uppercase"
                style={{color: '#22c55e'}}
              >
                Contact Us
              </h2>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                Let's Connect for 
                <span className="text-black"> FRA Implementation</span>
              </h1>
              <p className="text-gray-700 mt-3 sm:mt-4 text-sm sm:text-base">
                Get in touch to discover how Tribal Connect's AI-powered platform can digitize FRA records, create comprehensive atlases, and connect tribal communities with government schemes for sustainable development.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Name Fields */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base min-h-[44px]"
                    style={{
                      focusRing: '2px solid #DAA520'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#DAA520'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    placeholder="Rajesh"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base min-h-[44px]"
                    onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    placeholder="Sharma"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base min-h-[44px]"
                  onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  placeholder="rajesh.sharma@gov.in"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base min-h-[44px]"
                  onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Project/Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base min-h-[44px]"
                    onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    placeholder="Ministry of Tribal Affairs / Forest Department"
                  />
                </div>              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 resize-none transition-all text-sm sm:text-base"
                  onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  placeholder="Tell us about your FRA digitization needs - document processing, mapping requirements, DSS implementation, or stakeholder engagement. Include project details, location, and timeline requirements..."
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 shadow-lg hover:shadow-xl border text-sm sm:text-base"
                style={{
                  background: 'linear-gradient(to right, #22c55e, #16a34a)',
                  borderColor: 'rgba(34, 197, 94, 0.3)',
                  boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.25)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #16a34a, #22c55e)'}
                onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #22c55e, #16a34a)'}
              >
                Get FRA Consultation
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-3 sm:mb-4">
                Ready to implement FRA digitization in your region?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
                Join 500+ villages and 15 states that trust Tribal Connect for comprehensive FRA implementation. As a government-backed initiative, we deliver secure, compliant solutions with advanced AI technology and multi-agency collaboration.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 sm:space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-xl"
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{color: '#22c55e'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-black font-semibold mb-1 text-sm sm:text-base">Phone Number</h3>
                  <p className="text-gray-700 text-sm sm:text-base">1800-FRA-HELP</p>
                  <p className="text-xs sm:text-sm text-gray-600">Available 24/7 for FRA implementation support</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-xl"
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{color: '#22c55e'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-black font-semibold mb-1 text-sm sm:text-base">Email Address</h3>
                  <p className="text-gray-700 text-sm sm:text-base">support@tribalconnect.gov.in</p>
                  <p className="text-xs sm:text-sm text-gray-600">We'll respond within 24 hours</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-xl"
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{color: '#22c55e'}} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-black font-semibold mb-1 text-sm sm:text-base">WhatsApp</h3>
                  <p className="text-gray-700 text-sm sm:text-base">+91 98765 43210</p>
                  <p className="text-xs sm:text-sm text-gray-600">Quick support & FRA consultations</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-xl"
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{color: '#22c55e'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-black font-semibold mb-1 text-sm sm:text-base">Service Areas</h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    All States & UTs
                    <br />
                    Ministry of Tribal Affairs
                    <br />
                    Forest Departments Nationwide
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">FRA implementation support across India</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-6 sm:mt-8">
              <div 
                className="w-full h-64 sm:h-80 md:h-96 backdrop-blur-xl rounded-lg overflow-hidden shadow-lg"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.1)'
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.68842331436!2d54.897750062508744!3d25.0762677693423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1635959872076!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="India FRA Implementation Areas"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}