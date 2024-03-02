let timer;
let press = false;
const selectedUser = [];

document.addEventListener('click', (e) => {
	const userHtml = e.target.closest('.follow-container');
	const userId = userHtml?.dataset.userid;
	if (userId && !selectedUser.includes(userId)) {
		const name = userHtml.querySelector('span').innerText;
		selectedUser.push(userId);
		document.querySelector('.show-result').innerHTML = '';
		clearInput();
		addFriendsToContainer(userId, name);
		createChatBtnToggle(selectedUser);
	}
});

function clearInput() {
	const searchInput = document.querySelector('#searchInputText');
	searchInput.value = '';
	searchInput.focus();
}

function addFriendsToContainer(userId, name) {
	document
		.querySelector('.add-friends')
		.insertAdjacentHTML(
			'beforeend',
			`<span data-id=${userId}> ${name} </span>`
		);
}

function createChatBtnToggle(users) {
	if (users?.length) {
		document.querySelector('#create-chat-btn').disabled = false;
	} else {
		document.querySelector('#create-chat-btn').disabled = true;
	}
}

function removeUserElement() {
	const userId = selectedUser.pop();
	document.querySelector(`span[data-id="${userId}"]`)?.remove();
	createChatBtnToggle(selectedUser);
}

document.querySelector('#searchInputText').addEventListener('keyup', (e) => {
	clearTimeout(timer);
	const value = e.target.value.trim();

	if (!press && !value && e.keyCode == 8) {
		press = true;
		removeUserElement();
		setTimeout(() => {
			press = false;
		}, 500);
	}

	timer = setTimeout(() => {
		if (value) {
			searchResult(value, user._id);
		} else {
			document.querySelector('.show-result').innerHTML =
				'<h3 class="not-found">Result Not Found</h3>';
		}
	}, 500);
});

document.querySelector('#create-chat-btn').addEventListener('click', () => {
	if (selectedUser.length) {
		createChat(selectedUser);
	}
});

async function searchResult(value, loginUserId) {
	let htmlMarkup = '';
	const users = await getPosts('/users', value);

	if (users.length) {
		users.forEach((user) => {
			if (loginUserId == user._id || selectedUser.includes(user._id))
				return;
			htmlMarkup += createUserHtml(user);
		});
	} else {
		document.querySelector('.show-result').innerHTML =
			'<h3 class="not-found">Users Not Found</h3>';
		return;
	}

	document.querySelector('.show-result').innerHTML = htmlMarkup;
}

function createUserHtml(searchUser) {
	return `<a href="#" class="follow-container" data-userid="${searchUser._id}">
				<div class="img-container">
                    <img src="${searchUser.profilePicture}" alt="" srcset="">
                </div>
					<div class="info">
						<h3>${searchUser.userName}</h3>
						<span>${searchUser.userName}</span>
				    </div>
			</a>`;
}

async function getPosts(url, value) {
	const postData = await fetch(`${url}?search=${value}`, {
		method: 'GET',
	});

	return postData.json();
}

async function createChat(data) {
	const url = '/api/chat/create';
	const postData = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
	});

	return postData.json();
}
