import { NavLink } from 'react-router-dom';
import { Home, Search, Bell, Mail } from 'lucide-react';
import { cn } from '../../utils/cn';

const MobileNavbar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Search, label: 'Explore' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/messages', icon: Mail, label: 'Messages' },
  ];

  return (
    <nav className="flex justify-around py-3">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center",
            "text-text-secondary-light dark:text-text-secondary-dark",
            isActive && "text-primary-500"
          )}
        >
          <item.icon size={24} />
          <span className="text-xs mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNavbar;