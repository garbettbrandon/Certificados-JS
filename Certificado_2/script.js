// Selección de elementos del DOM
const form = document.getElementById("form");
const convertButton = document.getElementById("convert-btn");
const output = document.getElementById("output");

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
    while (num >= value) {
      result += symbol;
      num -= value;
    }
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

  // Limpia el mensaje previo
  output.classList.remove("alert", "hidden");
  output.innerText = "";

  // Validación
  const errorMessage = validateInput(numStr, num);
  if (errorMessage) {
    output.innerText = errorMessage; // Muestra el mensaje de error
    output.classList.add("alert");
    return;
  }

  // Conversión y salida
  const romanNumeral = convertToRoman(num);
  output.innerText = romanNumeral;
};

// Eventos
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita recargar la página
  handleConversion();
});

convertButton.addEventListener("click", handleConversion);
