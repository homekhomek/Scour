var shopMasterList = [
    // Basic Stats
    {
        choiceName: "Ham",
        classesFor: ["crusader", "prophet", "brigand", "necromancer"],
        cost: 1,
        rarity: 4,
        stats: {
            vit: 8
        }
    },
    {
        choiceName: "Hardtack",
        classesFor: ["crusader", "prophet", "brigand", "necromancer"],
        cost: 1,
        rarity: 4,
        stats: {
            maxAtk: 1,
            vit: -2
        }
    },
    {
        choiceName: "Marrow",
        classesFor: ["crusader", "prophet", "brigand", "necromancer"],
        cost: 1,
        rarity: 3,
        stats: {
            minAtk: 1
        }
    },
    {
        choiceName: "Rotessire",
        classesFor: ["crusader", "prophet", "brigand", "necromancer"],
        cost: 1,
        rarity: 1,
        stats: {
            vit: 6,
            maxAtk: 1
        }
    },
    {
        choiceName: "Sweets",
        classesFor: ["crusader", "prophet", "brigand", "necromancer"],
        cost: 1,
        rarity: 1,
        stats: {
            spd: 1,
        }
    },

    // Crusader stats
    {
        choiceName: "Blessed Blade",
        classesFor: ["crusader"],
        cost: 1,
        rarity: 5,
        stats: {
            minAtk: 1,
            maxAtk: 1
        }
    },
    {
        choiceName: "Prayer",
        classesFor: ["crusader"],
        cost: 1,
        rarity: 4,
        stats: {
            vit: 11
        }
    },

    // Crusader Abilities
    {
        choiceName: "Holy Strike",
        classesFor: ["crusader"],
        cost: 2,
        rarity: 1,
        ability: 0
    },
    {
        choiceName: "Inspire",
        classesFor: ["crusader"],
        cost: 2,
        rarity: 1,
        ability: 2
    },
    {
        choiceName: "Last Defiance",
        classesFor: ["crusader"],
        cost: 2,
        rarity: 1,
        ability: 1
    },

    // brigand stats
    {
        choiceName: "Sharpen Dagger",
        classesFor: ["brigand"],
        cost: 1,
        rarity: 6,
        stats: {
            maxAtk: 3
        }
    },
    {
        choiceName: "Poison Tip",
        classesFor: ["brigand"],
        cost: 1,
        rarity: 3,
        stats: {
            poi: 1
        }
    },

    // brigand abilities
    {
        choiceName: "Pick Pocket",
        classesFor: ["brigand"],
        cost: 1,
        rarity: 1,
        ability: 3
    },
    {
        choiceName: "Critical Hit!",
        classesFor: ["brigand"],
        cost: 2,
        rarity: 2,
        ability: 6
    },

    // prophet stats
    {
        choiceName: "Wine",
        classesFor: ["prophet"],
        cost: 1,
        rarity: 6,
        stats: {
            faith: 5
        }
    },
    {
        choiceName: "Bread",
        classesFor: ["prophet"],
        cost: 1,
        rarity: 3,
        stats: {
            faith: 3,
            vit: 4
        }
    },

    // prophet abilities
    {
        choiceName: "Smite",
        classesFor: ["prophet"],
        cost: 1,
        rarity: 3,
        ability: 4
    },
    {
        choiceName: "Holy Blessings",
        classesFor: ["prophet"],
        cost: 2,
        rarity: 2,
        ability: 5
    },
];

