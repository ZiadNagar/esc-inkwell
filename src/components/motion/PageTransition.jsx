import { motion } from "framer-motion";
const MotionDiv = motion.div;

export const PageTransition = ({ children }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="will-change-transform"
    >
      {children}
    </MotionDiv>
  );
};
