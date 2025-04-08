class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    shoot() {
        this.score += Math.random() > 0.5 ? 1 : 0;
    }
}

let playerNames = [];

function addPlayer() {
    const input = document.getElementById("playerInput");
    const name = input.value.trim();

    if (!name) {
        alert("Please enter a valid name.");
        return;
    }

    playerNames.push(name);
    input.value = "";
    updatePlayerList();
}

function removePlayer(index) {
    playerNames.splice(index, 1);
    updatePlayerList();
}

function updatePlayerList() {
    const listDiv = document.getElementById("playerList");

    if (playerNames.length === 0) {
        listDiv.innerHTML = "<h3>No players added yet.</h3>";
        document.getElementById("startButton") = true;
        return;
    }

    listDiv.innerHTML = "";
    playerNames.forEach((name, index) => {
        const playerItem = document.createElement("div");
        playerItem.className = "playerItem";
        playerItem.innerHTML = `
            Player ${index + 1} - ${name}
            <button class="removeBtn" onclick="removePlayer(${index})">Remove</button>
        `;
        listDiv.appendChild(playerItem);
    });
}

function createPlayers(nameArray) {
    return nameArray.map(name => new Player(name));
}

function round(players, attempts) {
    for (let i = 0; i < players.length; i++) {
        players[i].score = 0;
        for (let shot = 0; shot < attempts; shot++) {
            players[i].shoot();
        }
    }
}

function rankings(players) {
    return players.slice().sort((a, b) => b.score - a.score);
}

function checkTie(players) {
    const highestScore = players[0].score;
    return players.filter(p => p.score === highestScore);
}

function appendLog(message) {
    const log = document.getElementById("log");
    log.innerHTML += message + "\n";
    log.scrollTop = log.scrollHeight;
}

function clearLog() {
    document.getElementById("log").innerHTML = '';
}

function play() {
    clearLog();
    const players = createPlayers(playerNames);
    let rounds = 1;

    while (true) {
        appendLog("\nRound " + rounds);
        appendLog("________________\n")
        round(players, 10);
        const rank = rankings(players);
        for (let i = 0; i < rank.length; i++) {
            appendLog("Player " + (i + 1) + " - " + rank[i].name + " = " + rank[i].score + " points");
        }

        const tiedPlayers = checkTie(rank);
        if (tiedPlayers.length === 1) {
            appendLog("\nCHAMPION: " + tiedPlayers[0].name + " with " + tiedPlayers[0].score + " points!");
            break;
        } else {
            appendLog("\nTiebreaker needed between: " + tiedPlayers.map(p => p.name).join(", "));
            players.length = 0;
            tiedPlayers.forEach(p => players.push(p));
            rounds++;
        }
    }
}