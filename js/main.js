var shakeScreen = 0;
var pauseFrames = 0;

// Palette https://lospec.com/palette-list/shiny-16

var battleCanvas;
var matchGoing = false;
var canBuy = true;

var classList = ["crusader", "prophet", "brigand", "necromancer"]

var nextHire = "prophet";
var myGold = 0;
var myFloor = 0;
var myLives = 3;
var matchOverTicks = 0;
var hitIndicators = [];
var myTeam = [
	{
		characterName: "crusader".toUpperCase(),
		size: 40,
		atk: [2, 3],
		health: 20,
		speed: 6,
		poison: 0,
		lvlPoints: 0,
		classType: "crusader",
		abilities: [0],
		shopChoices: []
	}
];

myTeam.forEach((myChar) => {
	reRollShop(myChar);
});

let allUnitsSprs,
	myTeamSprs,
	enemyTeamSprs,
	groundSprs,
	groundSpr,
	leftWallSpr,
	rightWallSpr,
	yosterFont;


function preload() {
	yosterFont = loadFont('yoster.ttf');
}

function setup() {
	battleCanvas = (new Canvas(canvasScreenWidth, canvasScreenHeight)).canvas;

	battleCanvas.style.position = "absolute";
	battleCanvas.style.top = "10px";
	battleCanvas.style.left = "10px";

	world.gravity.y = worldGravity;
	world.autoStep = false

	allUnitsSprs = new Group();
	allUnitsSprs.rotationLock = true;
	allUnitsSprs.friction = 0;

	myTeamSprs = new allUnitsSprs.Group();
	myTeamSprs.overlaps(myTeamSprs);

	enemyTeamSprs = new allUnitsSprs.Group();
	enemyTeamSprs.overlaps(enemyTeamSprs);

	groundSprs = new Group();
	groundSprs.strokeWeight = 0;
	groundSprs.color = "#3c2f52";

	myTeamSprs.collides(enemyTeamSprs, onCollide);

	groundSpr = new groundSprs.Sprite(arenaWidth / 2, arenaHeight, arenaWidth, 200, "static");
	leftWallSpr = new groundSprs.Sprite(-45, arenaHeight / 2, 100, 1000, "static");
	rightWallSpr = new groundSprs.Sprite(arenaWidth + 45, arenaHeight / 2, 100, 1000, "static");

	frameRate(60);

	textAlign(CENTER);
	textFont(yosterFont);
}

function draw() {
	background('#1f1723');

	if (!matchGoing) {
		clear();
		strokeWeight(10);
		stroke("black");
		fill("#e2e2e2")
		textSize(50);
		text('Waiting for next floor...', canvasScreenWidth / 2, canvasScreenHeight / 2 + Math.sin(Date.now() / 300) * 5);
	}
	else {
		if (matchOverTicks == 0) {
			checkWin();
		}
		else {
			matchOverTicks--;

			if (matchOverTicks == 0) {
				endMatch();
			}
		}


		camera.on();

		groundSprs.draw();

		allUnitsSprs.forEach((spr, i) => {
			spr.applyForce(spr.spd);
			if (spr.invincFrames > 0)
				spr.invincFrames--;

			spr.vel.x *= velocityDampening;

			fill(getColorFromClass(spr.classType));
			strokeWeight(4);
			textSize(10);
			text(`${spr.charName}`, spr.x, spr.y - spr.sizeVal / 2 - 10);

			spr.abilities.forEach((abl, ablIndx) => {
				if (abilityList[abl].onTick) {
					abilityList[abl].onTick(spr, ablIndx);
				}
			});

			strokeWeight(2);
			stroke("black");
			spr.draw();

			fill("#b4e656");
			rect(spr.x - spr.sizeVal / 2, spr.y + spr.sizeVal / 2 + 5, spr.sizeVal * (spr.health / spr.initHealth), 5);

			fill("#f5464c")
			strokeWeight(4);
			textSize(13);
			text(`${spr.atk[0]}`, spr.x - 9, spr.y + spr.sizeVal / 2 + 28 - 4);

			textSize(16);
			text(`${spr.atk[1]}`, spr.x + 9, spr.y + spr.sizeVal / 2 + 28 + 4);

			if (spr.faith > 0) {
				fill("#4995f3")
				strokeWeight(4);
				textSize(14);
				text(`${spr.faith}`, spr.x, spr.y + spr.sizeVal / 2 + 47);
			}

		})


		setCameraPos();

		hitIndicators.forEach((hitInd) => {
			hitInd.life++;

			fill(hitInd.color);
			strokeWeight(4);
			stroke("black");
			textSize(20);
			text(`${hitInd.dmg}`, hitInd.x, hitInd.y - Math.pow(hitInd.life / hitIndicatorLifeTime, .5) * 20);
		})

		hitIndicators = hitIndicators.filter((hitInd) => { return hitInd.life <= hitIndicatorLifeTime });

		camera.off();
		if (pauseFrames > 0)
			pauseFrames--
		else
			world.step(1 / 60);

	}
}

