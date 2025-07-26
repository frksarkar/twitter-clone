import { create } from 'zustand';
import { Notification } from '../types/tweet';

interface NotificationStore {
	notifications: Notification[];
	notificationCount: number;
	messageCount: number;
	setNotifications: (notifications: Notification[]) => void;
	setNotification: (notification: Notification) => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
	notificationCount: 0,
	messageCount: 0,
	notifications: [],
	setNotifications: (notifications) => {
		set({ notifications });
		const notificationCount = notifications.filter((notification) => !notification.opened).length;
		const messageCount = notifications.filter(
			(notification) => !notification.opened && notification.type === 'message'
		).length;
		set({ notificationCount, messageCount });
	},

	// setNotifications: (notifications) => set({ notifications }),
	setNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
}));

export default useNotificationStore;
