const messageInput = document.querySelector('#chatMessageInput');
const messageBox = document.querySelector('.message-box');
let typingTimeoutId;

document.addEventListener('DOMContentLoaded', async (e) => {
	socket.emit('join-chats', chatId);
	const allMassages = await requestAPI('/api/message/' + chatId);
	const html = margHtml(allMassages.messages);
	messageBox.insertAdjacentHTML('beforeend', html);
	document.querySelector('.loader-wrapper').remove();
	messageBox.style.display = 'initial';
	scrollPage('.chat-messages');
});

function margHtml(allMassages) {
	let element = '';
	let lastSenderId = '';
	allMassages.forEach((message, index) => {
		element += createMessageHtml(
			message,
			allMassages[index + 1],
			lastSenderId
		);
		lastSenderId = message.sender._id;
	});
	return element;
}

document.addEventListener('click', (e) => {
	//  find chat name change button
	const chatNameChangeBtn = e.target.closest('.chat-title');
	chatNameChangeBtn
		? toggleActive('.changeChatNameContainer', '', chatNameChangeBtn)
		: null;

	//  find chat name change popup box btn
	const closeChatPopupBoxBtn = e.target.closest('.btn-close-popup');
	closeChatPopupBoxBtn
		? toggleActive('.changeChatNameContainer', 'close')
		: null;

	//  find change chat name submit button
	const chatNameSubmitBtn = e.target.closest('#change-name-btn');
	chatNameSubmitBtn ? changeChatName('#chatNameInput') : null;

	//	find message submit button
	const messageSendBtn = e.target.closest('.message-send');
	messageSendBtn ? validMessage() : null;
});

function toggleActive(container, action, e) {
	//  popup box
	const popupContainer = document.querySelector(container);
	// overlay screen
	const overlayScreen = document.querySelector('.overlay');

	if (action !== 'close') {
		//  active class
		overlayScreen.classList.add('active');
		popupContainer.classList.add('active');
		setInputValue(e, '#chatNameInput');
	} else {
		//  remove class
		popupContainer.classList.remove('active');
		overlayScreen.classList.remove('active');
	}
}

function setInputValue(element, elemName) {
	const value = element.innerText;
	const inputElement = document.querySelector(elemName);
	inputElement.value = value;
	inputElement.focus();
}

function changeChatName(inputName) {
	const inputElement = document.querySelector(inputName);
	const value = inputElement?.value.trim();
	if (value) {
		requestAPI('/api/chat/' + chatId, 'PUT', { chatName: value });
	} else {
		showToastMessage('Name cannot be empty.');
	}
}

messageInput.addEventListener('keypress', (e) => {
	typing();
	if (e.which !== 13) return;
	e.preventDefault();
	validMessage();
});

function typing() {
	socket.emit('typing', chatId);
}

function validMessage() {
	const value = messageInput.value.trim();
	if (!value) return showToastMessage("don't send empty value");
	sendMessage(value);
}

async function sendMessage(value) {
	const { status, message } = await requestAPI(
		'/api/message/' + chatId,
		'POST',
		{ content: value }
	);

	if (status == 'failed') return alert("message can't send");

	domInsertMsg(message);
	messageInput.value = '';
	messageInput.focus();
	socket.emit('message', message);
}

function domInsertMsg(message) {
	const html = createMessageHtml(message);
	messageBox.insertAdjacentHTML('beforeend', html);
	scrollPage('.chat-messages', true);
}

function createMessageHtml(data, nextMessage, lastSenderId) {
	const msgLogic = messageStyleLogic(data, nextMessage, lastSenderId);

	return `<li class="message-container ${msgLogic.msgClassName}" data-messageId="${data._id}">
				${msgLogic.userImageContainer}
				<div class="message-body">
					${msgLogic.userNameHtml}
					<div class="message">
						<span >${data.content}</span>
					</div>
				</div>
			</li>`;
}

function messageStyleLogic(data, nextMessage, lastSenderId) {
	const isMe = user._id == data.sender._id;
	let msgClassName = isMe ? 'me' : 'they';

	const sender = data.sender;
	const senderName = sender.userName;

	const currantSenderId = sender._id;
	const nextSenderId = nextMessage ? nextMessage.sender._id : '';

	const isFirst = currantSenderId != lastSenderId;
	const isLast = currantSenderId != nextSenderId;

	let userNameHtml = '';
	let userImageContainer = '';
	let userImage = '';

	if (isFirst) {
		msgClassName += ' first';
		if (!isMe) {
			userNameHtml += `<div class='sender-name'> <span >${senderName}</span></div>`;
		}
	}

	if (isLast) {
		msgClassName += ' last';
		if (!isMe) {
			userImage += `<img src="${sender.profilePicture}">`;
		}
	}

	if (!isMe) {
		userImageContainer += `<div class='sender-img'>${userImage}</div>`;
	}

	return { msgClassName, userNameHtml, userImageContainer };
}

function scrollPage(container, smooth) {
	const box = document.querySelector(container);
	const scrollHight = box.scrollHeight - box.clientHeight;
	if (smooth) {
		box.style.scrollBehavior = 'smooth';
	}
	box.scrollTop = scrollHight;
}

function removeTypingAnim() {
	const typingIndicator = document.querySelector('.typing-loader-container');
	typingIndicator.classList.remove('typing');
}

socket.on('typing', typingIndicator);

function messageReceive(messageData) {
	removeTypingAnim();
	domInsertMsg(messageData);
}

function typingIndicator() {
	const typingIndicator = document.querySelector('.typing-loader-container');
	typingIndicator.classList.add('typing');

	clearTimeout(typingTimeoutId);

	typingTimeoutId = setTimeout(() => {
		removeTypingAnim();
	}, 5000);
}
