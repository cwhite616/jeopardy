import { MenuItem } from './menu-config'
import { motion } from 'framer-motion'

interface MenuItemsProps {
  items: MenuItem[]
  onClose: () => void
}

export function MenuItems({ items, onClose }: MenuItemsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-48 bg-blue-900 rounded-md shadow-lg py-1 z-10"
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            item.action()
            onClose()
          }}
          className="block px-4 py-2 text-sm text-yellow-300 hover:bg-blue-800 w-full text-left"
        >
          {item.label}
        </button>
      ))}
    </motion.div>
  )
} 