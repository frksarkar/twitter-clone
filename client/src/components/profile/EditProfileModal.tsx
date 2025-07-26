import { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface EditProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (profileData: any) => void;
}

interface UpdateUserObj {
	name?: string;
	bio?: string;
	location?: string;
	website?: string;
	avatar?: File;
	coverPicture?: File;
}

const EditProfileModal = ({ isOpen, onClose, onSave }: EditProfileModalProps) => {
	const { user } = useAuth();
	const [formData, setFormData] = useState<UpdateUserObj>({
		name: user?.name || '',
		bio: user?.bio || '',
		location: user?.location || '',
		website: user?.website || '',
	});
	const [previewImage, setPreviewImage] = useState<{ avatar?: string; coverPicture?: string }>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const uploadImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev) => ({ ...prev, [e.target.name]: file }));
			setPreviewImage((prev) => ({ ...prev, [e.target.name]: URL.createObjectURL(file) }));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-background-light dark:bg-background-dark rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-secondary-100 dark:border-secondary-800">
					<div className="flex items-center">
						<button onClick={onClose} className="p-2 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors mr-4">
							<X size={20} />
						</button>
						<h2 className="text-xl font-bold">Edit profile</h2>
					</div>
					<button
						onClick={handleSubmit}
						className="px-4 py-1.5 bg-text-primary-light dark:bg-text-primary-dark text-background-light dark:text-background-dark font-bold rounded-full hover:opacity-90 transition-opacity"
					>
						Save
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-4 space-y-6">
					{/* Cover Photo */}
					<div className="relative">
						<div className="h-32 bg-secondary-200 dark:bg-secondary-800 rounded-lg relative overflow-hidden">
							<img src={previewImage.coverPicture || user?.coverPicture} alt="Cover" className="w-full h-full object-cover" />
							<button type="button" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
								<Camera size={24} className="text-white" />
								<input
									type="file"
									accept="image/*"
									name="coverPicture"
									className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
									onChange={uploadImageFile}
								/>
							</button>
						</div>

						{/* Profile Picture */}
						<div className="absolute -bottom-8 left-4">
							<div className="relative">
								<img
									src={previewImage.avatar || user?.avatar}
									alt={user?.name}
									className="w-16 h-16 rounded-full object-cover border-4 border-background-light dark:border-background-dark"
								/>
								<button
									type="button"
									className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
								>
									<Camera size={16} className="text-white" />
									<input
										type="file"
										accept="image/*"
										name="avatar"
										className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
										onChange={uploadImageFile}
									/>
								</button>
							</div>
						</div>
					</div>

					<div className="pt-8 space-y-4">
						{/* Name */}
						<div>
							<label htmlFor="name" className="block text-sm font-medium mb-2">
								Name
							</label>
							<input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="input" maxLength={50} />
							<div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">{formData.name?.length}/50</div>
						</div>

						{/* Bio */}
						<div>
							<label htmlFor="bio" className="block text-sm font-medium mb-2">
								Bio
							</label>
							<textarea
								id="bio"
								name="bio"
								value={formData.bio}
								onChange={handleChange}
								className="input resize-none"
								rows={3}
								maxLength={160}
								placeholder="Tell the world about yourself"
							/>
							<div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">{formData.bio?.length}/160</div>
						</div>

						{/* Location */}
						<div>
							<label htmlFor="location" className="block text-sm font-medium mb-2">
								Location
							</label>
							<input
								id="location"
								name="location"
								type="text"
								value={formData.location}
								onChange={handleChange}
								className="input"
								maxLength={30}
								placeholder="Where are you located?"
							/>
						</div>

						{/* Website */}
						<div>
							<label htmlFor="website" className="block text-sm font-medium mb-2">
								Website
							</label>
							<input id="website" name="website" type="text" value={formData.website} onChange={handleChange} className="input" placeholder="yourwebsite.com" />
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditProfileModal;
