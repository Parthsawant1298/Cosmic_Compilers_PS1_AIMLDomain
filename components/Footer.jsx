"use client";
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Youtube, Globe, Shield } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-8 h-8 text-green-500" />
              <h2 className="text-2xl font-bold text-white">SafeCity</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering law enforcement with predictive intelligence. Building safer, fairer, and smarter cities through ethical AI technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors">
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">Platform</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 inline-block">Crime Prediction</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 inline-block">Patrol Optimization</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 inline-block">Investigation Analytics</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 inline-block">Mobile Field App</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 inline-block">Command Dashboard</Link></li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">Resources</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 inline-block">Case Studies</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 inline-block">White Papers</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 inline-block">API Documentation</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 inline-block">Privacy Policy</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 inline-block">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span>Tech Park, Sector 5, Bengaluru, India</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>contact@safecity.ai</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} SafeCity AI. All rights reserved. Made in India.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}