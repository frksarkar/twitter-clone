import { useEffect, useState } from 'react';
import { User, Heart, Repeat, MessageCircle, Reply } from 'lucide-react';
import { Notification } from '../types/tweet';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../stores/useNotificationStore';
import { authApi } from '../api';

const NotificationsPage = () => {
	const [activeTab, setActiveTab] = useState<'all' | 'mentions'>('all');
	const [notificationUrls, setNotificationUrls] = useState<{ [key: string]: string }>({});
	const { notifications, setNotifications } = useNotificationStore();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchNotifications = async () => {
			const response = await authApi.get<{ status: string; notifications: Notification[] }>('/notifications/all');
			if (response.data.status !== 'success') return;

			const urls: { [key: string]: string } = {};
			for (const notification of filteredNotifications) {
				if (notification.type === 'reply') {
					try {
						const response = await authApi.get(`/api/replies/${notification.targetId}`);
						urls[notification._id] = `/tweet/${response.data.data.parentTweetId}`;
					} catch (error) {
						console.error('Error fetching reply URL:', error);
						urls[notification._id] = '/'; // Fallback URL
					}
				}
			}

			setNotificationUrls(urls);
			setNotifications(response.data.notifications);
		};

		fetchNotifications();
	}, [activeTab]);

	const markNotificationAsRead = async (notificationId: string, redirectUrl: string) => {
		try {
			// check if notification is already opened
			const isNotificationOpened = notifications.some((n) => n._id === notificationId && n.opened);
			if (!isNotificationOpened) {
				const response = await authApi.put(`/notifications/${notificationId}`);

				if (response.data.status !== 'success') return;

				const updatedNotifications = notifications.map((notification) => (notification._id === notificationId ? { ...notification, opened: true } : notification));

				setNotifications(updatedNotifications);
			}

			navigate(redirectUrl);
		} catch (error) {
			console.error('Error marking notification as read:', error);
		}
	};

	// Filter notifications based on active tab
	const filteredNotifications = activeTab === 'all' ? notifications : notifications.filter((notification) => notification.type === 'mention');

	return (
		<div className="min-h-screen animate-enter">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-800">
				<h1 className="font-bold text-xl p-4">Notifications</h1>

				{/* Tabs */}
				<div className="flex">
					<button
						onClick={() => setActiveTab('all')}
						className={`flex-1 py-4 text-center font-medium relative ${activeTab === 'all' ? 'font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}
					>
						All
						{activeTab === 'all' && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />}
					</button>
					<button
						onClick={() => setActiveTab('mentions')}
						className={`flex-1 py-4 text-center font-medium relative ${
							activeTab === 'mentions' ? 'font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'
						}`}
					>
						Mentions
						{activeTab === 'mentions' && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />}
					</button>
				</div>
			</header>

			{/* Notification List */}
			<div>
				{notifications.length === 0 ? (
					<p className="text-center text-text-secondary-light dark:text-text-secondary-dark">No notifications</p>
				) : (
					filteredNotifications.map((notification) => {
						let url = '';
						if (notification.type === 'follow') {
							url = `/profile/${notification.targetId}`;
						} else if (notification.type === 'message') {
							url = `/api/chat/${notification.targetId}`;
						} else if (notification.type === 'reply') {
							url = notificationUrls[notification._id];
						} else if (notification.type === 'like' || notification.type === 'retweet') {
							url = `/tweet/${notification.targetId}`;
						} else {
							url = `/post/${notification.targetId}`;
						}

						return (
							<div
								key={notification._id}
								onClick={() => markNotificationAsRead(notification._id, url)}
								className={`flex p-4 border-b ${
									notification.opened ? '' : 'bg-primary-50/30 dark:bg-primary-900/50'
								} border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-900/50 transition-colors cursor-pointer`}
							>
								{/* Notification Type Icon */}
								<div className="mr-3 text-primary-500">
									{notification.type === 'like' && <Heart size={24} className="text-error-500" />}
									{notification.type === 'retweet' && <Repeat size={24} className="text-success-500" />}
									{notification.type === 'follow' && <User size={24} />}
									{notification.type === 'mention' || (notification.type === 'message' && <MessageCircle size={24} />)}
									{notification.type === 'reply' && <Reply size={24} />}
								</div>

								{/* Notification Content */}
								<div className="flex-1">
									<div className="flex items-start">
										<img src={notification.userFrom.avatar} alt={notification.userFrom.name} className="w-10 h-10 rounded-full object-cover mr-3" />
										<div>
											<div className="flex flex-wrap items-baseline">
												<span className="font-bold mr-1 hover:underline">{notification.userFrom.name}</span>
												<span className="text-text-secondary-light dark:text-text-secondary-dark mr-1">@{notification.userFrom.username}</span>
												<span className="text-text-secondary-light dark:text-text-secondary-dark text-sm">· {notification.updatedAt}</span>
											</div>
											<p>{notification.content}</p>
											{notification.text && <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">{notification.text}</p>}
										</div>
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default NotificationsPage;
