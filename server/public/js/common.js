const postContainer = document.querySelector('.main-post-container');
let postValue;

document.addEventListener('DOMContentLoaded', (e) => {
	updateNotificationCount('.notificationBags', '/notifications/all?notify=true');
	updateNotificationCount('#messagesBegs', '/api/chat?notifying=true');
});

// create a new html element
function createHtml(postData) {
	const retweetData = postData.retweetData ? true : false;
	let retweetBy = '';
	let retweetText = '';
	let retweetTimestamp = '';
	let postAction = '';
	let pin = '';
	if (postData.author?._id === user._id) {
		postAction = `<button class='pin-btn ${postData.pinned ? 'active' : ''}' data-pin='${
			postData.pinned ? 'active' : ''
		}'> <i class="fa-solid fa-thumbtack"></i> </button>
		<button class='delete-btn'> <i class="fa-solid fa-xmark"></i> </button>`;
	}
	if (postData.pinned) {
		pin = `<div><i class="fa-solid fa-thumbtack"></i> Pinned post</div>`;
	}
	if (retweetData) {
		retweetBy = postData.author.userName;
		retweetText = `<i class="fa-solid fa-retweet"></i> <span>retweeted by <a href='/profile/${retweetBy}'>@${retweetBy}</a></span>`;
		retweetTimestamp = `<span>${timeDifference(Date.now(), new Date(postData.createdAt))}</span>`;
		// this post data place under the end of line
		postData = postData.retweetData;
	}
	const userData = postData.author;
	const likes = postData.likes?.length;
	const retweet = postData.retweetedBy?.length;
	const activeLikeClass = postData?.likes?.includes(user._id) ? 'active' : '';
	const activeRetweetClass = postData?.retweetedBy?.includes(user._id) ? 'active' : '';
	const timestamp = timeDifference(Date.now(), new Date(postData.createdAt));
	const avatar = postData.author?.profilePicture ? postData.author?.profilePicture : 'https://i.pravatar.cc/200';

	return `<div class="post" data-id='${postData._id}'>
				<div class='post-container'>
					<div class='retweet-container'> 
						${retweetText} ${retweetTimestamp} 
					</div>
					<div class='post-content'>
						<div class="imgContainer">
							<img
								src='${avatar}'
								alt="User's profile picture"
								srcset=""
							/>
						</div>
						<div class="post-body">
							<div class="pin-text">${pin}</div>
							<div class="post-header">
								<div class='post-header-info'>
									<span><a href='/profile/${userData?.userName}'>${userData?.userName}</a></span>
									<span><a href='/profile/${userData?.userName}'>@${userData?.userName}</a></span>
									<span>${timestamp}</span>
								</div>
								<div class='post-header-action'>
									${postAction}
								</div>
							</div>
							<div class="postBody">
								<p>${postData?.content}</p>
							</div>
							<div class="postFooter">
								<div class="post-btn-container">
									<button class='comment-btn'>
										<i class="fa-regular fa-comment"></i>
									</button>
								</div>
								<div class="post-btn-container green">
									<button class='tweet-btn ${activeRetweetClass}'>
										<i class="fa-solid fa-retweet"></i>
										<span>${retweet || ''}</span>
									</button>
								</div>
								<div class="post-btn-container red">
									<button class='like-btn ${activeLikeClass}'>
										<i class="fa-regular fa-heart"></i>
										<span>${likes || ''}</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`;
}

function htmlStructure({
	avatar,
	userName,
	timestamp,
	pin,
	content,
	postAction,
	activeLikeClass,
	activeRetweetClass,
	likes,
	retweet,
	retweetTimestamp,
}) {
	return `<div class="post">
	<div class="post-container">
		<div class="retweet-container">
			${retweet ? `${retweetTimestamp} ` : ''}${retweet || ''}
		</div>
		<div class="post-content">
			<div class="imgContainer">
				<img src="${avatar}" alt="User's profile picture" />
			</div>
			<div class="post-body">
				<div class="pin-text">${pin}</div>
				<div class="post-header">
					<div class="post-header-info">
						<span><a href="/profile/${userName}">${userName}</a></span>
						<span><a href="/profile/${userName}">@${userName}</a></span>
						<span>${timestamp}</span>
					</div>
					<div class="post-header-action">
						${postAction}
					</div>
				</div>
				<div class="postBody">
					<p>${content}</p>
				</div>
				<div class="postFooter">
					<div class="post-btn-container">
						<button class="comment-btn">
							<i class="fa-regular fa-comment"></i>
						</button>
					</div>
					<div class="post-btn-container green">
						<button class="tweet-btn ${activeRetweetClass}">
							<i class="fa-solid fa-retweet"></i>
							<span>${retweet || ''}</span>
						</button>
					</div>
					<div class="post-btn-container red">
						<button class="like-btn ${activeLikeClass}">
							<i class="fa-regular fa-heart"></i>
							<span>${likes || ''}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`;
}

function timeDifference(current, previous) {
	const msSecond = 1000,
		msMinute = msSecond * 60,
		msHour = msMinute * 60,
		msDay = msHour * 24,
		msMonth = msDay * 30,
		msYear = msDay * 365;

	const elapsed = current - previous;

	if (elapsed < msMinute) return Math.round(elapsed / msSecond) + ' seconds ago';
	if (elapsed < msHour) return Math.round(elapsed / msMinute) + ' minutes ago';
	if (elapsed < msDay) return Math.round(elapsed / msHour) + ' hours ago';
	if (elapsed < msMonth) return Math.round(elapsed / msDay) + ' days ago';
	if (elapsed < msYear) return Math.round(elapsed / msMonth) + ' months ago';
	return Math.round(elapsed / msYear) + ' years ago';
}

function handleInputChange(event) {
	const inputValue = event.target.value.trim();
	submitBtn.disabled = !inputValue;
}

function showToastMessage(message, displayDuration = 3000) {
	const toast = document.getElementById('toast-container');
	toast.textContent = message;
	toast.style.display = 'block';
	setTimeout(() => (toast.style.display = 'none'), displayDuration);
}

async function requestAPI(endpoint, method, data) {
	const response = await fetch(endpoint, {
		method,
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	});
	return response.json();
}

function loaderRemove(container) {
	if (!container) return;
	document.querySelector('.loader-wrapper').remove();
	container.style.display = 'initial';
}

// notification count
async function updateNotificationCount(element, endpoint) {
	const response = await requestAPI(endpoint);
	const count = response.notifications;
	const notification = document.querySelector(element);
	notification.textContent = count || '';
	notification.style.visibility = count ? 'visible' : 'hidden';
}
