import { useEffect } from 'react';
import Tweet from '../components/tweet/Tweet';
import { MoreHorizontal, Share } from 'lucide-react';
import useBookmarkStore from '../stores/useBookmarkStore';
import useTweetActions from '../hooks/useTweetActions';
import userStore from '../stores/useAuthUser';
import { authApi } from '../api';

const BookmarksPage = () => {
	const { getUser } = userStore();
	const authUser = getUser();
	const authUserId = authUser?._id || '';
	const { handleLike: like, handleRetweet: retweet, handleReply, handleBookmark: bookmark, toggleArray } = useTweetActions();
	// Filter bookmarked tweets
	const { setBookmarkTweets, bookmarksTweets } = useBookmarkStore();

	useEffect(() => {
		authApi({
			method: 'get',
			url: '/api/bookmarks',
		}).then((res) => {
			setBookmarkTweets(res.data.posts || []);
		});
	}, []);

	const handleLike = (id: string) => {
		like(id).then(() => {
			const updatedTweets = bookmarksTweets.map((tweet) => (tweet._id === id ? { ...tweet, likedBy: toggleArray(tweet.likedBy, authUserId) } : tweet));

			setBookmarkTweets(updatedTweets);
		});
	};

	const handleRetweet = (id: string) => {
		retweet(id).then(() => {
			const updatedTweets = bookmarksTweets.map((tweet) =>
				tweet._id === id
					? {
							...tweet,
							retweetedBy: toggleArray(tweet.retweetedBy, authUserId),
					  }
					: tweet
			);
			setBookmarkTweets(updatedTweets);
		});
	};

	const handleBookmark = (id: string) => {
		bookmark(id)
			.then(() => {
				setBookmarkTweets(
					bookmarksTweets.filter((tweet) => tweet._id !== id) // Remove tweets that are no longer bookmarked
				);
			})
			.catch((_err) => {
				alert('Error unbookmarking tweet:');
			});
	};

	return (
		<div className="min-h-screen animate-enter">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-800 p-4 flex justify-between items-center">
				<div>
					<h1 className="font-bold text-xl">Bookmarks</h1>
					<p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">@johndoe</p>
				</div>
				<div className="flex space-x-2">
					<button className="p-2 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
						<Share size={20} />
					</button>
					<button className="p-2 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
						<MoreHorizontal size={20} />
					</button>
				</div>
			</header>

			{/* Bookmarked Tweets */}
			{bookmarksTweets?.length > 0 ? (
				<div>
					{bookmarksTweets.map((tweet) => (
						<Tweet key={tweet._id} tweet={tweet} onLike={handleLike} onRetweet={handleRetweet} onBookmark={handleBookmark} onReply={handleReply} />
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center p-8 text-center h-[50vh]">
					<h2 className="text-2xl font-bold mb-2">You haven't added any Tweets to your Bookmarks yet</h2>
					<p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">When you do, they'll show up here.</p>
				</div>
			)}
		</div>
	);
};

export default BookmarksPage;
