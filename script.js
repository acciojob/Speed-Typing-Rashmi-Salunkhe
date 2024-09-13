const quoteDisplay = document.querySelector('.quote-display');
const quoteInput = document.getElementById('quoteInput');
const timerElement = document.querySelector('.timer');

let startTime;
let timerInterval;

// Fetch a random quote from the API
async function getRandomQuote() {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    return data.content;
}

// Display a new quote
async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplay.innerHTML = '';
    quote.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        quoteDisplay.appendChild(charSpan);
    });
    quoteInput.value = '';
    resetTimer();
    startTimer();
}

// Start the timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        timerElement.innerText = `${Math.floor((Date.now() - startTime) / 1000)}s`;
    }, 1000);
}

// Reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    timerElement.innerText = '0s';  // Reset display to '0s'
}

// Compare input to the displayed quote and mark characters as correct or incorrect
quoteInput.addEventListener('input', () => {
    const quoteArray = quoteDisplay.querySelectorAll('span');
    const inputArray = quoteInput.value.split('');

    let isCorrect = true;
    quoteArray.forEach((charSpan, index) => {
        const char = inputArray[index];
        if (char == null) {
            charSpan.classList.remove('correct', 'incorrect');
            isCorrect = false;
        } else if (char === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            isCorrect = false;
        }
    });

    if (isCorrect && inputArray.length === quoteArray.length) {
        // Typing complete, wait for 3 seconds before fetching a new quote
        resetTimer();
        setTimeout(renderNewQuote, 3000);
    }
});

// Start by rendering the first quote
renderNewQuote();
