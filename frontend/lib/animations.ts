import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export const titleVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } 
  }
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } 
  }
};

export const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

export const eagleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  show: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: { 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1],
      delay: 0.4 
    }
  },
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
