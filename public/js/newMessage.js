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
	document.querySelector('#create-chat-btn').disabled = !users.length;
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

document
	.querySelector('#create-chat-btn')
	.addEventListener('click', async () => {
		if (selectedUser.length) {
			const result = await requestAPI(
				'/api/chat/create',
				'POST',
				selectedUser
			);
			if (result) {
				showToastMessage('Group created successfully');
				setTimeout(() => location.reload(), 3000);
			}
		}
	});

async function searchResult(value, loginUserId) {
	let htmlMarkup = '';
	const users = await requestAPI(`/users?search=${value}`);

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

function createUserHtml({ _id, profilePicture, userName }) {
	return `<a href="#" class="follow-container" data-userid="${_id}">
				<div class="img-container">
                    <img src="${profilePicture}" alt="" srcset="">
                </div>
					<div class="info">
						<h3>${userName}</h3>
						<span>${userName}</span>
				    </div>
			</a>`;
}
