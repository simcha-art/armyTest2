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
    return territories.filter((t) => t.owner === "player");
}

function computerTerrs(territories) {
    return territories.filter((t) => t.owner === "computer");
}

function borderTerrs(territories) {
    const playerTerrsIds = playerTerrs(territories).map((t) => t.id);
    const computerTerrirtories = computerTerrs(territories);
    const borderTerrs = computerTerrirtories.filter((t) => {
        let isBorder;
        playerTerrsIds.forEach((terrId) => {
            if (t.neighbors.includes(terrId)) {
                isBorder = true;
            }
        });
        return isBorder;
    });
    return borderTerrs;
}

function isProtectionState(territories) {
    const playerTerritories = playerTerrs(territories);
    const distances = playerTerritories.map((t) => t.distanceFromComputerHQ);
    const minDist = Math.min(...distances);
    return minDist < 2;
}

function chooseTerrToReinforce(isProtectState, territories) {
    const borderTerritories = borderTerrs(territories);

    let result, distances, minDist, minId;
    if (isProtectState) {
        distances = borderTerritories.map((t) => t.distanceFromComputerHQ);
        minDist = Math.min(...distances);
        result = borderTerritories.filter(
            (t) => t.distanceFromComputerHQ === minDist,
        );

        if (result.length > 1) {
            const minSoldiers = Math.min(...result.map((t) => t.soldiers));
            result = result.filter((t) => t.soldiers === minSoldiers);
        }

        if (result.length > 1) {
            const minId = Math.min(...result.map((t) => t.id));
            result = result.filter((t) => t.id === minId);
        }
    } else {
        distances = borderTerritories.map((t) => t.distanceFromPlayerHQ);
        minDist = Math.min(...distances);
        result = borderTerritories.filter(
            (t) => t.distanceFromPlayerHQ === minDist,
        );

        if (result.length > 1) {
            const maxSoldiers = Math.max(
                ...borderTerritories.map((t) => t.soldiers),
            );
            result = result.filter((t) => t.soldiers === maxSoldiers);
        }

        if (result.length > 1) {
            minId = Math.min(...result.map((t) => t.id));
            result = result.filter((t) => t.id === minId);
        }
    }
    return result[0];
}

function computerReinforce(territories) {
    const isProtection = isProtectionState(territories);
    const toReinforce = chooseTerrToReinforce(isProtection, territories);
    toReinforce.soldiers += 3;
    return {territories, toId: toReinforce.id};
}

// function PlayerHQ(territories) {
//     return territories.filter((t) => t.owner === "player" && t.headquarters)[0];
// }

// function canAttackHQ(pHQ, borderTerritories) {
//     for (const t of borderTerritories) {
//         if (t.neighbors.includes(pHQ.id) && t.soldiers > pHQ.soldiers) {
//             return t;
//         }
//     }
// }

function computerAvailableAttacks(borderTerritories, playerTerritories) {
    const attacksAvailable = [];
    borderTerritories.forEach((ct) => {
        for (const pt of playerTerritories) {
            if (
                ct.neighbors.includes(pt.id) &&
                ct.soldiers - 1 / pt.soldiers >= 1.35
            ) {
                attacksAvailable.push({ ct, pt });
            }
        }
    });
    return attacksAvailable;
}

function calculateAttackScores(from, to) {
    const sentSoldiers = from.soldiers - 1;
    // התקדמות: האם תקיפת היעד מקרבת את המחשב למפקדת השחקן.
    // התוצאה היא 1 בהתקרבות, 0 ללא שינוי ו־1- בהתרחקות.
    const progress = from.distanceFromPlayerHQ - to.distanceFromPlayerHQ;

    // יתרון החיילים: ככל שנשלחים יותר חיילים ביחס למגינים, הציון גבוה יותר.
    const soldierAdvantage = sentSoldiers - to.soldiers;

    // הגנת המפקדה: תקיפת טריטוריה שמאיימת על מפקדת המחשב מקבלת בונוס.
    const protectsHeadquarters =
        Math.max(0, 3 - to.distanceFromComputerHQ) * 25;

    // התקדמות: תקיפה שמתקרבת למפקדת השחקן מקבלת משקל של 10 נקודות לצעד.
    const progressScore = progress * 10;

    // כיבוש המפקדה הוא היעד החשוב ביותר ולכן מקבל בונוס גבוה במיוחד.
    const headquartersScore = to.headquarters ? 1000 : 0;

    // הציון הסופי מחבר את כל סדרי העדיפויות של המחשב.
    const score =
        progressScore +
        soldierAdvantage +
        protectsHeadquarters +
        headquartersScore;

    return score;
}

