const submitBtn = document.querySelector('#submitPostBtn');
const homeDialogBoxTextArea = document.querySelector('.homeTextArea');
const likeBtn = document.querySelector('.like-btn');
const dialogBox = document.querySelector('.popup-container');
const dialogBoxTextArea = document.querySelector('#postbox');
const dialogBoxSubmitBtn = dialogBox.querySelector('button[type=submit]');
const deleteBox = document.querySelector('.delete-popup-container');
const deletePostBtn = deleteBox.querySelector('#delete-post-btn');
let postId;

// Wait for the DOM content to be fully loaded before executing the following code
document.addEventListener('DOMContentLoaded', async () => {
	// Send a GET request to the '/api/posts' endpoint and wait for the response
	const getAllGet = await fetch('/api/posts', {
		method: 'GET',
	});

	// Parse the response as JSON
	const posts = await getAllGet.json();

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
	postContainer?.insertAdjacentHTML('afterbegin', newPostHtml);
	loaderRemove(postContainer);
});

// if typing then enable post button
homeDialogBoxTextArea?.addEventListener('keyup', handleInputChange);

//  Add event listener for document click event
document.addEventListener('click', (event) => {
	// Find the closest like button
	const likeBtn = event.target.closest('.like-btn');
	// Find the closest tweet button
	const tweetBtn = event.target.closest('.tweet-btn');
	// Find the closest replay button
	const replayBtn = event.target.closest('.comment-btn');
	// Find the closest post container
	const postContainer = event.target.closest('.post');
	// Find the closest post container
	const deletePost = event.target.closest('.delete-btn');
	// Find the closest dialog box close button
	const dialogBoxCloseBtn = event.target.closest('.btn-close-popup');
	// find the follow button
	const followBtn = event.target.closest('.followBtn');
	// find the pin button
	const pinBtn = event.target.closest('.pin-btn');
	// find the button request pin post
	event.target.closest('#pinned-post-btn') ? pinnedPost(postId, true) : null;
	// find the button request unpin the post
	event.target.closest('#unpinned-post-btn') ? pinnedPost(postId, false) : null;

	// open the pinned container
	if (pinBtn && !pinBtn?.dataset.pin) {
		activeClass('pinned-popup-container');
	}

	if (pinBtn && pinBtn?.dataset.pin) {
		activeClass('unpinned-popup-container');
	}

	// Get the id of the post container, if it exists
	const elementId = postContainer ? event.target.closest('.post').dataset.id : null;

	// if elementId is exist then stor the value postId variable
	if (elementId) {
		postId = elementId;
	}

	//	open the delete post container
	deletePost ? activeClass('delete-popup-container') : null;

	followBtn ? follow(followBtn) : null;

	// If replay button is clicked, call pressReplayBtn function
	replayBtn ? pressReplayBtn(elementId) : null;

	// Close dialog box if close button is clicked
	dialogBoxCloseBtn ? dialogBoxClose() : null;

	// If like button is clicked, call pressLikeBtn function
	if (likeBtn) {
		pressLikeBtn(likeBtn, elementId);
	}
	// If tweet button is clicked, call pressTweetBtn function
	else if (tweetBtn) {
		pressTweetBtn(tweetBtn, elementId);
	}
});

function activeClass(name) {
	const element = document.querySelector(`.${name}`);
	document.querySelector('.overlay').classList.add('active');
	element.classList.add('active');
}

deletePostBtn.addEventListener('click', async () => {
	try {
		if (!postId) return alert('post id is required');
		const response = await postDeleteReq(postId);
		if (response.status != 'success') throw new Error('HTTP request problem');
		showToastMessage('You are delete this post', 2000);
		location.reload();
	} catch (error) {
		next(error);
	}
});

// Add event listener for keyup event on dialogBoxTextArea
dialogBoxTextArea.addEventListener('keyup', function handleInputChange(event) {
	postValue = event.target.value.trim();
	if (postValue) {
		dialogBoxSubmitBtn.disabled = false;
		return;
	}
	dialogBoxSubmitBtn.disabled = true;
});

/**
 * Closes the dialog box, removes the 'active' class from dialogBox and deleteBox,
 * removes the 'active' class from the overlay, and removes the .post element from dialogBox.
 */
function dialogBoxClose() {
	dialogBox.classList.remove('active');
	deleteBox.classList.remove('active');
	document.querySelector('.overlay').classList.remove('active');
	dialogBox.querySelector('.post') ? dialogBox.querySelector('.post').remove() : null;
	document.querySelector('.pinned-popup-container')?.classList.remove('active');
	document.querySelector('.unpinned-popup-container')?.classList.remove('active');
}

