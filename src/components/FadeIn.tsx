import { motion } from "framer-motion"

import { type ReactNode } from "react"

const MotionDiv = motion.div

interface Props {
  children: ReactNode

  delay?: number
}

export default function FadeIn({ children, delay = 0 }: Props) {
  return (
    <MotionDiv
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.45,
        delay
      }}
    >
      {children}
    </MotionDiv>
  )
}
