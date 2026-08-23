function calculatePower(soldiersAmount) {
    const luck = 0.6 + Math.random() * 0.4;
    return soldiersAmount * luck
    
}

function calculateSurvivals(winnerSoldiers, winnerPower, loserPower) {
    return  Math.max(1, Math.ceil(winnerSoldiers * (winnerPower - loserPower) / winnerPower));
}