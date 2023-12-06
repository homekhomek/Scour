var shakeScreen = 0;

// Palette https://lospec.com/palette-list/shiny-16

var battleCanvas;
var matchGoing = false;
var myGold = 0;
var myTeam = [
	{
		characterName: "Bracken",
		size: 20,
		atk: [1, 2],
		health: 5,
		speed: 10,
		knockback: 200,
		classType: "warrior"

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

	myTeamSprs = new allUnitsSprs.Group();
	myTeamSprs.overlaps(myTeamSprs);

	enemyTeamSprs = new allUnitsSprs.Group();
	enemyTeamSprs.overlaps(enemyTeamSprs);

	groundSprs = new Group();
	groundSprs.strokeWeight = 0;
	groundSprs.color = "#3c2f52";

	myTeamSprs.collides(enemyTeamSprs, hit);

	groundSpr = new groundSprs.Sprite(canvasScreenWidth / 2, canvasScreenHeight + 100, canvasScreenWidth, 400, "static");
	leftWallSpr = new groundSprs.Sprite(-45, 250, 100, 1000, "static");
	rightWallSpr = new groundSprs.Sprite(1545, 250, 100, 1000, "static");

	frameRate(60);

	console.log(battleCanvas)
	textAlign(CENTER);
}

function draw() {
	background('#1f1723');

	fill("#e2e2e2")
	textFont(yosterFont);

	textSize(50);
	text('Waiting for next match...', canvasScreenWidth / 2, canvasScreenHeight / 2 + Math.sin(Date.now() / 300) * 5);


	allUnitsSprs.forEach((spr, i) => {
		spr.applyForce(spr.spd);
		if (spr.invincFrames > 0)
			spr.invincFrames--;

		spr.vel.x *= .98;
		spr.draw();
	})



	if (shakeScreen != 0) {
		shakeScreen -= 1;
		camera.x = (canvasScreenWidth / 2) - (screenShakeIntensity / 2) + random(0, screenShakeIntensity)
		camera.y = (canvasScreenHeight / 2) - (screenShakeIntensity / 2) + random(0, screenShakeIntensity)

		if (shakeScreen == 0) {
			camera.x = (canvasScreenWidth / 2);
			camera.y = (canvasScreenHeight / 2);
		}
	}

	world.step(1 / 60);

}

function hit(myTeamSpr, enemyTeamSpr) {
	if (myTeamSpr.invincFrames > 0 || enemyTeamSpr.invincFrames > 0) return;

	myTeamSpr.applyForce(-enemyTeamSpr.knockback - random(0, 100), -random(50, 150));
	enemyTeamSpr.applyForce(myTeamSpr.knockback + random(0, 100), -random(50, 150));

	myTeamSpr.invincFrames = 10;
	enemyTeamSpr.invincFrames = 10;

	shakeScreen = 7;

}

function getEnemyTeam() {
	return [0, 0]
}

function generateTeamsInSketch() {
	var distFromLeft = 5;
	myTeam.forEach((val, ind) => {
		var sprData = unitTypes[val];

		generateSpriteFromUnitTypeIndex(myTeam, sprData);

		unitSpr.bearing = 0;
		unitSpr.x = distFromLeft + unitSpr.radius;
		distFromLeft += unitSpr.radius * 2 + 5;
	});


	var distFromRight = 1000 - 5;
	getEnemyTeam().forEach((val, ind) => {
		var sprData = unitTypes[val];
		var unitSpr = new enemyTeamSprs.Sprite();

		generateSpriteFromUnitTypeIndex(unitSpr, sprData);

		unitSpr.bearing = 180;
		unitSpr.x = distFromRight - unitSpr.radius;
		distFromRight -= unitSpr.radius * 2 + 5;
	});
}

function generateSpriteForTeamFromData(team, sprData) {
	var unitSpr = new myTeamSprs.Sprite();

	unitSpr.height = sprData.size;
	unitSpr.width = sprData.size;
	unitSpr.sizeVal = sprData.size;
	unitSpr.atk = [];
	unitSpr.atk[0] = sprData.atk[0];
	unitSpr.atk[1] = sprData.atk[1];
	unitSpr.spd = sprData.speed;
	unitSpr.health = sprData.health;
	unitSpr.knockback = sprData.knockback;
	unitSpr.y = 300 - sprData.radius - 5;
	invincFrames = 0;

}

