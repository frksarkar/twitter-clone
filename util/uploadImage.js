const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const { firebaseStorage } = require('../config/databaseConnection');

const uploadImageToStorage = async (imageFile, imageName) => {
	const metadata = { contentType: 'image/png' };
	const storageRef = ref(firebaseStorage, 'twitter-clone');
	const fileRef = ref(storageRef, `${imageName}.png`);

	await uploadBytes(fileRef, imageFile, metadata);

	return await getDownloadURL(fileRef);
};

exports.uploadImage = uploadImageToStorage;
