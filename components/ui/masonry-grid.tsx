import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const DEFAULT_CONTENT = [
  {
    title: "What is YTP?",
    subtitle: "Y-Axis Talent Pool",
    description: "YTP (Y-Axis Talent Pool) is a platform that builds globally standardized, verified candidate profiles for jobs, study, and migration. It helps candidates showcase skills, visa readiness, and availability clearly, making them discoverable and competitive worldwide.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "What is GIS?",
    subtitle: "Global Indian Score",
    description: "GIS (Global Indian Score) is a 0–100 score that measures a candidate's likelihood of succeeding abroad based on skills, education, visa, and readiness. It gives candidates a clear benchmark of their global readiness and highlights actions to improve chances of success.",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "What is ATS?",
    subtitle: "Applicant Tracking System",
    description: "ATS (Applicant Tracking System) is software recruiters use to scan, filter, and rank resumes before human review. It saves recruiters time, ensures fair shortlisting, and helps candidates with optimized profiles get noticed.",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Why do I need a professional resume?",
    subtitle: "ATS Optimization",
    description: "Professional resumes are ATS-optimized with proper formatting, keywords, and structure. They increase your chances of passing initial screening by 3x and help you stand out in a competitive job market.",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "How does visa status affect my opportunities?",
    subtitle: "Immigration Readiness",
    description: "Your visa status significantly impacts job opportunities. Work visas require employer sponsorship, while PR/citizenship status opens up more positions. Understanding your immigration pathway is crucial for career planning.",
    color: "from-indigo-500 to-purple-500"
  },
  {
    title: "What makes a candidate globally competitive?",
    subtitle: "Global Readiness",
    description: "Global competitiveness combines technical skills, cultural adaptability, language proficiency, and market-relevant experience. Our assessment helps identify gaps and provides a roadmap for improvement.",
    color: "from-teal-500 to-cyan-500"
  }
];

interface TextContent {
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

interface MasonryGridProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
  content?: TextContent[];
}

const MasonryGrid = ({ autoplay = true, pauseOnHover = true, content: propContent }: MasonryGridProps) => {
  const content = (propContent && propContent.length > 0) ? propContent : DEFAULT_CONTENT;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
              transition: { duration: 0.3 }
            }}
            onHoverStart={() => pauseOnHover && setHoveredIndex(index)}
            onHoverEnd={() => pauseOnHover && setHoveredIndex(null)}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
              index === 0 || index === 3 ? 'md:col-span-1' : ''
            } ${index === 1 ? 'md:row-span-2' : ''}`}
            style={{
              height: index === 1 ? '400px' : '200px'
            }}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90`} />
            
            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 bg-black/20"
              animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
              <div>
                <motion.h3 
                  className="text-xl font-bold mb-3"
                  animate={{ 
                    scale: hoveredIndex === index ? 1.1 : 1,
                    transition: { duration: 0.3 }
                  }}
                >
                  {item.title}
                </motion.h3>
                
                <span className="inline-block bg-white/20 backdrop-blur-sm text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {item.subtitle}
                </span>
              </div>
              
              <motion.p 
                className="text-sm leading-relaxed opacity-90"
                animate={{ 
                  opacity: hoveredIndex === index ? 1 : 0.9,
                  y: hoveredIndex === index ? -5 : 0,
                  transition: { duration: 0.3 }
                }}
              >
                {item.description}
              </motion.p>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`,
                  }}
                />
              ))}
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: hoveredIndex === index ? '100%' : '-100%' }}
              transition={{ duration: 0.6, delay: hoveredIndex === index ? 0.2 : 0 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGrid;
