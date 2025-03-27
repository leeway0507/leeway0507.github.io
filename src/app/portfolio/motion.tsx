"use client";

import { motion } from "framer-motion";

export default function Transition({
  children,
  delay = 0,
  ...props
}: React.ComponentProps<typeof motion.div> & { delay?: number }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
