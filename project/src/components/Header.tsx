
import { Eye, Info, Home } from 'lucide-react';

interface HeaderProps {
  currentPage: 'home' | 'results' | 'about';
  onPageChange: (page: 'home' | 'results' | 'about') => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Eye className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">NutriVision AI</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => onPageChange('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'home'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </button>
            <button
              onClick={() => onPageChange('about')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'about'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Info className="h-4 w-4" />
              <span>Sobre el Proyecto</span>
            </button>
          </nav>

          <div className="md:hidden">
            <button className="text-white/80 hover:text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}