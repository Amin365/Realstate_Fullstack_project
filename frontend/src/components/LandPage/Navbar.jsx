import { HomeIcon, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux"
import MainHeader from '../Header'

const menuItems = [
  { name: 'Features', href: '#features' },
  { name: 'Solution', href: '#solution' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
]

export const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // get token + user from redux
  const { token, user } = useSelector((state) => state.auth)

  return (
    <header>
      <nav
        data-state={menuState ? 'active' : undefined}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled &&
              'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5'
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Logo + Mobile Menu Button */}

            {
              token?(
                 <div className="flex items-center gap-3">
                  {/* Username */}
                 

                  
                  <div className=''>
                  <MainHeader/>
                  </div>
                    <Button
                    size="sm"
                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}
                    asChild
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                </div>
              ):
               <div className="flex w-full justify-between lg:w-auto">
              <div className="space-x-3 flex items-center">
                <Link to="/" aria-label="home" className="flex items-center text-gray-500 space-x-2">
                  <HomeIcon />
                </Link>
                <h1>Waansan RealState</h1>
              </div>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            }


           
            {/* Desktop Menu */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Section */}
            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">

              {/* Mobile Menu Links */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Auth Section */}
              {token ? (
                <div className="flex items-center gap-3">
                  {/* Username */}
                 

                  
                  <div className=''>
                  <MainHeader/>
                  </div>
                    <Button
                    size="sm"
                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}
                    asChild
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  {/* Login Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(isScrolled && 'lg:hidden')}
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>

                  {/* Sign Up Button */}
                  <Button
                    size="sm"
                    className={cn(isScrolled && 'lg:hidden')}
                    asChild
                  >
                    <Link to="/register">Sign Up</Link>
                  </Button>

                  {/* Get Started Button */}
                
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
