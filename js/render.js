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

        teamContainerDiv.innerHTML += `
        <div class="teamMate">
            <div class="unitPortrait" style="background-image: url('img/${curTeammate.classType}.png');"></div>
            <div class="unitName">${curTeammate.characterName}</div>
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
                <div class="shopChoice1 shopChoice">
                    <div class="cost">5 gold</div>
                    <div class="shopDesc">
                        5 VIT
                    </div>
                </div>
                <div class="shopChoice2 shopChoice">
                    <div class="cost">5 gold</div>
                    <div class="shopDesc">
                        ABL: first hit does x2 dmg
                    </div>
                </div>
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