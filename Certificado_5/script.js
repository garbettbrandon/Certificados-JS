document.addEventListener("DOMContentLoaded", () => {
  //Elementos del DOM
  const pokemonID = document.getElementById("pokemon-id");
  const pokemonName = document.getElementById("pokemon-name");
  const spriteContainer = document.getElementById("sprite-container");
  const types = document.getElementById("types");
  const height = document.getElementById("height");
  const weight = document.getElementById("weight");
  const hp = document.getElementById("hp");
  const attack = document.getElementById("attack");
  const defense = document.getElementById("defense");
  const specialAttack = document.getElementById("special-attack");
  const specialDefense = document.getElementById("special-defense");
  const speed = document.getElementById("speed");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const backButton = document.getElementById("back-button");
  const forwardButton = document.getElementById("forward-button");

  // Varibales
  let history = JSON.parse(localStorage.getItem("pokemonHistory")) || [];
  let currentIndex = history.length - 1;

  // Función para obtener el pokemon
  const getPokemon = async () => {
    try {
      const pokemonNameOrId = searchInput.value.toLowerCase();
      const response = await fetch(
        `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokemonNameOrId}`
      );
      const data = await response.json();
      displayPokemon(data);
      saveToHistory(data);
      currentIndex = history.length - 1;
      updateNavButtons();
    } catch (err) {
      resetDisplay();
      alert("Pokémon not found");
      console.log(`Pokémon not found: ${err}`);
    }
  };

  const displayPokemon = (data) => {
    // Mostramos la información del pokemon
    pokemonName.textContent = `${data.name}`;
    pokemonID.textContent = `#${data.id}`;
    weight.textContent = `Weight: ${data.weight}`;
    height.textContent = `Height: ${data.height}`;
    spriteContainer.innerHTML = `<img id="sprite" src="${data.sprites.front_default}" alt="${data.name} front default sprite">`;
    types.innerHTML = data.types
      .map(
        (obj) => `<span class="type ${obj.type.name}">${obj.type.name}</span>`
      )
      .join("");

    // stats
    hp.textContent = data.stats[0].base_stat;
    attack.textContent = data.stats[1].base_stat;
    defense.textContent = data.stats[2].base_stat;
    specialAttack.textContent = data.stats[3].base_stat;
    specialDefense.textContent = data.stats[4].base_stat;
    speed.textContent = data.stats[5].base_stat;
  };

  // Función para resetear la pantalla
  const resetDisplay = () => {
    // Eliminamos la imagen del pokemon
    const sprite = document.getElementById("sprite");
    if (sprite) sprite.remove();
    // Reseteamos los valores de los elementos
    pokemonName.textContent = "";
    pokemonID.textContent = "";
    types.innerHTML = "";
    height.textContent = "";
    weight.textContent = "";
    hp.textContent = "";
    attack.textContent = "";
    defense.textContent = "";
    specialAttack.textContent = "";
    specialDefense.textContent = "";
    speed.textContent = "";
  };

  const saveToHistory = (data) => {
    // Creamos un objeto con la información del Pokémon.
    const pokemonData = {
      name: data.name,
      id: data.id,
      weight: data.weight,
      height: data.height,
      sprite: data.sprites.front_default,
      types: data.types.map((obj) => obj.type.name),
      stats: data.stats.map((stat) => stat.base_stat),
    };
    // Agregamos el Pokémon al historial.
    history.push(pokemonData);
    // Guardamos el historial actualizado en localStorage.
    localStorage.setItem("pokemonHistory", JSON.stringify(history));
  };

  const updateNavButtons = () => {
    // Actualizamos el estado de los botones de navegación.
    // si hay botones
    if (backButton && forwardButton) {
      // Deshabilitamos los botones si no es posible navegar.
      backButton.disabled = currentIndex <= 0;
      // Deshabilitamos el botón de avance si no es posible navegar.
      forwardButton.disabled = currentIndex >= history.length - 1;

      // Añadimos o eliminamos la clase "disabled" según sea necesario.
      if (backButton.disabled) {
        backButton.classList.add("disabled");
      } else {
        backButton.classList.remove("disabled");
      }
      // Añadimos o eliminamos la clase "disabled" según sea necesario.
      if (forwardButton.disabled) {
        forwardButton.classList.add("disabled");
      } else {
        forwardButton.classList.remove("disabled");
      }
    }
  };

  const navHistory = (direction) => {
    if (direction === "back" && currentIndex > 0) {
      currentIndex--; // Retrocedemos en el historial.
    } else if (direction === "forward" && currentIndex < history.length - 1) {
      currentIndex++; // Avanzamos en el historial.
    } else {
      return; // Salir si no es posible navegar
    }
    // Obtenemos el Pokémon correspondiente al índice actual.
    const data = history[currentIndex];
    if (data) {
      // Mostramos los datos del Pokémon en la interfaz.
      displayPokemon({
        name: data.name,
        id: data.id,
        weight: data.weight,
        height: data.height,
        sprites: { front_default: data.sprite },
        types: data.types.map((type) => ({ type: { name: type } })),
        stats: data.stats.map((stat) => ({ base_stat: stat })),
      });
    }
    // Actualizamos el estado de los botones de navegación.
    updateNavButtons();
  };

  const init = () => {
    history = JSON.parse(localStorage.getItem("pokemonHistory")) || [];
    currentIndex = history.length - 1;
    // Si hay elementos en el historial, mostramos el último Pokémon buscado.
    if (currentIndex >= 0) {
      const lastPokemon = history[currentIndex];
      displayPokemon({
        name: lastPokemon.name,
        id: lastPokemon.id,
        weight: lastPokemon.weight,
        height: lastPokemon.height,
        sprites: { front_default: lastPokemon.sprite },
        types: lastPokemon.types.map((type) => ({ type: { name: type } })),
        stats: lastPokemon.stats.map((stat) => ({ base_stat: stat })),
      });
    }
    // Actualizamos el estado inicial de los botones de navegación.
    updateNavButtons();
  };

  init();

  // Event listeners

  if (backButton) {
    backButton.addEventListener("click", (e) => {
      e.preventDefault();
      navHistory("back");
    });
  }

  if (forwardButton) {
    forwardButton.addEventListener("click", (e) => {
      e.preventDefault();
      navHistory("forward");
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      getPokemon();
    });
  }
});
