"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function FadeIn({ children }) {

  const pathname = usePathname();

  return (
    <motion.div
      key={pathname} 
      initial={{ opacity: 0, scale: 0.985, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.985, y: -8 }}
      transition={{ 
        duration: 0.4,           
        delay: 0.12,             
        ease: [0.25, 1, 0.5, 1]  
      }}
      className="w-full flex flex-col"
    >
      {children}
    </motion.div>
  );
}