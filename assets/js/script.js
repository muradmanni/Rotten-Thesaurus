var randomWordGenerator = "?random=true"; // parameter for generating random words
var enteredInput = "test"; // form-input.value is supposed to be entered here, not a string.

const options = { // code provided by API docs
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
		'X-RapidAPI-Key': '6ecbaac172msh867cf483a4913b6p183836jsn739ee58e425f'
	}
};

// these are two different calls below, the code currently written as is will make two calls

// to get a random word: GET https://wordsapiv1.p.mashape.com/words?random=true
fetch('https://wordsapiv1.p.rapidapi.com/words/' + randomWordGenerator, options) // code provided by API docs
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));

// to get a word you input: GET https://wordsapiv1.p.mashape.com/words/{word}
fetch('https://wordsapiv1.p.rapidapi.com/words/' + enteredInput, options) // code provided by API docs
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));

// word details that can appear in JSON Format, see docs: https://www.wordsapi.com/docs/#get-word-details

// if you want to play around with the words API, please use free demonstrator at: https://www.wordsapi.com/
// regarding API Calls using the API Key, please use it sparingly as there is a limit of 2500 calls per day and exceeding that 2500 call limit results in a charge of $0.004 per call after that 2500 limit. 
