import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import usePostStore from '../stores/usePostStore';
import useAuthStore from '../stores/useAuth';
import { User } from '../types/tweet';
import userStore from '../stores/useAuthUser';

const useTweetActions = () => {
	const { posts, setPosts } = usePostStore();
	const { getToken } = useAuthStore();
	const { getUser, setUser } = userStore();
	const navigate = useNavigate();
	const authUserId = getUser()?._id || '';

	const toggleArray = (array: string[], item: string) => (array.includes(item) ? array.filter((i) => i !== item) : [...array, item]);

	const handleLike = async (postId: string) => {
		try {
			const response = await axios.put(`http://localhost:3000/api/posts/${postId}/like`, null, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			});
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
			const response = await axios.post(`http://localhost:3000/api/posts/${postId}/retweet`, null, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			});
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
			const res = await axios.put(`http://localhost:3000/api/bookmarks/${postId}`, null, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			});
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
			const res = await axios.put(`http://localhost:3000/users/replies/${id}/like`, null, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			});
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
