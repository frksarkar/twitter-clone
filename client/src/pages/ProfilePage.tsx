import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, LinkIcon, MapPin, MoreHorizontal, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Tweet from '../components/tweet/Tweet';
import Reply from '../components/tweet/Reply';
import EditProfileModal from '../components/profile/EditProfileModal';
import FollowButton from '../components/profile/FollowButton';
import { Reply as ReplyType, TweetType, User } from '../types/tweet';
import useTweetActions from '../hooks/useTweetActions';
import { authApi } from '../api';

const ProfilePage = () => {
	const navigate = useNavigate();
	const { username } = useParams<{ username: string }>();
	const { user: currentUser, updateProfile } = useAuth();
	if (!currentUser) navigate('/login');
	const { handleLike: like, toggleArray, handleRetweet: retweet, handleBookmark: bookmark, handleReply, handleReplyLike: replyLike } = useTweetActions();

	const [activeTab, setActiveTab] = useState<'tweets' | 'replies' | 'media' | 'likes'>('tweets');
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [profileUser, setProfileUser] = useState<User | null>(null); // Default to current user();

	// Check if this is the current user's profile
	const isOwnProfile = currentUser?.username === username;

	// Initial state for tweets
	const [tweets, setTweets] = useState<TweetType[]>([]);
	const [replies, setReplies] = useState<ReplyType[]>([]);
	const [likes, setLikes] = useState<User[]>([]);

	// Filter tweets with media
	const userMediaTweets = tweets?.filter((tweet) => tweet.media && tweet.media.length > 0);

	useEffect(() => {
		const fetchProfileData = async () => {
			if (!isOwnProfile) {
				try {
					const { data } = await authApi.get<{ data: User; status: string; message: string }>('/users', {
						params: {
							username: username,
						},
					});
					setProfileUser(data.data || {});
				} catch (error) {
					console.error('Error fetching profile data:', error);
					if (!isOwnProfile) navigate('/');
				}
			} else {
				setProfileUser(currentUser);
			}
		};
		fetchProfileData();
	}, [username, isOwnProfile]);

	useEffect(() => {
		if (!profileUser) return;
		const fetchData = async () => {
			try {
				if (activeTab === 'replies') {
					const { data } = await authApi.get<{ data: ReplyType[]; status: string; message: string }>('/api/replies', {
						params: {
							userId: profileUser?._id,
						},
					});
					setReplies(data.data);
				} else if (activeTab === 'tweets') {
					const { data } = await authApi.get<{ posts: TweetType[]; status: string; message: string }>('/api/posts', {
						params: {
							isAuthor: isOwnProfile,
							userId: profileUser?._id,
						},
					});
					setTweets(data.posts);
				} else if (activeTab === 'likes') {
					const { data } = await authApi.get<{ likes: User[]; status: string; message: string }>('/users/likes', {
						params: {
							userId: profileUser?._id,
						},
					});
					setLikes(data.likes);
				}
			} catch (error) {
				if (!isOwnProfile) navigate('/');
				if (activeTab === 'replies') setReplies([]);
				else if (activeTab === 'tweets') setTweets([]);
				else if (activeTab === 'likes') setLikes([]);
			}
		};

		fetchData();
	}, [activeTab, profileUser]);

	const handleLike = (id: string) => {
		like(id)
			.then(() => {
				const updatedTweets = tweets.map((tweet) => (tweet._id === id ? { ...tweet, likedBy: toggleArray(tweet.likedBy, currentUser?._id!) } : tweet));
				setTweets(updatedTweets);
			})
			.catch((error) => {
				console.error('Error liking tweet:', error);
			});
	};

	const handleRetweet = (id: string) => {
		retweet(id)
			.then(() => {
				const updatedTweets = tweets.map((tweet) => (tweet._id === id ? { ...tweet, retweetedBy: toggleArray(tweet.retweetedBy, currentUser?._id!) } : tweet));
				setTweets(updatedTweets);
			})
			.catch((error) => {
				alert(`Error retweeting: ${error.response?.data?.message || 'An error occurred'}`);
			});
	};

	const handleBookmark = (id: string) => {
		bookmark(id)
			.then(() => {
				const updatedBookmarks = toggleArray(currentUser?.bookmarks || [], id);
				updateProfile({ ...currentUser, bookmarks: updatedBookmarks });
			})
			.catch((error) => {
				console.error('Error bookmarking tweet:', error);
			});
	};

	const handleReplyLike = (id: string) => {
		replyLike(id)
			.then(() => {
				setReplies(replies.map((reply) => (reply._id === id ? { ...reply, likes: toggleArray(reply.likes, currentUser?._id!) } : reply)));
			})
			.catch((error) => {
				alert('Error liking reply: ' + (error.response?.data?.message || 'An error occurred'));
			});
		// setReplies(
		// 	replies.map((reply) =>
		// 		reply.id === id
		// 			? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
		// 			: reply
		// 	)
		// );
	};

	const handleProfileSave = (profileData: any) => {
		if (isOwnProfile) {
			const form = new FormData();
			for (const key in profileData) {
				form.append(key, profileData[key]);
			}
			authApi
				.put('/users/update', form)
				.then((response) => {
					if (response.data.status !== 'success') return;
					updateProfile(response.data.data);
					setProfileUser((prev) => ({ ...prev, ...response.data.data }));
				})

				.catch((error) => {
					console.error(error);
				});
		}
	};

	const handleFollowChange = (isFollowing: boolean) => {
		// extract current user profile following array
		const followers = profileUser?.followers || [];

		if (!currentUser) return;
		// auth user following array update
		const following = currentUser?.following || [];
		updateProfile({
			following: isFollowing ? [...following, currentUser?._id] : following.filter((id) => id !== currentUser?._id),
		});

		// profile user followers array update
		setProfileUser(
			(prev) =>
				({
					...prev,
					followers: isFollowing ? [...followers, currentUser?._id!] : followers.filter((id) => id !== currentUser?._id!),
				} as User)
		);
	};

	return profileUser ? (
		<div className="min-h-screen animate-enter">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-800 p-4 flex items-center">
				<Link to="/" className="mr-4">
					<ArrowLeft size={20} />
				</Link>
				<div>
					<h1 className="font-bold text-xl">{profileUser.name}</h1>
					<p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">{tweets.length} Tweets</p>
				</div>
			</header>

			{/* Profile Info */}
			<div>
				{/* Cover Photo */}
				<div className="h-48 bg-secondary-200 dark:bg-secondary-800 relative">
					<img src={profileUser.coverPicture} alt="Cover" className="w-full h-full object-cover" />
				</div>

				{/* Profile Picture & Buttons */}
				<div className="px-4 pb-4 relative">
					<img
						src={profileUser.avatar}
						alt={profileUser.name}
						className="w-32 h-32 rounded-full object-cover border-4 border-background-light dark:border-background-dark absolute -top-16"
					/>

					<div className="flex justify-end mt-4 mb-12 space-x-2">
						{!isOwnProfile && (
							<button className="p-2 rounded-full border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
								<MoreHorizontal size={20} />
							</button>
						)}

						{isOwnProfile ? (
							<button
								onClick={() => setIsEditModalOpen(true)}
								className="px-4 py-1.5 border border-secondary-300 dark:border-secondary-600 font-bold rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors flex items-center"
							>
								<Settings size={16} className="mr-2" />
								Edit profile
							</button>
						) : (
							<div className="group-hover">
								<FollowButton
									targetUserId={profileUser._id}
									targetUsername={profileUser.username}
									onFollowChange={handleFollowChange}
									isFollowing={profileUser.followers?.includes(currentUser?._id!)}
								/>
							</div>
						)}
					</div>

					{/* User Info */}
					<div className="mt-4">
						<div className="flex items-center">
							<h2 className="text-xl font-bold">{profileUser.name}</h2>
							{profileUser.verified && (
								<svg className="w-5 h-5 ml-1 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</div>
						<p className="text-text-secondary-light dark:text-text-secondary-dark">@{profileUser.username}</p>

						{profileUser.bio && <p className="mt-3">{profileUser.bio}</p>}

						<div className="flex flex-wrap mt-3 text-text-secondary-light dark:text-text-secondary-dark">
							{profileUser.location && (
								<div className="flex items-center mr-4 mb-2">
									<MapPin size={18} className="mr-1" />
									<span>{profileUser.location}</span>
								</div>
							)}
							{profileUser.website && (
								<div className="flex items-center mr-4 mb-2">
									<LinkIcon size={18} className="mr-1" />
									<a href={`https://${profileUser.website}`} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline">
										{profileUser.website}
									</a>
								</div>
							)}
							<div className="flex items-center mb-2">
								<Calendar size={18} className="mr-1" />
								<span>Joined {profileUser.joined}</span>
							</div>
						</div>

						<div className="flex mt-3">
							<Link to={`/profile/${profileUser.username}/following`} className="mr-4 hover:underline">
								<span className="font-bold">{profileUser.following?.length || 0}</span>{' '}
								<span className="text-text-secondary-light dark:text-text-secondary-dark">Following</span>
							</Link>
							<Link to={`/profile/${profileUser.username}/followers`} className="hover:underline">
								<span className="font-bold">{profileUser.followers?.length || 0}</span>{' '}
								<span className="text-text-secondary-light dark:text-text-secondary-dark">Followers</span>
							</Link>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex border-b border-secondary-100 dark:border-secondary-800">
					<button
						onClick={() => setActiveTab('tweets')}
						className={`flex-1 py-4 text-center font-medium relative ${
							activeTab === 'tweets' ? 'font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'
						}`}
					>
						Tweets
						{activeTab === 'tweets' && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />}
					</button>
					<button
						onClick={() => setActiveTab('replies')}
						className={`flex-1 py-4 text-center font-medium relative ${
							activeTab === 'replies' ? 'font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'
						}`}
					>
						Replies
						{activeTab === 'replies' && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />}
					</button>
					<button
						onClick={() => setActiveTab('media')}
						className={`flex-1 py-4 text-center font-medium relative ${
							activeTab === 'media' ? 'font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'
						}`}
					>
						Media
						{activeTab === 'media' && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />}
					</button>
					<button
						onClick={() => setActiveTab('likes')}
						className={`flex-1 py-4 text-center font-medium relative ${
							activeTab === 'likes' ? 'font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'
						}`}
					>
						Likes
						{activeTab === 'likes' && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />}
					</button>
				</div>

				{/* Content Sections */}
				{activeTab === 'tweets' && (
					<div>
						{tweets.length > 0 ? (
							tweets.map((tweet) => (
								<Tweet key={tweet._id} tweet={tweet} onLike={handleLike} onRetweet={handleRetweet} onBookmark={handleBookmark} onReply={handleReply} />
							))
						) : (
							<div className="flex flex-col items-center justify-center p-8 text-center h-[30vh]">
								<h2 className="text-2xl font-bold mb-2">{isOwnProfile ? "You haven't tweeted yet" : 'No tweets yet'}</h2>
								<p className="text-text-secondary-light dark:text-text-secondary-dark">
									{isOwnProfile ? "When you post a tweet, it'll show up here." : 'When they tweet, their tweets will show up here.'}
								</p>
							</div>
						)}
					</div>
				)}

				{activeTab === 'replies' && (
					<div>
						{replies.length > 0 ? (
							replies.map((reply) => <Reply key={reply._id} reply={reply} onLike={handleReplyLike} />)
						) : (
							<div className="flex flex-col items-center justify-center p-8 text-center h-[30vh]">
								<h2 className="text-2xl font-bold mb-2">{isOwnProfile ? "You haven't replied yet" : 'No replies yet'}</h2>
								<p className="text-text-secondary-light dark:text-text-secondary-dark">
									{isOwnProfile ? 'When you reply to tweets, your replies will show up here.' : 'When they reply to tweets, their replies will show up here.'}
								</p>
							</div>
						)}
					</div>
				)}

				{activeTab === 'media' && (
					<div>
						{userMediaTweets.length > 0 ? (
							<div className="grid grid-cols-2 gap-0.5 p-1">
								{userMediaTweets.map((tweet) =>
									tweet.media?.map((image, index) => (
										<Link key={`${tweet._id}-${index}`} to={`/tweet/${tweet._id}`} className="aspect-square overflow-hidden">
											<img src={image} alt="Media content" className="w-full h-full object-cover transition-transform hover:scale-105" />
										</Link>
									))
								)}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center p-8 text-center h-[30vh]">
								<h2 className="text-2xl font-bold mb-2">{isOwnProfile ? "You haven't posted media yet" : 'No media tweets yet'}</h2>
								<p className="text-text-secondary-light dark:text-text-secondary-dark">
									{isOwnProfile ? "When you post photos or videos, they'll show up here." : "When they tweet photos or videos, they'll show up here."}
								</p>
							</div>
						)}
					</div>
				)}

				{activeTab === 'likes' &&
					(likes.length > 0 ? (
						likes.map((like) => (
							<div key={like._id} className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-2 mb-2">
								<img src={like.avatar} alt={like.name} className="w-8 h-8 object-cover rounded-full" />
								<div className="text-text-primary-light dark:text-text-primary-dark">{like.name}</div>
								{like.verified && (
									<svg className="w-5 h-5 ml-1 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
								)}
								<div className="text-text-secondary-light dark:text-text-secondary-dark">{like.username}</div>
							</div>
						))
					) : (
						<div className="flex flex-col items-center justify-center p-8 text-center h-[30vh]">
							<h2 className="text-2xl font-bold mb-2">{isOwnProfile ? "You haven't liked any tweets yet" : 'No likes yet'}</h2>
							<p className="text-text-secondary-light dark:text-text-secondary-dark">
								{isOwnProfile ? "When you like tweets, they'll show up here." : "When they like tweets, they'll show up here."}
							</p>
						</div>
					))}
			</div>

			{/* Edit Profile Modal */}
			<EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleProfileSave} />
		</div>
	) : (
		<div className="min-h-screen flex items-center justify-center">
			<div className="w-full max-w-md">
				<h2 className="text-2xl font-bold mb-2">User not found</h2>
				<p className="text-text-secondary-light dark:text-text-secondary-dark">The user you are looking for does not exist.</p>
			</div>
		</div>
	);
};

export default ProfilePage;
