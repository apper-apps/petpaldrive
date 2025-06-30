import { motion } from 'framer-motion'

const Loading = ({ type = 'cards', count = 3 }) => {
  const SkeletonCard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-surface rounded-xl p-6 shadow-lg"
    >
      <div className="animate-pulse space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
        </div>
      </div>
    </motion.div>
  )

  const SkeletonStats = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-surface rounded-xl p-6 shadow-lg"
    >
      <div className="animate-pulse flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
      </div>
    </motion.div>
  )

  const SkeletonList = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-surface rounded-xl p-4 shadow-lg"
    >
      <div className="animate-pulse flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
        </div>
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
      </div>
    </motion.div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'stats':
        return <SkeletonStats />
      case 'list':
        return <SkeletonList />
      default:
        return <SkeletonCard />
    }
  }

  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  )
}

export default Loading