"use client";

import { motion } from "framer-motion";

export function FadeIn({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 10 }} // Empezamos un poquito más abajo y transparente
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.45,       // Un poco más largo para que sea más suave
        delay: 0.1,          // La mini pausa antes de entrar (ideal para armonizar con el loading)
        ease: [0.22, 1, 0.36, 1] // Curva elegante "easeOutQuart"
      }}
      className={`w-full flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}