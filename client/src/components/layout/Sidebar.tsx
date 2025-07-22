import { NavLink, Link } from 'react-router-dom';
import { Home, Search, Bell, Mail, Bookmark, User, Settings, LogOut, MoreHorizontal, Twitter } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';
import useNotificationStore from '../../stores/useNotificationStore';

const Sidebar = () => {
	const { toggleTheme } = useTheme();
	const { user, logout } = useAuth();
	const { notificationCount, messageCount } = useNotificationStore();

	const navItems = [
		{ to: '/', icon: Home, label: 'Home' },
		{ to: '/explore', icon: Search, label: 'Explore' },
		{ to: '/notifications', icon: Bell, label: 'Notifications', badge: notificationCount },
		{ to: '/messages', icon: Mail, label: 'Messages', badge: messageCount },
		{ to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
		{ to: `/profile/${user?.username}`, icon: User, label: 'Profile' },
	];

	return (
		<div className="flex flex-col h-full p-2 lg:p-4 justify-between">
			<div className="space-y-2 lg:space-y-4">
				{/* Logo */}
				<div className="p-2 lg:p-3 flex items-center justify-center lg:justify-start">
					<Link
						to="/"
						className="text-primary-500 hover:bg-primary-50 dark:hover:bg-secondary-800 p-2 rounded-full transition-colors"
					>
						<Twitter size={28} className="lg:mr-4" />
					</Link>
				</div>

				{/* Navigation */}
				<nav className="space-y-1">
					{navItems.map((item) => (
						<NavLink
							key={item.label}
							to={item.to}
							className={({ isActive }) =>
								cn(
									'flex items-center justify-center lg:justify-start p-3 rounded-full transition-colors',
									'text-text-primary-light dark:text-text-primary-dark hover:bg-secondary-50 dark:hover:bg-secondary-800',
									isActive && 'font-bold'
								)
							}
						>
							<div className="flex items-center justify-center lg:justify-start relative">
								<item.icon size={24} className="lg:mr-4 " />
								{/* notification badge */}
								{item.badge! > 0 && (
									<span className="notification-badge  absolute left-3 bottom-2 inline-flex items-center justify-center w-3 h-3 p-3 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full lg:mr-4">
										{item.badge}
									</span>
								)}
							</div>
							<span className="hidden lg:block">{item.label}</span>
						</NavLink>
					))}
				</nav>

				{/* Tweet Button */}
				<div className="mt-4">
					<button className="w-full bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 font-bold transition-colors">
						<span className="hidden lg:block">Tweet</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="lg:hidden h-6 w-6 mx-auto"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
					</button>
				</div>
			</div>

			{/* User Profile & Settings */}
			<div className="mt-auto">
				<button
					onClick={toggleTheme}
					className="w-full flex items-center justify-center lg:justify-start p-3 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors mb-2"
				>
					<Settings size={24} className="lg:mr-4" />
					<span className="hidden lg:block">Toggle Theme</span>
				</button>

				<button
					onClick={logout}
					className="w-full flex items-center justify-center lg:justify-start p-3 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors mb-2"
				>
					<LogOut size={24} className="lg:mr-4" />
					<span className="hidden lg:block">Sign out</span>
				</button>

				{/* Clickable Profile Section */}
				<Link
					to={`/profile/${user?.username}`}
					className="flex items-center p-3 mt-2 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer transition-colors group"
				>
					<img src={user?.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover lg:mr-3" />
					<div className="hidden lg:block flex-1">
						<p className="font-bold text-sm">{user?.name}</p>
						<p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
							@{user?.username}
						</p>
					</div>
					<MoreHorizontal
						size={20}
						className="hidden lg:block ml-auto text-text-secondary-light dark:text-text-secondary-dark group-hover:text-text-primary-light dark:group-hover:text-text-primary-dark transition-colors"
					/>
				</Link>
			</div>
		</div>
	);
};

export default Sidebar;
