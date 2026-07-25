"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "Are your scrubs suitable for long shifts?",
    a: "Yes! Our scrubs are specifically crafted from 4-way stretch, moisture-wicking fabrics that move with your body and keep you cool and comfortable during even the longest 12+ hour shifts."
  },
  {
    q: "How do I choose the right size?",
    a: "Our scrubs are designed with a tailored yet flexible fit. Use our size guide to find your perfect match, or reach out to our team for personalized assistance."
  },
  {
    q: "What materials are your scrubs made from?",
    a: "We use an ultra-premium blend of rayon, nylon, and spandex. This combination ensures durability, breathability, anti-wrinkle properties, and an exceptionally soft feel against the skin."
  },
  {
    q: "How should I care for my scrubs?",
    a: "Machine wash cold with like colors and tumble dry on low. Our advanced color-lock fabric resists fading and shrinkage so your scrubs look brand new wash after wash."
  },
  {
    q: "Are the scrubs designed for mobility?",
    a: "Absolutely. With tailored ergonomic seams and athletic-inspired flexibility, our workwear provides unrestricted movement without sacrificing a professional, polished silhouette."
  }
];

export const FaqAccordion = () => {
  // Default second item open as shown in Figma screenshot
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            onClick={() => toggleFaq(index)}
            className={`bg-[#EFF5F7] border border-[#D5E5EC] p-5 rounded-lg cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              isOpen ? "shadow-sm bg-[#E5F0F5] md:col-span-1" : "hover:border-[#024b5c]/40"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-[#024b5c] shrink-0 w-4 inline-block text-center">
                  {isOpen ? "−" : "+"}
                </span>
                <h3 className="text-xs sm:text-sm font-semibold text-[#024b5c] leading-snug">
                  {faq.q}
                </h3>
              </div>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 pl-7 text-xs text-[#024b5c]/80 font-normal leading-relaxed border-t border-[#024b5c]/10 pt-3">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
