function getColorFromClass(className) {
    if (className == 'crusader') {
        return "#f5464c";
    }
    else if (className == "prophet") {
        return "#b4e656"
    }
    else if (className == "brigand") {
        return "#bcb0b3"
    }
    else if (className == "necromancer") {
        return "#4995f3"
    }

    return "#fff";
}


function getColorFromStatName(statName) {
    if (statName == "vit") {
        return "#b4e656";
    }
    else if (statName == "minAtk") {
        return "#f5464c ";
    }
    else if (statName == "maxAtk") {
        return "#f5464c";
    }
    else if (statName == "poi") {
        return "#3ec54b";
    }
    else if (statName == "spd") {
        return "#72deeb";
    }
    else if (statName == "faith") {
        return "#4995f3";
    }
}

function translateStatName(statName) {
    if (statName == "vit") {
        return "VIT";
    }
    else if (statName == "minAtk") {
        return "MIN";
    }
    else if (statName == "maxAtk") {
        return "MAX";
    }
    else if (statName == "poi") {
        return "POISON";
    }
    else if (statName == "spd") {
        return "SPEED";
    }
    else if (statName == "faith") {
        return "FAITH";
    }
}


function createNewCharacter() {
    var newChar = {
        size: 40,
        atk: [1, 4],
        health: 10,
        speed: 6,
        poison: 0,
        faith: 0,
        lvlPoints: 1,
        abilities: [],
        shopChoices: [],
        characterName: "filler"
    };


    newChar.classType = nextHire;
    newChar.characterName = nextHire.toUpperCase();

    if (nextHire == 'crusader') {
        newChar.health = 20;
        newChar.atk = [2, 3];
    }
    else if (nextHire == 'prophet') {
        newChar.health = 14;
        newChar.atk = [1, 2];
        newChar.speed = 4;
        newChar.size = 30;
        newChar.faith = 3;
    }
    else if (nextHire == 'brigand') {
        newChar.health = 17;
        newChar.atk = [2, 4];
        newChar.speed = 7;
        newChar.size = 38;
    }
    else if (nextHire == 'necromancer') {
        newChar.health = 12;
        newChar.atk = [1, 1];
        newChar.speed = 4;
        newChar.size = 36;
    }

    nextHire = classList[Math.floor(Math.random() * classList.length)];

    return newChar;
}

function createIndicator(x, y, txt, txtColor) {
    var curInd = {
        life: 0,
        x: x,
        y: y,
        dmg: txt,
        color: txtColor
    };

    var yOffset = 0;

    for (var i = 0; i < hitIndicators.length; i++) {
        if (hitIndicators[i].x == x && hitIndicators[i].life == 0) {
            yOffset -= 20;
        }
    }

    curInd.y += yOffset;

    hitIndicators.push(curInd);
}

function getHireCost() {
    return Math.pow(myTeam.length + 1, 2) + 6;
}