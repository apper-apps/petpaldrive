import ApperIcon from '@/components/ApperIcon'

const Badge = ({ children, variant = 'default', icon, className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-success bg-opacity-10 text-success',
    warning: 'bg-warning bg-opacity-10 text-warning',
    error: 'bg-error bg-opacity-10 text-error',
    info: 'bg-info bg-opacity-10 text-info',
    primary: 'bg-primary bg-opacity-10 text-primary'
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {icon && <ApperIcon name={icon} size={14} className="mr-1" />}
      {children}
    </span>
  )
}

export default Badge