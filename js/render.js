var teamContainerDiv = document.getElementById("teamContainer");

function renderMyTeam() {
    teamContainerDiv.innerHTML = "";

    for (var i = 0; i < myTeam.length + 1; i++) {
        var additHTML = '';
        if (i == myTeam.length) {
            additHTML = getAdditionalPanel(i);
        }
        else {
            additHTML = getTeammateRender(myTeam[i], i)
        }

        teamContainerDiv.style.width = `${360 * (myTeam.length + 1)}px`;

        teamContainerDiv.innerHTML += additHTML;
    }
}

function getAdditionalPanel(i) {
    return `<div class="teamMate" style="left: ${360 * i}px">
        <div class="hireButton" onclick="hireNew()">
            HIRE <span style="color:${getColorFromClass(nextHire)}">${nextHire.toUpperCase()}</span><br><span class="goldSpan">${getHireCost()} GOLD</span>
        </div>
        <div class="rerollAllButton" onclick="rerollAll()">
            REROLL ALL<br><span class="goldSpan">2 GOLD</span>
        </div>
    </div>`
}

function getTeammateRender(curTeammate, i) {

    var abilityHTML = ``;
    for (var j = 0; j < curTeammate.abilities.length; j++) {
        abilityHTML += `<div class="ability" style="top:${j * 30}px">${abilityList[curTeammate.abilities[j]].desc}</div>`
    }

    var shopHtml = ``;
    for (var k = 0; k < 2; k++) {
        var curShopChoice = curTeammate.shopChoices[k];
        var statText = '';
        if (curShopChoice.stats) {
            var statCounter = 0;
            var statsTotal = Object.keys(curShopChoice.stats).length
            for (let statName in curShopChoice.stats) {
                statText += `<span style="color: ${getColorFromStatName(statName)}">${curShopChoice.stats[statName]} ${translateStatName(statName)}</span>`
                statCounter++;
                if (statCounter < statsTotal)
                    statText += ", ";
            }
            statText += "<br>";
        }
        if (curShopChoice.ability != undefined) {
            statText += `<span style="color:#8c7f90">ABL:</span> ` + abilityList[curShopChoice.ability].desc;
        }
        shopHtml += `
        <div class="shopChoice${1 + k} shopChoice" onclick="buyShopChoice(${i},${k})">
            <div class="shopChoiceName">${curShopChoice.choiceName}</div>
            <div class="cost">${curShopChoice.cost} LVL</div>
            <div class="shopDesc">
               ${statText}
            </div>
        </div>
        `;

    }

    return `
    <div class="teamMate" id="teammate${i}" style="left: ${360 * i}px">
        <div class="unitPortrait" style="background-image: url('img/${curTeammate.classType}.png');"></div>
        <div class="unitName" style="color: ${getColorFromClass(curTeammate.classType)}">${curTeammate.characterName}</div>
        <div class="stats">
            <span class="statsText">-- STATS --</span><br>
            <span class="healthText">${curTeammate.health} VIT</span><br>
            <span class="atkText">${curTeammate.atk[0]}-${curTeammate.atk[1]} ATK</span><br>
            <span class="spdText">${curTeammate.speed} SPD</span><br>
            ${curTeammate.poison > 0 ? `<span class="poiText">${curTeammate.poison} POISON</span><br>` : ``}
            ${curTeammate.faith > 0 ? `<span class="faithText">${curTeammate.faith} FAITH</span><br>` : ``}
            <!--<span class="defText">0 DEF</span><br>-->
        </div>
        <div class="abilityLabel">-- ABILITIES --</div>
        <div class="abilityWrapper">
            <div class="abilitySlots" style="height: ${30 * (Math.max(2, curTeammate.abilities.length))}px">
                ${abilityHTML}
            </div>
        </div>
        <div class="shopLabel">-- LVL UP! --</div>
        ${curTeammate.lvlPoints > 0 ? `<div class="lvls"><span class="lvlText">${curTeammate.lvlPoints} LVL</span></div>
        <div class="shopChoices">
            ${shopHtml}
        </div>
        ` : ``}
        
    </div>`;
}

function renderGoldAndFloors() {
    document.getElementById("goldText").innerHTML = `GOLD: ${myGold}`;
    document.getElementById("lvlText").innerHTML = `FLOOR: ${myFloor}`;
    document.getElementById("liveText").innerHTML = `LIVES: ${myLives}`;
    document.getElementById("nextFloorInd").innerHTML = '- NEXT FLOOR -<br><br>';
    for (var i = 0; i < enemyFloors[myFloor].length; i++) {
        var curEnemy = repeatedEnemies[enemyFloors[myFloor][i]];


        document.getElementById("nextFloorInd").innerHTML += `<span style="color:${getColorFromClass(curEnemy.classType)}">${curEnemy.characterName}</span><br><span class="healthText">${curEnemy.health}</span> ~ <span class="atkText">${curEnemy.atk[0]}-${curEnemy.atk[1]}</span><br>`
    }

}

function renderAll() {
    renderGoldAndFloors();
    renderMyTeam();
}