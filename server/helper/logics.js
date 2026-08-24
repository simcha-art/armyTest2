function calculatePower(soldiersAmount) {
    const luck = 0.6 + Math.random() * 0.4;
    return soldiersAmount * luck;
}

function calculateSurvivals(winnerSoldiers, winnerPower, loserPower) {
    return Math.max(
        1,
        Math.ceil((winnerSoldiers * (winnerPower - loserPower)) / winnerPower),
    );
}


function playerTerrs(territories) {
    return territories.filter(t => t.owner === "player")
}

function computerTerrs(territories) {
    return territories.filter(t => t.owner === "computer")
}

function borderTerrs(territories) {
    const playerTerrsIds = playerTerrs(territories).map(t => t.id)
    const computerTerrirtories = computerTerrs(territories)
    const borderTerrs = computerTerrirtories.filter(t => {
        let isBorder;
        playerTerrsIds.forEach(terrId => {
            if (t.neighbors.includes(terrId)) {
                isBorder = true
                console.log(isBorder)
            }
        });
        return isBorder
    })
    return borderTerrs
}

function isProtectionState(territories) {
    const playerTerritories = playerTerrs(territories)
    const distances = playerTerritories.map(t => t.distanceFromComputerHQ) 
    const minDist = Math.min(...distances)
    return minDist < 2
}


function chooseTerrToReinforce(isProtectState, territories) {
    const borderTerritories = borderTerrs(territories)
    
    let result, distances, minDist, minId;
    if (isProtectState) {
        console.log("protect")
        distances = borderTerritories.map(t => t.distanceFromComputerHQ)
        minDist = Math.min(...distances)
        result = borderTerritories.filter(t => t.distanceFromComputerHQ === minDist)

        if (result.length > 1) {
            const minSoldiers = Math.min(...result.map(t => t.soldiers))
            result = result.filter(t => t.soldiers === minSoldiers)
        }

        if (result.length > 1) {
            const minId = Math.min(...result.map(t => t.id))
            result = result.filter(t => t.id === minId)
        }

    } else {
        distances = borderTerritories.map(t => t.distanceFromPlayerHQ)
        minDist = Math.min(...distances)
        result = borderTerritories.filter(t => t.distanceFromPlayerHQ === minDist)

        if (result.length > 1) {
            const maxSoldiers = Math.max(...borderTerritories.map(t => t.soldiers))
            result = result.filter(t => t.soldiers === maxSoldiers)
        }

        if (result.length > 1) {
            minId = Math.min(...result.map(t => t.id))
            result = result.filter(t => t.id === minId)
        }
    }
    return result[0]
}

function computerReinforce(territories) {
    const isProtection = isProtectionState(territories)
    const toReinforce = chooseTerrToReinforce(isProtection, territories)
    toReinforce.soldiers += 3
    return toReinforce.id
}

function PlayerHQ(territories) {
    return territories.filter(t => t.owner === "player" && t.headquarters)[0]
}

function canAttackHQ(pHQ, borderTerritories) {
    for (const t of borderTerritories) {
        if (t.neighbors.includes(pHQ.id) && t.soldiers > pHQ.soldiers) {
            return t
        }
    }
}

function canAttackPlayerTerrs(borderTerritories, playerTerritories) {
    const attacksAvailable = []
    borderTerritories.forEach(ct => {
        for (const pt of playerTerritories) {
            if (ct.neighbors.includes(pt.id) && (ct.soldiers / pt.soldiers) >= 1.35) {
                attacksAvailable.push({ct, pt})
            }
        }
    })
    return attacksAvailable
}




