function getColorFromClass(className) {
    if (className == 'crusader') {
        return "#f5464c";
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
}

function translateStatName(statName) {
    if (statName == "vit") {
        return "VIT";
    }
    else if (statName == "minAtk") {
        return "MIN ATK";
    }
    else if (statName == "maxAtk") {
        return "MAX ATK";
    }
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