'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  CheckSquare, 
  Home, 
  Menu, 
  X, 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Monitor,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './ThemeProvider'

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      active: pathname === '/'
    },
    {
      name: 'Todo List',
      href: '/todos',
      icon: CheckSquare,
      active: pathname === '/todos'
    }
  ]

  const mockUser = {
    name: 'Divy Singh',
    email: 'divy.singh@example.com',
    initials: 'DS'
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ]

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Mobile backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full bg-card border-r transition-all duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-18' : 'w-80 lg:w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CheckSquare className="h-5 w-5 text-primary-foreground" />
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <h1 className="text-lg font-bold truncate">Divy's Den</h1>
                    <p className="text-sm text-muted-foreground truncate">
                      AI Experimentation Hub
                    </p>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${item.active 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                    ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <div className="relative">
              <Button
                variant="ghost"
                className={`
                  w-full justify-start gap-3 p-3 h-auto
                  ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}
                `}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {mockUser.initials}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium truncate">{mockUser.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{mockUser.email}</div>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </>
                )}
              </Button>

              {/* User Menu Dropdown */}
              {showUserMenu && !isCollapsed && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border rounded-lg shadow-lg p-2">
                  {/* Theme Selection */}
                  <div className="px-3 py-2">
                    <div className="text-sm font-medium mb-2">Theme</div>
                    <div className="space-y-1">
                      {themeOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <Button
                            key={option.value}
                            variant={theme === option.value ? "default" : "ghost"}
                            size="sm"
                            className="w-full justify-start gap-2 text-sm"
                            onClick={() => setTheme(option.value as any)}
                          >
                            <Icon className="h-4 w-4" />
                            {option.label}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="border-t my-2" />
                  
                  {/* Settings */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-sm"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-sm text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              )}
            </div>

            {/* Collapsed toggle */}
            <div className={`mt-3 ${isCollapsed ? 'lg:flex lg:justify-center' : 'hidden lg:block'}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex"
              >
                <Menu className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Collapse</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar