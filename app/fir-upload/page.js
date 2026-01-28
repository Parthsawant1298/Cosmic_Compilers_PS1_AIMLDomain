'use client';
import FIRUpload from '@/components/FIRUpload';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FIRUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="py-12">
        <FIRUpload />
      </div>

      <Footer />
    </div>
  );
}