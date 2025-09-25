'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MobileNavProps {
  onSettingsClick: () => void;
  showNewChat?: boolean;
  currentPage: 'chat' | 'history';
}

export default function MobileNav({ onSettingsClick, showNewChat = false, currentPage }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 swo-shadow sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Image
                src="/logo_swo.png"
                alt="SoftwareOne"
                width={32}
                height={32}
                className="object-contain"
              />
              <div className="h-6 w-px bg-gray-300"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-black truncate">
                {currentPage === 'chat' ? 'AI Growth Analyst' : 'Chat History'}
              </h1>
              <p className="text-xs text-gray-600 truncate">by SoftwareOne</p>
            </div>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Desktop Header - Hidden on Mobile */}
      <header className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4 swo-shadow">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo_swo.png"
                alt="SoftwareOne"
                width={40}
                height={40}
                className="object-contain"
              />
              <div className="h-8 w-px bg-gray-300"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">
                {currentPage === 'chat' ? 'AI-Powered Growth Analyst' : 'Chat History'}
              </h1>
              <p className="text-sm text-gray-600">
                {currentPage === 'chat' ? 'by SoftwareOne' : 'AI-Powered Growth Analyst by SoftwareOne'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {showNewChat && (
              <a
                href="/chat"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 hover:border-gray-300 swo-shadow hover:swo-shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>New Chat</span>
              </a>
            )}
            <a
              href={currentPage === 'chat' ? '/history' : '/chat'}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 hover:border-gray-300 swo-shadow hover:swo-shadow-md"
            >
              {currentPage === 'chat' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>History</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  <span>New Chat</span>
                </>
              )}
            </a>
            <button
              onClick={onSettingsClick}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 hover:border-gray-300 swo-shadow hover:swo-shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeMenu}
          ></div>

          {/* Menu panel */}
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform">
            {/* Menu header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-black">Menu</h3>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu items */}
            <div className="p-4 space-y-3">
              {showNewChat && (
                <a
                  href="/chat"
                  onClick={closeMenu}
                  className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <span className="font-medium">New Chat</span>
                </a>
              )}

              <a
                href={currentPage === 'chat' ? '/history' : '/chat'}
                onClick={closeMenu}
                className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
              >
                {currentPage === 'chat' ? (
                  <>
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="font-medium">Chat History</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <span className="font-medium">New Chat</span>
                  </>
                )}
              </a>

              <button
                onClick={() => {
                  onSettingsClick();
                  closeMenu();
                }}
                className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.5 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
