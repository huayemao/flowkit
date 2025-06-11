import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { motion } from "framer-motion"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon?: React.ReactNode
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation()
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    const index = items.findIndex((item) => item.href === location.pathname)
    if (index !== -1) {
      setActiveIndex(index)
    }
  }, [location.pathname, items])

  return (
    <nav
      className={cn(
        "flex flex-col space-y-1 p-2",
        className
      )}
      {...props}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              "hover:bg-accent/50 hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive 
                ? "bg-accent/50 text-accent-foreground" 
                : "text-muted-foreground hover:text-accent-foreground"
            )}
            onClick={() => setActiveIndex(index)}
          >
            <div className={cn(
              "flex h-5 w-5 items-center justify-center transition-colors",
              isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
            )}>
              {item.icon}
            </div>
            <span className="flex-1">{item.title}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
} 