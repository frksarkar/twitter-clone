import { useNavigate } from 'react-router-dom';

import usePostStore from '../stores/usePostStore';
import { User } from '../types/tweet';
import userStore from '../stores/useAuthUser';
import { authApi } from '../api';

const useTweetActions = () => {
	const { posts, setPosts } = usePostStore();
	const { getUser, setUser } = userStore();
	const navigate = useNavigate();
	const authUserId = getUser()?._id || '';

	const toggleArray = (array: string[], item: string) => (array.includes(item) ? array.filter((i) => i !== item) : [...array, item]);

	const handleLike = async (postId: string) => {
		try {
			const response = await authApi.put(`/api/posts/${postId}/like`);
			if (response.data) {
				setPosts(posts.map((post) => (post._id === postId ? { ...post, likedBy: toggleArray(post.likedBy, authUserId) } : post)));
			}
			return response.data;
		} catch (error) {
			console.error('Error liking post:', error);
		}
	};

	const handleRetweet = async (postId: string) => {
		try {
			const response = await authApi.post(`/api/posts/${postId}/retweet`);
			const { state, data: post } = response.data;
			let tweets = [...posts];
			tweets = tweets.map((tweet) => (tweet._id === postId ? { ...tweet, retweetedBy: toggleArray(tweet.retweetedBy, authUserId) } : tweet));
			if (state === 'retweet') tweets.unshift(post);
			if (state === 'delete') tweets = tweets.filter((tweet) => tweet.retweetData?._id !== postId);
			setPosts(tweets);
			return response.data;
		} catch (error: any) {
			throw error;
		}
	};

	const handleBookmark = async (postId: string) => {
		try {
			const res = await authApi.put(`/api/bookmarks/${postId}`);
			const { userBookmarks } = res.data;

			const bookmarks = [...userBookmarks?.bookmarks];
			setUser({
				...getUser(),
				bookmarks,
			} as User);
			return bookmarks;
		} catch (error) {
			throw error;
		}
	};

	const handleReplyLike = async (id: string) => {
		try {
			const res = await authApi.put(`/users/replies/${id}/like`);
			return res.data;
		} catch (error) {
			throw error;
		}
	};

	const handleReply = (id: string) => {
		navigate(`/tweet/${id}`);
	};

	return { handleLike, handleRetweet, handleBookmark, handleReply, handleReplyLike, toggleArray };
};

export default useTweetActions;
