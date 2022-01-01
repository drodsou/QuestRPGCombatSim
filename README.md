# Quest RPG combat simulator

A personal rough simulation of Quest RPG combat, to give an idea of how hard a combat would be. 

Enter team members writing one line per member: `HitPoints,AttackPower`, eg `10,2` for normal player.

## Method

10000 combats are simulated on each fight, giving a +-1% accuracy. Only basic attacks simulated. Rules in `attack` function in `questFightSimulator.js` file. Damage done on roll:
- 20: attack * 2
- 11-19: attack
- 6-10: attack /2
- 2-5: 0
- 1: receives normal deffender attack

## Simulating abilites

As said, the simulation runs on basic attacks only, but `abilities` can change a sure loss in a unexpected win, eg one wizard's Magic Strike full of APs could make 20 ensured damage by itself in a fight, ie the full health of a "big boss" as described in the book. 

To try to simulate this case, 4 ensured dmg per round is aprox. equivalent to `4 / 0.625 = 6.4` dice rolled dmg, so a `10,6.4`

Also other abilities can change the outcome of a combat without need for matching combat power in other ways: mind control, distraction, impersonation, fear, etc... and preciselly these open unexpected uses, or GM creative application of consecuences of critical fails or successes with tough choices are the ones that can create unexpected plot twists and potentiallty bring the real fun and amusement to the game much more than raw weapon combat.


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

## Manual estimation: book difficulty rating

`(eHP+eAt+eNum)/pHP*100`

Quoting from book: If the difficulty rating is roughly equal to 100% of party's HP, it is a deadly fight that will push their limits.If the difficulty rating is between 50% to 80% of the party's HP, it is still deadly, but should be a fair fight.

## Manual alternative estimation: party overpower

My own estimator, seen the the official estimation did not match simulation results too well in some cases. The idea comes from finding the minimal number of rounds that each team can zero the HP of the other, and then comparing both: `(pHP/eAt) / (eHP/pAt)`. But is mathematically equivalent, moving factors around, and mentally easier to calculate, the concept of `power` for each team, party: `pHP*pAt` and enemy: `eHP*eAt`.

If a team has LESS number of members we give 50% additional power (`power*1.5`) as has seen from the simulation that having more members with same total power is worse, as attack power decreases as members die). Note that this the opposite direction of the book Difficiculty Rating calculation.

Finally `dividing the power of the more powerfull team by the other` we arrive to the concept of `overpower`, where if is 1, obbiously chances of winning would be equal for both teams (50%), even though in practice is a little more for the players as usuarlly roll first. Other `overpower values`, correlate with simulation win chances this way::

- 1: 55%, 1.5: 75%, 2: 97%, 4: 99%


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