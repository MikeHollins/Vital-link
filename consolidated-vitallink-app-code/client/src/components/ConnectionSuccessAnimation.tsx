import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Zap } from 'lucide-react';

interface ConnectionSuccessAnimationProps {
  isVisible: boolean;
  platformName: string;
  platformIcon?: React.ReactNode;
  onComplete?: () => void;
}

export const ConnectionSuccessAnimation: React.FC<ConnectionSuccessAnimationProps> = ({
  isVisible,
  platformName,
  platformIcon,
  onComplete
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const confettiItems = Array.from({ length: 12 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
      initial={{ 
        x: 0, 
        y: 0, 
        opacity: 1,
        scale: 0
      }}
      animate={{ 
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: [0, 1, 0],
        rotate: Math.random() * 360
      }}
      transition={{ 
        duration: 2,
        delay: i * 0.1,
        ease: "easeOut"
      }}
    />
  ));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          />

          {/* Main animation container */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm mx-4"
          >
            {/* Confetti */}
            {showConfetti && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {confettiItems}
              </div>
            )}

            {/* Success icon with pulse animation */}
            <div className="flex flex-col items-center text-center space-y-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.2
                }}
                className="relative"
              >
                {/* Platform icon background */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.7)",
                      "0 0 0 10px rgba(34, 197, 94, 0)",
                      "0 0 0 0 rgba(34, 197, 94, 0)"
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center relative"
                >
                  {platformIcon || <Zap className="h-8 w-8 text-white" />}
                  
                  {/* Checkmark overlay */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 text-white" />
                  </motion.div>
                </motion.div>

                {/* Sparkle effects */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <Sparkles className="absolute -top-2 -left-2 h-4 w-4 text-yellow-400" />
                  <Sparkles className="absolute -bottom-2 -right-2 h-3 w-3 text-blue-400" />
                  <Sparkles className="absolute top-0 -right-3 h-3 w-3 text-purple-400" />
                </motion.div>
              </motion.div>

              {/* Success text */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="space-y-2"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Successfully Connected!
                </h3>
                <motion.p
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                  className="text-green-600 dark:text-green-400 font-medium"
                >
                  {platformName} is now linked to VitalLink
                </motion.p>
              </motion.div>

              {/* Data sync indicator */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"
                />
                <span>Syncing your health data...</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};