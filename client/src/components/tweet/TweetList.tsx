import { useNavigate } from 'react-router-dom';
import Tweet from './Tweet';
import axios from 'axios';
import useAuthUser from '../../hooks/userAuthHooks';
import { TweetType, User } from '../../types/tweet';
import { useEffect, useRef, useState } from 'react';
import usePostStore from '../../stores/usePostStore';
import useAuthStore from '../../stores/useAuth';

const fetchMockData = async (
	cursor: string,
	limit: number = 10,
	token: string,
	activeTab: string
): Promise<TweetType[]> => {
	const { data } = await axios<{
		status: string;
		message: string;
		posts: TweetType[];
	}>({
		method: 'get',
		url: 'http://localhost:3000/api/posts',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: {
			isFollowing: activeTab === 'following',
			cursor,
			limit,
		},
	});

	return data.posts;
};

const TweetList = ({ activeTab }: { activeTab: string }) => {
	const { posts, setPosts } = usePostStore();

	const navigate = useNavigate();
	const { getToken } = useAuthStore();
	const { getAuthUser, setAuthUser } = useAuthUser();
	const authUserId = getAuthUser()?._id || '';

	// infinity scroll start
	const [cursor, setCursor] = useState(String);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [targetTab, setTargetTab] = useState('for-you');

	const observerRef = useRef<HTMLDivElement | null>(null);

	const loadMore = async () => {
		if (loading || !hasMore) return;
		setLoading(true);
		const currentCursor = posts.length ? posts[posts.length - 1].createdAt : '';

		const newItems = await fetchMockData(cursor || currentCursor, 10, getToken() || '', activeTab);

		setPosts([...posts, ...newItems]);

		setCursor(newItems[newItems.length - 1]?.createdAt || '');
		if (newItems.length === 0) setHasMore(false);
		setLoading(false);
	};

	useEffect(() => {
		// Reset posts when switching tabs
		setTargetTab(activeTab);
		setPosts([]);
		setCursor('');
		setHasMore(true);
	}, [activeTab]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const first = entries[0];
				if (first.isIntersecting) loadMore();
			},
			{ threshold: 1 }
		);

		if (observerRef.current) observer.observe(observerRef.current);
		return () => {
			if (observerRef.current) observer.unobserve(observerRef.current);
		};
	}, [observerRef.current, loading, hasMore, activeTab]);
	// infinity scroll end

	const handleLike = async (postId: string) => {
		try {
			const response = await axios.put(`http://localhost:3000/api/posts/${postId}/like`, null, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			});

			if (response.data) {
				setPosts(
					posts.map((post) =>
						post._id === postId ? { ...post, likedBy: toggleArray(post.likedBy, authUserId) } : post
					)
				);
			}
		} catch (error) {
			console.error('Error liking post:', error);
		}
	};

	const toggleArray = (array: string[], item: string) =>
		array.includes(item) ? array.filter((i) => i !== item) : [...array, item];

	const handleRetweet = async (postId: string) => {
		try {
			const response = await axios.post(`http://localhost:3000/api/posts/${postId}/retweet`, null, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			});

			const { state, data: post } = response.data;

			let tweets = [...posts];

			// Toggle the retweet state for the post
			tweets = tweets.map((tweet) =>
				tweet._id === postId ? { ...tweet, retweetedBy: toggleArray(tweet.retweetedBy, authUserId) } : tweet
			);

			// Add the post to the beginning of the list if it's a retweet
			if (state === 'retweet') tweets.unshift(post);

			// Remove any retweets of the post if it's a deletion
			if (state === 'delete') tweets = tweets.filter((tweet) => tweet.retweetData?._id !== postId);

			setPosts(tweets);
		} catch (error) {
			console.error('Error retweeting post:', error);
		}
	};

	const handleBookmark = async (postId: string) => {
		try {
			const res = await axios.put(`http://localhost:3000/api/bookmark/${postId}`, null, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			});

			const { userBookmarks } = res.data;
			const bookmarks = [...userBookmarks.bookmarks];

			setAuthUser({
				...getAuthUser(),
				bookmarks,
			} as User);
		} catch (error) {
			console.error('Error bookmarking post:', error);
		}
	};
	const handleReply = (id: string) => {
		navigate(`/tweet/${id}`);
	};

	return (
		<div>
			{loading ? (
				<div className={`min-h-screen flex items-center justify-center `}>
					<div className="animate-spin-slow">
						<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
								className="fill-primary-500"
							/>
						</svg>
					</div>
				</div>
			) : (
				posts.map((tweet) => (
					<Tweet
						key={tweet._id}
						tweet={tweet}
						onLike={handleLike}
						onRetweet={handleRetweet}
						onBookmark={handleBookmark}
						onReply={handleReply}
					/>
				))
			)}
			{!loading && !hasMore && (
				<h1 className="flex flex-col items-center space-y-4 mt-4 font-medium">there is no more tweets</h1>
			)}
			{loading ||
				(hasMore && (
					<div className="flex flex-col items-center space-y-4 mt-4">
						<div className="inline-block w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
					</div>
				))}
			<div ref={observerRef} />
		</div>
	);
};

export default TweetList;
