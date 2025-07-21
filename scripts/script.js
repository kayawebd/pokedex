// only run this on your “list” page
if (window.location.href.includes("pokedex")) {
  // — Constants & DOM refs —
  const pokemonsPerPage = 24;
  const colors = {
    fire: "#ef7d7d", grass: "#defde0", electric: "#fcf7de",
    water: "#def3fd", ground: "#f4e7da", rock: "#d5d5d4",
    fairy: "#fceaff", poison: "#98d7a5", bug: "#f8d5a3",
    dragon: "#97b3e6", psychic: "#dbb8f7", flying: "#f5f5f5",
    fighting: "#e6e0d4", normal: "#f5f5f5",
  };
  const typeDropdown = document.getElementById("type_dropdown");
  const languageDropdown = document.getElementById("language_dropdown");
  const pokeContainer = document.getElementById("poke_container");

  // — State —
  let currentPage = 1;
  let allPokemonData = [];
  let filteredPokemons = [];
  let selectedLanguage = "english";
  let spinnerTimer = null;
  let isLoading = false;

  // — Spinner helpers —
  function showLoadingSpinner() {
    spinnerTimer = setTimeout(() => {
      if (!document.querySelector(".loading-spinner")) {
        const s = document.createElement("div");
        s.className = "loading-spinner";
        s.textContent = "Loading…";
        pokeContainer.appendChild(s);
      }
    }, 200);
  }
  function hideLoadingSpinner() {
    clearTimeout(spinnerTimer);
    const s = document.querySelector(".loading-spinner");
    if (s) s.remove();
  }

  // — Data loading & rendering —
  async function loadAllPokemonData() {
    showLoadingSpinner();
    try {
      const res = await fetch("./pokeinfo/pokedex.json");
      allPokemonData = await res.json();
      filteredPokemons = allPokemonData;
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      hideLoadingSpinner();
      pokeContainer.innerHTML = "";  // clear old cards
      loadPokemons();                // first 24
      // now append & observe the sentinel
      pokeContainer.appendChild(sentinel);
      io.observe(sentinel);
    }
  }

  function loadPokemons() {
    showLoadingSpinner();
    const start = (currentPage - 1) * pokemonsPerPage;
    const end = start + pokemonsPerPage;
    for (let i = start; i < end && i < filteredPokemons.length; i++) {
      createPokemonCard(filteredPokemons[i]);
    }
    hideLoadingSpinner();
    currentPage++;
  }

  function createPokemonCard(p) {
    const name = p.name[selectedLanguage];
    const type = p.type[0].toLowerCase();
    const color = colors[type] || "#fff";
    const paddedId = String(p.id).padStart(3, "0");
    const imgUrl = `./images/pokedex/thumbnails/${paddedId}.png`;

    const link = document.createElement("a");
    link.href = `pokemon.html?id=${p.id}`;

    const card = document.createElement("div");
    card.className = "pokemon";
    card.style.backgroundColor = color;
    card.innerHTML = `
      <div class="img-container">
        <img src="${imgUrl}" alt="${p.name.english}" />
      </div>
      <div class="info">
        <span class="number">#${paddedId}</span>
        <h3 class="name">${name}</h3>
        <small class="type">Type: <span>${p.type.join(", ")}</span></small>
      </div>
    `;

    link.appendChild(card);
    pokeContainer.appendChild(link);
  }

  // — Filtering —
  function filterAndDisplayPokemons(type) {
    filteredPokemons = (type === "all")
      ? allPokemonData
      : allPokemonData.filter(p => p.type.includes(type));
    currentPage = 1;
    pokeContainer.innerHTML = "";
    loadPokemons();
  }

  // — Sentinel for preloading page N+1 —
  const sentinel = document.createElement("div");
  // give it a tiny height so it can actually be observed:
  sentinel.style.height = "1px";
  sentinel.style.width = "100%";
  sentinel.className = "scroll-sentinel";

  const io = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting && !isLoading) {
      isLoading = true;
      obs.unobserve(sentinel);

      loadPokemons();         // load next batch
      isLoading = false;

      // re-append & re-observe
      pokeContainer.appendChild(sentinel);
      obs.observe(sentinel);
    }
  }, {
    rootMargin: "200px 0px", // begin loading when sentinel is 200px from viewport
    threshold: 0
  });

  // — Event listeners —
  if (languageDropdown) {
    languageDropdown.addEventListener("change", () => {
      selectedLanguage = languageDropdown.value;
      currentPage = 1;
      pokeContainer.innerHTML = "";
      loadPokemons();
    });
  }
  if (typeDropdown) {
    typeDropdown.addEventListener("change", () => {
      filterAndDisplayPokemons(typeDropdown.value);
    });
  }

  // — Kick it off —
  loadAllPokemonData();
}