function setCameraPos() {
	camera.x = Math.max(
		canvasScreenWidth / 2,
		((allUnitsSprs.reduce((curTot, curSpr) => curTot + curSpr.x, 0) / allUnitsSprs.length) + camera.x) / 2
	);
	camera.y = arenaHeight / 2;

	if (shakeScreen != 0) {
		shakeScreen -= 1;
		camera.x += -(screenShakeIntensity / 2) + random(0, screenShakeIntensity)
		camera.y += -(screenShakeIntensity / 2) + random(0, screenShakeIntensity)
	}
}

function onCollide(myTeamSpr, enemyTeamSpr) {

	myTeamSpr.applyForce((-defaultKnockback * (enemyTeamSpr.sizeVal / myTeamSpr.sizeVal)) - random(0, 100), -random(50, 100));
	enemyTeamSpr.applyForce((defaultKnockback * (myTeamSpr.sizeVal / enemyTeamSpr.sizeVal)) + random(0, 100), -random(50, 100));

	meleeHit(myTeamSpr, enemyTeamSpr, false);
	meleeHit(enemyTeamSpr, myTeamSpr);

	checkDeath(enemyTeamSpr);
}

function hireNew() {
	if (matchGoing || myGold < getHireCost())
		return;

	myGold -= getHireCost();

	var newChar = createNewCharacter();

	myTeam.push(newChar);

	reRollShop(newChar);

	renderAll();

}

function rerollAll() {
	if (matchGoing || myGold < 2)
		return;

	myGold -= 2;

	myTeam.forEach((curChar) => {
		reRollShop(curChar);
	});

	nextHire = classList[Math.floor(Math.random() * classList.length)];

	renderAll();
}

function meleeHit(hitterSpr, victimSpr, doCheckDeath = true) {
	var dmg = hitterSpr.atk[0] + floor(random(hitterSpr.atk[1] - hitterSpr.atk[0] + 1));
	hitterSpr.abilities.forEach((abl, ablIndx) => {
		if (abilityList[abl].onHit) {
			dmg = abilityList[abl].onHit(hitterSpr, victimSpr, dmg, ablIndx);
		}
	})

	if (hitterSpr.poison > 0) {
		victimSpr.poisonCounter += hitterSpr.poison;
	}

	victimSpr.lastHitter = hitterSpr;

	damage(victimSpr, dmg, doCheckDeath);
}

function heal(victimSpr, dmg) {

	victimSpr.health += dmg;
	victimSpr.health = Math.min(victimSpr.health, victimSpr.maxHealth);
	createIndicator(victimSpr.x, victimSpr.y, dmg, "#b4e656");
}

function damage(victimSpr, dmg, doCheckDeath = true) {
	victimSpr.health -= dmg;

	createIndicator(victimSpr.x, victimSpr.y, dmg, "#f5464c");
	if (victimSpr.poisonCounter > 0) {
		victimSpr.health -= victimSpr.poisonCounter;
		createIndicator(victimSpr.x, victimSpr.y, victimSpr.poisonCounter, "#3ec54b");
		victimSpr.poisonCounter -= 1;
	}


	pauseFrames = 5;
	shakeScreen = 5;

	if (doCheckDeath)
		checkDeath(victimSpr);
}

