const mainContainer = document.querySelector('.show-result');

document.addEventListener('DOMContentLoaded', async (e) => {
	const data = await requestAPI('/api/posts/' + postId);
	const html = createHtml(data);
	mainContainer?.insertAdjacentHTML('afterbegin', html);
});
