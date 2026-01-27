"use client"
import React from 'react';
import { TrendingDown, Zap, DollarSign, Database, Shield, BarChart2 } from "lucide-react"

const StatsComponent = () => {
  const stats = [
    {
      icon: <TrendingDown className="h-8 w-8 text-green-500" />,
      value: "25-35%",
      label: "Crime Reduction",
      suffix: "",
      desc: "In pilot deployment areas",
    },
    {
      icon: <Zap className="h-8 w-8 text-green-500" />,
      value: "40%",
      label: "Faster Response",
      suffix: "",
      desc: "Emergency incident handling",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      value: "₹2.3 Cr",
      label: "Annual Savings",
      suffix: "",
      desc: "Per state efficiency gains",
    },
    {
      icon: <Database className="h-8 w-8 text-green-500" />,
      value: "95%",
      label: "Data Quality",
      suffix: "",
      desc: "Standardized information",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      value: "65%",
      label: "Bias Reduction",
      suffix: "",
      desc: "Fairer policing practices",
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-green-500" />,
      value: "28%",
      label: "Efficiency",
      suffix: "",
      desc: "Better patrol coverage",
    },
  ]

  return (
    <div className="w-full py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Proven Results <span className="text-green-600">That Matter</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real impact delivered through intelligent technology and data-driven decision making.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-green-50 group-hover:bg-green-600 transition-colors duration-300">
                  {React.cloneElement(stat.icon, { className: "h-8 w-8 text-green-600 group-hover:text-white transition-colors duration-300" })}
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}{stat.suffix}</div>
                  <div className="font-semibold text-gray-700">{stat.label}</div>
                </div>
              </div>
              <p className="text-gray-500 text-sm pl-16">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatsComponent
