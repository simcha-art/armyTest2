# War game Israel against Hizbulla

משחק מחשב. המחשב הוא חיזבאלללה, השחקן הוא ישראל. על השחקן לשחק כנגד המחשב, לכבוש את המפקדה של חיבאללה ולהסיר את האיום מעל ישראל.

## DB

בחרתי להשתמש בדאטאבייס מסוג mongodb
הסיבה היא כי לא ראיתי צורך בדאטאבייס רלציוני, אין כאן קשרים מהותיים בין הטבלאות.
ומכיון שהישויות כוללות בתוכן מערכים ואובייקטים, שיותר נכון ונוח לעבוד איתן על ידי mongodb.

## endpoints

games/ => start the game, create playerId
games/:id => take open game, for page refresh
games/:id/reinforce => reinforce some territory
games/:id/attack => attacks from territory of player the territory of computer, can be skiped with body: {skip: true}
games/:id/move => move soldiers from territory to another territory, both of the player, then the computer do its turn
games/:id/end-turn => end turn without moving sodliers from place to place, the computer do its turn

## how to run
```
node .\server\app.js
```