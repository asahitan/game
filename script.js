let timer, startTime;
let typingText = "Type this text as fast as you can...";
let userInput = document.getElementById('user-input');
let timerElement = document.getElementById('timer');
let wpmElement = document.getElementById('wpm');
let accuracyElement = document.getElementById('accuracy');

// Initialize game
document.getElementById('code-snippet').innerText = typingText;

userInput.addEventListener('input', function() {
    if (!timer) {
        startTime = new Date().getTime();
        timer = setInterval(updateTimer, 1000);
    }
    
    let typedText = userInput.value;
    updateStats(typedText);
});

function updateTimer() {
    let timeElapsed = Math.floor((new Date().getTime() - startTime) / 1000);
    timerElement.innerText = timeElapsed;
}

function updateStats(typedText) {
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === typingText[i]) {
            correctChars++;
        }
    }
    
    let accuracy = (correctChars / typedText.length) * 100;
    accuracyElement.innerText = Math.floor(accuracy);

    let wordsTyped = typedText.split(' ').length;
    let minutesElapsed = (new Date().getTime() - startTime) / 60000;
    let wpm = Math.floor(wordsTyped / minutesElapsed);
    wpmElement.innerText = wpm;
}
