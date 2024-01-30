const homePostContainer = document.querySelector('.post');

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
	console.log(event.target.closest('.replies'));
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
	const getAllGet = await fetch(
		`/api/posts?postedBy=${data.userId}&isReply=${data.isReply}`,
		{
			method: 'GET',
		}
	);

	// Parse the response as JSON
	return getAllGet.json();
}
