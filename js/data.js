var shopMasterList = [
    {
        classesFor: ["crusader"],
        cost: 10,
        ability: 0
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
                hitIndicators.push({ x: myChar.x, y: myChar.y - 20, dmg: 5, life: 0, color: "#b4e656" });
                myChar.health += 5;
                myChar[`healHit${abilityIndex}`] = 0;
            }
        }
    }
];