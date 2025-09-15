import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_CONTENT = [
  {
    title: "What is YTP?",
    subtitle: "Y-Axis Talent Pool",
    description: "YTP (Y-Axis Talent Pool) is a platform that builds globally standardized, verified candidate profiles for jobs, study, and migration. It helps candidates showcase skills, visa readiness, and availability clearly, making them discoverable and competitive worldwide.",
    icon: "🏢"
  },
  {
    title: "What is GIS?",
    subtitle: "Global Indian Score",
    description: "GIS (Global Indian Score) is a 0–100 score that measures a candidate's likelihood of succeeding abroad based on skills, education, visa, and readiness. It gives candidates a clear benchmark of their global readiness and highlights actions to improve chances of success.",
    icon: "📊"
  },
  {
    title: "What is ATS?",
    subtitle: "Applicant Tracking System",
    description: "ATS (Applicant Tracking System) is software recruiters use to scan, filter, and rank resumes before human review. It saves recruiters time, ensures fair shortlisting, and helps candidates with optimized profiles get noticed.",
    icon: "🔍"
  },
  {
    title: "Why do I need a professional resume?",
    subtitle: "ATS Optimization",
    description: "Professional resumes are ATS-optimized with proper formatting, keywords, and structure. They increase your chances of passing initial screening by 3x and help you stand out in a competitive job market.",
    icon: "📝"
  },
  {
    title: "How does visa status affect my opportunities?",
    subtitle: "Immigration Readiness",
    description: "Your visa status significantly impacts job opportunities. Work visas require employer sponsorship, while PR/citizenship status opens up more positions. Understanding your immigration pathway is crucial for career planning.",
    icon: "✈️"
  },
  {
    title: "What makes a candidate globally competitive?",
    subtitle: "Global Readiness",
    description: "Global competitiveness combines technical skills, cultural adaptability, language proficiency, and market-relevant experience. Our assessment helps identify gaps and provides a roadmap for improvement.",
    icon: "🌍"
  }
];

interface TextContent {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

interface FlipCarouselProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
  content?: TextContent[];
}

const FlipCarousel = ({ autoplay = true, pauseOnHover = true, content: propContent }: FlipCarouselProps) => {
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
    <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full p-8">
        <div 
          className="w-full max-w-4xl"
          onMouseEnter={() => pauseOnHover && setIsHovered(true)}
          onMouseLeave={() => pauseOnHover && setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="perspective-1000"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center space-x-8">
                  {/* Icon section */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                      {content[currentIndex].icon}
                    </div>
                  </motion.div>

                  {/* Content section */}
                  <div className="flex-1">
                    <motion.h3
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-3xl font-bold text-white mb-4"
                    >
                      {content[currentIndex].title}
                    </motion.h3>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="mb-6"
                    >
                      <span className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-sm font-bold px-4 py-2 rounded-full">
                        {content[currentIndex].subtitle}
                      </span>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-gray-300 text-lg leading-relaxed"
                    >
                      {content[currentIndex].description}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {content.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-cyan-400 w-8' : 'bg-white/30'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + i * 15}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FlipCarousel;
