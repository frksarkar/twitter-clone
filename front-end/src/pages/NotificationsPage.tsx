import { useState } from 'react';
import { User, Heart, Repeat, MessageCircle } from 'lucide-react';

// Mock notification data
const notificationData = [
	{
		id: '1',
		type: 'like',
		user: {
			name: 'Jane Smith',
			username: 'janesmith',
			avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60',
		},
		content: 'liked your Tweet',
		tweetPreview: 'Just got my hands on the new MacBook Pro with the M3 chip...',
		time: '2h',
	},
	{
		id: '2',
		type: 'retweet',
		user: {
			name: 'Alex Johnson',
			username: 'alexj',
			avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
		},
		content: 'retweeted your Tweet',
		tweetPreview: 'The sunrise this morning was absolutely breathtaking...',
		time: '5h',
	},
	{
		id: '3',
		type: 'follow',
		user: {
			name: 'Sarah Wilson',
			username: 'sarahw',
			avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=60',
		},
		content: 'followed you',
		time: '1d',
	},
	{
		id: '4',
		type: 'mention',
		user: {
			name: 'Tech News',
			username: 'technews',
			avatar: 'https://images.pexels.com/photos/207580/pexels-photo-207580.jpeg?auto=compress&cs=tinysrgb&w=60',
		},
		content: 'mentioned you in a Tweet',
		tweetPreview: '@johndoe What do you think about the new AI features in iOS 19?',
		time: '2d',
	},
	{
		id: '5',
		type: 'reply',
		user: {
			name: 'John Smith',
			username: 'johnsmith',
			avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=60',
		},
		content: 'replied to your Tweet',
		tweetPreview: 'I completely agree! The performance improvements are incredible.',
		time: '3d',
	},
];

const NotificationsPage = () => {
	const [activeTab, setActiveTab] = useState<'all' | 'mentions'>('all');

	// Filter notifications based on active tab
	const filteredNotifications =
		activeTab === 'all'
			? notificationData
			: notificationData.filter((notification) => notification.type === 'mention');

	return (
		<div className="min-h-screen animate-enter">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-800">
				<h1 className="font-bold text-xl p-4">Notifications</h1>

				{/* Tabs */}
				<div className="flex">
					<button
						onClick={() => setActiveTab('all')}
						className={`flex-1 py-4 text-center font-medium relative ${
							activeTab === 'all'
								? 'font-bold'
								: 'text-text-secondary-light dark:text-text-secondary-dark'
						}`}
					>
						All
						{activeTab === 'all' && (
							<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />
						)}
					</button>
					<button
						onClick={() => setActiveTab('mentions')}
						className={`flex-1 py-4 text-center font-medium relative ${
							activeTab === 'mentions'
								? 'font-bold'
								: 'text-text-secondary-light dark:text-text-secondary-dark'
						}`}
					>
						Mentions
						{activeTab === 'mentions' && (
							<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />
						)}
					</button>
				</div>
			</header>

			{/* Notification List */}
			<div>
				{filteredNotifications.map((notification) => (
					<div
						key={notification.id}
						className="flex p-4 border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-900/50 transition-colors cursor-pointer"
					>
						{/* Notification Type Icon */}
						<div className="mr-3 text-primary-500">
							{notification.type === 'like' && <Heart size={24} className="text-error-500" />}
							{notification.type === 'retweet' && <Repeat size={24} className="text-success-500" />}
							{notification.type === 'follow' && <User size={24} />}
							{notification.type === 'mention' ||
								(notification.type === 'reply' && <MessageCircle size={24} />)}
						</div>

						{/* Notification Content */}
						<div className="flex-1">
							<div className="flex items-start">
								<img
									src={notification.user.avatar}
									alt={notification.user.name}
									className="w-10 h-10 rounded-full object-cover mr-3"
								/>
								<div>
									<div className="flex flex-wrap items-baseline">
										<span className="font-bold mr-1 hover:underline">{notification.user.name}</span>
										<span className="text-text-secondary-light dark:text-text-secondary-dark mr-1">
											@{notification.user.username}
										</span>
										<span className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
											· {notification.time}
										</span>
									</div>
									<p>{notification.content}</p>
									{notification.tweetPreview && (
										<p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
											{notification.tweetPreview}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default NotificationsPage;
