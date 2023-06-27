const screen = document.getElementById("screen");
const backspace = document.getElementById("backspace-symbol");
const buttons = document.getElementsByTagName("button");
const historyButton = document.getElementById("historybutton");
const historyBackground = document.getElementById("history-background");
const historyPage = document.getElementById("history-page");
let screenvalue = "",
  lastScreenValue = "";
let maxHistoryItems = 6;
let isAnyNumber = false;

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function (e) {
    let buttontext = e.target.innerText;
    if (buttontext == "C") {
      if (e.key != "Enter") {
        console.log("Enter");
        clear();
      }
    } else if (isAnyNumber && buttontext == "X") {
      screenvalue += "*";
      screen.value = screenvalue;
    } else if (isAnyNumber && buttontext == "=") {
      calculateResult();
    } else if (buttontext == "00") {
      screenvalue += "00";
      screen.value = screenvalue;
    } else if (isNumber(buttontext)) {
      screenvalue += buttontext;
      screen.value = screenvalue;
      isAnyNumber = true;
    } else if (
      isAnyNumber &&
      (buttontext == "/" ||
        buttontext == "-" ||
        buttontext == "+" ||
        buttontext == ".")
    ) {
      screenvalue += buttontext;
      screen.value = screenvalue;
    }
  });
}
document.addEventListener("keydown", function (e) {
  if (e.key <= 9) {
    isAnyNumber = true;
    screenvalue += e.key;
    screen.value = screenvalue;
  }
  if (
    isAnyNumber &&
    (e == "*" ||
      e.key == "-" ||
      e.key == "/" ||
      e.key == "-" ||
      e.key == "+" ||
      e.key == ".")
  ) {
    screenvalue += e.key;
    screen.value = screenvalue;
  }
  if (e == "Escape") {
    clear();
  }
  if (e.key == "Backspace") {
    removeAtLast();
  }
  if (isAnyNumber && (e.key == "Enter" || e.key == "=")) {
    e.preventDefault();
    calculateResult();
  } else if (e.key == "r") {
    location.reload();
  }
});

backspace.addEventListener("click", function () {
  removeAtLast();
});
function removeAtLast() {
  if (screenvalue.length > 0) {
    screenvalue = screenvalue.substring(0, screenvalue.length - 1);
    screen.value = screenvalue;
  } else {
    isAnyNumber = false;
  }
}

historyButton.addEventListener("click", showHistory);
historyBackground.addEventListener("click", function (e) {
  if (e.target.classList.value == "history") return;
  historyBackground.classList.add("hide");
});

function isNumber(number) {
  return /^\d$/.test(number);
}
function clear() {
  isAnyNumber = false;
  screenvalue = "";
  screen.value = screenvalue;
}
function calculateResult() {
  let answer = eval(screenvalue);
  if (answer === undefined) return;
  screen.value = eval(screenvalue);
  lastScreenValue = screenvalue;
  screenvalue = screen.value;
  let history = JSON.parse(localStorage.getItem("history")) || [];
  if (history.length >= maxHistoryItems) {
    history.shift();
  }
  history.push({ value: lastScreenValue, result: screen.value });
  localStorage.setItem("history", JSON.stringify(history));
}

function showHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  if (history.length === 0) {
    let empty = document.createElement("div");
    empty.innerText = "No history available";
    empty.className = "history-element";
    historyPage.appendChild(empty);
  } else {
    historyPage.innerHTML = "";
    for (let i = history.length - 1; i >= 0; i--) {
      let empty = document.createElement("div");
      empty.innerText = `${history[i].value} =  ${history[i].result}`;
      empty.className = "history-element";
      historyPage.appendChild(empty);
      if (i > 0) {
        historyPage.appendChild(document.createElement("hr"));
      }
    }
  }

  historyBackground.classList.remove("hide");
}

window.onbeforeunload = function () {
  localStorage.clear();
};