function checkDeath(spr) {
	if (spr.health <= 0) {

		if (spr.lastHitter) {
			spr.lastHitter.abilities.forEach((abl, ablIndx) => {
				if (abilityList[abl].onKill) {
					abilityList[abl].onKill(spr.lastHitter, spr, ablIndx);
				}
			});
		}

		spr.abilities.forEach((abl, ablIndx) => {
			if (abilityList[abl].onDie) {
				abilityList[abl].onDie(spr, ablIndx);
			}
		})
		spr.remove();
	}
}

function checkWin() {
	if (myTeamSprs.length > 0 && enemyTeamSprs.length <= 0) {
		matchOverTicks = 30;
	}
	else if (enemyTeamSprs.length > 0 && myTeamSprs.length <= 0) {
		matchOverTicks = 30
	}
	else if (enemyTeamSprs.length <= 0 && myTeamSprs.length <= 0) {
		matchOverTicks = 30
	}
}

function myWin() {
	myGold += 12;
	resetMatch();
}

function myLoss() {
	myLives -= 1;

	if (myLives <= 0) {
		alert(`You made it to floor ${myFloor}. Nice job!`);
		location.reload();
	}
	myGold += 8;
	resetMatch();
}

function myTie() {
	myGold += 10;
	resetMatch();
}

function endMatch() {
	if (myTeamSprs.length > 0 && enemyTeamSprs.length <= 0) {
		myWin();
	}
	else if (enemyTeamSprs.length > 0 && myTeamSprs.length <= 0) {
		myLoss();
	}
	else if (enemyTeamSprs.length <= 0 && myTeamSprs.length <= 0) {
		myTie();
	}
}

function resetMatch() {
	allUnitsSprs.remove();
	myFloor += 1;
	myTeam.forEach((curChar) => {
		curChar.lvlPoints += 1;
	})
	matchGoing = false;
	nextHire = classList[Math.floor(Math.random() * classList.length)];
	document.getElementById("nextMatch").classList.add("matchEnabled");
	hitIndicators = [];
	renderAll();
}

function getEnemyTeam() {
	return enemyFloors[myFloor].map((enemyInd) => {
		return repeatedEnemies[enemyInd]
	});
}

function generateTeamsInSketch() {
	var distFromLeft = 5;
	myTeam.forEach((val, ind) => {

		var unitSpr = generateSpriteForTeamFromData(myTeamSprs, val);

		unitSpr.bearing = 0;
		unitSpr.x = distFromLeft + unitSpr.sizeVal;
		distFromLeft += unitSpr.sizeVal * 2 + 5;
		unitSpr.enemyTeam = enemyTeamSprs;
		unitSpr.myTeam = myTeamSprs;
	});


	var distFromRight = arenaWidth - 5;
	getEnemyTeam().forEach((val, ind) => {

		var unitSpr = generateSpriteForTeamFromData(enemyTeamSprs, val);

		unitSpr.bearing = 180;
		unitSpr.x = distFromRight - unitSpr.sizeVal;
		distFromRight -= unitSpr.sizeVal * 2 + 5;
		unitSpr.enemyTeam = myTeamSprs;
		unitSpr.myTeam = enemyTeamSprs;
	});
}

function generateSpriteForTeamFromData(team, sprData) {
	var unitSpr = new team.Sprite();

	unitSpr.initHealth = sprData.health;
	unitSpr.height = sprData.size;
	unitSpr.width = sprData.size;
	unitSpr.sizeVal = sprData.size;
	unitSpr.atk = [];
	unitSpr.atk[0] = sprData.atk[0];
	unitSpr.atk[1] = sprData.atk[1];
	unitSpr.spd = sprData.speed;
	unitSpr.health = sprData.health;
	unitSpr.maxHealth = sprData.health;
	unitSpr.poisonCounter = 0;
	unitSpr.poison = sprData.poison;
	unitSpr.faith = sprData.faith;
	unitSpr.y = 300 - sprData.size - 5;
	unitSpr.mass = 1;
	unitSpr.lastHitter = null;
	unitSpr.color = getColorFromClass(sprData.classType);
	unitSpr.charName = sprData.characterName;
	unitSpr.classType = sprData.classType;
	invincFrames = 0;

	unitSpr.abilities = sprData.abilities;

	unitSpr.abilities.forEach((abl, ablIndx) => {
		if (abilityList[abl].onInit) {
			abilityList[abl].onInit(unitSpr, ablIndx);
		}
	});

	return unitSpr;
}

