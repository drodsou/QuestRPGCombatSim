# Quest RPG combat simulator

A personal rough simulation of Quest RPG combat, to give an idea of how hard a combat would be

## Method
1000 combats are simulated on each fight. Only basic attacks simulated. Rules: when rolled 1, receives dmg equal to full target attack. When rolled 2-5, recives half of that dmg.

## Manual estimation of difficulty

Result includes simulation result and also a estimation number, useful for manual calculation in case of not having the simulator at hand, using this formula:

`( ((pHP/eAt) / (eHP/pAt)) / pNum * eNum`

where:
- pHP: sum of party HP
- pAt: sum of party Attack
- eHP: sum of enemies HP
- eAt: sum of enemies Attack
- pNum: number of party members
- eNum: number of enemies

Basically, dividing number of attacks needed by enemies to kill party, by number of attacks needed by party to kill enemies, and then adjusted to the number of enemies, as 1 powerfull enemy is much difficult than 4 enemies with the same sum of HP and Attack.

Estimation does not perfectly match simulation results, but serves as a rough guide. A result of >2 is easy win. 1-2 probable win with some struggle. 0-5-1 hard fight probable to lose. Bellow 0.5 almost sure loss.

 

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