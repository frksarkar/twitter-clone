export interface User {
	_id: string;
	name: string;
	username: string;
	email: string;
	avatar: string;
	verified?: boolean;
	bio?: string;
	following?: string[];
	followers?: string[];
	joined?: string;
	location?: string;
	website?: string;
	bookmarks: string[];
	coverPicture?: string;
}

export interface Reply {
	_id: string;
	author: User;
	content: string;
	media?: string[];
	timestamp: string;
	likes: string[];
	parentTweetId: string;
	parentReplyId?: string; // For nested replies
}

export interface TweetType {
	_id: string;
	author: User;
	likedBy: string[];
	retweetedBy: string[];
	retweetData: TweetType | null;
	replyTo: number;
	pinned: boolean;
	content: string;
	media?: string[];
	hashtags: string[];
	mentions: string[];
	visibility: string;
	updatedAt: string;
	createdAt: string;
}

export interface Notification {
	_id: string;
	userTo: User;
	userFrom: User;
	type: notificationType;
	content: string;
	opened: boolean;
	targetId: string;
	text: string;
	createdAt: string;
	updatedAt: string;
}

export enum notificationType {
	Like = 'like',
	Reply = 'reply',
	Follow = 'follow',
	Retweet = 'retweet',
	Bookmark = 'bookmark',
	Message = 'message',
	Mention = 'mention',
}
