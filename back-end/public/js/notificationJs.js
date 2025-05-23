const notificationListContainer = document.querySelector('.listOfNotification');

document.addEventListener('DOMContentLoaded', async (e) => {
	const data = await requestAPI('/notifications/all');
	const html = htmlMarkup(data.notifications);
	notificationListContainer.insertAdjacentHTML('afterbegin', html);
});

function htmlMarkup(data) {
	let html = '';
	data.forEach((element) => {
		const receiveUser = element.userForm;
		const isActive = element.opened ? '' : 'active';
		const url = typeOfUrl(element);
		const title = typeOfNotification(element);

		html += htmlElement(
			url,
			element._id,
			isActive,
			receiveUser.profilePicture,
			title
		);
	});
	return html;
}

function htmlElement(url, elementId, isActive, profilePicture, title) {
	return `<a href="${url}" data-notificationid="${elementId}" onClick="markNotificationAsOpened(this); return false;"> 
				<div class="notification ${isActive}">
					<div class="imageContainer">
						<img src="${profilePicture}" alt="">
					</div><div class="title">
					<span>${title}</span>
					</div>
				</div>
			</a>`;
}

function typeOfUrl(notification) {
	const { notificationType, entryId } = notification;
	let path = '';
	switch (notificationType) {
		case 'retweet':
		case 'like':
			path = `/post/${entryId}`;
			break;
		case 'follow':
			path = `/profile/${entryId}`;
			break;
		case 'message':
			path = `/api/chat/${entryId}`;
	}
	return path;
}

function typeOfNotification({ notificationType, userForm }) {
	const user = userForm.userName;
	const map = {
		retweet: 'retweeted one of your posts',
		like: 'liked one of your posts',
		follow: 'started following you',
		message: 'sent you a message',
	};
	return `${user} ${map[notificationType]}`;
}

async function markNotificationAsOpened(btnElement) {
	const notificationId = btnElement.dataset.notificationid;
	const result = await requestAPI('/notifications/' + notificationId, 'PUT');
	if (result.status !== 'success') {
		return alert("can't open please try again");
	}
	window.location = btnElement.href;
}
