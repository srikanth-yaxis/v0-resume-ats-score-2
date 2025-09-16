import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

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

interface TypewriterCardsProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
  content?: TextContent[];
}

const TypewriterCards = ({ autoplay = true, pauseOnHover = true, content: propContent }: TypewriterCardsProps) => {
  const content = (propContent && propContent.length > 0) ? propContent : DEFAULT_CONTENT;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoplay || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % content.length);
      setDisplayedText('');
      setIsTyping(true);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoplay, isHovered, content.length]);

  useEffect(() => {
    if (!isTyping) return;

    const currentText = content[currentIndex].description;
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < currentText.length) {
        setDisplayedText(currentText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [currentIndex, isTyping, content]);

  return (
    <div className="relative w-full h-[150px]  rounded-2xl overflow-hidden">
      {/* Animated background */}
      
      <div className="relative z-10 flex items-center justify-center h-full p-2">
        <div 
          className="w-5/6"
          onMouseEnter={() => pauseOnHover && setIsHovered(true)}
          onMouseLeave={() => pauseOnHover && setIsHovered(false)}
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className=" backdrop-blur-sm rounded-xl p-4"
          >
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-xl font-bold  mb-4 flex items-center gap-3"
            >
              <p>{content[currentIndex].title} </p>
              <span className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                {content[currentIndex].subtitle}
              </span>
            </motion.h3>
            
            

            <div className="">
              <p className="text-gray-900 text-sm leading-relaxed">
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-cyan-400"
                  >
                    |
                  </motion.span>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress indicator */}
      
    </div>
  );
};

export default TypewriterCards;
