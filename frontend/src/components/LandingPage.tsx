import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <motion.div 
        style={{ opacity, scale }}
        className="h-screen flex flex-col items-center justify-center px-4"
      >
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-center mb-6"
        >
          Tokenize the Future of
          <span className="text-blue-500"> Physical Infrastructure</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 text-center max-w-2xl"
        >
          DobLink brings the power of DePIN revenue tokens to your platform with a simple, embeddable payment processor.
        </motion.p>
      </motion.div>

      {/* Value Proposition Sections */}
      <div className="max-w-6xl mx-auto px-4 py-20 space-y-32">
        {/* Section 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Seamless Integration</h2>
            <p className="text-gray-400 text-lg">
              Embed our payment processor with just a few lines of code. No complex setup required.
            </p>
          </div>
          <div className="flex-1 bg-gray-800 rounded-lg p-8 shadow-xl">
            <div className="aspect-video bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </motion.div>

        {/* Section 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row-reverse items-center gap-12"
        >
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Future Revenue, Today</h2>
            <p className="text-gray-400 text-lg">
              Enable your users to invest in the future revenue of physical infrastructure projects through tokenized assets.
            </p>
          </div>
          <div className="flex-1 bg-gray-800 rounded-lg p-8 shadow-xl">
            <div className="aspect-video bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </motion.div>

        {/* Section 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Web3 Native</h2>
            <p className="text-gray-400 text-lg">
              Built for the decentralized future. Connect with any Web3 wallet and start trading DePIN revenue tokens instantly.
            </p>
          </div>
          <div className="flex-1 bg-gray-800 rounded-lg p-8 shadow-xl">
            <div className="aspect-video bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 text-center"
      >
        <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Platform?</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
          Get Started
        </button>
      </motion.div>
    </div>
  );
};

export default LandingPage; 