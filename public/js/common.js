const submitBtm = document.querySelector('#submitPostBtn');
const textBox = document.querySelector('#postbox');
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

submitBtm.addEventListener('click', async (event) => {
	const formData = new FormData();
	formData.append('content', postValue);
	try {
		const request = await  fetch('/api/post', {
			method: 'POST',
			body: formData
		})
		const data = await request.json();
		console.log("🚀 ~ submitBtm.addEventListener ~ data:", data)
	} catch (error) {
	}
});
