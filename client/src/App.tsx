import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import BookmarksPage from './pages/BookmarksPage';
import ProfilePage from './pages/ProfilePage';
import TweetPage from './pages/TweetPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';

function AppContent() {
	const { theme } = useTheme();
	const { user, isLoading } = useAuth();
	const [isAppLoaded, setIsAppLoaded] = useState(false);

	// Simulate loading state
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsAppLoaded(true);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	if (!isAppLoaded || isLoading) {
		return (
			<div className={`min-h-screen flex items-center justify-center ${theme}`}>
				<div className="animate-spin-slow">
					<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
							className="fill-primary-500"
						/>
					</svg>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className={theme}>
				<AuthPage />
			</div>
		);
	}

	return (
		<div className={theme}>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<HomePage />} />
					<Route path="explore" element={<ExplorePage />} />
					<Route path="notifications" element={<NotificationsPage />} />
					<Route path="messages" element={<MessagesPage />} />
					<Route path="bookmarks" element={<BookmarksPage />} />
					<Route path="profile/:username" element={<ProfilePage />} />
					<Route path="tweet/:id" element={<TweetPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>
		</div>
	);
}

function App() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
}

export default App;
