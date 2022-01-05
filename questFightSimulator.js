

/*
Player: 10HP, 2 Attack (basic with weapon)

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

const DEBUG = false;


function getInitStats(party, enemy) {

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

  let p = initStats.party,  e = initStats.enemy;
  p.len = party.length;
  e.len = enemy.length;
  
  initStats.bookDifficulty =  ( ( (e.sumHP + e.sumAttack + e.len) / p.sumHP) * 100).toFixed(2);

  // initStats.partyEstimatedWin =  ( ((p.sumHP/e.sumAttack) / (e.sumHP/p.sumAttack)) / party.length * enemy.length).toFixed(2);
  
  p.power = p.sumHP * p.sumAttack * (p.len < e.len ? 1.5 : 1);
  e.power = e.sumHP*e.sumAttack  * (e.len < p.len ? 1.5 : 1); 

  p.overPower =  (( p.power >= e.power ? p.power/e.power : -1 * e.power/p.power)  ).toFixed(2);
  //p.overPower =  (p.power / e.power).toFixed(2);

  let opWinChance = (op)=>{
    if (op <= -4.0) return 1;
    if (op <= -2.0) return 4;
    if (op <= -1.5) return 28;
    if (op <= 1.00) return 55;
    if (op <= 1.50) return 75;
    if (op <= 2.00) return 97;
    if (op <= 4.00) return 99;
  };

  p.opWinChance = opWinChance(p.overPower);


  // console.log(initStats)

  return initStats;

}



function simulate(party, enemy) {
  
  


  let combats = DEBUG ? 1 : 1000;

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
    roundLoop: while (inst.bothAlive()) {
      round++;
      // console.log('-- round', round, 'party', inst.party.length, 'enemy', inst.enemy.length);
      
      // -- party turn
      for (let actor = 0; actor < inst.party.length; actor++) {
        let enemyTarget = getTarget(inst.enemy, inst.party[actor].attack);
        // console.log('enemyTarget',enemyTarget);
        
        attack(inst.party[actor], inst.enemy[enemyTarget])
        
        inst.party = inst.party.filter(x=>x.hp>0);
        inst.enemy = inst.enemy.filter(x=>x.hp>0);
        DEBUG && logState(inst.party, inst.enemy);
        if (!inst.bothAlive()) {
          break roundLoop;
        }
      }
      
      // -- enemy turn
      for (let actor = 0; actor < inst.enemy.length; actor++) {
        let partyTarget = getTarget(inst.party, inst.enemy[actor].attack);
        // console.log('partyTarget',partyTarget);
          
        attack(inst.enemy[actor], inst.party[partyTarget])
        
        inst.party = inst.party.filter(x=>x.hp>0);
        inst.enemy = inst.enemy.filter(x=>x.hp>0);
        DEBUG && logState(inst.party, inst.enemy);
        if (!inst.bothAlive()) {
          break roundLoop;
        }
      }

    } // rounds
    
    // -- 1 combat done

    let winner = inst.party.length > inst.enemy.length ? 'party' : 'enemy';
    winners.push({
      winner:winner, 
      alive: inst[winner].length,
      health: inst[winner].reduce( (prev,curr)=>prev+curr.hp, 0),
    });
    DEBUG && console.log('winner', winner);


  } // combats

  // console.log('winners', winners)

  let stats = {
    party:{wins:0, winsPC:0, avgAlive:0, avgAlivePC:0, avgHealth:0, avgHealthPC:0},
    enemy:{wins:0, winsPC:0, avgAlive:0, avgAlivePC:0, avgHealth:0, avgHealthPC:0},
  }

  winners.forEach(w=>{
    stats[w.winner].wins++;
    stats[w.winner].avgAlive += w.alive;
    stats[w.winner].avgHealth += w.health;
  });

  if (stats.party.wins > 0) { 
    stats.party.avgAlive = (stats.party.avgAlive / stats.party.wins).toFixed(1); 
    stats.party.avgAlivePC = Math.floor(stats.party.avgAlive / party.length * 100);
    stats.party.avgHealth = (stats.party.avgHealth / stats.party.wins).toFixed(1);
  }
  
  let initPartyHP = party.reduce( (prev,curr)=>prev + curr.hp, 0);
  stats.party.avgHealthPC = Math.floor(stats.party.avgHealth / initPartyHP * 100);
  stats.party.winsPC = Math.floor(stats.party.wins / combats * 100);

  // stats.enemy.avgAlive = (stats.enemy.avgAlive / stats.enemy.wins).toFixed(1);
  // stats.enemy.avgAlivePC = Math.floor(stats.enemy.avgAlive / enemy.length * 100);
  // stats.enemy.winsPC = Math.floor(stats.enemy.wins / combats * 100);


  // console.log(stats);
  return stats

} // simulate function  



/// ---- HELPERS

function roll() {
  return Math.ceil( Math.random() * 20 );
}

function getTarget(defender, attackPower) {
  // let target = Math.floor( Math.random() * defender.length );

  // select target: prioritize enemies with hp bellow my attack who have the bigger attack
  let target = 0;
  for (let n=1; n<defender.length; n++) {
    if ( (defender[target].hp > attackPower && defender[n].hp < defender[target].hp)
      || (defender[target].hp <= attackPower && defender[n].attack > defender[target].attack)
    
    ) {
      target =n;
    }
  }
  return target

}


function logState(team1, team2) {
  let str = '-> '
  team1.forEach(t=> str += (t.name+':'+t.hp+' ') );
  str += '| '
  team2.forEach(t=> str += (t.name+':'+t.hp+' ') );
  console.log(str);
}

/**
 * Attack and calculate consequences
*/
function attack(attacker, defender) {

  let rolled = roll();
  // console.log(attacker.name, 'rolled', rolled);

  if (rolled === 20) {
    DEBUG && console.log(attacker.name, 'crits', defender.name);
    defender.hp -= (attacker.attack * 2);
  }

  if (rolled >= 11 && rolled <= 19) {
    DEBUG && console.log(attacker.name, 'hits', defender.name);
    defender.hp -= attacker.attack;
  }

  if (rolled >= 6 && rolled <=10) {
    DEBUG && console.log(attacker.name, 'hits with consecuences', defender.name);
    defender.hp -= attacker.attack; 
    attacker.hp -= attacker.attack/2; 
    // or maybe hits full but gets stuck for the next move, choice. Maybe
  }
  if (rolled >= 2 && rolled <= 5) {
    DEBUG && console.log(attacker.name, 'fails', defender.name);
    // attacker.hp -= 0; 
  }
  if (rolled == 1) {
    DEBUG && console.log(attacker.name, 'critfails', defender.name);
    let counterRoll = roll();
    if (counterRoll >= 10) {  attacker.hp -= (defender.attack) };
  }

  if (defender.hp <= 0) {
    DEBUG && console.log(': ', attacker.name, 'KILLS', defender.name);
  }
  if (attacker.hp <= 0) {
    DEBUG && console.log(': ', defender.name, 'CAUSES DEATH OF', attacker.name);
  }

}
 
  






