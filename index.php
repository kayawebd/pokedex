<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Explore Pokémon by type or language using this interactive Pokédex.">
    <title>PokeDex</title>
    <link rel="stylesheet" href="./styles/style.css">
    <script defer src="./scripts/script.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200;0,300;0,400;1,200;1,300&display=swap"
        rel="stylesheet">

</head>

<body>
    <a href="./index.php" class="site-heading">
        <h1>PokeDex</h1>
    </a>
    <div class="select_container">
        <label for="type_dropdown" class="sr-only">Filter by Type:</label>
        <select id="type_dropdown">
            <option value="all">All Types</option>
            <option value="Normal">Normal</option>
            <option value="Fire">Fire</option>
            <option value="Water">Water</option>
            <option value="Grass">Grass</option>
            <option value="Flying">Flying</option>
            <option value="Fighting">Fighting</option>
            <option value="Poison">Poison</option>
            <option value="Electric">Electric</option>
            <option value="Ground">Ground</option>
            <option value="Rock">Rock</option>
            <option value="Psychic">Psychic</option>
            <option value="Ice">Ice</option>
            <option value="Bug">Bug</option>
            <option value="Ghost">Ghost</option>
            <option value="Steel">Steel</option>
            <option value="Dragon">Dragon</option>
            <option value="Dark">Dark</option>
            <option value="Fairy">Fairy</option>
        </select>
        <label for="language_dropdown" class="sr-only">Select Language:</label>
        <select id="language_dropdown">
            <option value="english">English</option>
            <option value="japanese">日本語</option>
            <option value="chinese">中文</option>
            <option value="french">Française</option>
        </select>
    </div>
    <div id="poke_container" class="poke-container"></div>
</body>

</html>