function chooseAttack(availableAttacks) {
    const maxScores = Math.max(...availableAttacks.map((a) => a.scores));
    availableAttacks = availableAttacks.filter((a) => a.scores === maxScores);
    console.log(
        "availableAttacks: ",
        availableAttacks.map((a) => [a.ct.id, a.pt.id, a.scores]),
    );

    if (availableAttacks.length > 1) {
        console.log("available attack are too many. choosing minToId");
        const minToId = Math.min(...availableAttacks.map((a) => a.pt.id));
        console.log({ minToId });
        availableAttacks = availableAttacks.filter((a) => a.pt.id === minToId);
        console.log(
            "availableAttacks: ",
            availableAttacks.map((a) => [a.ct.id, a.pt.id, a.scores]),
        );
    }

    if (availableAttacks.length > 1) {
        console.log("available attack are still too many, choosing minFromId");
        const minFromId = Math.min(...availableAttacks.map((a) => a.ct.id));
        console.log({ minFromId });
        availableAttacks = availableAttacks.filter(
            (a) => a.ct.id === minFromId,
        );
        console.log(
            "availableAttacks: ",
            availableAttacks.map((a) => [a.ct.id, a.pt.id, a.scores]),
        );
    }

    if (availableAttacks.length === 0) return null;

    return availableAttacks[0];
}

function computerAttack(territories) {
    const borderTerritories = borderTerrs(territories);
    const playerTerritories = playerTerrs(territories);
    const availableAttacks = computerAvailableAttacks(
        borderTerritories,
        playerTerritories,
    );
    availableAttacks.forEach((attack) => {
        attack.scores = calculateAttackScores(attack.ct, attack.pt);
    });
    const attack = chooseAttack(availableAttacks);
    if (!attack) {
        return territories;
    }

    const attackTerr = attack.ct;
    const defenceTerr = attack.pt;
    const sentSoldiers = attackTerr.soldiers - 1;
    const defenceSoldiers = defenceTerr.soldiers;
    const attackPower = calculatePower(sentSoldiers);
    const defencePower = calculatePower(defenceSoldiers);

    attack.sentSoldiers = sentSoldiers;
    attackTerr.soldiers -= sentSoldiers;

    if (attackPower > defencePower) {
        attack.winner = "computer";
        defenceTerr.owner = "computer";
        defenceTerr.soldiers = calculateSurvivals(
            sentSoldiers,
            attackPower,
            defencePower,
        );
        if (defenceTerr.headquarters) {
            attack.isWinTheGame = true;
        }
    } else {
        attack.winner = "player";
        defenceTerr.soldiers = calculateSurvivals(
            defenceSoldiers,
            defencePower,
            attackPower,
        );
    }

    return { territories, attack };
}

function findOrigins(computerTerrirtories, playerTerritories) {
    const playerTerrIds = playerTerritories.map((t) => t.id);
    const savedTerrs = computerTerrirtories.filter((ct) => {
        let saved = true;
        for (const ptId of playerTerrIds) {
            if (ct.neighbors.includes(ptId)) {
                saved = false;
            }
        }
        return saved;
    });
    const withEnoughSoldiers = savedTerrs.filter((t) => {
        if (t.headquarters) {
            return t.soldiers > 4;
        } else {
            return t.soldiers > 1;
        }
    });
    return withEnoughSoldiers;
}

function findTransitions(
    originsAvailable,
    computerTerrirtories,
    isProtectionState,
) {
    const transitionsAvail = [];
    originsAvailable.forEach((from) => {
        computerTerrirtories.forEach((to) => {
            if (from.neighbors.includes(to.id)) {
                if (isProtectionState) {
                    if (to.distanceFromComputerHQ < from.distanceFromComputerHQ)
                        transitionsAvail.push({ from, to });
                } else {
                    if (to.distanceFromPlayerHQ < from.distanceFromPlayerHQ)
                        transitionsAvail.push({ from, to });
                }
            }
        });
    });
    return transitionsAvail;
}

