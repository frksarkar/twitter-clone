import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MoreHorizontal, FileHeart as HeartFilled } from 'lucide-react';
import { Reply as ReplyType } from '../../types/tweet';
import { useAuth } from '../../contexts/AuthContext';

interface ReplyProps {
	reply: ReplyType;
	onLike: (id: string) => void;
	isNested?: boolean;
}

const Reply = ({ reply, onLike, isNested = false }: ReplyProps) => {
	const { user: currentUser } = useAuth();
	const { _id: id, author: user, content, media, timestamp, likes } = reply;
	const isLiked = likes.includes(currentUser?._id || '');

	const renderMedia = () => {
		if (!media || media.length === 0) return null;

		if (media.length === 1) {
			return (
				<div className="mt-2 rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-800">
					<img src={media[0]} alt="Reply media" className="w-full h-auto max-h-64 object-cover" />
				</div>
			);
		}

		return (
			<div className="mt-2 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-800">
				{media.slice(0, 4).map((image, index) => (
					<div key={index} className="relative">
						<img src={image} alt={`Reply media ${index + 1}`} className="w-full h-24 object-cover" />
						{index === 3 && media.length > 4 && (
							<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
								<span className="text-white font-bold text-sm">+{media.length - 4}</span>
							</div>
						)}
					</div>
				))}
			</div>
		);
	};

	return (
		<article
			className={`border-b border-secondary-100 dark:border-secondary-800 p-4 hover:bg-secondary-50 dark:hover:bg-secondary-900/50 transition-colors ${
				isNested ? 'ml-12 border-l-2 border-primary-200 dark:border-primary-800' : ''
			}`}
		>
			<div className="flex">
				<Link to={`/profile/${user.username}`} className="flex-shrink-0 mr-3">
					<img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
				</Link>

				<div className="flex-1 min-w-0">
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
						<button className="ml-auto text-text-secondary-light dark:text-text-secondary-dark p-1 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 hover:text-primary-500 transition-colors">
							<MoreHorizontal size={14} />
						</button>
					</div>

					{/* Reply Content */}
					<p className="mt-1 whitespace-pre-wrap text-sm">{content}</p>

					{/* Media */}
					{renderMedia()}

					{/* Reply Actions */}
					<div className="flex items-center mt-2 text-text-secondary-light dark:text-text-secondary-dark">
						<button onClick={() => onLike(id)} className={`flex items-center group mr-4 ${isLiked ? 'text-error-500' : ''}`}>
							<span className="p-1.5 rounded-full group-hover:bg-error-500/10 group-hover:text-error-500 transition-colors">
								{isLiked ? <HeartFilled size={16} /> : <Heart size={16} />}
							</span>
							<span className={`ml-1 text-xs ${isLiked ? 'text-error-500' : 'group-hover:text-error-500'}`}>{likes.length}</span>
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};

export default Reply;
