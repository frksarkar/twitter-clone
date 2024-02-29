let timer;
search.addEventListener('keyup', (e) => {
	clearTimeout(timer);
	const value = e.target.value.trim();

	timer = setTimeout(() => {
		if (value) {
			searchResult(activeTab, value);
		} else {
			document.querySelector('.search-contain').innerHTML =
				'<h3 class="not-found">Result Not Found</h3>';
		}
	}, 500);
});

async function searchResult(tab, value) {
	let posts;
	let htmlMarkup = '';
	if (tab === 'posts') {
		posts = await getPosts('/api/posts', value);
	} else {
		posts = await getPosts('/users', value);
	}

	if (!posts.length) {
		document.querySelector('.search-contain').innerHTML =
			'<h3 class="not-found">Result Not Found</h3>';
		return;
	}

	posts.forEach((post) => {
		if (tab === 'posts') {
			htmlMarkup += createHtml(post);
		} else {
			htmlMarkup += createUserHtml(post);
		}
	});
	document.querySelector('.search-contain').innerHTML = htmlMarkup;
}

async function getPosts(url, value) {
	const postData = await fetch(`${url}?search=${value}`, {
		method: 'GET',
	});

	return postData.json();
}

function createUserHtml(searchUser) {
	const isFollow = searchUser.followers.includes(user._id)
		? 'Following'
		: 'Follow';
	return `<div class="follow-container">
				<div class="img-container"><img src="${searchUser.profilePicture}" alt="" srcset=""></div>
					<div class="info">
						<h3>${searchUser.userName}</h3>
						<span>${searchUser.userName}</span>
					</div>
				<div class="follow-btn-container">
					<button class="followBtn following" data-userid="${searchUser._id}">${isFollow}</button>
				</div>
			</div>`;
}

//	follow functionality
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
