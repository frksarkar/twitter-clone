const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const { firebaseStorage } = require('../config/databaseConnection');

exports.uploadImage = async (imageFile, imageName, storageName) => {
	const storageUrl = storageName ? `twitter-clone/${storageName}/${imageName}.png` : `twitter-clone/${imageName}.png`;
	const fileRef = ref(firebaseStorage, storageUrl);
	await uploadBytes(fileRef, imageFile, { contentType: 'image/png' });
	return getDownloadURL(fileRef);
};

exports.mediaUpload = (file, userId, savePath) => {
	let imageName = Date().split(' ');
	imageName.length = 5;
	imageName = imageName.join('-');
	imageName = imageName + '-' + userId;
	const imageUrl = this.uploadImage(file, imageName, savePath);
	return imageUrl;
};
