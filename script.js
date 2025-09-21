// DOM elements
const inputVocab = document.getElementById("input_vocab");
const inputMeaning = document.getElementById("input_meaning");
const btnAdd = document.getElementById("btn_add");
const timerDisplay = document.getElementById("timer");
const btnStart = document.getElementById("btn_start");
const btnStop = document.getElementById("btn_stop");
const btnReset = document.getElementById("btn_reset");
const clickerBtn = document.getElementById("coffee_btn");
const vocabListDisplay = document.getElementById("vocab_list_display");

// Data
let listVocab = [];
let listVocabTranslation = [];
let clickCount = 0;
let clickMultiplier = 1;
let timer = null;
let seconds = 0;
let clickUpgradeCost = 20;

// short form for delays
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Cookie helpers
function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split('; ').reduce((acc, curr) => {
        const [k, v] = curr.split('=');
        acc[k] = decodeURIComponent(v);
        return acc;
    }, {});
    return cookies[name];
}

function saveToCookies() {
    setCookie("vocabList", JSON.stringify(listVocab));
    setCookie("vocabTranslation", JSON.stringify(listVocabTranslation));
}

function loadFromCookies() {
    const storedList = getCookie("vocabList");
    const storedTranslations = getCookie("vocabTranslation");

    if (storedList && storedTranslations) {
        listVocab = JSON.parse(storedList);
        listVocabTranslation = JSON.parse(storedTranslations);
    }
}

// Vocab logic
function addVocab() {
    const vocab = inputVocab.value.trim();
    const translation = inputMeaning.value.trim();

    if (vocab && translation) {
        listVocab.push(vocab);
        listVocabTranslation.push(translation);
        saveToCookies();
        inputVocab.value = "";
        inputMeaning.value = "";
        showList();
    }
}

function showList() {
    if (listVocab.length === 0) {
        vocabListDisplay.innerHTML = "<p>No vocabulary added yet.</p>";
        return;
    }

    vocabListDisplay.innerHTML = `
        <h2>Vocabulary List</h2>
        <ul>
            ${listVocab.map((word, i) => `<li>${word} – ${listVocabTranslation[i]}</li>`).join("")}
        </ul>
    `;
}

// Timer logic
function startTimer() {
    if (!timer) {
        timer = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
}

// Clicker logic
function handleClick() {
    clickCount += clickMultiplier;
    clickerBtn.textContent = `🍪 ${clickCount}`;
}

// Upgrade logic
async function handleUpgradeClick(e) {
    if (!e.currentTarget) return;  // Defensive check

    const btn = e.currentTarget;
    const type = btn.dataset.upgrade;

    if (clickCount >= clickUpgradeCost) {
        if (type === "espresso") {
            clickMultiplier += 1;
            clickCount -= clickUpgradeCost;
            clickerBtn.textContent = `🍪: ${clickCount}`;
            clickUpgradeCost *= 2;
            btn.textContent = `Espresso Machine (+1/click for ${clickUpgradeCost} clicks)`;
        }
    } else {
        // Not enough clicks for upgrade - show error message
        btn.textContent = "You don't have enough Beans";
        btn.dataset.error = "true";
        await delay(2000);
        btn.dataset.error = "false";
        btn.textContent = `Espresso Machine (+1/click for ${clickUpgradeCost} clicks)`;
    }
}

// Add event listeners
btnAdd.addEventListener("click", addVocab);
btnStart.addEventListener("click", startTimer);
btnStop.addEventListener("click", stopTimer);
btnReset.addEventListener("click", resetTimer);
clickerBtn.addEventListener("click", handleClick);

document.querySelectorAll('.upgrade-btn').forEach(btn => {
    btn.addEventListener('click', handleUpgradeClick);
});

inputMeaning.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        btnAdd.click();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadFromCookies();
    showList();
    updateTimerDisplay();
});
//For what are you searching? ඞ
