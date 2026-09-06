import { motion } from "framer-motion";

/**
 * ShinyText – animates a left-to-right light sweep over text using a
 * gradient background-clip trick.
 *
 * @param {string}  text        - Text to render
 * @param {number}  speed       - Seconds for one full sweep (default 3)
 * @param {number}  spread      - Gradient angle in degrees (default 100)
 * @param {string}  baseColor   - Base/edge colour of the gradient
 * @param {string}  shineColor  - Centre highlight colour
 * @param {string}  className   - Extra Tailwind / CSS classes
 */
export default function ShinyText({
  text,
  speed = 3,
  spread = 100,
  baseColor = "#64CEFB",
  shineColor = "#ffffff",
  className = "",
}) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${baseColor} 40%, ${shineColor} 50%, ${baseColor} 60%)`,
        backgroundSize: "200% 100%",
        backgroundRepeat: "no-repeat",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
      animate={{ backgroundPosition: ["100% 0%", "0% 0%"] }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {text}
    </motion.span>
  );
}