var abilityList = [
    {
        desc: `every <span class="atkText">3 hits</span> -> <span class="healthText">heal 7%</span>`,
        unique: true,
        onInit: (myChar, abilityIndex) => {
            myChar[`healHit${abilityIndex}`] = 0;

        },
        onHit: (myChar, enemyChar, dmg, abilityIndex) => {
            myChar[`healHit${abilityIndex}`] += 1;

            if (myChar[`healHit${abilityIndex}`] >= 3) {
                var healAmt = Math.ceil(myChar.maxHealth * 0.07);
                heal(myChar, healAmt)
                myChar[`healHit${abilityIndex}`] = 0;
            }


            return dmg;
        }
    },
    {
        desc: `death -> <span class="atkText">10% dmg</span> to all enemies`,
        unique: true,
        onDie: (myChar, abilityIndex) => {
            myChar.enemyTeam.forEach((spr) => {
                var dmgAmt = Math.ceil(spr.maxHealth * .1);
                damage(spr, dmgAmt);
            })
        },

    },
    {
        desc: `every <span class="atkText">hit</span> -> random ally <span class="healthText">heal 3%</span>`,
        unique: true,
        onHit: (myChar, enemyChar, dmg, abilityIndex) => {
            var randTeammate = myChar.myTeam[Math.floor(myChar.myTeam.length * Math.random())];

            var healAmt = Math.ceil(randTeammate.maxHealth * 0.03);
            heal(randTeammate, healAmt);

            return dmg;
        }
    },
    {
        desc: `every <span class="atkText">kill</span> -> gain <span class="healthText">1 gold</span>`,
        unique: true,
        onKill: (myChar, enemyChar, abilityIndex) => {
            myGold += 1;
            createIndicator(myChar.x, myChar.y, "1 GOLD", "#efd081");
            renderGoldAndFloors();
        }
    },
    {
        desc: `every 3s, <span class="faithText">1 FTH</span> -> <span class="atkText">hit closest enemy</span>`,
        unique: false,
        onInit: (myChar, abilityIndex) => {
            myChar[`smite${abilityIndex}`] = 0;

        },
        onTick: (myChar, abilityIndex) => {
            myChar[`smite${abilityIndex}`] += 1;

            if (myChar[`smite${abilityIndex}`] >= 60 * 3 && myChar.faith >= 1) {
                myChar[`smite${abilityIndex}`] = 0;
                myChar.faith -= 1;
                var targetSpr = null;

                for (var i = 0; i < myChar.enemyTeam.length; i++) {
                    if (!targetSpr || Math.abs(targetSpr.x - myChar.x) > Math.abs(myChar.enemyTeam[i] - myChar.x))
                        targetSpr = myChar.enemyTeam[i];
                }

                if (targetSpr) {
                    meleeHit(myChar, targetSpr, true);
                    createIndicator(myChar.x, myChar.y, "-1", "#4995f3");
                }

            }
        }
    },
    {
        desc: `every 5s, <span class="faithText">4 FTH</span> -> <span class="healthText">heal team 15%</span>`,
        unique: false,
        onInit: (myChar, abilityIndex) => {
            myChar[`groupHeal${abilityIndex}`] = 0;

        },
        onTick: (myChar, abilityIndex) => {
            myChar[`groupHeal${abilityIndex}`] += 1;

            if (myChar[`groupHeal${abilityIndex}`] >= 60 * 5 && myChar.faith >= 4) {
                myChar[`groupHeal${abilityIndex}`] = 0;
                myChar.faith -= 4;

                for (var i = 0; i < myChar.myTeam.length; i++) {
                    var curChar = myChar.myTeam[i];
                    var healAmt = Math.ceil(0.15 * curChar.maxHealth);
                    heal(curChar, healAmt);
                }

            }
        }
    },
    {
        desc: `<span class="atkText">1st hit</span> -> <span class="atkText">x2 dmg</span>`,
        unique: true,
        onInit: (myChar, abilityIndex) => {
            myChar[`critFirst${abilityIndex}`] = 1;

        },
        onHit: (myChar, enemyChar, dmg, abilityIndex) => {
            if (myChar[`critFirst${abilityIndex}`] == 1) {
                myChar[`critFirst${abilityIndex}`] = 0;
                dmg *= 2;

            }

            return dmg;
        }
    },
];

var enemyFloors = [
    [0],
    [0, 0],
    [0, 1],
    [1, 1, 1],
    [2],
    [0, 0, 0, 4],
    [4, 4],
    [2, 2],
    [3, 3],
    [3, 3, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4],
    [5],
]

var repeatedEnemies = [
    {
        characterName: "RAT",
        size: 20,
        atk: [1, 2],
        health: 15,
        speed: 12,
        poison: 0,
        classType: "brigand",
        abilities: [],
        shopChoices: []
    },
    {
        characterName: "GOBLIN",
        size: 32,
        atk: [2, 4],
        health: 32,
        speed: 8,
        poison: 0,
        classType: "prophet",
        abilities: [],
        shopChoices: []
    },
    {
        characterName: "OGRE",
        size: 67,
        atk: [4, 7],
        health: 71,
        speed: 5,
        poison: 0,
        classType: "prophet",
        abilities: [],
        shopChoices: []
    },
    {
        characterName: "TROLL",
        size: 41,
        atk: [6, 8],
        health: 59,
        speed: 7,
        poison: 0,
        classType: "brigand",
        abilities: [],
        shopChoices: []
    },
    {
        characterName: "ZOMBIE",
        size: 33,
        atk: [4, 7],
        health: 38,
        speed: 3,
        poison: 2,
        classType: "necromancer",
        abilities: [],
        shopChoices: []
    },
    {
        characterName: "DRAGON",
        size: 51,
        atk: [8, 17],
        health: 180,
        speed: 5,
        poison: 0,
        classType: "crusader",
        abilities: [],
        shopChoices: []
    },
]