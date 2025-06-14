"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
  direction?: "left" | "right"
}

export function PageTransition({ children, direction = "right" }: PageTransitionProps) {
  return (
    <motion.div
      initial={{
        x: direction === "right" ? 20 : -20,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      exit={{
        x: direction === "right" ? -20 : 20,
        opacity: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}
