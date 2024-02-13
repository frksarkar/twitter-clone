const homePostContainer = document.querySelector('.post');
const uploadedFile = document.querySelector('#upload-profile-picture');
const uploadedCoverFile = document.querySelector('#upload-cover-picture');
const image = document.getElementById('uploadImagePreview');

let cropper;

// Wait for the DOM content to be fully loaded before executing the following code
document.addEventListener('DOMContentLoaded', async () => {
	const isReply = activeTab == 'replies' ? true : false;
	const data = {
		userId,
		isReply,
	};
	// Load posts asynchronously
	const posts = await loadPosts(data);
	// Inject posts into the HTML
	injectPostInHtml(posts);
});

document.addEventListener('click', (event) => {
	// find profile upload button
	const profilePicUploadBtn = event.target.closest('.profile-pic-btn');

	// find cover picture button
	const coverPicBtn = event.target.closest('.cover-pic-btn');

	// find close picture upload popup button
	const profilePicUploadContainerCloseBtn =
		event.target.closest('.btn-close-popup');

	// find close cover picture upload popup button
	const coverPicUploadContainerCloseBtn =
		event.target.closest('.close-cover-popup');

	// find save profile picture
	const saveProfilePictureBtn = event.target.closest('#save-picture-btn');

	// find save cover picture button
	const saveCoverPictureBtn = event.target.closest('#save-cover-btn');

	// get user id
	const userId = profilePicUploadBtn?.dataset.userid;

	// show profile pic upload container
	profilePicUploadBtn && userId
		? toggleUploadPopup(userId, event, '.upload-profile-pic-container')
		: null;

	// show cover pic upload container
	coverPicBtn
		? toggleUploadPopup('', event, '.upload-cover-pic-container')
		: null;

	// close profile pic upload container
	profilePicUploadContainerCloseBtn
		? toggleUploadPopup('close', event, '.upload-profile-pic-container')
		: null;

	//
	coverPicUploadContainerCloseBtn
		? toggleUploadPopup('close', event, '.upload-cover-pic-container')
		: null;

	// Send the file to the server.
	saveProfilePictureBtn
		? sendProfilePicToServer(user._id, cropper, event, 'profile')
		: null;

	// Send to the cover image file to the server.
	saveCoverPictureBtn
		? sendProfilePicToServer(user._id, cropper, event, 'cover')
		: null;
});

uploadedFile.addEventListener('change', loadImage);

uploadedCoverFile.addEventListener('change', loadImage);

function injectPostInHtml(posts) {
	// Initialize an empty string to store the HTML for new posts
	let newPostHtml = '';

	// Loop through each post data and create HTML for each post
	posts.forEach((postData) => {
		newPostHtml += createHtml(postData);
	});

	// If there are no posts, add a message to indicate that nothing is to be shown
	if (!posts.length) {
		newPostHtml += `<div class="post-container empty"><span>Nothing to show.</span></div>`;
	}

	// Insert the new post HTML at the beginning of the post container
	homePostContainer.insertAdjacentHTML('afterbegin', newPostHtml);
}

async function loadPosts(data) {
	// Send a GET request to the '/api/posts' endpoint and wait for the response
	const getAllPosts = await fetch(
		`/api/posts?postedBy=${data.userId}&isReply=${data.isReply}`,
		{
			method: 'GET',
		}
	);

	// Parse the response as JSON
	return getAllPosts.json();
}

function toggleUploadPopup(data, event, container) {
	// get the picture upload container
	const profilePicUploaderContainer = document.querySelector(container);
	const overlayScreen = document.querySelector('.overlay');

	// close the popup container
	if (data === 'close') {
		profilePicUploaderContainer.classList.remove('active');
		image.src = '';
		uploadedFile.value = '';
		cropper?.destroy();
		document.querySelector('.preview-picture').style.display = 'none';
		// remove screen overlay
		overlayScreen.classList.remove('active');
		return;
	}

	overlayScreen.classList.add('active');
	// open the container
	profilePicUploaderContainer.classList.add('active');
}

// save the picture to the server
function sendProfilePicToServer(userId, cropper, event, imageName) {
	let imgName = imageName === 'profile' ? 'profilePicture' : 'coverPicture';
	const form = new FormData();
	const baseUrl = 'http://localhost:3000';
	const endpoint = `/users/update/${imageName}/${userId}/image`;
	const url = baseUrl + endpoint;

	cropper.getCroppedCanvas().toBlob((blob) => {
		form.append(imgName, blob);

		fetch(url, {
			method: 'PUT',
			body: form,
		})
			.then((data) => console.log(data))
			.catch((err) => console.log(err));
	});
}

//	load image in the element
function loadImage(event) {
	const containerId = event.target.getAttribute('id');
	const imageContainer = event.target.nextElementSibling;
	const img = imageContainer.children[0];
	const reader = new FileReader();

	reader.onload = function (e) {
		img.src = e.target.result;
		imageContainer.style.display = 'block';
		cropper?.destroy();

		if (containerId === 'upload-profile-picture') {
			cropper = new Cropper(img, { aspectRatio: 1 / 1 });
		} else {
			// cover image ratio
			cropper = new Cropper(img, { aspectRatio: 121 / 36 });
		}
	};

	reader.readAsDataURL(event.target.files[0]);
}

//	Add event listener for mouseover on profile avatar
document
	.querySelector('.profile-avatar')
	.addEventListener('mouseover', function (event) {
		// Remove class
		document
			.querySelector('.profile-cover')
			.classList.remove('profile-cover-image');
	});

// Add event listener for mouseout on profile avatar
document
	.querySelector('.profile-avatar')
	.addEventListener('mouseout', function (event) {
		// Add class
		document
			.querySelector('.profile-cover')
			.classList.add('profile-cover-image');
	});
