import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
	ArrowLeft,
	MoreHorizontal,
	MessageCircle,
	Repeat,
	Heart,
	Bookmark,
	Share,
	FileHeart as HeartFilled,
	Bookmark as BookmarkFilled,
	Repeat as RepeatFilled,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Reply as ReplyType, TweetType } from '../types/tweet';
import ReplyComposer from '../components/tweet/ReplyComposer';
import Reply from '../components/tweet/Reply';
import usePostStore from '../stores/usePostStore';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api';

const TweetPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { posts } = usePostStore();
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [tweetData, setTweetData] = useState<TweetType | null>(null);
	const [error, setError] = useState<string | null>(null);
	// State for replies
	const [replies, setReplies] = useState<ReplyType[]>([]);

	// Find the tweet by id
	const tweet = posts.find((tweet) => tweet._id === id) || tweetData!;
	if (!tweet) {
		return (
			<div className="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
				<p className="text-2xl font-bold">Tweet not found</p>
			</div>
		);
	}

	const isLiked = user?._id ? tweet?.likedBy.includes(user._id) : false;
	const isRetweeted = user?._id ? tweet?.retweetedBy.includes(user._id) : false;
	const isBookmarked = user?.bookmarks.includes(tweet?._id) || false;
	const likes = tweet?.likedBy?.length || 0;
	const retweets = tweet?.retweetedBy?.length || 0;
	const repliesCount = replies?.length || 0;

	useEffect(() => {
		setLoading(true);
		setError(null);

		if (posts.length === 0 && id) {
			const fetchTweet = async (id: string) => {
				try {
					const response = await authApi.get(`/api/posts/${id}`);

					setTweetData(response.data.data);
				} catch (error) {
					console.error('Error fetching tweet:', error);
					setError('Error fetching tweet');
					navigate('/');
				}
			};

			fetchTweet(id);
		}

		const fetchReplies = async () => {
			try {
				const response = await authApi.get<{ data: ReplyType[]; status: string }>(`/api/replies/post/${id}`);
				setReplies(response.data.data);
			} catch (error) {
				console.error('Error fetching replies:', error);
				setError('Error fetching replies');
				navigate('/');
			}
		};

		fetchReplies();
		setLoading(false);
	}, []);

	const handleLike = () => {
		// setIsLiked(!isLiked);
		// setLikes(isLiked ? likes - 1 : likes + 1);
	};

	const handleRetweet = () => {
		// setIsRetweeted(!isRetweeted);
		// setRetweets(isRetweeted ? retweets - 1 : retweets + 1);
	};

	const handleBookmark = () => {
		// setIsBookmarked(!isBookmarked);
	};

	const handleReply = (postId: string, content: string, media?: File[]) => {
		const form = new FormData();
		form.append('content', content);
		media?.forEach((file) => form.append('images', file));

		authApi({
			method: 'POST',
			url: `/api/replies/post/${postId}`,
			data: form,
		})
			.then((response) => {
				setReplies([response.data.reply, ...replies]);
			})
			.catch((error) => {
				console.error('Error creating reply:', error);
			});
	};

	const handleReplyLike = (replyId: string) => {
		// setReplies((prev) =>
		// 	prev.map((reply) =>
		// 		reply.id === replyId
		// 			? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
		// 			: reply
		// 	)
		// );
	};

	const renderMedia = () => {
		if (!tweet.media || tweet.media.length === 0) return null;

		if (tweet.media.length === 1) {
			return (
				<div className="mt-3 rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-800">
					<img src={tweet.media[0]} alt="Tweet media" className="w-full h-auto object-cover" />
				</div>
			);
		}

		if (tweet.media.length === 2) {
			return (
				<div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-800">
					{tweet.media.map((image, index) => (
						<img key={index} src={image} alt={`Tweet media ${index + 1}`} className="w-full h-64 object-cover" />
					))}
				</div>
			);
		}

		if (tweet.media.length >= 3) {
			return (
				<div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-800">
					<img src={tweet.media[0]} alt="Tweet media 1" className="w-full h-64 object-cover row-span-2" />
					{tweet.media.slice(1, 3).map((image, index) => (
						<img key={index + 1} src={image} alt={`Tweet media ${index + 2}`} className="w-full h-32 object-cover" />
					))}
					{tweet.media.length > 3 && (
						<div className="relative">
							<img src={tweet.media[3]} alt="Tweet media 4" className="w-full h-32 object-cover" />
							{tweet.media.length > 4 && (
								<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
									<span className="text-white font-bold text-lg">+{tweet.media.length - 4}</span>
								</div>
							)}
						</div>
					)}
				</div>
			);
		}
	};

	// Separate main replies from nested replies
	const mainReplies = replies.filter((reply) => !reply.parentReplyId);
	const nestedReplies = replies.filter((reply) => reply.parentReplyId);

	return loading ? (
		<div className="p-8 text-center">
			<p className="text-text-secondary-light dark:text-text-secondary-dark">Tweet not found.</p>
		</div>
	) : (
		<div className="min-h-screen animate-enter">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-800 p-4 flex items-center">
				<Link to="/" className="mr-4">
					<ArrowLeft size={20} />
				</Link>
				<h1 className="font-bold text-xl">Tweet</h1>
			</header>

			{/* Tweet Detail */}
			<article className="border-b border-secondary-100 dark:border-secondary-800 p-4">
				<div className="flex">
					<Link to={`/profile/${tweet.author.username}`} className="flex-shrink-0 mr-3">
						<img src={tweet.author.avatar} alt={tweet.author.name} className="w-12 h-12 rounded-full object-cover" />
					</Link>

					<div className="flex-1">
						<div className="flex justify-between items-start">
							<div>
								<Link to={`/profile/${tweet.author.username}`} className="font-bold hover:underline">
									{tweet.author.name}
								</Link>
								{tweet.author.verified && (
									<svg className="w-4 h-4 ml-1 inline text-primary-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
								)}
								<Link to={`/profile/${tweet.author.username}`} className="text-text-secondary-light dark:text-text-secondary-dark block hover:underline">
									@{tweet.author.username}
								</Link>
							</div>
							<button className="text-text-secondary-light dark:text-text-secondary-dark p-1 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-primary-500 transition-colors">
								<MoreHorizontal size={18} />
							</button>
						</div>

						<p className="mt-3 text-xl whitespace-pre-wrap">{tweet.content}</p>

						{renderMedia()}

						<p className="text-text-secondary-light dark:text-text-secondary-dark mt-4">
							{tweet.updatedAt && formatDistanceToNow(new Date(tweet.updatedAt), { addSuffix: true })}
						</p>

						{/* Stats */}
						<div className="flex border-t border-b border-secondary-100 dark:border-secondary-800 mt-4 py-3 space-x-6">
							<div>
								<span className="font-bold">{repliesCount}</span>{' '}
								<span className="text-text-secondary-light dark:text-text-secondary-dark">{repliesCount === 1 ? 'Reply' : 'Replies'}</span>
							</div>
							<div>
								<span className="font-bold">{retweets}</span> <span className="text-text-secondary-light dark:text-text-secondary-dark">Retweets</span>
							</div>
							<div>
								<span className="font-bold">{likes}</span> <span className="text-text-secondary-light dark:text-text-secondary-dark">Likes</span>
							</div>
						</div>

						{/* Actions */}
						<div className="flex justify-between py-3 text-text-secondary-light dark:text-text-secondary-dark">
							<button className="flex items-center group">
								<span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
									<MessageCircle size={20} />
								</span>
							</button>

							<button onClick={handleRetweet} className={`flex items-center group ${isRetweeted ? 'text-success-500' : ''}`}>
								<span className="p-2 rounded-full group-hover:bg-success-500/10 group-hover:text-success-500 transition-colors">
									{isRetweeted ? <RepeatFilled size={20} /> : <Repeat size={20} />}
								</span>
							</button>

							<button onClick={handleLike} className={`flex items-center group ${isLiked ? 'text-error-500' : ''}`}>
								<span className="p-2 rounded-full group-hover:bg-error-500/10 group-hover:text-error-500 transition-colors">
									{isLiked ? <HeartFilled size={20} /> : <Heart size={20} />}
								</span>
							</button>

							<button onClick={handleBookmark} className={`flex items-center group ${isBookmarked ? 'text-primary-500' : ''}`}>
								<span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
									{isBookmarked ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
								</span>
							</button>

							<button className="flex items-center group">
								<span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
									<Share size={20} />
								</span>
							</button>
						</div>
					</div>
				</div>
			</article>

			{/* Reply Composer */}
			<ReplyComposer tweet={tweet} onReply={handleReply} />

			{/* Replies */}
			<div>
				{mainReplies.length > 0 ? (
					<>
						{mainReplies.map((reply) => (
							<div key={reply._id}>
								<Reply reply={reply} onLike={handleReplyLike} />
								{/* Nested replies */}
								{nestedReplies
									.filter((nestedReply) => nestedReply.parentReplyId === reply._id)
									.map((nestedReply) => (
										<Reply key={nestedReply._id} reply={nestedReply} onLike={handleReplyLike} isNested={true} />
									))}
							</div>
						))}
					</>
				) : (
					<div className="p-8 text-center">
						<p className="text-text-secondary-light dark:text-text-secondary-dark">No replies yet. Be the first to reply!</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default TweetPage;
