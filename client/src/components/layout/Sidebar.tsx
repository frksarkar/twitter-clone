import { NavLink, Link } from 'react-router-dom';
import { Home, Search, Bell, Mail, Bookmark, User, Settings, MoreHorizontal, Twitter } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';

const Sidebar = () => {
	const { toggleTheme } = useTheme();

	const navItems = [
		{ to: '/', icon: Home, label: 'Home' },
		{ to: '/explore', icon: Search, label: 'Explore' },
		{ to: '/notifications', icon: Bell, label: 'Notifications' },
		{ to: '/messages', icon: Mail, label: 'Messages' },
		{ to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
		{ to: '/profile/johndoe', icon: User, label: 'Profile' },
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
							<item.icon size={24} className="lg:mr-4" />
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
					className="w-full flex items-center justify-center lg:justify-start p-3 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
				>
					<Settings size={24} className="lg:mr-4" />
					<span className="hidden lg:block">Toggle Theme</span>
				</button>

				<div className="flex items-center p-3 mt-2 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer transition-colors">
					<img
						src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60"
						alt="Profile"
						className="w-10 h-10 rounded-full object-cover lg:mr-3"
					/>
					<div className="hidden lg:block">
						<p className="font-bold text-sm">John Doe</p>
						<p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">@johndoe</p>
					</div>
					<MoreHorizontal
						size={20}
						className="hidden lg:block ml-auto text-text-secondary-light dark:text-text-secondary-dark"
					/>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
