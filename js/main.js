var shakeScreen = 0;
var pauseFrames = 0;

// Palette https://lospec.com/palette-list/shiny-16

var battleCanvas;
var matchGoing = false;
var myGold = 0;
var myFloor = 0;
var hitIndicators = [];
var myTeam = [
	{
		characterName: "Bracken",
		size: 40,
		atk: [1, 4],
		health: 10,
		speed: 10,
		knockback: 200,
		classType: "crusader",
		abilities: [0],
		shopChoices: []
	}
];



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

	console.log(battleCanvas)
	textAlign(CENTER);
	textFont(yosterFont);
}

function draw() {
	background('#1f1723');

	if (!matchGoing) {
		fill("#e2e2e2")
		textSize(50);
		text('Waiting for next match...', canvasScreenWidth / 2, canvasScreenHeight / 2 + Math.sin(Date.now() / 300) * 5);
	}

	camera.on();

	groundSprs.draw();

	allUnitsSprs.forEach((spr, i) => {
		spr.applyForce(spr.spd);
		if (spr.invincFrames > 0)
			spr.invincFrames--;

		spr.vel.x *= .96;
		spr.draw();

		fill("#b4e656");
		rect(spr.x - spr.sizeVal / 2, spr.y + spr.sizeVal / 2 + 5, spr.sizeVal * (spr.health / spr.initHealth), 5);
		fill("#f5464c")
		textSize(13);
		text(`${spr.atk[0]}`, spr.x - 7, spr.y + spr.sizeVal / 2 + 28 - 4);
		textSize(16);
		text(`${spr.atk[1]}`, spr.x + 7, spr.y + spr.sizeVal / 2 + 28 + 4);
	})


	setCameraPos();



	hitIndicators.forEach((hitInd) => {
		hitInd.life++;

		fill(hitInd.color)
		strokeWeight(2)
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

function setCameraPos() {
	camera.x = Math.max(
		canvasScreenWidth / 2,
		myTeamSprs.reduce((curMax, curSpr) => Math.max(curSpr.x, curMax), 0)
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

	meleeHit(myTeamSpr, enemyTeamSpr);
	meleeHit(enemyTeamSpr, myTeamSpr);

	pauseFrames = 5;
	shakeScreen = 5;
}

function meleeHit(hitterSpr, victimSpr) {
	var dmg = hitterSpr.atk[0] + floor(random(hitterSpr.atk[1]));
	hitterSpr.abilities.forEach((abl, ablIndx) => {
		if (abilityList[abl].onHit) {
			abilityList[abl].onHit(hitterSpr, victimSpr, dmg, ablIndx);
		}
	})

	damage(victimSpr, dmg);

}

function damage(victimSpr, dmg) {
	victimSpr.health -= dmg;
	hitIndicators.push({ x: victimSpr.x, y: victimSpr.y, dmg: dmg, life: 0, color: "#f5464c" });
	checkDeath(victimSpr);
}

function checkDeath(spr, checkWin = true) {
	if (spr.health <= 0) {
		spr.remove();
	}
}

function checkWin() {
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

function myWin() {

}

function myLoss() {

}

function myTie() {

}

function getEnemyTeam() {
	return [
		{
			characterName: "Goblin",
			size: 20,
			atk: [1, 3],
			health: 10,
			speed: 8,
			knockback: 200,
			classType: "crusader",
			abilities: [],
			shopChoices: []
		},
		{
			characterName: "Goblin",
			size: 30,
			atk: [1, 3],
			health: 10,
			speed: 8,
			knockback: 200,
			classType: "crusader",
			abilities: [],
			shopChoices: []
		}
	]
}

function generateTeamsInSketch() {
	var distFromLeft = 5;
	myTeam.forEach((val, ind) => {
		console.log(myTeamSprs)

		var unitSpr = generateSpriteForTeamFromData(myTeamSprs, val);

		unitSpr.bearing = 0;
		unitSpr.x = distFromLeft + unitSpr.sizeVal;
		distFromLeft += unitSpr.sizeVal * 2 + 5;
		console.log(unitSpr);
	});


	var distFromRight = arenaWidth - 5;
	getEnemyTeam().forEach((val, ind) => {

		var unitSpr = generateSpriteForTeamFromData(enemyTeamSprs, val);

		unitSpr.bearing = 180;
		unitSpr.x = distFromRight - unitSpr.sizeVal;
		distFromRight -= unitSpr.sizeVal * 2 + 5;
	});
}

function generateSpriteForTeamFromData(team, sprData) {
	console.log(team);
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
	unitSpr.knockback = sprData.knockback;
	unitSpr.y = 300 - sprData.size - 5;
	unitSpr.mass = 1;
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

renderAll();