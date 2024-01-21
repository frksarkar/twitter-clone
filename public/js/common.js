const submitBtm = document.querySelector('#submitPostBtn');
const textBox = document.querySelector('#postbox');
const postContainer = document.querySelector('.main-post-container');

let postValue;

// if typing then enable post button
textBox.addEventListener('keyup', (event) => {
	postValue = event.target.value.trim();
	if (postValue) {
		submitBtm.disabled = false;
		return;
	}
	submitBtm.disabled = true;
});

// create new post element btn
submitBtm.addEventListener('click', async (event) => {
	const formData = new FormData();
	formData.append('content', postValue);
	try {
		const request = await fetch('/api/posts', {
			method: 'POST',
			body: new URLSearchParams(formData).toString(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
		const newPostData = await request.json();

		if (newPostData.status === 'failed') {
			console.log('can not post');
			return;
		}

		textBox.value = '';
		submitBtm.disabled = true;

		// create a new post html element
		const newPostHtml = createHtml(newPostData.data);
		postContainer.insertAdjacentHTML('afterbegin', newPostHtml);

		// the new post place then delete the empty box
		const postBox = postContainer.querySelector('.empty');
		if (postBox && postBox.classList.contains('empty')) {
			postBox.remove();
		}
	} catch (error) {
		console.log('🚀 ~ submitBtm.addEventListener ~ error:', error);
	}
});

// create a new html element
function createHtml(postData) {
	const userData = postData.postedBy;
	const timestamp = timeDifference(Date.now(), new Date(postData.createdAt));

	return `<div class="post-container" data-id='${postData._id}'>
				<div class="imgContainer">
					<img
						src="https://i.pravatar.cc/300"
						alt="User's profile picture"
						srcset=""
					/>
				</div>
				<div class="post-body">
					<div class="post-header">
						<span>${userData.userName}</span>
						<span>@${userData.userName}</span>
						<span>${timestamp}</span>
					</div>
					<div class="postBody">
						<p>${postData.content}</p>
					</div>
					<div class="postFooter">
						<div class="post-btn-container">
							<button class='comment-btn'>
								<i class="fa-regular fa-comment"></i>
							</button>
						</div>
						<div class="post-btn-container">
							<button class='share-btn'>
								<i class="fa-solid fa-retweet"></i>
							</button>
						</div>
						<div class="post-btn-container">
							<button class='like-btn'>
								<i class="fa-regular fa-heart"></i>
							</button>
						</div>
					</div>
				</div>
			</div>`;
}

// date and time stamp
function timeDifference(current, previous) {
	let msPerMinute = 60 * 1000;
	let msPerHour = msPerMinute * 60;
	let msPerDay = msPerHour * 24;
	let msPerMonth = msPerDay * 30;
	let msPerYear = msPerDay * 365;

	let elapsed = current - previous;

	if (elapsed < msPerMinute) {
		if (elapsed / 1000 < 30) return 'just now';
		return Math.round(elapsed / 1000) + ' seconds ago';
	} else if (elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + ' minutes ago';
	} else if (elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) + ' hours ago';
	} else if (elapsed < msPerMonth) {
		return Math.round(elapsed / msPerDay) + ' days ago';
	} else if (elapsed < msPerYear) {
		return Math.round(elapsed / msPerMonth) + ' months ago';
	} else {
		return Math.round(elapsed / msPerYear) + ' years ago';
	}
}

