document.addEventListener('click', (event) => {
	const followBtn = event.target.closest('.followBtn');

	followBtn ? follow(followBtn) : null;
});

async function follow(btn) {
	const userId = btn.dataset.userid;
	const request = await fetch(`/users/${userId}/follow`, {
		method: 'PUT',
	});

	const result = await request.json();
	const followCount = document.querySelector('.followers-count');

	if (result.action === 'Follow') {
		btn.innerText = 'Follow';
		btn.classList.remove('following');
	} else {
		btn.innerText = 'Following';
		btn.classList.add('following');
	}
}
