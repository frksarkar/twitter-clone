import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

interface FollowButtonProps {
	targetUserId: string;
	targetUsername: string;
	isFollowing?: boolean;
	onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton = ({ targetUserId, targetUsername, isFollowing = false, onFollowChange }: FollowButtonProps) => {
	const { user, token } = useAuth();
	const [following, setFollowing] = useState(isFollowing);
	const [isLoading, setIsLoading] = useState(false);

	// Don't show follow button for own profile
	if (user?._id === targetUserId) {
		return null;
	}

	const handleFollowToggle = async () => {
		setIsLoading(true);
		try {
			const response = await axios({
				method: 'PUT',
				url: `http://localhost:3000/users/${targetUserId}/follow`,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status !== 200) {
				throw new Error('Failed to update follow status');
			}
			const newFollowingState = !following;
			setFollowing(newFollowingState);
			onFollowChange?.(newFollowingState);
		} catch (error) {
			console.error('Error following/unfollowing user:', error);
		} finally {
			setIsLoading(false);
		}
		// Simulate API call
	};

	return (
		<button
			onClick={handleFollowToggle}
			disabled={isLoading}
			className={`px-4 py-1.5 font-bold rounded-full transition-all ${
				following
					? 'bg-transparent border border-secondary-300 dark:border-secondary-600 text-text-primary-light dark:text-text-primary-dark hover:bg-error-500/10 hover:border-error-500 hover:text-error-500'
					: 'bg-text-primary-light dark:bg-text-primary-dark text-background-light dark:text-background-dark hover:opacity-90'
			} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
		>
			{isLoading ? (
				<div className="flex items-center">
					<div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
					{following ? 'Unfollowing...' : 'Following...'}
				</div>
			) : (
				<span className="group-hover:hidden">{following ? 'Following' : 'Follow'}</span>
			)}
			{following && !isLoading && <span className="hidden group-hover:inline text-error-500">Unfollow</span>}
		</button>
	);
};

export default FollowButton;
