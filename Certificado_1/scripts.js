const userInput = document.getElementById("text-input");
const checkBtn = document.getElementById("check-btn");
const resultDiv = document.getElementById("result");

const getStoredWords = () => {
  const words = JSON.parse(localStorage.getItem("words")) || [];
  console.log(words);  // Para depurar
  return words;
};

const saveWord = (word, isPalindrome) => {
  const words = getStoredWords();
  words.push({ word, isPalindrome });
  localStorage.setItem("words", JSON.stringify(words));
};

const removeWord = (index) => {
  const words = getStoredWords();
  words.splice(index, 1);
  localStorage.setItem("words", JSON.stringify(words));
  displayWords();
};

const displayWords = () => {
  resultDiv.classList.remove('hidden'); // Asegúrate de que el div esté visible
  resultDiv.replaceChildren();
  const words = getStoredWords();
  words.forEach((item, index) => {
    const pTag = document.createElement("p");
    pTag.className = "user-input";
    pTag.innerText = `${item.word} ${
      item.isPalindrome ? "is" : "is not"
    } a palindrome.`;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", () => removeWord(index));

    pTag.appendChild(deleteBtn);
    resultDiv.appendChild(pTag);
  });
};

const checkPalindrome = (input) => {
  const originalInput = input;

  if (input == "") {
    alert("Please input a value");
    return;
  }

  const normalizedString = input.replace(/[^A-Za-z0-9]/gi, "").toLowerCase();
  const isPalindrome =
    normalizedString === [...normalizedString].reverse().join("");
  saveWord(originalInput, isPalindrome);
  displayWords();
};

checkBtn.addEventListener("click", () => {
  checkPalindrome(userInput.value);
  userInput.value = "";
});

userInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    checkPalindrome(userInput.value);
    userInput.value = "";
  }
});

// Initial display of stored words
displayWords();
