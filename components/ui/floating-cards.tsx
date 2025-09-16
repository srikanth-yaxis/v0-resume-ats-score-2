import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_CONTENT = [
  {
    title: "What is YTP?",
    subtitle: "Y-Axis Talent Pool",
    description: "YTP (Y-Axis Talent Pool) is a platform that builds globally standardized, verified candidate profiles for jobs, study, and migration. It helps candidates showcase skills, visa readiness, and availability clearly, making them discoverable and competitive worldwide."
  },
  {
    title: "What is GIS?",
    subtitle: "Global Indian Score",
    description: "GIS (Global Indian Score) is a 0–100 score that measures a candidate's likelihood of succeeding abroad based on skills, education, visa, and readiness. It gives candidates a clear benchmark of their global readiness and highlights actions to improve chances of success."
  },
  {
    title: "What is ATS?",
    subtitle: "Applicant Tracking System",
    description: "ATS (Applicant Tracking System) is software recruiters use to scan, filter, and rank resumes before human review. It saves recruiters time, ensures fair shortlisting, and helps candidates with optimized profiles get noticed."
  },
  {
    title: "Why do I need a professional resume?",
    subtitle: "ATS Optimization",
    description: "Professional resumes are ATS-optimized with proper formatting, keywords, and structure. They increase your chances of passing initial screening by 3x and help you stand out in a competitive job market."
  },
  {
    title: "How does visa status affect my opportunities?",
    subtitle: "Immigration Readiness",
    description: "Your visa status significantly impacts job opportunities. Work visas require employer sponsorship, while PR/citizenship status opens up more positions. Understanding your immigration pathway is crucial for career planning."
  },
  {
    title: "What makes a candidate globally competitive?",
    subtitle: "Global Readiness",
    description: "Global competitiveness combines technical skills, cultural adaptability, language proficiency, and market-relevant experience. Our assessment helps identify gaps and provides a roadmap for improvement."
  }
];

interface TextContent {
  title: string;
  subtitle: string;
  description: string;
}

interface FloatingCardsProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
  content?: TextContent[];
}

const FloatingCards = ({ autoplay = true, pauseOnHover = true, content: propContent }: FloatingCardsProps) => {
  const content = (propContent && propContent.length > 0) ? propContent : DEFAULT_CONTENT;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoplay || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % content.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoplay, isHovered, content.length]);

  return (
    <div className="relative w-full h-[150px] overflow-hidden  rounded-2xl">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onMouseEnter={() => pauseOnHover && setIsHovered(true)}
            onMouseLeave={() => pauseOnHover && setIsHovered(false)}
            className=" w-4/5"
          >
            <div className=" backdrop-blur-sm rounded-xl   border border-white/20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center space-y-2"
              >
                <div>
                  <h3 className="text font-bold text-gray-900 mb-3">
                    {content[currentIndex].title}
                  </h3>
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium px-4 py-1 rounded-full">
                    {content[currentIndex].subtitle}
                  </span>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="text-gray-700 leading-relaxed text-xs"
                >
                  {content[currentIndex].description}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {content.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FloatingCards;
