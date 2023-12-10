var shopMasterList = [
    {
        choiceName: "Holy Strike",
        classesFor: ["crusader"],
        cost: 10,
        rarity: 5,
        ability: 0
    },
    {
        choiceName: "Last Defiance",
        classesFor: ["crusader"],
        cost: 10,
        rarity: 5,
        ability: 1
    },
    {
        choiceName: "Ham",
        classesFor: ["crusader"],
        cost: 2,
        rarity: 5,
        stats: {
            vit: 3
        }
    },
    {
        choiceName: "Sword Upgrade",
        classesFor: ["crusader"],
        cost: 4,
        rarity: 5,
        stats: {
            minAtk: 1,
            maxAtk: 1
        }
    }
];

var abilityList = [
    {
        desc: `every <span class="atkText">3 hits</span>, <span class="healthText">heal 5</span>`,
        unique: true,
        onInit: (myChar, abilityIndex) => {
            myChar[`healHit${abilityIndex}`] = 0;

        },
        onHit: (myChar, enemyChar, damage, abilityIndex) => {
            myChar[`healHit${abilityIndex}`] += 1;

            if (myChar[`healHit${abilityIndex}`] >= 3) {
                createIndicator(myChar.x, myChar.y, "5", "#b4e656");

                console.log(hitIndicators);
                myChar.health += 5;
                myChar[`healHit${abilityIndex}`] = 0;
            }
        }
    },
    {
        desc: `<span class="atkText">5 dmg</span> to all enemies on death`,
        unique: true,
        onDie: (myChar, abilityIndex) => {
            myChar.enemyTeam.forEach((spr) => {
                damage(spr, 5);
            })
        },

    }
];