const userInput = document.getElementById("user-input");
const checkBtn = document.getElementById("check-btn");
const clearBtn = document.getElementById("clear-btn");
const resultsDiv = document.getElementById("results-div");

// Function to validate the phone number
const checkValidNumber = (input) => {
  if (input === "") {
    alert("Please provide a phone number");
    return;
  }
  const countryCode = "^(1\\s?)?";
  const areaCode = "(\\([0-9]{3}\\)|[0-9]{3})";
  const spacesDashes = "[\\s\\-]?";
  const phoneNumber = "[0-9]{3}[\\s\\-]?[0-9]{4}$";
  const phoneRegex = new RegExp(
    `${countryCode}${areaCode}${spacesDashes}${phoneNumber}`
  );

  const pTag = document.createElement("p");
  pTag.className = "results-text";
  phoneRegex.test(input)
    ? (pTag.style.color = "#00471b")
    : (pTag.style.color = "#4d3800");
  pTag.appendChild(
    document.createTextNode(
      `${phoneRegex.test(input) ? "Valid" : "Invalid"} US number: ${input}`
    )
  );
  resultsDiv.appendChild(pTag);
};

// Function to handle numeric keypad input
const addToInput = (value) => {
  userInput.value += value;
};

// Event listeners for buttons
checkBtn.addEventListener("click", () => {
  checkValidNumber(userInput.value);
  userInput.value = "";
});

clearBtn.addEventListener("click", () => {
  resultsDiv.textContent = "";
  userInput.value = "";
});

// Event listener for Enter key
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkValidNumber(userInput.value);
    userInput.value = "";
  }
});

// Numeric keypad functionality
const keypadButtons = document.querySelectorAll(".key");
keypadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addToInput(button.textContent);
  });
});
