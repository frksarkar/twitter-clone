import { create } from 'zustand';
import { TweetType } from '../types/tweet';

interface PostStore {
	posts: TweetType[] | [];
	setPosts: (posts: TweetType[]) => void;
	setPost: (post: TweetType) => void;
}

const usePostStore = create<PostStore>((set) => ({
	posts: [],
	setPosts: (posts) => set({ posts }),
	setPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
}));

export default usePostStore;
