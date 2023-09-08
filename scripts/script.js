const homePageUrl = "index.html";
const currentUrl = window.location.href;

if (currentUrl.includes(homePageUrl)) {
  // Constants
  const pokemonsPerPage = 24;
  const colors = {
    fire: "#ef7d7d",
    grass: "#defde0",
    electric: "#fcf7de",
    water: "#def3fd",
    ground: "#f4e7da",
    rock: "#d5d5d4",
    fairy: "#fceaff",
    poison: "#98d7a5",
    bug: "#f8d5a3",
    dragon: "#97b3e6",
    psychic: "#dbb8f7",
    flying: "#f5f5f5",
    fighting: "#e6e0d4",
    normal: "#f5f5f5",
    Ice: "#b5e7f5",
    Ghost: "#a693b3",
    Dark: "#6f6f6f",
    Steel: "#c0c0d1",
  };

  // Elements
  const typeDropdown = document.getElementById("type_dropdown");
  const languageDropdown = document.getElementById("language_dropdown");
  const pokeContainer = document.getElementById("poke_container");

  // Variables
  let currentPage = 1;
  let allPokemonData = [];
  let filteredPokemons = [];
  let selectedLanguage = "english";

  // Event listeners
  if (languageDropdown) {
    languageDropdown.addEventListener("change", function () {
      selectedLanguage = languageDropdown.value;
      updatePokemonCards();
    });
  }

  if (typeDropdown) {
    typeDropdown.addEventListener("change", function () {
      const selectedType = typeDropdown.value;
      filterAndDisplayPokemons(selectedType);
    });
  }

  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      loadPokemons();
    }
  });

  // Functions
  const updatePokemonCards = () => {
    pokeContainer.innerHTML = "";
    filteredPokemons.forEach((pokemon) => {
      createPokemonCard(pokemon);
    });
  };

  const loadAllPokemonData = async () => {
    try {
      const response = await fetch("./pokeinfo/pokedex.json");
      allPokemonData = await response.json();
      filteredPokemons = allPokemonData;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadPokemons = () => {
    const start = (currentPage - 1) * pokemonsPerPage;
    const end = start + pokemonsPerPage;
    for (let i = start; i < end && i < filteredPokemons.length; i++) {
      createPokemonCard(filteredPokemons[i]);
    }
    currentPage++;
  };

  const filterAndDisplayPokemons = (selectedType) => {
    pokeContainer.innerHTML = "";
    if (selectedType === "all") {
      filteredPokemons = allPokemonData;
    } else {
      filteredPokemons = allPokemonData.filter((pokemon) => {
        return pokemon.type.includes(selectedType);
      });
    }
    currentPage = 1;
    loadPokemons();
  };

  const createPokemonCard = (pokemon) => {
    const name = pokemon.name[selectedLanguage];
    const type = pokemon.type[0];
    const color = colors[type.toLowerCase()];
    const paddedId = pokemon.id.toString().padStart(3, "0");
    const imageUrl = `./images/pokedex/thumbnails/${paddedId}.png`;

    const pokeInnerHTML = `
    <div class="img-container">
      <img src="${imageUrl}" alt="${pokemon.name.english}" />
    </div>
    <div class="info">
      <span class="number">${paddedId}</span>
      <h3 class="name">${name}</h3>
      <small class="type">Type: <span>${type}</span></small>
    </div>
  `;

    // Create the link element
    const linkElement = document.createElement("a");
    linkElement.href = `pokemon.html?id=${pokemon.id}`;

    // Create the Pokemon card element
    const pokemonEl = document.createElement("div");
    pokemonEl.classList.add("pokemon");
    pokemonEl.style.backgroundColor = color;
    pokemonEl.innerHTML = pokeInnerHTML;

    // Append the Pokemon card to the link element
    linkElement.appendChild(pokemonEl);

    // Append the link element to the container in the DOM
    pokeContainer.appendChild(linkElement);
  };

  // Initialization
  loadAllPokemonData().then(() => {
    loadPokemons("all");
  });
}

// Check if the URL contains "pokemon.html"
if (currentUrl.includes("pokemon.html")) {
  console.log("testing");
  // Get the Pokemon ID from the query parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonId = urlParams.get("id");

  // Fetch Pokemon data from the external JSON file
  fetch("./pokeinfo/pokedex.json")
    .then((response) => response.json())
    .then((data) => {
      const selectedPokemon = data.find(
        (pokemon) => pokemon.id === parseInt(pokemonId)
      );
      if (selectedPokemon) {
        // Update the HTML elements with fetched Pokemon data
        document.getElementById(
          "pokemon-image"
        ).src = `./images/pokedex/hires/${selectedPokemon.id
          .toString()
          .padStart(3, "0")}.png`;
        document.getElementById("pokemon-number").textContent =
          selectedPokemon.id.toString().padStart(3, "0");
        document.getElementById("pokemon-name").textContent =
          selectedPokemon.name.english;
        document.getElementById("pokemon-type").lastChild.textContent =
          selectedPokemon.type.join(", ");
        document.getElementById("pokemon-description").textContent =
          selectedPokemon.description;
        document.getElementById(
          "pokemon-height"
        ).textContent = `${selectedPokemon.profile.height}`;
        document.getElementById(
          "pokemon-weight"
        ).textContent = `${selectedPokemon.profile.weight}`;
        document.getElementById(
          "pokemon-egg"
        ).textContent = `${selectedPokemon.profile.egg.join(", ")}`;
        document.getElementById("pokemon-hp").textContent =
          selectedPokemon.base.HP;
        document.getElementById("pokemon-attack").textContent =
          selectedPokemon.base.Attack;
        document.getElementById("pokemon-defense").textContent =
          selectedPokemon.base.Defense;
        document.getElementById("pokemon-sp-attack").textContent =
          selectedPokemon.base["Sp. Attack"];
        document.getElementById("pokemon-sp-defense").textContent =
          selectedPokemon.base["Sp. Defense"];
        document.getElementById("pokemon-speed").textContent =
          selectedPokemon.base.Speed;
        document.getElementById(
          "pokemon-species"
        ).textContent = `${selectedPokemon.species}`;

        const abilitiesContainer = document.getElementById("pokemon-abilities");
        selectedPokemon.profile.ability.forEach((ability) => {
          const abilityElement = document.createElement("p");
          abilityElement.textContent = `${ability[0]}: ${
            ability[1] === "true" ? "Hidden Ability" : "Regular Ability"
          }`;
          abilitiesContainer.appendChild(abilityElement);
        });

        const genderTextContainer = document.getElementById("pokemon-gender");
        const genderRatio = selectedPokemon.profile.gender;
        const maleRatio = parseInt(genderRatio.split(":")[0]);
        const femaleRatio = parseInt(genderRatio.split(":")[1]);
        genderTextContainer.textContent = `${maleRatio}% male, ${femaleRatio}% female`;
      } else {
        console.error("Pokemon not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching Pokemon data:", error);
    });
}