dialogBoxSubmitBtn.addEventListener('click', () => {
	const formData = new FormData();
	formData.append('replayTo', postId);
	formData.append('content', dialogBoxTextArea.value);
	replayToPost(formData);
});

// Closes the dialog box and removes the 'active' class, and also removes the
// post element from the dialog box.
async function pressLikeBtn(likeBtn, elementId) {
	const result = await fetch(`/api/posts/${elementId}/like`, {
		method: 'PUT',
	});
	const data = await result.json();
	const like = likeBtn.querySelector('span');
	like.innerText = data.data.likes.length || '';

	const userLike = data.data.likes.includes(user._id);
	if (userLike) {
		likeBtn.classList.add('active');
	} else {
		likeBtn.classList.remove('active');
	}
}

//  Asynchronously presses the tweet button for a given element ID, updating the UI
//  with the retweet count and adding or removing the 'active' class based on user
//  interaction.
async function pressTweetBtn(tweetBtn, elementId) {
	const result = await fetch(`/api/posts/${elementId}/tweet`, {
		method: 'POST',
	});
	const data = await result.json();
	const tweet = tweetBtn.querySelector('span');
	tweet.innerText = data.updatedPost.retweetedBy.length || '';

	const userLike = data.updatedPost.retweetedBy.includes(user._id);
	if (userLike) {
		tweetBtn.classList.add('active');
		const newPostHtml = createHtml(data.newRetweet);
		postContainer.insertAdjacentHTML('afterbegin', newPostHtml);
	} else {
		tweetBtn.classList.remove('active');
	}
}

// Asynchronously presses the replay button for a given post ID.
async function pressReplayBtn(postId) {
	if (!postId) {
		alert('post id is required');
	}
	document.querySelector('.overlay').classList.add('active');
	dialogBox.classList.add('active');
	const data = await getPost(postId);
	setTimeout(() => {
		const postHtml = createHtml(data);
		const textArea = dialogBox.querySelector('.postMainContainer');
		textArea.insertAdjacentHTML('beforebegin', postHtml);
	}, 500);
}

submitBtn?.addEventListener('click', async (event) => {
	const content = homeDialogBoxTextArea.value.trim();

	if (!content) {
		showToastMessage("can't post");
		return;
	}

	const formData = new FormData();
	formData.append('content', content);

	const response = await fetch('/api/posts', {
		method: 'POST',
		body: new URLSearchParams(formData),
	});

	if (!response.ok) {
		alert('Post failed');
		return;
	}

	homeDialogBoxTextArea.value = '';
	submitBtn.disabled = true;

	const newPostData = await response.json();
	const newPostHtml = createHtml(newPostData.data);

	postContainer.insertAdjacentHTML('afterbegin', newPostHtml);

	const emptyBox = postContainer.querySelector('.empty');

	if (emptyBox) {
		emptyBox.remove();
	}
});

// Asynchronously retrieves the post data for the given post ID.
async function getPost(postId) {
	const postData = await fetch('/api/posts/' + postId, {
		method: 'GET',
	});

	return postData.json();
}

//	toggle the pin post
async function pinnedPost(postId, pin) {
	try {
		const postData = await fetch('/api/posts/' + postId + '/pinned', {
			method: 'PUT',
			body: JSON.stringify({ pinned: pin }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!postData.ok) throw new Error('HTTP error');

		location.reload();
	} catch (err) {
		console.log('🚀 ~ file: home.js:260 ~ pinnedPost ~ err:', err);
	}
}

async function replayToPost(formData) {
	try {
		const request = await fetch('/api/posts', {
			method: 'POST',
			body: new URLSearchParams(formData).toString(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
		const newPostData = await request.json();
		showToastMessage('You are replay this post', 2000);
		console.log('🚀 ~ replayToPost ~ newPostData:', newPostData);
	} catch (error) {
		console.log('🚀 ~ replayToPost ~ error:', error);
	}
}

// Sends a DELETE request to the server to delete a post with the given postId.
async function postDeleteReq(postId) {
	const request = await fetch('/api/posts/' + postId, {
		method: 'DELETE',
	});

	return request.json();
}

async function follow(btn) {
	const userId = btn.dataset.userid;
	const result = await requestAPI(`/users/${userId}/follow`, 'PUT');

	const followCount = document.querySelector('.followers-count');

	if (result.action === 'Follow') {
		btn.innerText = 'Follow';
		btn.classList.remove('following');
		if (followCount) followCount.innerText = parseInt(followCount?.innerText) - 1;
	} else {
		btn.innerText = 'Following';
		btn.classList.add('following');
		if (followCount) followCount.innerText = parseInt(followCount?.innerText) + 1;
	}
}
