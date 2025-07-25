import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = false, onClick, ...props }) => {
  const Component = onClick ? motion.div : 'div'
  
  return (
<Component
      className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
      whileHover={hover ? { scale: 1.01, y: -2 } : {}}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card