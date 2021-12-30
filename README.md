# Quest RPG combat simulator

A personal rough simulation of Quest RPG combat, to give an idea of how hard a combat would be

## Method
1000 combats are simulated on each fight. Only basic attacks simulated. Rules: when rolled 1, receives dmg equal to full target attack. When rolled 2-5, recives half of that dmg.

## Manual estimation of difficulty

Result includes first the simulation result, but also, for comparison, "Diff" following Quest RPG difficulty rating (combat section, pag.126), and then an alternative estimated probability for party to win, "WinProb", both, useful for manual calculation in case of not having the simulator at hand-

Given:
- pHP: sum of party HP
- pAt: sum of party Attack
- eHP: sum of enemies HP
- eAt: sum of enemies Attack
- pNum: number of party members
- eNum: number of enemies

The formulas are as follow:

## Manual estimation: book difficulty

`(eHP+eAt+eNum)/pHP*100`

Quoting from book: If the difficulty rating is roughly equal to 100% of party's HP, it is a deadly fight that will push their limits.If the difficulty rating is between 50% to 80% of the party's HP, it is still deadly, but should be a fair fight.

## Manual estimation: alternative party win probability

My own estimator, seen the the official estimation did not match simulation results too well in some cases:

`(pHP/eAt) / (eHP/pAt) / pNum * eNum / 2`


Basically, dividing number of attacks needed by enemies to kill party, by number of attacks needed by party to kill enemies, and then adjusted to the number of enemies, as seen in the simulations that 1 powerful enemy is much difficult than 4 enemies with the same sum of HP and Attack, contrary to what the book difficulty rating suggests. Finally divided by 2 as it was seen to match fit simulation results more directly.

WinProb estimation does not perfectly match simulation results either, but serves as a better correlation with actual simulation results. A result of >1 is easy win. 0.5-1 probable win with some struggle. 0.25-0.50 hard fight probable to lose. Bellow 0.25 almost sure loss.

 

## Quest RPG

Example actor's Hit Points and Attack according to Quest RPG book:
- Player: 10 HP, 2 Attack (basic with weapon)

- Commoners 2 HP, 1 Attack
- Minions 4 HP, 2 Attack.
- Bosses 10 HP, 4 Attack

- Veteran: Add 4 HP and 1 attack (14/5 98%)
- Big: Add 10 HP and 1 attack   (20/5 90% prob)
- Colossal: Add 40 HP and 4 attack (50/8 1% prob)

I am not related with Quest RPG creators at all.

Quest RPG home: https://www.adventure.game/