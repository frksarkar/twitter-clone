import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Repeat, Heart, Bookmark, Share, MoreHorizontal, FileHeart as HeartFilled, Bookmark as BookmarkFilled, Repeat as RepeatFilled } from 'lucide-react';
import { TweetType } from '../../types/tweet';
import React, { useEffect, useRef, useState } from 'react';
import userStore from '../../stores/useAuthUser';

interface TweetProps {
	tweet: TweetType;
	onLike: (id: string) => void;
	onRetweet: (id: string) => void;
	onBookmark: (id: string) => void;
	onReply?: (id: string) => void;
}

const Tweet = ({ tweet, onLike, onRetweet, onBookmark, onReply }: TweetProps) => {
	const { getUser } = userStore();
	const authUser = getUser();
	const authUserId = authUser?._id ?? '';
	const isRetweet = !!tweet.retweetData?.author;
	const retweetOriginalTweet = isRetweet ? tweet.retweetData! : tweet;
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const { _id: id, author: user, content, media, updatedAt: timestamp, replyTo: replies, retweetedBy: retweets, likedBy: likes } = retweetOriginalTweet;

	const isLiked = likes?.includes(authUserId);
	const isRetweeted = isRetweet ? tweet?.retweetedBy?.includes(authUserId) : retweets?.includes(authUserId);
	const isBookmarked = authUser?.bookmarks.includes(tweet._id);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = ({ target }: MouseEvent) => !dropdownRef.current?.contains(target as Node) && setShowDropdown(false);

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleMoreClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setShowDropdown(!showDropdown);
	};

	const handleDropdownAction = (action: string, _e: React.MouseEvent) => {
		setShowDropdown(false);
		switch (action) {
			case 'copy':
				navigator.clipboard.writeText(`${window.location.origin}/tweet/${id}`);
				break;
			case 'embed':
			case 'report':
			case 'mute':
			case 'block':
			case 'follow':
			case 'unfollow':
				alert(`TODO: Implement ${action} action`);
				break;
			default:
				break;
		}
	};

	const renderMedia = () => {
		if (!media || media.length === 0) return null;

		if (media.length === 1) {
			return (
				<div className="mt-3 rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-800">
					<img src={media[0]} alt="Tweet media" className="w-full h-auto max-h-96 object-cover" />
				</div>
			);
		}

		if (media.length === 2) {
			return (
				<div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-800">
					{media.map((image, index) => (
						<img key={index} src={image} alt={`Tweet media ${index + 1}`} className="w-full h-48 object-cover" />
					))}
				</div>
			);
		}

		if (media.length === 3) {
			return (
				<div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-800">
					<img src={media[0]} alt="Tweet media 1" className="w-full h-48 object-cover row-span-2" />
					<img src={media[1]} alt="Tweet media 2" className="w-full h-24 object-cover" />
					<img src={media[2]} alt="Tweet media 3" className="w-full h-24 object-cover" />
				</div>
			);
		}

		if (media.length >= 4) {
			return (
				<div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-800">
					{media.slice(0, 4).map((image, index) => (
						<div key={index} className="relative">
							<img src={image} alt={`Tweet media ${index + 1}`} className="w-full h-32 object-cover" />
							{index === 3 && media.length > 4 && (
								<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
									<span className="text-white font-bold text-lg">+{media.length - 4}</span>
								</div>
							)}
						</div>
					))}
				</div>
			);
		}
	};

	const handleReplyClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onReply) {
			onReply(id);
		}
	};

	return (
		<article className="border-b border-secondary-100 dark:border-secondary-800 p-4 hover:bg-secondary-50 dark:hover:bg-secondary-900/50 transition-colors cursor-pointer">
			{/* Tweet Header */}
			<div className="flex">
				<Link to={`/profile/${tweet.author.username}`} className="flex-shrink-0 mr-3">
					<img src={tweet.author.avatar} alt={tweet.author.name} className="w-12 h-12 rounded-full object-cover" />
				</Link>

				<div className="flex-1 min-w-0">
					{/* show retweet post icon*/}
					{tweet.retweetData?.author && (
						<div className="flex items-center mr-3">
							<RepeatFilled className="w-4 h-4 mr-2 text-primary-500" />
							{tweet.author._id === authUserId ? 'You repasted' : tweet.author.name}
						</div>
					)}

					{/* User Info */}
					<div className="flex items-baseline">
						<Link to={`/profile/${user.username}`} className="font-bold hover:underline truncate">
							{user.name}
						</Link>
						{user.verified && (
							<svg className="w-4 h-4 ml-1 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						)}
						<Link to={`/profile/${user.username}`} className="text-text-secondary-light dark:text-text-secondary-dark ml-1 truncate hover:underline">
							@{user.username}
						</Link>
						<span className="text-text-secondary-light dark:text-text-secondary-dark mx-1">·</span>
						<span className="text-text-secondary-light dark:text-text-secondary-dark text-sm hover:underline">
							{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
						</span>
						{/* More Button with Dropdown */}
						<div className="ml-auto relative" ref={dropdownRef}>
							<button
								onClick={handleMoreClick}
								className="text-text-secondary-light dark:text-text-secondary-dark p-1 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 hover:text-primary-500 transition-colors"
							>
								<MoreHorizontal size={16} />
							</button>

							{/* Dropdown Menu */}
							{showDropdown && (
								<div className="absolute right-0 top-8 bg-background-light dark:bg-background-dark border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg py-2 z-50 min-w-[200px]">
									<button
										onClick={(e) => handleDropdownAction('copy', e)}
										className="w-full text-left px-4 py-2 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
									>
										Copy link to Tweet
									</button>
									<button
										onClick={(e) => handleDropdownAction('embed', e)}
										className="w-full text-left px-4 py-2 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
									>
										Embed Tweet
									</button>
									<hr className="border-secondary-200 dark:border-secondary-700 my-1" />
									<button
										onClick={(e) => handleDropdownAction('follow', e)}
										className="w-full text-left px-4 py-2 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
									>
										Follow @{user.username}
									</button>
									<button
										onClick={(e) => handleDropdownAction('mute', e)}
										className="w-full text-left px-4 py-2 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
									>
										Mute @{user.username}
									</button>
									<button
										onClick={(e) => handleDropdownAction('block', e)}
										className="w-full text-left px-4 py-2 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors text-error-500"
									>
										Block @{user.username}
									</button>
									<hr className="border-secondary-200 dark:border-secondary-700 my-1" />
									<button
										onClick={(e) => handleDropdownAction('report', e)}
										className="w-full text-left px-4 py-2 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors text-error-500"
									>
										Report Tweet
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Tweet Content */}
					<Link to={`/tweet/${id}`}>
						<p className="mt-1 whitespace-pre-wrap">{content}</p>

						{/* Media */}
						{renderMedia()}
					</Link>

					{/* Tweet Actions */}
					<div className="flex justify-between mt-3 text-text-secondary-light dark:text-text-secondary-dark max-w-md">
						<button onClick={handleReplyClick} className="flex items-center group">
							<span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
								<MessageCircle size={18} />
							</span>
							<span className="ml-1 text-sm group-hover:text-primary-500">{replies}</span>
						</button>

						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onRetweet(id);
							}}
							className={`flex items-center group ${isRetweeted ? 'text-success-500' : ''}`}
						>
							<span className="p-2 rounded-full group-hover:bg-success-500/10 group-hover:text-success-500 transition-colors">
								{isRetweeted ? <RepeatFilled size={18} /> : <Repeat size={18} />}
							</span>
							<span className={`ml-1 text-sm ${isRetweeted ? 'text-success-500' : 'group-hover:text-success-500'}`}>{retweets.length}</span>
						</button>

						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onLike(id);
							}}
							className={`flex items-center group ${isLiked ? 'text-error-500' : ''}`}
						>
							<span className="p-2 rounded-full group-hover:bg-error-500/10 group-hover:text-error-500 transition-colors">
								{isLiked ? <HeartFilled size={18} /> : <Heart size={18} />}
							</span>
							<span className={`ml-1 text-sm ${isLiked ? 'text-error-500' : 'group-hover:text-error-500'}`}>{likes.length}</span>
						</button>

						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onBookmark(id);
							}}
							className={`flex items-center group ${isBookmarked ? 'text-primary-500' : ''}`}
						>
							<span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
								{isBookmarked ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
							</span>
							<span className={`ml-1 text-sm ${isBookmarked ? 'text-primary-500' : 'group-hover:text-primary-500'}`}>{/* {bookmarks.length} */}</span>
						</button>

						<button
							className="flex items-center group"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								alert('Share action not implemented yet');
							}}
						>
							<span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
								<Share size={18} />
							</span>
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};

export default Tweet;
