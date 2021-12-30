

/*
Commoners 2 HP, 1 Attack. (x12, 100%)
Minions 4 HP, 2 Attack.
Bosses 10 HP, 4 Attack.
  1 boss + 2 minion: 97%
  1 boss + 3 minion: 90%, posib muera 1 party

Veteran Add 4 HP and 1 attack (14/5 98%)
Big Add 10 HP and 1 attack   (20/5 90% prob)
ColossalAdd 40 HP and 4 attack (50/8 1% prob)
*/


/*  RESULTS
enemy = party, 1 enem, 10%/90%
enemy = party, 2 enem, 15%/85%
enemy = party, 3 enem, 33%/66%
enemy = party, 4 enem, 52%/47%
*/

// -- for console test
// console.log(
//   simulate([
//     {name: 'p0', hp:10, attack:2},
//     {name: 'p1', hp:10, attack:2},
//     // // {name: 'p2', hp:10, attack:2},
//     // // {name: 'p3', hp:10, attack:2}
//   ], [
//     {name: 'e0', hp:4, attack:2},
//     {name: 'e0', hp:4, attack:2},
//     {name: 'e0', hp:4, attack:2},
//   ])
// );


function simulate(party, enemy) {
  
  let initStats = {
    party: { 
      sumHP: party.reduce( (prev,curr)=>prev + curr.hp, 0),
      sumAttack: party.reduce( (prev,curr)=>prev + curr.attack, 0),
    },
    enemy: { 
      sumHP: enemy.reduce( (prev,curr)=>prev + curr.hp, 0),
      sumAttack: enemy.reduce( (prev,curr)=>prev + curr.attack, 0),
    }
  }
  initStats.party.potential = initStats.party.sumAttack / initStats.enemy.sumHP
  initStats.enemy.potential = initStats.enemy.sumAttack / initStats.party.sumHP

  initStats.totalPotential = initStats.party.potential + initStats.enemy.potential;


  // initStats.partyEstimatedWin =  (initStats.party.potential / initStats.enemy.potential / party.length * enemy.length).toFixed(2);
  let p = initStats.party; let e = initStats.enemy;
  
  initStats.partyEstimatedWin =  ( ((p.sumHP/e.sumAttack) / (e.sumHP/p.sumAttack)) / party.length * enemy.length).toFixed(2);



  // console.log(initStats)







  let combats = 1000;

  let winners = [];
  for (let combat = 1; combat <= combats; combat++) {
    // -- 1 combat
    // console.log('---- COMBAT', combat);
    let inst = {
      party : JSON.parse(JSON.stringify(party)),
      enemy : JSON.parse(JSON.stringify(enemy)),
      bothAlive : function () {
        return this.party.length > 0 && this.enemy.length >0
      }
    }

    let round = 0;
    while (inst.bothAlive()) {
      round++;
      // console.log('-- round', round, 'party', inst.party.length, 'enemy', inst.enemy.length);
      let maxActors = inst.party.length >= inst.enemy.length ? inst.party.length : inst.enemy.length;

      let targetIndex
      for (let actor = 0; actor < maxActors; actor++) {

        // -- party
        if (inst.party[actor]) {
          let enemyTarget = Math.floor( Math.random() * inst.enemy.length )
          // console.log('enemyTarget',enemyTarget);
          
          attack(inst.party[actor], inst.enemy[enemyTarget])

          inst.party = inst.party.filter(x=>x.hp>0);
          inst.enemy = inst.enemy.filter(x=>x.hp>0);
          if (!inst.bothAlive()) {
            break;
          }
        }

        // // enemy
        if (inst.enemy[actor]) {
          let partyTarget = Math.floor( Math.random() * inst.party.length )
        // console.log('partyTarget',partyTarget);
          
          attack(inst.enemy[actor], inst.party[partyTarget])

          inst.party = inst.party.filter(x=>x.hp>0);
          inst.enemy = inst.enemy.filter(x=>x.hp>0);
          if (!inst.bothAlive()) {
            break;
          }

        }

      } // round
      
    

    } // 1 combat
    let winner = inst.party.length > inst.enemy.length ? 'party' : 'enemy';
    winners.push({winner:winner, alive: inst[winner].length});
    //console.log('winner', winner);
    // console.log(inst.party);
    // console.log(inst.enemy);

  } // combats

  // console.log('winners', winners)

  let stats = {
    party:{wins:0, winsPC:0, avgAlive:0, avgAlivePC:0},
    enemy:{wins:0, winsPC:0, avgAlive:0, avgAlivePC:0},
    
  }

  winners.forEach(w=>{
    stats[w.winner].wins++;
    stats[w.winner].avgAlive += w.alive;
  });

  stats.party.avgAlive = (stats.party.avgAlive / stats.party.wins).toFixed(1);
  stats.party.avgAlivePC = Math.floor(stats.party.avgAlive / party.length * 100);
  stats.party.winsPC = Math.floor(stats.party.wins / combats * 100);
  stats.enemy.avgAlive = (stats.enemy.avgAlive / stats.enemy.wins).toFixed(1);
  stats.enemy.avgAlivePC = Math.floor(stats.enemy.avgAlive / enemy.length * 100);
  stats.enemy.winsPC = Math.floor(stats.enemy.wins / combats * 100);


  // console.log(stats);
  return {initStats, stats}

} // simulate function  



/// ---- HELPERS

function roll() {
  return Math.floor( Math.random() * 20 ) + 1;
}

function attack(attacker, defender) {
  let DEBUG = false;
  let rolled = roll();
  // console.log(attacker.name, 'rolled', rolled);

  if (rolled === 20) {
    DEBUG && console.log(attacker.name, 'crits', defender.name);
    defender.hp -= (attacker.attack * 2);
  }
  if (rolled >= 6 && rolled < 20) {
    DEBUG && console.log(attacker.name, 'hits', defender.name);
    defender.hp -= attacker.attack;
  }
  if (rolled >= 2 && rolled <= 5) {
    DEBUG && console.log(attacker.name, 'fails', defender.name);
    attacker.hp -= defender.attack/2;
  }
  if (rolled == 1) {
    DEBUG && console.log(attacker.name, 'critfails', defender.name);
    attacker.hp -= (defender.attack);
  }
  if (defender.hp <= 0) {
    DEBUG && console.log(': ', attacker.name, 'KILLS', defender.name);
  }

  if (attacker.hp <= 0) {
    DEBUG && console.log(': ', defender.name, 'CAUSES DEATH OF', attacker.name);
  }

}
 
  






