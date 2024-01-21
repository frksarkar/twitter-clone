const likeBtn = document.querySelector('.like-btn');

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
	if (likeBtn) {
	}
	const elementId = event.target.closest('.post-container')
		? event.target.closest('.post-container').dataset.id
		: null;
});

function pressLikeBtn(event) {
	console.log(event);
}
