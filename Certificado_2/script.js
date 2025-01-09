// Selección de elementos del DOM
const form = document.getElementById("form");
const convertButton = document.getElementById("convert-btn");
const output = document.getElementById("output");
const savedConversionsContainer = document.getElementById("saved-conversions");

// Función para convertir números arábigos a romanos
const convertToRoman = (num) => {
  const ref = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1],
  ];

  let result = "";
  for (const [symbol, value] of ref) {
    const count = Math.floor(num / value);
    result += symbol.repeat(count);
    num -= value * count;
  }
  return result;
};

// Función para validar la entrada y devolver un mensaje de error si es inválida
const validateInput = (str, num) => {
  if (!str || str.match(/[e.]/g)) {
    return "Please enter a valid number.";
  }
  if (num < 1) {
    return "Please enter a number greater than or equal to 1.";
  }
  if (num > 3999) {
    return "Please enter a number less than or equal to 3999.";
  }
  return null; // Entrada válida
};

// Función para manejar la conversión y actualizar la interfaz
const handleConversion = () => {
  const numStr = document.getElementById("number").value;
  const num = parseInt(numStr, 10);
  const error = validateInput(numStr, num);
  if (error) {
    output.textContent = error;
    output.classList.remove("hidden");
    output.classList.add("alert");
    return;
  }
  const roman = convertToRoman(num);
  output.textContent = `${num} = ${roman}`;
  output.classList.remove("hidden");
  output.classList.remove("alert");
  saveConversion(num, roman);
};

// Función para guardar la conversión en localStorage
const saveConversion = (num, roman) => {
  const conversions = JSON.parse(localStorage.getItem("conversions")) || [];
  conversions.push({ num, roman });
  localStorage.setItem("conversions", JSON.stringify(conversions));
  displaySavedConversions();
};

// Función para mostrar las conversiones guardadas
const displaySavedConversions = () => {
  const conversions = JSON.parse(localStorage.getItem("conversions")) || [];
  savedConversionsContainer.innerHTML = "";
  conversions.forEach((conversion, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <span>${conversion.num} = ${conversion.roman}</span>
      <button onclick="deleteConversion(${index})">Delete</button>
    `;
    savedConversionsContainer.appendChild(div);
  });
};

// Función para eliminar una conversión específica
const deleteConversion = (index) => {
  const conversions = JSON.parse(localStorage.getItem("conversions")) || [];
  conversions.splice(index, 1);
  localStorage.setItem("conversions", JSON.stringify(conversions));
  displaySavedConversions();
};

// Event listener para el botón de conversión
convertButton.addEventListener("click", handleConversion);

// Mostrar las conversiones guardadas al cargar la página
document.addEventListener("DOMContentLoaded", displaySavedConversions);

// Eventos
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita recargar la página
  handleConversion();
});

convertButton.addEventListener("click", handleConversion);
