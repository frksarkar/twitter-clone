const homePostContainer = document.querySelector('.post');
const uploadedFile = document.querySelector('#upload-profile-picture');
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

	// find close picture upload popup button
	const profilePicUploadContainerCloseBtn =
		event.target.closest('.btn-close-popup');

	// find save profile picture
	const saveProfilePictureBtn = event.target.closest('#save-picture-btn');

	// get user id
	const userId = profilePicUploadBtn?.dataset.userid;

	// show profile pic upload container
	profilePicUploadBtn && userId ? toggleUploadPopup(userId) : null;

	// close profile pic upload container
	profilePicUploadContainerCloseBtn
		? toggleUploadPopup('close', event)
		: null;

	// Send the file to the server.
	saveProfilePictureBtn
		? sendProfilePicToServer(user._id, cropper, event)
		: null;
});

uploadedFile.addEventListener('change', (event) => {
	const reader = new FileReader();
	console.log('upload file');
	reader.onload = function (e) {
		image.src = e.target.result;
		image.parentElement.style.display = 'block';
		cropper?.destroy();
		cropper = new Cropper(image, { aspectRatio: 1 / 1 });
		// cover image ratio
		// cropper = new Cropper(image, { aspectRatio: 121 / 36 });
	};

	reader.readAsDataURL(event.target.files[0]);
});

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

function toggleUploadPopup(data, event) {
	// get the picture upload container
	const profilePicUploaderContainer = document.querySelector(
		'.upload-profile-pic-container'
	);
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

// save the profile picture to the server
function sendProfilePicToServer(userId, image, btn) {
	const form = new FormData();

	cropper.getCroppedCanvas().toBlob((blob) => {
		form.append('profileImage', blob);

		fetch(`/users/update/${userId}/image`, {
			method: 'PUT',
			body: form,
		});
	});
}


// Add event listener for mouseover on profile avatar
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
