const likeBtn = document.querySelector('.like-btn');
const dialogBox = document.querySelector('.popup-container');
const dialogBoxTextArea = dialogBox.querySelector('#postbox');
const dialogBoxSubmitBtn = dialogBox.querySelector('button[type=submit]');

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
	postContainer.insertAdjacentHTML('afterbegin', newPostHtml);
});

/**
 * Add event listener for document click event
 * @param {Object} event - The event object
 */
document.addEventListener('click', (event) => {
	// Find the closest like button
	const likeBtn = event.target.closest('.like-btn');
	// Find the closest tweet button
	const tweetBtn = event.target.closest('.tweet-btn');
	// Find the closest replay button
	const replayBtn = event.target.closest('.comment-btn');
	// Find the closest post container
	const postContainer = event.target.closest('.post');
	// Find the closest dialog box close button
	const dialogBoxCloseBtn = event.target.closest('.btn-close-popup');

	// Get the id of the post container, if it exists
	const elementId = postContainer
		? event.target.closest('.post').dataset.id
		: null;

	// If replay button is clicked, call pressReplayBtn function
	replayBtn ? pressReplayBtn(replayBtn, elementId) : null;

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

// Add event listener for keyup event on dialogBoxTextArea
dialogBoxTextArea.addEventListener('keyup', function handleInput(event) {
	// Trim the input value
	postValue = event.target.value.trim();
	// If the trimmed value is not empty, enable the submit button
	if (postValue) {
		dialogBoxSubmitBtn.disabled = false;
		return;
	}
	// If the trimmed value is empty, disable the submit button
	dialogBoxSubmitBtn.disabled = true;
});

function dialogBoxClose() {
	dialogBox.classList.remove('active');
	dialogBox.querySelector('.post').remove();
	document.querySelector('.overlay').classList.remove('active');
}

dialogBoxSubmitBtn.addEventListener('click', (event) => {
	const formData = new FormData();
	// formData.append('id', postId);
	// formData.append('content', dialogBoxTextArea.value);
	const postId = event.target.closest('.post')
	console.log("🚀 ~ dialogBoxSubmitBtn.addEventListener ~ postId:", postId)
});

/**
 * Closes the dialog box and removes the 'active' class, and also removes the
 * post element from the dialog box.
 */
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

/**
 * Asynchronously presses the tweet button for a given element ID, updating the UI
 * with the retweet count and adding or removing the 'active' class based on user
 * interaction.
 *
 * @param {HTMLElement} tweetBtn - the tweet button element
 * @param {string} elementId - the ID of the element to be tweeted
 * @return {void}
 */
async function pressTweetBtn(tweetBtn, elementId) {
	const result = await fetch(`/api/posts/${elementId}/tweet`, {
		method: 'POST',
	});
	const data = await result.json();
	const tweet = tweetBtn.querySelector('span');
	tweet.innerText = data.updatedPost.retweetUsers.length || '';

	const userLike = data.updatedPost.retweetUsers.includes(user._id);
	if (userLike) {
		tweetBtn.classList.add('active');
		const newPostHtml = createHtml(data.newRetweet);
		postContainer.insertAdjacentHTML('afterbegin', newPostHtml);
	} else {
		tweetBtn.classList.remove('active');
	}
}

/**
 * Asynchronously presses the replay button for a given element and post ID.
 *
 * @param {Element} element - The element to which the replay button is attached
 * @param {string} postId - The ID of the post to be replayed
 * @return {Promise<void>} A promise that resolves when the replay is completed
 */
async function pressReplayBtn(element, postId) {
	if (!postId) {
		console.log('post id is required');
	}
	document.querySelector('.overlay').classList.add('active');
	dialogBox.classList.add('active');
	const data = await getPost(postId);
	const postHtml = createHtml(data);
	const textArea = dialogBox.querySelector('.postMainContainer');
	textArea.insertAdjacentHTML('beforebegin', postHtml);
}

/**
 * Asynchronously retrieves the post data for the given post ID.
 *
 * @param {number} postId - The ID of the post to retrieve
 * @return {Promise} A Promise that resolves to the JSON data of the post
 */
async function getPost(postId) {
	const postData = await fetch('/api/posts/' + postId, {
		method: 'GET',
	});

	return postData.json();
}

async function replayToPost(postId) {
	try {
		const request = await fetch('/api/posts', {
			method: 'POST',
			body: new URLSearchParams(formData).toString(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
		const newPostData = await request.json();
		console.log('🚀 ~ replayToPost ~ newPostData:', newPostData);
	} catch (error) {
		console.log('🚀 ~ replayToPost ~ error:', error);
	}
}
