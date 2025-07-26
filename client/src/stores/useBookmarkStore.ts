import { create } from 'zustand';
import { TweetType } from '../types/tweet';

interface BookmarkTweetStore {
	bookmarksTweets: TweetType[];
	setBookmarkTweets: (tweets: TweetType[]) => void;
	removeBookmark: (postId: string) => void;
}

const useBookmarkStore = create<BookmarkTweetStore>((set) => ({
	bookmarksTweets: [],
	setBookmarkTweets: (tweets) => set({ bookmarksTweets: tweets }),
	removeBookmark: (postId: string) =>
		set((state) => ({ bookmarksTweets: state.bookmarksTweets.filter((post) => post._id !== postId) })),
}));

export default useBookmarkStore;
