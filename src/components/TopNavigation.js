import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Wallet } from 'lucide-react';

const TopNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Assume these are your navigation items
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Trades', path: '/trades' },
    { name: 'Statistics', path: '/statistics' },
    { name: 'Journal', path: '/journal' },
    { name: 'Settings', path: '/settings' },
  ];
  
  // Optional: dropdown items for user profile or additional features
  const dropdownItems = [
    { name: 'Profile', path: '/profile' },
    { name: 'Logout', path: '/logout' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo and brand - remove padding to move leftmost */}
          <div className="flex-shrink-0 pl-4">
            <Link to="/" className="flex items-center space-x-2">
              <Wallet className="h-6 w-6 text-white" />
              <h1 className="text-xl font-bold">Trading Journal</h1>
            </Link>
          </div>
            
          {/* Desktop menu - Directly after the title */}
          <div className="hidden md:block ml-6">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Spacer to push user dropdown to the right */}
          <div className="flex-grow"></div>
          
          {/* User dropdown - At the far right */}
          <div className="hidden md:block pr-4">
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
              >
                <span>User</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-10">
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden ml-auto pr-4">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile dropdown items */}
            <div className="mt-3 pt-3 border-t border-gray-700">
              {dropdownItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavigation;