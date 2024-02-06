const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const { firebaseStorage } = require('../config/databaseConnection');

const uploadImage = async (file, filename) => {
	const metadata = {
		contentType: 'image/png',
	};
	const storageRef = ref(firebaseStorage, 'twitter-clone');
	const fileRef = ref(storageRef, filename + '.png');

	await uploadBytes(fileRef, file, metadata);

	return await getDownloadURL(fileRef);
};

exports.uploadImage = uploadImage;
