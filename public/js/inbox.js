document.addEventListener('DOMContentLoaded', async (e) => {
	const resultContainer = document.querySelector('.show-result');
	const data = await requestAPI('/api/chat');
	let html = '';
	data.forEach((element) => {
		html += generateHtml(element);
	});
	resultContainer.insertAdjacentHTML('afterbegin', html);
});

function generateHtml(data) {
	const users = filterUser(data, user._id);
	const image = groupImage(users, data.isGroupChat);
	const groupName = data.chatName ? data.chatName : createGroupName(users);
	const latestMessage = data.latestMessage
		? recentMeg(data.latestMessage)
		: 'new';

	let className = data.isGroupChat ? 'group' : '';

	return `<a href="/api/chat/${data._id}">
	<div class="message-container">
	   <div class="img ${className}"> 
	   		${image}
	   </div>
	   <div class="chat-body">
		  <h3 class="chat-name">${groupName}</h3>
		  <p class="recent-message">${latestMessage}</p>
	   </div>
	</div>
 </a>`;
}

function recentMeg(data) {
	return `<span>${data?.sender.userName}: </span>${data.content}`;
}

function filterUser(data, loginUserId) {
	return data.users?.filter((user) => user._id != loginUserId);
}

function createGroupName(data) {
	let userName = '';
	data.forEach((user, index) => {
		if (!index) {
			userName += `${user.userName}`;
		} else {
			userName += `, ${user.userName}`;
		}
	});
	return userName;
}

function groupImage(data, isGroupImage) {
	let image = `<img src="${
		data[0]?.profilePicture || 'https://i.pravatar.cc/300'
	}  " alt="group-image"></img>`;

	if (isGroupImage) {
		image += `<img src="${
			data[1]?.profilePicture || 'https://i.pravatar.cc/300'
		}  " alt="group-image"></img>`;
	}
	return image;
}
