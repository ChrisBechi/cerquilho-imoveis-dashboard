import { motion } from "framer-motion"

import { type ReactNode, forwardRef } from "react"

const MotionDiv = motion.div

interface Props {
  children: ReactNode

  delay?: number
}

const FadeIn = forwardRef<HTMLDivElement, Props>(
  ({ children, delay = 0 }, ref) => {
    return (
      <MotionDiv
        ref={ref}
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
)

FadeIn.displayName = "FadeIn"

export default FadeIn
