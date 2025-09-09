import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Fixed Header */}
      <Header onToggleSidebar={toggleSidebar} />
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-label="Close sidebar overlay"
        />
      )}
      
      {/* Main Layout Container */}
      <div className="flex h-screen pt-16">
        {/* Fixed Sidebar */}
        <div className={`
          fixed left-0 top-16 bottom-0 z-50 lg:static lg:top-auto lg:bottom-auto lg:z-auto
          w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200
          h-full flex flex-col
        `}>
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto lg:ml-0">
          <div className="min-h-full">
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
