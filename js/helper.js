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
        return "#f5464c";
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