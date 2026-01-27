"use client";
import React, { useState } from "react";
import { Plus, Minus, Search } from "lucide-react";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How accurate are the crime predictions?",
      answer: "SafeCity's AI model has demonstrated an 87% accuracy rate in pilot programs across 3 major cities, consistently predicting high-risk zones 24 hours in advance."
    },
    {
      question: "Is the data secure?",
      answer: "Absolutely. We use military-grade end-to-end encryption for all data. Our system is compliant with national data privacy regulations and undergoes regular security audits."
    },
    {
      question: "Does the AI introduce bias?",
      answer: "No. Fairness is a core pillar of SafeCity. We have built-in bias detection algorithms that constantly monitor for demographic skew and flag it immediately, ensuring equitable policing."
    },
    {
      question: "How long does it take to deploy?",
      answer: "The Pilot Program can be up and running in 2 weeks. Full city-wide deployment typically takes 4-6 weeks, including officer training and historical data integration."
    },
    {
      question: "Does the mobile app work offline?",
      answer: "Yes, the SafeCity mobile app is designed for field use. It functions fully offline, allowing officers to file reports and access maps, syncing automatically once connectivity is restored."
    },
    {
      question: "Can it integrate with existing CCTV networks?",
      answer: "Yes, SafeCity is designed to be interoperable. It can ingest data from existing CCTV feeds, emergency call systems (Dial 100), and legacy record management systems."
    },
    {
      question: "Is training provided?",
      answer: "Yes, we provide comprehensive training for all levels - from field officers using the mobile app to command center staff interpreting the analytics dashboard."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          Frequently Asked <span className="text-green-600">Questions</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Common questions about implementation, security, and features.
        </p>
      </div>

      {/* Accordion Section */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`border rounded-xl transition-all duration-300 bg-white overflow-hidden ${openIndex === index ? "border-green-500 shadow-md" : "border-gray-200 hover:border-green-200"
              }`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
              <span className={`text-lg font-semibold ${openIndex === index ? "text-green-700" : "text-gray-800"}`}>
                {faq.question}
              </span>
              <div className={`p-1 rounded-full transition-colors ${openIndex === index ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 transition-transform duration-300 transform rotate-0" />
                ) : (
                  <Plus className="w-5 h-5 transition-transform duration-300 transform rotate-90" />
                )}
              </div>
            </button>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FAQPage;