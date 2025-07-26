import { useState, useRef } from 'react';
import { Image, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { TweetType } from '../../types/tweet';

const MAX_REPLY_LENGTH = 280;

interface ReplyComposerProps {
	tweet: TweetType;
	onReply: (postId: string, content: string, media?: File[]) => void;
	placeholder?: string;
}

const ReplyComposer = ({ tweet, onReply, placeholder = 'Tweet your reply' }: ReplyComposerProps) => {
	const [replyContent, setReplyContent] = useState('');
	const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { user } = useAuth();

	const remainingChars = MAX_REPLY_LENGTH - replyContent.length;
	const isOverLimit = remainingChars < 0;

	const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setReplyContent(e.target.value);
	};

	const handleMediaClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setSelectedFiles(files);

		if (files.length === 0) return;

		files.forEach((file) => {
			if (mediaPreviews.length < 4) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setMediaPreviews((prev) => [...prev, reader.result as string]);
				};
				reader.readAsDataURL(file);
			}
		});
	};

	const removeMedia = (index: number) => {
		setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
	};

	const handleReplySubmit = () => {
		if (replyContent.trim() && !isOverLimit) {
			onReply(tweet._id, replyContent, selectedFiles);

			// Reset form
			setReplyContent('');
			setMediaPreviews([]);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const renderMediaPreviews = () => {
		if (mediaPreviews.length === 0) return null;

		if (mediaPreviews.length === 1) {
			return (
				<div className="relative mt-2 rounded-2xl overflow-hidden">
					<img
						src={mediaPreviews[0]}
						alt="Media preview"
						className="w-full h-auto max-h-48 object-cover rounded-2xl"
					/>
					<button
						onClick={() => removeMedia(0)}
						className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white hover:bg-black/80 transition-colors"
					>
						<X size={16} />
					</button>
				</div>
			);
		}

		return (
			<div className="mt-2 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">
				{mediaPreviews.map((preview, index) => (
					<div key={index} className="relative">
						<img src={preview} alt={`Media preview ${index + 1}`} className="w-full h-20 object-cover" />
						<button
							onClick={() => removeMedia(index)}
							className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white hover:bg-black/80 transition-colors"
						>
							<X size={12} />
						</button>
					</div>
				))}
			</div>
		);
	};

	if (!user) return null;

	return (
		<div className="border-b border-secondary-100 dark:border-secondary-800 p-4">
			{/* Replying to indicator */}
			<div className="mb-3 text-text-secondary-light dark:text-text-secondary-dark text-sm">
				Replying to <span className="text-primary-500">@{tweet.author.username}</span>
			</div>

			<div className="flex">
				<img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover mr-3" />
				<div className="flex-1">
					<textarea
						placeholder={placeholder}
						value={replyContent}
						onChange={handleReplyChange}
						className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder-text-secondary-light dark:placeholder-text-secondary-dark"
						rows={2}
					/>

					{/* Media Preview */}
					{renderMediaPreviews()}

					<div className="flex items-center justify-between mt-3">
						<div className="flex space-x-2 text-primary-500">
							<button
								onClick={handleMediaClick}
								disabled={mediaPreviews.length >= 4}
								className={`p-2 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors ${
									mediaPreviews.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							>
								<Image size={18} />
							</button>
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileChange}
								accept="image/*"
								multiple
								className="hidden"
							/>
						</div>

						<div className="flex items-center space-x-3">
							{replyContent.length > 0 && (
								<div
									className={`text-sm ${
										isOverLimit
											? 'text-error-500'
											: 'text-text-secondary-light dark:text-text-secondary-dark'
									}`}
								>
									{remainingChars}
								</div>
							)}
							<button
								onClick={handleReplySubmit}
								disabled={!replyContent.trim() || isOverLimit}
								className={`px-4 py-1.5 bg-primary-500 text-white font-bold rounded-full transition-colors text-sm ${
									!replyContent.trim() || isOverLimit
										? 'opacity-50 cursor-not-allowed'
										: 'hover:bg-primary-600'
								}`}
							>
								Reply
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReplyComposer;