const exampleTerrs = [
  { "id": 1,  "name": "טריפולי",      "x": 63.00, "y": 4.00,  "neighbors": [2, 3], "soldiers": 6, "owner": "computer", "distanceFromComputerHQ": 1, "distanceFromPlayerHQ": 6 },
  { "id": 2,  "name": "ביירות",       "x": 50.80, "y": 13.00, "neighbors": [1, 4, 5], "soldiers": 8, "owner": "computer", "headquarters": true, "distanceFromComputerHQ": 0, "distanceFromPlayerHQ": 6 },
  { "id": 3,  "name": "בעלבכ",        "x": 70.30, "y": 8.00,  "neighbors": [1, 5, 9], "soldiers": 7, "owner": "computer", "distanceFromComputerHQ": 2, "distanceFromPlayerHQ": 5 },
  { "id": 4,  "name": "צידון",        "x": 48.80, "y": 16.50, "neighbors": [2, 5, 6, 7], "soldiers": 6, "owner": "computer", "distanceFromComputerHQ": 1, "distanceFromPlayerHQ": 5 },
  { "id": 5,  "name": "זחלה",         "x": 62.50, "y": 12.00, "neighbors": [2, 3, 4, 6, 9], "soldiers": 7, "owner": "computer", "distanceFromComputerHQ": 1, "distanceFromPlayerHQ": 5 },
  { "id": 6,  "name": "נבטיה",        "x": 53.70, "y": 19.00, "neighbors": [4, 5, 7, 8, 9], "soldiers": 7, "owner": "computer", "distanceFromComputerHQ": 2, "distanceFromPlayerHQ": 5 },
  { "id": 7,  "name": "צור",          "x": 45.90, "y": 21.00, "neighbors": [4, 6, 8, 10], "soldiers": 7, "owner": "computer", "distanceFromComputerHQ": 2, "distanceFromPlayerHQ": 4 },
  { "id": 8,  "name": "בינת ג׳בייל",  "x": 50.80, "y": 23.50, "neighbors": [6, 7, 9, 10], "soldiers": 7, "owner": "computer", "distanceFromComputerHQ": 3, "distanceFromPlayerHQ": 4 },
  { "id": 9,  "name": "מרג׳ עיון",    "x": 60.50, "y": 22.00, "neighbors": [3, 5, 6, 8, 12], "soldiers": 7, "owner": "computer", "distanceFromComputerHQ": 2, "distanceFromPlayerHQ": 4 },
  { "id": 10, "name": "נהריה",        "x": 43.90, "y": 35.20, "neighbors": [7, 8, 11, 13], "soldiers": 4, "owner": "player", "distanceFromComputerHQ": 3, "distanceFromPlayerHQ": 3 },
  { "id": 11, "name": "צפת",          "x": 61.50, "y": 31.90, "neighbors": [10, 12, 13, 14], "soldiers": 4, "owner": "player", "distanceFromComputerHQ": 4, "distanceFromPlayerHQ": 3 },
  { "id": 12, "name": "קריית שמונה",  "x": 68.40, "y": 27.30, "neighbors": [9, 11, 14], "soldiers": 4, "owner": "player", "distanceFromComputerHQ": 3, "distanceFromPlayerHQ": 3 },
  { "id": 13, "name": "חיפה",         "x": 39.70, "y": 41.30, "neighbors": [10, 11, 15, 16], "soldiers": 4, "owner": "player", "distanceFromComputerHQ": 4, "distanceFromPlayerHQ": 2 },
  { "id": 14, "name": "טבריה",        "x": 66.40, "y": 33.50, "neighbors": [11, 12, 16], "soldiers": 4, "owner": "player", "distanceFromComputerHQ": 4, "distanceFromPlayerHQ": 2 },
  { "id": 15, "name": "נתניה",        "x": 34.20, "y": 50.00, "neighbors": [13, 18], "soldiers": 4, "owner": "player", "distanceFromComputerHQ": 5, "distanceFromPlayerHQ": 2 },
  { "id": 16, "name": "עפולה",        "x": 53.70, "y": 40.40, "neighbors": [13, 14, 17, 18], "soldiers": 4, "owner": "player", "distanceFromComputerHQ": 5, "distanceFromPlayerHQ": 1 },
  { "id": 17, "name": "ירושלים",      "x": 50.80, "y": 56.60, "neighbors": [16, 18, 20], "soldiers": 8, "owner": "player", "headquarters": true, "distanceFromComputerHQ": 6, "distanceFromPlayerHQ": 0 },
  { "id": 18, "name": "תל אביב",      "x": 29.30, "y": 57.30, "neighbors": [15, 16, 17, 19], "soldiers": 4, "owner": "player", "distanceFromComputerHQ": 6, "distanceFromPlayerHQ": 1 },
  { "id": 19, "name": "באר שבע",      "x": 39.10, "y": 71.60, "neighbors": [18, 20, 21], "soldiers": 4, "owner": "player", "distanceFromComputerHQ": 7, "distanceFromPlayerHQ": 2 },
  { "id": 20, "name": "חברון",        "x": 48.80, "y": 61.80, "neighbors": [17, 19, 21], "soldiers": 4, "owner": "player", "distanceFromComputerHQ": 7, "distanceFromPlayerHQ": 1 },
  { "id": 21, "name": "אילת",         "x": 42.70, "y": 98.70, "neighbors": [19, 20], "soldiers": 4, "owner": "player", "distanceFromComputerHQ": 8, "distanceFromPlayerHQ": 2 }
]

const pHQ = PlayerHQ(exampleTerrs)
const borderTerritories = borderTerrs(exampleTerrs)
const playerTerritories = playerTerrs(exampleTerrs)
const attacks = canAttackPlayerTerrs(borderTerritories, playerTerritories)
console.log(attacks)

export { calculatePower, calculateSurvivals, computerReinforce };
