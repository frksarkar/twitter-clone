import { useState, useRef } from 'react';
import { Image, MapPin, Smile, Calendar, X, BarChart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import usePostStore from '../../stores/usePostStore';
import { authApi } from '../../api';

const MAX_TWEET_LENGTH = 280;

const TweetComposer = () => {
	const [tweetContent, setTweetContent] = useState('');
	const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const { setPost } = usePostStore();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const { user } = useAuth();

	const remainingChars = MAX_TWEET_LENGTH - tweetContent.length;
	const isOverLimit = remainingChars < 0;

	const handleTweetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTweetContent(e.target.value);
	};

	const handleMediaClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		setSelectedFiles(files);
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

	const handleTweetSubmit = async () => {
		if (tweetContent && !isOverLimit) {
			await handleUpload();

			// Reset form
			setTweetContent('');
			setMediaPreviews([]);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const handleUpload = async () => {
		if (selectedFiles.length === 0) return alert('No files selected');

		const formData = new FormData();

		selectedFiles.forEach((file) => {
			formData.append('images', file); // "images" is the field name
		});

		formData.append('content', tweetContent);

		try {
			const res = await authApi.post('/api/posts', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setPost(res.data.newPost);
		} catch (err) {
			console.error('Upload failed:', err);
		}
	};

	const renderMediaPreviews = () => {
		if (mediaPreviews.length === 0) return null;

		if (mediaPreviews.length === 1) {
			return (
				<div className="relative mt-2 rounded-2xl overflow-hidden">
					<img src={mediaPreviews[0]} alt="Media preview" className="w-full h-auto max-h-80 object-cover rounded-2xl" />
					<button onClick={() => removeMedia(0)} className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white hover:bg-black/80 transition-colors">
						<X size={18} />
					</button>
				</div>
			);
		}

		if (mediaPreviews.length === 2) {
			return (
				<div className="mt-2 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">
					{mediaPreviews.map((preview, index) => (
						<div key={index} className="relative">
							<img src={preview} alt={`Media preview ${index + 1}`} className="w-full h-32 object-cover" />
							<button
								onClick={() => removeMedia(index)}
								className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white hover:bg-black/80 transition-colors"
							>
								<X size={16} />
							</button>
						</div>
					))}
				</div>
			);
		}

		if (mediaPreviews.length === 3) {
			return (
				<div className="mt-2 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">
					<div className="relative row-span-2">
						<img src={mediaPreviews[0]} alt="Media preview 1" className="w-full h-full object-cover" />
						<button onClick={() => removeMedia(0)} className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white hover:bg-black/80 transition-colors">
							<X size={16} />
						</button>
					</div>
					{mediaPreviews.slice(1).map((preview, index) => (
						<div key={index + 1} className="relative">
							<img src={preview} alt={`Media preview ${index + 2}`} className="w-full h-16 object-cover" />
							<button
								onClick={() => removeMedia(index + 1)}
								className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white hover:bg-black/80 transition-colors"
							>
								<X size={14} />
							</button>
						</div>
					))}
				</div>
			);
		}

		if (mediaPreviews.length === 4) {
			return (
				<div className="mt-2 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">
					{mediaPreviews.map((preview, index) => (
						<div key={index} className="relative">
							<img src={preview} alt={`Media preview ${index + 1}`} className="w-full h-24 object-cover" />
							<button
								onClick={() => removeMedia(index)}
								className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white hover:bg-black/80 transition-colors"
							>
								<X size={14} />
							</button>
						</div>
					))}
				</div>
			);
		}
	};

	if (!user) return null;

	return (
		<div className="border-b border-secondary-100 dark:border-secondary-800 p-4">
			<div className="flex">
				<img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full object-cover mr-3" />
				<div className="flex-1">
					<textarea
						placeholder="What's happening?"
						value={tweetContent}
						onChange={handleTweetChange}
						className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder-text-secondary-light dark:placeholder-text-secondary-dark"
						rows={2}
					/>

					{/* Media Preview */}
					{renderMediaPreviews()}

					<div className="flex items-center justify-between mt-4 pt-2 border-t border-secondary-100 dark:border-secondary-800">
						<div className="flex space-x-2 text-primary-500">
							<button
								onClick={handleMediaClick}
								disabled={mediaPreviews.length >= 4}
								className={`p-2 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors ${
									mediaPreviews.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							>
								<Image size={20} />
							</button>
							<input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
							<button className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors">
								<BarChart size={20} />
							</button>
							<button className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors">
								<Smile size={20} />
							</button>
							<button className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors">
								<Calendar size={20} />
							</button>
							<button className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors">
								<MapPin size={20} />
							</button>
						</div>

						<div className="flex items-center space-x-3">
							{tweetContent.length > 0 && (
								<div className={`text-sm ${isOverLimit ? 'text-error-500' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>{remainingChars}</div>
							)}
							<button
								onClick={handleTweetSubmit}
								disabled={!tweetContent || isOverLimit}
								className={`px-5 py-2 bg-primary-500 text-white font-bold rounded-full transition-colors ${
									!tweetContent || isOverLimit ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'
								}`}
							>
								Tweet
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TweetComposer;
