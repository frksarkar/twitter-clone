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

//	follow functionality
document.addEventListener('click', (event) => {
	const followBtn = event.target.closest('.followBtn');
	followBtn ? follow(followBtn) : null;
});

async function searchResult(tab, value) {
	let posts;
	let htmlMarkup = '';
	if (tab === 'posts') {
		posts = await requestAPI(`/api/posts?search=${value}`);
	} else {
		posts = await requestAPI(`/users?search=${value}`);
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
			htmlMarkup += createSearchUserHtml(post);
		}
	});
	document.querySelector('.search-contain').innerHTML = htmlMarkup;
}

function createSearchUserHtml(searchUser) {
	const followBtn = followBtnHtml(searchUser);
	searchUser.followBtn = followBtn;
	return FollowHtmlMarkup(searchUser);
}

function FollowHtmlMarkup({ profilePicture, userName, followBtn }) {
	return `<div class="follow-container">
				<div class="img-container"><img src="${profilePicture}" alt="" srcset=""></div>
					<a href="/profile/${userName}" class="info">
						<h3>${userName}</h3>
						<span>${userName}</span>
					</a>
				<div class="follow-btn-container">
					${followBtn}
				</div>
			</div>`;
}

function followBtnHtml(searchUserObj) {
	const isCurrentUserFollowing = searchUserObj.followers.includes(user._id);
	const buttonText = isCurrentUserFollowing ? 'Following' : 'Follow';
	const isDifferentUser = searchUserObj._id != user._id;

	return isDifferentUser
		? `<button class="followBtn following" data-userid="${searchUserObj._id}">${buttonText}</button>`
		: '';
}