function attemptNextFloor() {
	if (matchGoing) {
		return;
	}
	matchGoing = true;

	// Disable the next match button animation
	document.getElementById("nextMatch").classList.remove("matchEnabled");

	generateTeamsInSketch();
}

function reRollShop(curChar) {

	curChar.shopChoices = [];
	var maxRoll = 0;
	var posChoices = shopMasterList.filter((curShopChoice, choiceShopIndex) => {
		if (!curShopChoice.classesFor.includes(curChar.classType))
			return false;

		if (curShopChoice.ability != undefined && (abilityList[curShopChoice.ability].unique && curChar.abilities.includes(curShopChoice.ability)))
			return false;

		maxRoll += curShopChoice.rarity;
		return true;
	});


	for (var i = 0; i < 2; i++) {
		if (i == 1) {
			var secondChoice = -1;

			while (secondChoice == -1 || secondChoice == curChar.shopChoices[0]) {
				var curRoll = Math.floor(Math.random() * maxRoll);
				for (var j = 0; j < posChoices.length; j++) {

					if (curRoll - posChoices[j].rarity < 0) {
						secondChoice = posChoices[j];
						break;
					}

					curRoll -= posChoices[j].rarity;
				}
			}


			curChar.shopChoices.push(secondChoice)
		}
		else {
			var curRoll = Math.floor(Math.random() * maxRoll);
			for (var j = 0; j < posChoices.length; j++) {

				if (curRoll - posChoices[j].rarity < 0) {
					curChar.shopChoices.push(posChoices[j])
					break;
				}

				curRoll -= posChoices[j].rarity;
			}
		}

	}

	renderAll();
}



function buyShopChoice(charIndex, shopIndex) {
	if (!canBuy || matchGoing)
		return;


	var curChar = myTeam[charIndex];
	var curShopChoice = curChar.shopChoices[shopIndex];

	if (curShopChoice.cost <= curChar.lvlPoints) {
		curChar.lvlPoints -= curShopChoice.cost;
		canBuy = false;


		document.getElementById(`teammate${charIndex}`).style.transform = "scale(.9)";
		document.getElementById(`teammate${charIndex}`).getElementsByClassName("shopChoice").forEach((el) => {
			el.style.opacity = "0";
		})

		setTimeout(() => {
			if (curShopChoice.stats) {
				if (curShopChoice.stats.vit)
					curChar.health += curShopChoice.stats.vit;

				if (curShopChoice.stats.minAtk) {
					curChar.atk[0] += curShopChoice.stats.minAtk;
					curChar.atk[1] += curShopChoice.stats.minAtk;
				}

				if (curShopChoice.stats.maxAtk) {
					curChar.atk[1] += curShopChoice.stats.maxAtk;
				}

				if (curShopChoice.stats.poi) {
					curChar.poison += curShopChoice.stats.poi;
				}

				if (curShopChoice.stats.spd) {
					curChar.speed += curShopChoice.stats.spd;
					curChar.speed = Math.max(curChar.speed, 1);
				}

				if (curShopChoice.stats.faith) {
					curChar.faith += curShopChoice.stats.faith;
				}


			}

			if (curShopChoice.ability != undefined)
				curChar.abilities.push(curShopChoice.ability);


			document.getElementById(`teammate${charIndex}`).style.transform = "scale(1)";

			setTimeout(() => {
				canBuy = true;
				reRollShop(curChar);
				renderAll();
			}, 500);
		}, 500);


	}


}

renderAll();