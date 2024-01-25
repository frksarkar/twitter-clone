const likeBtn = document.querySelector('.like-btn');
const dialogBox = document.querySelector('.popup-container');
const dialogBoxTextArea = dialogBox.querySelector('#postbox');
const dialogBoxSubmitBtn = dialogBox.querySelector('button[type=submit]');

document.addEventListener('DOMContentLoaded', async () => {
	const getAllGet = await fetch('/api/posts', {
		method: 'GET',
	});
	const posts = await getAllGet.json();

	let newPostHtml = '';
	posts.forEach((postData) => {
		newPostHtml += createHtml(postData);
	});

	if (!posts.length) {
		newPostHtml += `<div class="post-container empty"><span>Nothing to show.</span></div>`;
	}

	postContainer.insertAdjacentHTML('afterbegin', newPostHtml);
});

document.addEventListener('click', (event) => {
	const likeBtn = event.target.closest('.like-btn');
	const tweetBtn = event.target.closest('.tweet-btn');
	const postContainer = event.target.closest('.post');
	const dialogBoxCloseBtn = event.target.closest('.btn-close-popup');

	const elementId = postContainer
		? event.target.closest('.post').dataset.id
		: null;
	dialogBoxCloseBtn ? dialogBoxClose() : null;
	if (likeBtn) {
		pressLikeBtn(likeBtn, elementId);
	} else if (tweetBtn) {
		pressTweetBtn(tweetBtn, elementId);
	}
});

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
	dialogBox.style.transition = 'transform 0.3s';
	dialogBox.style.transform = 'translate(135px, -500px)';

	setTimeout(() => {
		dialogBox.style.display = 'none';
	}, 300);
}

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
