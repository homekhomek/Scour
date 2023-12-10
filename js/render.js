var teamContainerDiv = document.getElementById("teamContainer");

function renderMyTeam() {
    teamContainerDiv.innerHTML = "";

    for (var i = 0; i < myTeam.length; i++) {
        var curTeammate = myTeam[i];

        var abilityHTML = ``;
        for (var j = 0; j < Math.max(2, curTeammate.abilities.length); j++) {
            if (j >= curTeammate.abilities.length) {
                abilityHTML += `<div class="ability" style="top:${j * 30}px"></div>`
            }
            else {
                abilityHTML += `<div class="ability" style="top:${j * 30}px">${abilityList[curTeammate.abilities[j]].desc}</div>`
            }
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
                statText += "ABL: " + abilityList[curShopChoice.ability].desc;
            }
            shopHtml += `
            <div class="shopChoice${1 + k} shopChoice" onclick="buyShopChoice(${i},${k})">
                <div class="shopChoiceName">${curShopChoice.choiceName}</div>
                <div class="cost">${curShopChoice.cost} gold</div>
                <div class="shopDesc">
                   ${statText}
                </div>
            </div>
            `;

        }

        teamContainerDiv.innerHTML += `
        <div class="teamMate" id="teammate${i}">
            <div class="unitPortrait" style="background-image: url('img/${curTeammate.classType}.png');"></div>
            <div class="unitName" style="color: ${getColorFromClass(curTeammate.classType)}">${curTeammate.characterName}</div>
            <div class="stats">
                <span class="statsText">-- STATS --</span><br>
                <span class="healthText">${curTeammate.health} VIT</span><br>
                <span class="atkText">${curTeammate.atk[0]}-${curTeammate.atk[1]} ATK</span><br>
                <span class="spdText">${curTeammate.speed} SPD</span><br>
                <!--<span class="defText">0 DEF</span><br>-->
            </div>
            <div class="abilityLabel">-- ABILITIES --</div>
            <div class="abilityWrapper">
                <div class="abilitySlots" style="height: ${30 * (Math.max(2, curTeammate.abilities.length))}px">
                    ${abilityHTML}
                </div>
            </div>
            <div class="shopLabel">-- SHOP --</div>
            <div class="shopChoices">
                ${shopHtml}
            </div>
        </div>`;
    }
}

function renderGoldAndFloors() {
    document.getElementById("goldText").innerHTML = `GOLD:<br>${myGold}`;
    document.getElementById("lvlText").innerHTML = `FLOOR:<br>${myFloor}`;
}

function renderAll() {
    renderGoldAndFloors();
    renderMyTeam();
}