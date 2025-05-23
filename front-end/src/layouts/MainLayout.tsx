import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import RightSidebar from '../components/layout/RightSidebar';
import MobileNavbar from '../components/layout/MobileNavbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex md:w-[88px] lg:w-[275px] h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-h-screen border-x border-secondary-100 dark:border-secondary-800 max-w-[600px] w-full mx-auto">
        <Outlet />
      </main>

      {/* Right Sidebar - Hidden on mobile and small tablets */}
      <div className="hidden lg:block lg:w-[350px] h-screen sticky top-0">
        <RightSidebar />
      </div>

      {/* Mobile Navigation - Visible only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-secondary-100 dark:border-secondary-800 bg-background-light dark:bg-background-dark z-10">
        <MobileNavbar />
      </div>
    </div>
  );
};

export default MainLayout;