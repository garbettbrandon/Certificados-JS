// Precio del producto
let price = 0; // Precio en euros

// Caja registradora (denominación y cantidad disponible en euros)
let cid = [
  ["ONE CENT", 1.01],
  ["TWO CENT", 2.05],
  ["FIVE CENT", 3.1],
  ["TEN CENT", 4.25],
  ["TWENTY CENT", 5],
  ["FIFTY CENT", 6],
  ["ONE EURO", 90],
  ["TWO EURO", 50],
  ["FIVE EURO", 55],
  ["TEN EURO", 20],
  ["TWENTY EURO", 60],
  ["FIFTY EURO", 100],
  ["ONE HUNDRED EURO", 200],
];

// Elementos del DOM para mostrar resultados
const displayChangeDue = document.getElementById("change-due");
const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const priceScreen = document.getElementById("price-screen");
const cashDrawerDisplay = document.getElementById("cash-drawer-display");
const btns = document.querySelectorAll(".btn");

// Formatea y muestra los resultados en el DOM
const formatResults = (status, change) => {
  displayChangeDue.innerHTML = `<p>Estado: ${status}</p>`;
  displayChangeDue.innerHTML += change
    .map(
      ([denominationName, amount]) =>
        `<p>${denominationName}: ${amount.toFixed(2)}€</p>`
    )
    .join("");
};

// Función principal para calcular el cambio
const checkCashRegister = () => {
  // Convertimos el efectivo y el precio a céntimos para evitar errores con decimales
  const cashInCents = Math.round(Number(cash.value) * 100); // Efectivo del cliente
  console.log(cashInCents);
  const priceInCents = Math.round(price * 100); // Precio del producto
  console.log(priceInCents);

  // Si el cliente no tiene suficiente dinero
  if (cashInCents < priceInCents) {
    alert("El cliente no tiene suficiente dinero.");
    cash.value = "";
    return;
  }

  // Si el cliente paga con el importe exacto
  if (cashInCents === priceInCents) {
    displayChangeDue.innerHTML =
      "<p>No hay cambio: el cliente ha pagado exacto.</p>";
    cash.value = "";
    return;
  }

  // Calcular el cambio debido en céntimos
  let changeDue = cashInCents - priceInCents;

  // Ordenar las denominaciones de mayor a menor y convertir a céntimos
  // reverse() para que las denominaciones más grandes estén al principio
  const reversedCid = [...cid]
    .reverse()
    .map(([denominationName, amount]) => [
      denominationName,
      Math.round(amount * 100),
    ]);

  // Valores de cada denominación en céntimos
  const denominations = [
    50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1,
  ];

  // Objeto para almacenar el resultado
  const result = { status: "OPEN", change: [] }; // Resultado del cambio

  // Total de dinero en la caja registradora. Se usa para comprobar si hay suficiente dinero.
  // Se usa .reduce() para sumar todos los valores de las denominaciones
  const totalCID = reversedCid.reduce(
    // total es el acumulador y [_, amount] es el valor actual
    (total, [_, amount]) => total + amount,
    // Inicializamos el acumulador en
    0
  );

  console.log(totalCID);

  // Si no hay suficiente dinero en caja para dar el cambio
  if (totalCID < changeDue) {
    displayChangeDue.innerHTML = "<p>Estado: FONDOS_INSUFICIENTES</p>";
    return;
  }

  // Si la caja quedará vacío después de dar el cambio
  if (totalCID === changeDue) {
    result.status = "CLOSED";
  }

  // Calcular el cambio denominación por denominación
  for (let i = 0; i < reversedCid.length; i++) {
    if (changeDue >= denominations[i] && changeDue > 0) {
      const [denominationName, total] = reversedCid[i]; // Nombre y cantidad disponible de la denominación
      const possibleChange = Math.min(total, changeDue); // Cantidad máxima que se puede devolver
      const count = Math.floor(possibleChange / denominations[i]); // Número de monedas/billetes
      const amountInChange = count * denominations[i]; // Cantidad que realmente devolvemos
      changeDue -= amountInChange; // Reducimos el cambio pendiente

      if (count > 0) {
        result.change.push([denominationName, amountInChange / 100]);
      }
    }
  }

  // Si no se pudo devolver todo el cambio
  if (changeDue > 0) {
    displayChangeDue.innerHTML = "<p>Estado: FONDOS_INSUFICIENTES</p>";
    return;
  }

  // Mostrar los resultados y actualizar el cajón
  formatResults(result.status, result.change);
  updateUI(result.change);
};

// Comprobar si hay datos para procesar
const checkResults = () => {
  if (!cash.value) {
    return;
  }
  checkCashRegister();
};

// Actualiza la interfaz de usuario y reduce el cajón de efectivo
const updateUI = (change) => {
  const currencyNameMap = {
    "ONE CENT": "1 céntimo",
    "TWO CENT": "2 céntimos",
    "FIVE CENT": "5 céntimos",
    "TEN CENT": "10 céntimos",
    "TWENTY CENT": "20 céntimos",
    "FIFTY CENT": "50 céntimos",
    "ONE EURO": "1 euro",
    "TWO EURO": "2 euros",
    "FIVE EURO": "5 euros",
    "TEN EURO": "10 euros",
    "TWENTY EURO": "20 euros",
    "FIFTY EURO": "50 euros",
    "ONE HUNDRED EURO": "100 euros",
  };

  // Actualizar el cajón si se ha entregado cambio
  if (change) {
    change.forEach(([changeDenomination, changeAmount]) => {
      const targetArr = cid.find(
        ([denominationName]) => denominationName === changeDenomination
      );
      targetArr[1] =
        (Math.round(targetArr[1] * 100) - Math.round(changeAmount * 100)) / 100;
    });
  }

  // Limpiar el campo de efectivo
  cash.value = "";
  priceScreen.textContent = `Total: ${price.toFixed(2)}€`;
  cashDrawerDisplay.innerHTML = `<p><strong>Efectivo en caja:</strong></p>
    ${cid
      .map(
        ([denominationName, amount]) =>
          `<p>${currencyNameMap[denominationName]}: ${amount.toFixed(2)}€</p>`
      )
      .join("")}
  `;
};

// Función para actualizar el price screen
const updatePriceScreen = (value) => {
  if (value === "C") {
    price = 0;
    priceScreen.textContent = `Total: ${price.toFixed(2)}€`;
  } else {
    if (value === ".") {
      if (!price.toString().includes(".")) {
        price = price.toString() + ".";
      }
    } else {
      if (price.toString().includes(".")) {
        price = price.toString() + value.toString();
      } else {
        price = parseFloat(price.toString() + value.toString());
      }
    }
    priceScreen.textContent = `Total: ${parseFloat(price).toFixed(2)}€`;
  }
  console.log(price);
};

// Función para cada botón numérico que modifica el price screen
btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.textContent === "," ? "." : btn.textContent;
    updatePriceScreen(value);
  });
});

// Escuchar el clic del botón de compra
purchaseBtn.addEventListener("click", checkResults);

// Permitir presionar Enter para calcular el cambio
cash.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkResults();
  }
});

// Actualizar la interfaz al inicio
updateUI();