function chooseTransition(transitionsAvail) {
    if (transitionsAvail.length === 0) return null;

    const maxSoldiers = Math.max(
        ...transitionsAvail.map((trans) => trans.from.soldiers),
    );
    transitionsAvail = transitionsAvail.filter(
        (trans) => trans.from.soldiers === maxSoldiers,
    );

    if (transitionsAvail.length > 1) {
        const minToId = Math.min(
            ...transitionsAvail.map((trans) => trans.to.id),
        );
        transitionsAvail = transitionsAvail.filter(
            (trans) => trans.to.id === minToId,
        );
    }

    if (transitionsAvail.length > 1) {
        const minFromId = Math.min(
            ...transitionsAvail.map((trans) => trans.from.id),
        );
        transitionsAvail = transitionsAvail.filter(
            (trans) => trans.from.id === minFromId,
        );
    }

    return transitionsAvail[0];
}

function computerMove(territories, isProtection) {
    console.log(
        "begin: ",
        territories.map((t) => [t.id, t.soldiers]),
    );
    const computerTerrirtories = computerTerrs(territories);
    const playerTerritories = playerTerrs(territories);
    const originsAvail = findOrigins(computerTerrirtories, playerTerritories);
    const transitionsAvail = findTransitions(
        originsAvail,
        computerTerrirtories,
        isProtection,
    );
    const transition = chooseTransition(transitionsAvail);
    if (!transition) return;

    const { from, to } = transition;
    let sentSoldiers;
    if (from.headquarters) {
        sentSoldiers = from.soldiers - 4;
    } else {
        sentSoldiers = from.soldiers - 1;
    }

    transition.sentSoldiers = sentSoldiers;
    from.soldiers -= sentSoldiers;
    to.soldiers += sentSoldiers;
    console.log(
        "end: ",
        territories.map((t) => [t.id, t.soldiers]),
    );
    return { territories, transition };
}

