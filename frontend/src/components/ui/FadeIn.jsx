"use client";

import { motion } from "framer-motion";

export function FadeIn({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 6 }} // Escala muy sutil y desplazamiento mínimo
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.22, 1, 0.36, 1] // Curva "easeOutQuart": arranca suave y frena con total delicadeza
      }}
      className={`w-full flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}