const exampleTerrs = [
    {
        id: 1,
        name: "טריפולי",
        x: 63.0,
        y: 4.0,
        neighbors: [2, 3],
        soldiers: 1,
        owner: "computer",
        distanceFromComputerHQ: 1,
        distanceFromPlayerHQ: 6,
    },
    {
        id: 2,
        name: "ביירות",
        x: 50.8,
        y: 13.0,
        neighbors: [1, 4, 5],
        soldiers: 4,
        owner: "computer",
        headquarters: true,
        distanceFromComputerHQ: 0,
        distanceFromPlayerHQ: 6,
    },
    {
        id: 3,
        name: "בעלבכ",
        x: 70.3,
        y: 8.0,
        neighbors: [1, 5, 9],
        soldiers: 7,
        owner: "computer",
        distanceFromComputerHQ: 2,
        distanceFromPlayerHQ: 5,
    },
    {
        id: 4,
        name: "צידון",
        x: 48.8,
        y: 16.5,
        neighbors: [2, 5, 6, 7],
        soldiers: 6,
        owner: "computer",
        distanceFromComputerHQ: 1,
        distanceFromPlayerHQ: 5,
    },
    {
        id: 5,
        name: "זחלה",
        x: 62.5,
        y: 12.0,
        neighbors: [2, 3, 4, 6, 9],
        soldiers: 7,
        owner: "computer",
        distanceFromComputerHQ: 1,
        distanceFromPlayerHQ: 5,
    },
    {
        id: 6,
        name: "נבטיה",
        x: 53.7,
        y: 19.0,
        neighbors: [4, 5, 7, 8, 9],
        soldiers: 7,
        owner: "computer",
        distanceFromComputerHQ: 2,
        distanceFromPlayerHQ: 5,
    },
    {
        id: 7,
        name: "צור",
        x: 45.9,
        y: 21.0,
        neighbors: [4, 6, 8, 10],
        soldiers: 7,
        owner: "computer",
        distanceFromComputerHQ: 2,
        distanceFromPlayerHQ: 4,
    },
    {
        id: 8,
        name: "בינת ג׳בייל",
        x: 50.8,
        y: 23.5,
        neighbors: [6, 7, 9, 10],
        soldiers: 7,
        owner: "computer",
        distanceFromComputerHQ: 3,
        distanceFromPlayerHQ: 4,
    },
    {
        id: 9,
        name: "מרג׳ עיון",
        x: 60.5,
        y: 22.0,
        neighbors: [3, 5, 6, 8, 12],
        soldiers: 7,
        owner: "computer",
        distanceFromComputerHQ: 2,
        distanceFromPlayerHQ: 4,
    },
    {
        id: 10,
        name: "נהריה",
        x: 43.9,
        y: 35.2,
        neighbors: [7, 8, 11, 13],
        soldiers: 4,
        owner: "player",
        distanceFromComputerHQ: 3,
        distanceFromPlayerHQ: 3,
    },
    {
        id: 11,
        name: "צפת",
        x: 61.5,
        y: 31.9,
        neighbors: [10, 12, 13, 14],
        soldiers: 4,
        owner: "player",
        distanceFromComputerHQ: 4,
        distanceFromPlayerHQ: 3,
    },
    {
        id: 12,
        name: "קריית שמונה",
        x: 68.4,
        y: 27.3,
        neighbors: [9, 11, 14],
        soldiers: 4,
        owner: "player",
        distanceFromComputerHQ: 3,
        distanceFromPlayerHQ: 3,
    },
    {
        id: 13,
        name: "חיפה",
        x: 39.7,
        y: 41.3,
        neighbors: [10, 11, 15, 16],
        soldiers: 4,
        owner: "player",
        distanceFromComputerHQ: 4,
        distanceFromPlayerHQ: 2,
    },
    {
        id: 14,
        name: "טבריה",
        x: 66.4,
        y: 33.5,
        neighbors: [11, 12, 16],
        soldiers: 4,
        owner: "player",
        distanceFromComputerHQ: 4,
        distanceFromPlayerHQ: 2,
    },
    {
        id: 15,
        name: "נתניה",
        x: 34.2,
        y: 50.0,
        neighbors: [13, 18],
        soldiers: 4,
        owner: "player",
        distanceFromComputerHQ: 5,
        distanceFromPlayerHQ: 2,
    },
    {
        id: 16,
        name: "עפולה",
        x: 53.7,
        y: 40.4,
        neighbors: [13, 14, 17, 18],
        soldiers: 4,
        owner: "player",
        distanceFromComputerHQ: 5,
        distanceFromPlayerHQ: 1,
    },
    {
        id: 17,
        name: "ירושלים",
        x: 50.8,
        y: 56.6,
        neighbors: [16, 18, 20],
        soldiers: 8,
        owner: "player",
        headquarters: true,
        distanceFromComputerHQ: 6,
        distanceFromPlayerHQ: 0,
    },
    {
        id: 18,
        name: "תל אביב",
        x: 29.3,
        y: 57.3,
        neighbors: [15, 16, 17, 19],
        soldiers: 4,
        owner: "player",
        distanceFromComputerHQ: 6,
        distanceFromPlayerHQ: 1,
    },
    {
        id: 19,
        name: "באר שבע",
        x: 39.1,
        y: 71.6,
        neighbors: [18, 20, 21],
        soldiers: 4,
        owner: "player",
        distanceFromComputerHQ: 7,
        distanceFromPlayerHQ: 2,
    },
    {
        id: 20,
        name: "חברון",
        x: 48.8,
        y: 61.8,
        neighbors: [17, 19, 21],
        soldiers: 4,
        owner: "player",
        distanceFromComputerHQ: 7,
        distanceFromPlayerHQ: 1,
    },
    {
        id: 21,
        name: "אילת",
        x: 42.7,
        y: 98.7,
        neighbors: [19, 20],
        soldiers: 4,
        owner: "player",
        distanceFromComputerHQ: 8,
        distanceFromPlayerHQ: 2,
    },
];


export {
    calculatePower,
    calculateSurvivals,
    computerReinforce,
    computerAttack,
    computerMove,
    isProtectionState,
};
