// game.js for Perlenspiel 3.1

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-14 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

// This is a template for creating new Perlenspiel games


var gameOver = false;

var gridH, gridW;

var floorColor = 8081935;

var playerColor = PS.COLOR_BLUE;
var playerGlyph = 0x02190;
var playerGlyphColor = PS.COLOR_YELLOW;
var playerDirection = "N";
var oriX = 4;
var oriY = 4;

var doorX = 0;
var doorY = 0;
var wasDoor = false;
var heartDoor = false;
var lastX = 0;
var lastY = 0;

var attackX = 0;
var attackY = 0;

var drawNewEnemy = true;
var enemyColor = PS.COLOR_BLACK;
var enemyGlyph = 0x0298;
var enemyGlyphColor = PS.COLOR_RED;
var enemyRandMove = 0;
var enemyOriginalX = 0;
var enemyOriginalY = 0;

var inRoom = false;
var activeRoom = 0;

var shouldBreak = false;

var enemyMovementTimer, swordPresentTimer;

var Enemy0 = {
	x: 5,
	y: 5,
	glyph: enemyGlyph,
	wasDoorE: false,
	eDoorX: 0,
	eDoorY: 0,
};
var Enemy1 = {
	x: 0,
	y: 4,
	glyph: enemyGlyph,
	wasDoorE: false,
	eDoorX: 0,
	eDoorY: 0,
};
var Enemy2 = {
	x: 4,
	y: 0,
	glyph: enemyGlyph,
	wasDoorE: false,
	eDoorX: 0,
	eDoorY: 0,
};
var Enemy3 = {
	x: 1,
	y: 4,
	glyph: enemyGlyph,
	wasDoorE: false,
	eDoorX: 0,
	eDoorY: 0,
};
var Enemy4 = {
	x: 4,
	y: 1,
	glyph: enemyGlyph,
	wasDoorE: false,
	eDoorX: 0,
	eDoorY: 0,
};

var EnemyList = new Array();
EnemyList[0] = 0;
EnemyList[1] = 0;
EnemyList[2] = 0;
EnemyList[3] = 0;
EnemyList[4] = 0;

var enemiesLeft = 0;

var PlayerInventory = {
	maxHealth: 5,
	curHealth: 5,
}

function DrawPlayer(x, y){
	PS.glyph(x, y, playerGlyph);
	PS.data(x, y, "Player");
	PS.glyphColor(x, y, playerGlyphColor);
	PS.color(x, y, playerColor);
}

function ErasePlayer(x, y){
	PS.glyph(x, y, "");
	PS.color(x, y, floorColor);
	PS.data(x, y, "");
	if (wasDoor == true){
		PS.data(doorX, doorY, "Door");
		wasDoor = false;
		StatusTextUpdate("Inventory");
	}
		
}

function EnemyPreDraw(){
	
	drawNewEnemy = true;
	for (var i = 0; i < EnemyList.length; i++){
		if (EnemyList[i] != 0){
			DrawEnemy(i);
		}
	}
	
	drawNewEnemy = false;

	enemyMovementTimer = PS.timerStart(60, EnemyMovement);
}

function DrawEnemy(i){
	if (PS.data(EnemyList[i].x, EnemyList[i].y) == "Door"){
		EnemyList[i].wasDoorE = true;
		EnemyList[i].eDoorX = EnemyList[i].x;
		EnemyList[i].eDoorY = EnemyList[i].y;
	}
	
	PS.glyphColor(EnemyList[i].x, EnemyList[i].y, enemyGlyphColor);
	PS.glyph(EnemyList[i].x, EnemyList[i].y, EnemyList[i].glyph);
	PS.color(EnemyList[i].x, EnemyList[i].y, enemyColor);
	PS.data(EnemyList[i].x, EnemyList[i].y, "Enemy");
	if (drawNewEnemy)
		enemiesLeft++;
}

function EraseEnemy(x, y, i){
	PS.color(x, y, floorColor);
	PS.data(x, y, "");
	if (EnemyList[i].wasDoorE == true){
		PS.data(EnemyList[i].eDoorX, EnemyList[i].eDoorY, "Door");
		EnemyList[i].wasDoorE = false;
	}
	PS.glyph(x, y, "");
}

function RandomMovementDecider(){
	enemyRandMove = PS.random(4);
}

function EnemyMovement(){
	
	for (var i = 0; i < EnemyList.length; i++){
		if (EnemyList[i] != 0){

			RandomMovementDecider();

			enemyOriginalX = EnemyList[i].x;
			enemyOriginalY = EnemyList[i].y;

			
			if (enemyRandMove == 0){

			}
			else if (enemyRandMove == 1){ // Up
				EnemyList[i].y--;
				if (EnemyList[i].y < 0){
					EnemyList[i].y = gridH - 1;
				}
				if (PS.data(EnemyList[i].x, EnemyList[i].y) == "Enemy"){
					EnemyList[i].x = enemyOriginalX;
					EnemyList[i].y = enemyOriginalY;
				}
			}
			else if (enemyRandMove == 2){ // Down
				EnemyList[i].y++;
				if (EnemyList[i].y >= gridH){
					EnemyList[i].y = 0;
				}
				if (PS.data(EnemyList[i].x, EnemyList[i].y) == "Enemy"){
					EnemyList[i].x = enemyOriginalX;
					EnemyList[i].y = enemyOriginalY;
				}
			}
			else if (enemyRandMove == 3){ // Left
				EnemyList[i].x--;
				if (EnemyList[i].x < 0){
					EnemyList[i].x = gridW - 1;
				}
				if (PS.data(EnemyList[i].x, EnemyList[i].y) == "Enemy"){
					EnemyList[i].x = enemyOriginalX;
					EnemyList[i].y = enemyOriginalY;
				}
			}
			else if (enemyRandMove == 4){ // Right
				EnemyList[i].x++;
				if (EnemyList[i].x >= gridW){
					EnemyList[i].x = 0;
				}
				if (PS.data(EnemyList[i].x, EnemyList[i].y) == "Enemy"){
					EnemyList[i].x = enemyOriginalX;
					EnemyList[i].y = enemyOriginalY;
				}
			}

			if (PS.data(EnemyList[i].x, EnemyList[i].y) == "Player"){
				UpdateHealth(-1);
				
				EnemyDestroyer(EnemyList[i].x, EnemyList[i].y, false);
			}
			
			else if (enemyOriginalX != EnemyList[i].x || enemyOriginalY != EnemyList[i].y){
				EraseEnemy(enemyOriginalX, enemyOriginalY, i);
				DrawEnemy(i);
			}
		}
	}
}

function EnemyDestroyer(x, y, dropCheck){
	for (var i = 0; i < EnemyList.length; i++){
		if (EnemyList[i] != 0){
			if (EnemyList[i].x == x && EnemyList[i].y == y){
				
				EraseEnemy(x, y, i);
				enemiesLeft--;
				if (enemiesLeft <= 0){
					PS.audioPlay("fx_powerup8");
					if (PlayerInventory.curHealth > 0)
						StatusTextUpdate("Room Cleared!");
					else 
						StatusTextUpdate("Game Over :( Press R to reset.")
					activeRoom.cleared = true;
					PS.timerStop(enemyMovementTimer);
					if (enemiesLeft == 0 && activeRoom == RoomList[16]){
						gameOver = true;
						StatusTextUpdate("You Won! :) Press R to reset.")
					}
				}
				EnemyList[i] = 0;
				
				if (dropCheck == true){
					DropCheck(x, y);
				}
			}
		}
	}
}

function DropCheck(x, y){
	var randDrop = PS.random(2);

	if (randDrop > 0){
		DrawHeart(x, y);
	}

}

function DrawHeart(x, y){
	PS.glyph(x, y, 0x2764);
	PS.glyphColor(x, y, PS.COLOR_RED);
	
	if (PS.data(x, y) == "Door")
		heartDoor = true;
	PS.data(x, y, "Health");
}

function CalculateAttackCoor(){
	if (playerDirection == "N"){
		attackX = oriX;
		attackY = oriY - 1;
	}
	else if (playerDirection == "S"){
		attackX = oriX;
		attackY = oriY + 1;
	}
	else if (playerDirection == "W"){
		attackX = oriX - 1;
		attackY = oriY;
	}
	else if (playerDirection == "E"){
		attackX = oriX + 1;
		attackY = oriY;
	}
}

function DrawSword(x, y){
	if (PS.data(x, y) != "Wall"){
		PS.glyph(x, y, 0x0F12);
		PS.glyphColor(x, y, 0xFFFF);
		PS.color(x, y, floorColor);
	}
}

function EraseSword(){
	PS.glyph(attackX, attackY, "");
	PS.timerStop(swordPresentTimer);
}

function Melee(){
	CalculateAttackCoor();
	if (attackX >= 0 && attackX < gridW 
		&& attackY >= 0 && attackY < gridH 
		&& PS.data(attackX, attackY) != "Health"
		&& PS.glyph(attackX, attackY) != 0x0F12){
		DrawSword(attackX, attackY);
		PS.audioPlay("fx_rip");
		if (PS.data(attackX, attackY) == "Enemy"){
			EnemyDestroyer(attackX, attackY, true);
			PS.audioPlay("fx_squirp");
		}
		else {
			swordPresentTimer = PS.timerStart(15, EraseSword);
		}
	}
}

function StatusTextUpdate(message){
	if (message == "Inventory"){
		PS.statusText("Current Health: " + PlayerInventory.curHealth);
	}
	else {
		PS.statusText(message);
	}
}

function UpdateHealth(value){
	if (value < 0)
		PS.audioPlay("fx_bloink");
	
	PlayerInventory.curHealth += value;
	if (PlayerInventory.curHealth > 0){
		if (PlayerInventory.curHealth > PlayerInventory.maxHealth){
			PlayerInventory.curHealth = PlayerInventory.maxHealth;
		}
		StatusTextUpdate("Inventory");
	}
	else if (PlayerInventory.curHealth <= 0){
		PS.audioPlay("fx_shoot3");
		gameOver = true;
		StatusTextUpdate("Game Over :( Press R to reset.");
		ErasePlayer(oriX, oriY);
	}

}

function GameReset(){
	gameOver = false;
	oriX = 17;
	oriY = 25;
	PlayerInventory.curHealth = PlayerInventory.maxHealth;
	
	for (var i = 0; i < RoomList.length; i++){
		RoomList[i].cleared = false;
		// PS.debug("Room is " + RoomList[i].cleared + "\n");
	}
	for (var e = 0; e < EnemyList.length; e++){
		EnemyList[e] = 0;
	}
}

function InitialSetup(beginStatus){
	var begun = beginStatus;

	gridW = 26;
	gridH = 26;
	PS.gridSize(gridW, gridH);
	PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);

	if (!begun){
		GameReset();
		StatusTextUpdate("Use WASD to Move & Arrows to rotate");
	}
	else {
		StatusTextUpdate("Inventory");
	}

	inRoom = false;

	for (i = 0; i < ActiveDoors.length; i++){
		ActiveDoors[i] = 0;
	}

	shouldBreak = false;

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);

	PS.color(17, 2, floorColor); 
	PS.color(17, 25, floorColor); 
	PS.color(17, 24, floorColor); 
	PS.color(17, 23, floorColor); 
	PS.color(17, 22, floorColor); 
	PS.color(17, 21, floorColor); 
	PS.color(17, 20, floorColor); 
	PS.color(17, 19, floorColor); 
	PS.color(17, 18, floorColor); 
	PS.color(17, 17, floorColor); 
	PS.color(17, 16, floorColor); 
	PS.color(17, 15, floorColor); 
	PS.color(17, 14, floorColor); 
	PS.color(17, 13, floorColor); 
	PS.color(17, 12, floorColor); 
	PS.color(17, 11, floorColor); 
	PS.color(17, 10, floorColor); 
	PS.color(17, 9, floorColor); 
	PS.color(17, 8, floorColor); 
	PS.color(17, 8, floorColor); 
	PS.color(17, 7, floorColor); 
	PS.color(17, 6, floorColor); 
	PS.color(17, 5, floorColor); 
	PS.color(17, 4, floorColor); 
	PS.color(17, 3, floorColor); 
	PS.color(18, 4, floorColor); 
	PS.color(19, 4, floorColor); 
	PS.color(20, 4, floorColor); 
	PS.color(21, 4, floorColor); 
	PS.color(22, 4, floorColor); 
	PS.color(22, 5, floorColor); 
	PS.color(22, 6, floorColor); 
	PS.color(22, 7, floorColor); 
	PS.color(22, 8, floorColor); 
	PS.color(21, 8, floorColor); 
	PS.color(20, 8, floorColor); 
	PS.color(19, 8, floorColor); 
	PS.color(18, 8, floorColor); 
	PS.color(23, 8, floorColor); 
	PS.color(24, 8, floorColor); 
	PS.color(25, 8, floorColor); 
	PS.color(18, 17, floorColor); 
	PS.color(19, 17, floorColor); 
	PS.color(20, 17, floorColor); 
	PS.color(21, 17, floorColor); 
	PS.color(22, 17, floorColor); 
	PS.color(22, 16, floorColor); 
	PS.color(22, 15, floorColor); 
	PS.color(22, 14, floorColor); 
	PS.color(22, 13, floorColor); 
	PS.color(22, 12, floorColor); 
	PS.color(22, 11, floorColor); 
	PS.color(22, 10, floorColor); 
	PS.color(22, 9, floorColor); 
	PS.color(16, 8, floorColor); 
	PS.color(15, 8, floorColor); 
	PS.color(14, 8, floorColor); 
	PS.color(13, 8, floorColor); 
	PS.color(12, 8, floorColor); 
	PS.color(11, 8, floorColor); 
	PS.color(10, 8, floorColor); 
	PS.color(9, 8, floorColor); 
	PS.color(8, 8, floorColor); 
	PS.color(7, 8, floorColor); 
	PS.color(6, 8, floorColor); 
	PS.color(5, 8, floorColor); 
	PS.color(4, 8, floorColor); 
	PS.color(3, 8, floorColor); 
	PS.color(2, 8, floorColor); 
	PS.color(1, 8, floorColor); 
	PS.color(0, 8, floorColor); 
	PS.color(0, 7, floorColor); 
	PS.color(0, 6, floorColor); 
	PS.color(0, 5, floorColor); 
	PS.color(0, 4, floorColor); 
	PS.color(0, 3, floorColor); 
	PS.color(0, 2, floorColor); 
	PS.color(0, 1, floorColor); 
	PS.color(0, 0, floorColor); 
	PS.color(1, 0, floorColor); 
	PS.color(2, 0, floorColor); 
	PS.color(3, 0, floorColor); 
	PS.color(4, 0, floorColor); 
	PS.color(5, 0, floorColor); 
	PS.color(6, 0, floorColor); 
	PS.color(7, 0, floorColor); 
	PS.color(8, 0, floorColor); 
	PS.color(8, 1, floorColor); 
	PS.color(8, 2, floorColor); 
	PS.color(9, 2, floorColor); 
	PS.color(10, 2, floorColor); 
	PS.color(11, 2, floorColor); 
	PS.color(12, 2, floorColor); 
	PS.color(13, 2, floorColor); 
	PS.color(14, 2, floorColor); 
	PS.color(15, 2, floorColor); 
	PS.color(16, 2, floorColor); 
	PS.color(8, 3, floorColor); 
	PS.color(8, 4, floorColor); 
	PS.color(8, 5, floorColor); 
	PS.color(8, 6, floorColor); 
	PS.color(8, 7, floorColor); 
	PS.color(7, 4, floorColor); 
	PS.color(6, 4, floorColor); 
	PS.color(5, 4, floorColor); 
	PS.color(4, 4, floorColor); 
	PS.color(3, 4, floorColor); 
	PS.color(2, 4, floorColor); 
	PS.color(1, 4, floorColor); 
	PS.color(4, 5, floorColor); 
	PS.color(4, 6, floorColor); 
	PS.color(4, 7, floorColor); 
	PS.color(4, 9, floorColor); 
	PS.color(4, 10, floorColor); 
	PS.color(4, 11, floorColor); 
	PS.color(4, 12, floorColor); 
	PS.color(3, 12, floorColor); 
	PS.color(2, 12, floorColor); 
	PS.color(1, 12, floorColor); 
	PS.color(0, 12, floorColor); 
	PS.color(4, 13, floorColor); 
	PS.color(4, 14, floorColor); 
	PS.color(4, 15, floorColor); 
	PS.color(4, 16, floorColor); 
	PS.color(4, 17, floorColor); 
	PS.color(3, 17, floorColor); 
	PS.color(2, 17, floorColor); 
	PS.color(1, 17, floorColor); 
	PS.color(0, 17, floorColor); 
	PS.color(5, 17, floorColor); 
	PS.color(6, 17, floorColor); 
	PS.color(7, 17, floorColor); 
	PS.color(8, 17, floorColor); 
	PS.color(8, 18, floorColor); 
	PS.color(8, 19, floorColor); 
	PS.color(8, 20, floorColor); 
	PS.color(8, 21, floorColor); 
	PS.color(8, 22, floorColor); 
	PS.color(7, 22, floorColor); 
	PS.color(6, 22, floorColor); 
	PS.color(5, 22, floorColor); 
	PS.color(4, 22, floorColor); 
	PS.color(3, 22, floorColor); 
	PS.color(2, 22, floorColor); 
	PS.color(1, 22, floorColor); 
	PS.color(0, 22, floorColor); 
	PS.color(9, 22, floorColor); 
	PS.color(10, 22, floorColor); 
	PS.color(11, 22, floorColor); 
	PS.color(12, 22, floorColor); 
	PS.color(12, 21, floorColor); 
	PS.color(12, 20, floorColor); 
	PS.color(12, 19, floorColor); 
	PS.color(12, 18, floorColor); 
	PS.color(12, 17, floorColor); 
	PS.color(11, 17, floorColor); 
	PS.color(10, 17, floorColor); 
	PS.color(9, 17, floorColor); 
	PS.color(13, 17, floorColor); 
	PS.color(14, 17, floorColor); 
	PS.color(15, 17, floorColor); 
	PS.color(16, 17, floorColor); 
	PS.color(13, 22, floorColor); 
	PS.color(14, 22, floorColor); 
	PS.color(15, 22, floorColor); 
	PS.color(16, 22, floorColor); 
	PS.color(8, 16, floorColor); 
	PS.color(8, 15, floorColor); 
	PS.color(8, 14, floorColor); 
	PS.color(8, 13, floorColor); 
	PS.color(8, 12, floorColor); 
	PS.color(8, 11, floorColor); 
	PS.color(8, 10, floorColor); 
	PS.color(8, 9, floorColor); 

	PS.data(18, 25, "Wall"); 
	PS.data(18, 24, "Wall"); 
	PS.data(18, 23, "Wall"); 
	PS.data(18, 22, "Wall"); 
	PS.data(18, 21, "Wall"); 
	PS.data(18, 20, "Wall"); 
	PS.data(18, 19, "Wall"); 
	PS.data(18, 18, "Wall"); 
	PS.data(19, 18, "Wall"); 
	PS.data(20, 18, "Wall"); 
	PS.data(21, 18, "Wall"); 
	PS.data(22, 18, "Wall"); 
	PS.data(23, 18, "Wall"); 
	PS.data(23, 17, "Wall"); 
	PS.data(23, 16, "Wall"); 
	PS.data(23, 15, "Wall"); 
	PS.data(23, 14, "Wall"); 
	PS.data(23, 13, "Wall"); 
	PS.data(23, 12, "Wall"); 
	PS.data(23, 11, "Wall"); 
	PS.data(23, 10, "Wall"); 
	PS.data(23, 9, "Wall"); 
	PS.data(24, 9, "Wall"); 
	PS.data(25, 9, "Wall"); 
	PS.data(25, 7, "Wall"); 
	PS.data(24, 7, "Wall"); 
	PS.data(23, 7, "Wall"); 
	PS.data(23, 6, "Wall"); 
	PS.data(23, 5, "Wall"); 
	PS.data(23, 4, "Wall"); 
	PS.data(23, 3, "Wall"); 
	PS.data(22, 3, "Wall"); 
	PS.data(21, 3, "Wall"); 
	PS.data(20, 3, "Wall"); 
	PS.data(19, 3, "Wall"); 
	PS.data(18, 3, "Wall"); 
	PS.data(18, 2, "Wall"); 
	PS.data(18, 1, "Wall"); 
	PS.data(17, 1, "Wall"); 
	PS.data(16, 1, "Wall"); 
	PS.data(15, 1, "Wall"); 
	PS.data(14, 1, "Wall"); 
	PS.data(13, 1, "Wall"); 
	PS.data(12, 1, "Wall"); 
	PS.data(11, 1, "Wall"); 
	PS.data(10, 1, "Wall"); 
	PS.data(9, 1, "Wall"); 
	PS.data(9, 0, "Wall"); 
	PS.data(7, 1, "Wall"); 
	PS.data(7, 2, "Wall"); 
	PS.data(7, 3, "Wall"); 
	PS.data(6, 3, "Wall"); 
	PS.data(5, 3, "Wall"); 
	PS.data(4, 3, "Wall"); 
	PS.data(3, 3, "Wall"); 
	PS.data(2, 3, "Wall"); 
	PS.data(1, 3, "Wall"); 
	PS.data(1, 2, "Wall"); 
	PS.data(1, 1, "Wall"); 
	PS.data(2, 1, "Wall"); 
	PS.data(3, 1, "Wall"); 
	PS.data(4, 1, "Wall"); 
	PS.data(5, 1, "Wall"); 
	PS.data(6, 1, "Wall"); 
	PS.data(1, 5, "Wall"); 
	PS.data(1, 6, "Wall"); 
	PS.data(1, 7, "Wall"); 
	PS.data(2, 7, "Wall"); 
	PS.data(3, 7, "Wall"); 
	PS.data(3, 6, "Wall"); 
	PS.data(3, 5, "Wall"); 
	PS.data(2, 5, "Wall"); 
	PS.data(5, 5, "Wall"); 
	PS.data(5, 6, "Wall"); 
	PS.data(5, 7, "Wall"); 
	PS.data(6, 7, "Wall"); 
	PS.data(7, 7, "Wall"); 
	PS.data(7, 6, "Wall"); 
	PS.data(7, 5, "Wall"); 
	PS.data(6, 5, "Wall"); 
	PS.data(9, 3, "Wall"); 
	PS.data(9, 4, "Wall"); 
	PS.data(9, 5, "Wall"); 
	PS.data(9, 6, "Wall"); 
	PS.data(9, 7, "Wall"); 
	PS.data(10, 7, "Wall"); 
	PS.data(11, 7, "Wall"); 
	PS.data(12, 7, "Wall"); 
	PS.data(13, 7, "Wall"); 
	PS.data(14, 7, "Wall"); 
	PS.data(15, 7, "Wall"); 
	PS.data(16, 7, "Wall"); 
	PS.data(16, 6, "Wall"); 
	PS.data(16, 5, "Wall"); 
	PS.data(16, 4, "Wall"); 
	PS.data(16, 3, "Wall"); 
	PS.data(15, 3, "Wall"); 
	PS.data(14, 3, "Wall"); 
	PS.data(13, 3, "Wall"); 
	PS.data(12, 3, "Wall"); 
	PS.data(11, 3, "Wall"); 
	PS.data(10, 3, "Wall"); 
	PS.data(18, 5, "Wall"); 
	PS.data(18, 6, "Wall"); 
	PS.data(18, 7, "Wall"); 
	PS.data(19, 7, "Wall"); 
	PS.data(20, 7, "Wall"); 
	PS.data(21, 7, "Wall"); 
	PS.data(21, 6, "Wall"); 
	PS.data(21, 5, "Wall"); 
	PS.data(20, 5, "Wall"); 
	PS.data(19, 5, "Wall"); 
	PS.data(18, 5, "Wall"); 
	PS.data(3, 9, "Wall"); 
	PS.data(3, 10, "Wall"); 
	PS.data(3, 11, "Wall"); 
	PS.data(2, 11, "Wall"); 
	PS.data(1, 11, "Wall"); 
	PS.data(0, 11, "Wall"); 
	PS.data(0, 10, "Wall"); 
	PS.data(0, 9, "Wall"); 
	PS.data(1, 9, "Wall"); 
	PS.data(2, 9, "Wall"); 
	PS.data(3, 9, "Wall"); 
	PS.data(3, 13, "Wall"); 
	PS.data(3, 14, "Wall"); 
	PS.data(3, 15, "Wall"); 
	PS.data(3, 16, "Wall"); 
	PS.data(2, 16, "Wall"); 
	PS.data(1, 16, "Wall"); 
	PS.data(0, 16, "Wall"); 
	PS.data(0, 15, "Wall"); 
	PS.data(0, 14, "Wall"); 
	PS.data(0, 13, "Wall"); 
	PS.data(1, 13, "Wall"); 
	PS.data(2, 13, "Wall"); 
	PS.data(0, 18, "Wall"); 
	PS.data(1, 18, "Wall"); 
	PS.data(2, 18, "Wall"); 
	PS.data(3, 18, "Wall"); 
	PS.data(4, 18, "Wall"); 
	PS.data(5, 18, "Wall"); 
	PS.data(6, 18, "Wall"); 
	PS.data(7, 18, "Wall"); 
	PS.data(7, 19, "Wall"); 
	PS.data(7, 20, "Wall"); 
	PS.data(7, 21, "Wall"); 
	PS.data(6, 21, "Wall"); 
	PS.data(5, 21, "Wall"); 
	PS.data(4, 21, "Wall"); 
	PS.data(3, 21, "Wall"); 
	PS.data(2, 21, "Wall"); 
	PS.data(1, 21, "Wall"); 
	PS.data(0, 21, "Wall"); 
	PS.data(0, 20, "Wall"); 
	PS.data(0, 19, "Wall"); 
	PS.data(0, 18, "Wall"); 
	PS.data(9, 18, "Wall"); 
	PS.data(9, 19, "Wall"); 
	PS.data(9, 20, "Wall"); 
	PS.data(9, 21, "Wall"); 
	PS.data(10, 21, "Wall"); 
	PS.data(11, 21, "Wall"); 
	PS.data(11, 20, "Wall"); 
	PS.data(11, 19, "Wall"); 
	PS.data(11, 19, "Wall"); 
	PS.data(10, 18, "Wall"); 
	PS.data(9, 18, "Wall"); 
	PS.data(13, 18, "Wall"); 
	PS.data(13, 19, "Wall"); 
	PS.data(13, 20, "Wall"); 
	PS.data(13, 21, "Wall"); 
	PS.data(14, 21, "Wall"); 
	PS.data(15, 21, "Wall"); 
	PS.data(16, 21, "Wall"); 
	PS.data(16, 20, "Wall"); 
	PS.data(16, 19, "Wall"); 
	PS.data(16, 18, "Wall"); 
	PS.data(15, 18, "Wall"); 
	PS.data(14, 18, "Wall"); 
	PS.data(13, 18, "Wall"); 
	PS.data(0, 23, "Wall"); 
	PS.data(1, 23, "Wall"); 
	PS.data(2, 23, "Wall"); 
	PS.data(3, 23, "Wall"); 
	PS.data(4, 23, "Wall"); 
	PS.data(5, 23, "Wall"); 
	PS.data(6, 23, "Wall"); 
	PS.data(7, 23, "Wall"); 
	PS.data(8, 23, "Wall"); 
	PS.data(9, 23, "Wall"); 
	PS.data(10, 23, "Wall"); 
	PS.data(11, 23, "Wall"); 
	PS.data(12, 23, "Wall"); 
	PS.data(13, 23, "Wall"); 
	PS.data(14, 23, "Wall"); 
	PS.data(15, 23, "Wall"); 
	PS.data(16, 23, "Wall"); 
	PS.data(16, 24, "Wall"); 
	PS.data(16, 25, "Wall"); 
	PS.data(15, 25, "Wall"); 
	PS.data(14, 25, "Wall"); 
	PS.data(13, 25, "Wall"); 
	PS.data(12, 25, "Wall"); 
	PS.data(11, 25, "Wall"); 
	PS.data(10, 25, "Wall"); 
	PS.data(9, 25, "Wall"); 
	PS.data(8, 25, "Wall"); 
	PS.data(7, 25, "Wall"); 
	PS.data(6, 25, "Wall"); 
	PS.data(5, 25, "Wall"); 
	PS.data(4, 25, "Wall"); 
	PS.data(3, 25, "Wall"); 
	PS.data(2, 25, "Wall"); 
	PS.data(1, 25, "Wall"); 
	PS.data(0, 25, "Wall"); 
	PS.data(0, 24, "Wall"); 
	PS.data(5, 16, "Wall"); 
	PS.data(6, 16, "Wall"); 
	PS.data(7, 16, "Wall"); 
	PS.data(7, 15, "Wall"); 
	PS.data(7, 14, "Wall"); 
	PS.data(7, 13, "Wall"); 
	PS.data(7, 12, "Wall"); 
	PS.data(7, 11, "Wall"); 
	PS.data(7, 10, "Wall"); 
	PS.data(7, 9, "Wall"); 
	PS.data(6, 9, "Wall"); 
	PS.data(5, 9, "Wall"); 
	PS.data(5, 10, "Wall"); 
	PS.data(5, 11, "Wall"); 
	PS.data(5, 12, "Wall"); 
	PS.data(5, 13, "Wall"); 
	PS.data(5, 14, "Wall"); 
	PS.data(5, 15, "Wall"); 
	PS.data(5, 16, "Wall"); 
	PS.data(9, 16, "Wall"); 
	PS.data(9, 15, "Wall"); 
	PS.data(9, 14, "Wall"); 
	PS.data(9, 14, "Wall"); 
	PS.data(9, 13, "Wall"); 
	PS.data(9, 12, "Wall"); 
	PS.data(9, 11, "Wall"); 
	PS.data(9, 10, "Wall"); 
	PS.data(9, 9, "Wall"); 
	PS.data(10, 9, "Wall"); 
	PS.data(11, 9, "Wall"); 
	PS.data(12, 9, "Wall"); 
	PS.data(13, 9, "Wall"); 
	PS.data(14, 9, "Wall"); 
	PS.data(15, 9, "Wall"); 
	PS.data(16, 9, "Wall"); 
	PS.data(16, 10, "Wall"); 
	PS.data(16, 11, "Wall"); 
	PS.data(16, 12, "Wall"); 
	PS.data(16, 13, "Wall"); 
	PS.data(16, 14, "Wall"); 
	PS.data(16, 15, "Wall"); 
	PS.data(16, 16, "Wall"); 
	PS.data(15, 16, "Wall"); 
	PS.data(14, 16, "Wall"); 
	PS.data(13, 16, "Wall"); 
	PS.data(12, 16, "Wall"); 
	PS.data(11, 16, "Wall"); 
	PS.data(10, 16, "Wall"); 
	PS.data(9, 16, "Wall"); 
	PS.data(18, 16, "Wall"); 
	PS.data(18, 15, "Wall"); 
	PS.data(18, 14, "Wall"); 
	PS.data(18, 13, "Wall"); 
	PS.data(18, 12, "Wall"); 
	PS.data(18, 11, "Wall"); 
	PS.data(18, 10, "Wall"); 
	PS.data(18, 9, "Wall"); 
	PS.data(19, 9, "Wall"); 
	PS.data(20, 9, "Wall"); 
	PS.data(21, 9, "Wall"); 
	PS.data(21, 10, "Wall"); 
	PS.data(21, 11, "Wall"); 
	PS.data(21, 12, "Wall"); 
	PS.data(21, 13, "Wall"); 
	PS.data(21, 14, "Wall"); 
	PS.data(21, 15, "Wall"); 
	PS.data(21, 16, "Wall"); 
	PS.data(20, 16, "Wall"); 
	PS.data(19, 16, "Wall"); 
	PS.data(11, 18, "Wall");

	PS.border(1, 1, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(1, 5, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(0, 9, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(0, 13, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(0, 18, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(0, 23, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 18, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(5, 9, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(5, 5, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 3, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 5, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 9, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(13, 18, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 9, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(23, 9, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 18, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(21, 18, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 23, {top: 1, left: 1, right: 0, bottom: 0}); 
	PS.border(0, 0, {top: 1, left: 1, right: 0, bottom: 0});
	PS.border(17, 2, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(22, 4, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 8, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 9, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 18, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(20, 23, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(20, 18, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(21, 9, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(21, 5, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 3, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 9, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 18, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 18, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(11, 18, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 9, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(8, 0, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 1, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 5, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(3, 13, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(3, 9, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 23, {top: 1, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 17, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(20, 25, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(20, 22, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(25, 25, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(21, 16, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(21, 7, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(16, 7, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(16, 16, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(16, 21, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(11, 21, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(7, 21, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(7, 16, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(3, 16, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(3, 11, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(3, 7, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(7, 7, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(7, 3, {top: 0, left: 0, right: 1, bottom: 1}); 
	PS.border(18, 7, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(18, 16, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(23, 17, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(21, 25, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(9, 16, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(9, 21, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(13, 21, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(0, 21, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(0, 16, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(5, 16, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(0, 11, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(1, 7, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(1, 3, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(9, 7, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(2, 3, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(3, 3, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(4, 3, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(5, 3, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(6, 3, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(2, 7, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(6, 7, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(2, 11, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(1, 11, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(1, 16, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(2, 16, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(1, 21, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(2, 21, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(3, 21, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(4, 21, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(5, 21, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(6, 21, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(10, 21, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(14, 21, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(15, 21, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(19, 25, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(19, 22, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(22, 25, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(23, 25, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(24, 25, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(24, 17, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(20, 7, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(19, 7, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(15, 7, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(14, 7, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(13, 7, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(12, 7, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(11, 7, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(10, 7, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(10, 16, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(11, 16, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(12, 16, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(13, 16, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(14, 16, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(15, 16, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(6, 16, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(20, 16, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(19, 16, {top: 0, left: 0, right: 0, bottom: 1}); 
	PS.border(2, 1, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(3, 1, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(4, 1, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(5, 1, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(6, 1, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(1, 0, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(2, 0, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(3, 0, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(4, 0, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(5, 0, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(6, 0, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(7, 0, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(9, 2, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(10, 2, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(11, 2, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(12, 2, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(13, 2, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(14, 2, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(15, 2, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(16, 2, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(18, 4, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(19, 4, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(20, 4, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(21, 4, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(24, 8, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(23, 8, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(24, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(20, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(19, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(20, 5, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(19, 5, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(15, 3, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(14, 3, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(13, 3, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(12, 3, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(11, 3, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(10, 3, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(6, 5, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(2, 5, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(3, 5, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(1, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(2, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(1, 13, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(2, 13, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(6, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(10, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(11, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(12, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(13, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(14, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(15, 9, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(14, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(15, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(10, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(6, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(5, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(4, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(3, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(2, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(1, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(1, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(2, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(3, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(4, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(5, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(6, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(7, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(8, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(9, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(10, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(11, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(12, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(13, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(14, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(15, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(19, 23, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(19, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(22, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(23, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(24, 18, {top: 1, left: 0, right: 0, bottom: 0}); 
	PS.border(20, 19, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(20, 20, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(20, 21, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(20, 24, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 24, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 25, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 19, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 20, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(11, 19, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(11, 20, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 19, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 20, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 10, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 11, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 12, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 13, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 14, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 15, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(3, 15, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(3, 14, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(3, 10, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(3, 6, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 6, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 6, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 5, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 4, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(21, 6, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(22, 5, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(22, 6, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(22, 7, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(8, 1, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(7, 2, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 10, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 11, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 12, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 13, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 14, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(16, 15, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(21, 10, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(21, 11, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(21, 12, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(21, 13, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(21, 14, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(21, 15, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 10, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 11, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 12, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 13, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 14, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 15, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 16, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 19, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 20, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 21, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 22, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 23, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(25, 24, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(17, 3, {top: 0, left: 0, right: 1, bottom: 0}); 
	PS.border(23, 10, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(23, 11, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(23, 12, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(23, 13, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(23, 14, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(23, 15, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(23, 16, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(21, 19, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(21, 20, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(21, 21, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(21, 22, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(21, 23, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(21, 24, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 24, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 19, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 20, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 21, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 15, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 14, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 13, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 12, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 11, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 10, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 6, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 6, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 5, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 4, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(5, 6, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(1, 6, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(1, 2, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(0, 10, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(0, 14, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(0, 15, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(0, 19, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(0, 20, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(5, 10, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(5, 11, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(5, 12, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(5, 13, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(5, 14, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(5, 15, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 19, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 20, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(13, 19, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(13, 20, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 10, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 11, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 12, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 13, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 14, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(9, 15, {top: 0, left: 1, right: 0, bottom: 0}); 
	PS.border(18, 22, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(18, 25, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(5, 7, {top: 0, left: 1, right: 0, bottom: 1}); 
	PS.border(3, 5, {top: 1, left: 0, right: 1, bottom: 0}); 

	PS.border(24, 8, {top: 1, left: 0, right: 0, bottom: 3}); 
	PS.data(24, 8, "Door"); 
	PS.border(11, 2, {top: 1, left: 0, right: 0, bottom: 3}); 
	PS.data(11, 2, "Door"); 
	PS.border(1, 12, {top: 0, left: 0, right: 0, bottom: 3}); 
	PS.data(1, 12, "Door"); 
	PS.border(4, 17, {top: 0, left: 0, right: 0, bottom: 3}); 
	PS.data(4, 17, "Door"); 
	PS.border(14, 17, {top: 0, left: 0, right: 0, bottom: 3}); 
	PS.data(14, 17, "Door"); 
	PS.border(4, 4, {top: 3, left: 0, right: 0, bottom: 0}); 
	PS.data(4, 4, "Door"); 
	PS.border(0, 12, {top: 3, left: 0, right: 0, bottom: 0}); 
	PS.data(0, 12, "Door"); 
	PS.border(12, 17, {top: 3, left: 0, right: 0, bottom: 0}); 
	PS.data(12, 17, "Door"); 
	PS.border(13, 8, {top: 3, left: 0, right: 0, bottom: 0}); 
	PS.data(13, 8, "Door"); 
	PS.border(4, 22, {top: 3, left: 0, right: 0, bottom: 0}); 
	PS.data(4, 22, "Door"); 
	PS.border(12, 8, {top: 0, left: 0, right: 0, bottom: 3}); 
	PS.data(12, 8, "Door"); 
	PS.border(4, 12, {top: 0, left: 0, right: 3, bottom: 0}); 
	PS.data(4, 12, "Door"); 
	PS.border(4, 7, {top: 0, left: 0, right: 3, bottom: 0}); 
	PS.data(4, 7, "Door"); 
	PS.border(8, 13, {top: 0, left: 0, right: 3, bottom: 0}); 
	PS.data(8, 13, "Door"); 
	PS.border(8, 19, {top: 0, left: 0, right: 3, bottom: 0}); 
	PS.data(8, 19, "Door"); 
	PS.border(12, 19, {top: 0, left: 0, right: 3, bottom: 0}); 
	PS.data(12, 19, "Door"); 
	PS.border(17, 22, {top: 0, left: 0, right: 3, bottom: 0}); 
	PS.data(17, 22, "Door"); 
	PS.border(17, 24, {top: 0, left: 0, right: 3, bottom: 0}); 
	PS.data(17, 24, "Door"); 
	PS.border(22, 12, {top: 0, left: 0, right: 3, bottom: 0}); 
	PS.data(22, 12, "Door"); 
	PS.border(17, 7, {top: 0, left: 0, right: 3, bottom: 0}); 
	PS.data(17, 7, "Door"); 
	PS.border(8, 6, {top: 0, left: 0, right: 3, bottom: 0}); 
	PS.data(8, 6, "Door"); 
	PS.border(17, 12, {top: 0, left: 0, right: 3, bottom: 0}); 
	PS.data(17, 12, "Door"); 
	PS.border(8, 2, {top: 0, left: 3, right: 0, bottom: 0}); 
	PS.data(8, 2, "Door"); 
	PS.border(4, 5, {top: 0, left: 3, right: 0, bottom: 0}); 
	PS.data(4, 5, "Door"); 
	PS.border(4, 10, {top: 0, left: 3, right: 0, bottom: 0}); 
	PS.data(4, 10, "Door"); 
	PS.border(8, 10, {top: 0, left: 3, right: 0, bottom: 0}); 
	PS.data(8, 10, "Door"); 
	PS.border(8, 15, {top: 0, left: 3, right: 0, bottom: 0}); 
	PS.data(8, 15, "Door"); 
	PS.border(4, 14, {top: 0, left: 3, right: 0, bottom: 0}); 
	PS.data(4, 14, "Door"); 
	PS.border(12, 20, {top: 0, left: 3, right: 0, bottom: 0}); 
	PS.data(12, 20, "Door"); 
	PS.border(22, 14, {top: 0, left: 3, right: 0, bottom: 0}); 
	PS.data(22, 14, "Door"); 
	PS.border(17, 13, {top: 0, left: 3, right: 0, bottom: 0}); 
	PS.data(17, 13, "Door"); 
	PS.border(22, 6, {top: 0, left: 3, right: 1, bottom: 0}); 
	PS.data(22, 6, "Door"); 
	PS.border(17, 4, {top: 0, left: 3, right: 0, bottom: 0}); 
	PS.data(17, 4, "Door"); 
	PS.border(19, 17, {top: 0, left: 0, right: 0, bottom: 3}); 
	PS.data(19, 17, "Door"); 
	PS.border(22, 17, {top: 0, left: 0, right: 0, bottom: 3}); 
	PS.data(22, 17, "Door"); 

	DrawOthersIfCleared();

	DrawPlayer(oriX, oriY);
}

function DrawOthersIfCleared(){
	for (var i = 0; i < RoomList.length; i++){
		if (RoomList[i].cleared == true){
			PS.applyRect(RoomList[i].xCoor, RoomList[i].yCoor, RoomList[i].xSize, RoomList[i].ySize, 
				PS.color, floorColor);
		}
	}
}

var Room0 = {
	cleared: false,
	xCoor: 18,
	yCoor: 23,
	xSize: 3,
	ySize: 3,
};

var Room1 = {
	cleared: false,
	xCoor: 18,
	yCoor: 18,
	xSize: 3,
	ySize: 5,
};

var Room2 = {
	cleared: false,
	xCoor: 21,
	yCoor: 18,
	xSize: 5,
	ySize: 8,
};

var Room3 = {
	cleared: false,
	xCoor: 18,
	yCoor: 9,
	xSize: 4,
	ySize: 8,
};

var Room4 = {
	cleared: false,
	xCoor: 23,
	yCoor: 9,
	xSize: 3,
	ySize: 9,
};

var Room5 = {
	cleared: false,
	xCoor: 18,
	yCoor: 5,
	xSize: 4,
	ySize: 3,
};

var Room6 = {
	cleared: false,
	xCoor: 9,
	yCoor: 3,
	xSize: 8,
	ySize: 5,
};

var Room7 = {
	cleared: false,
	xCoor: 1,
	yCoor: 1,
	xSize: 7,
	ySize: 3,
};

var Room8 = {
	cleared: false,
	xCoor: 1,
	yCoor: 5,
	xSize: 3,
	ySize: 3,
};

var Room9 = {
	cleared: false,
	xCoor: 5,
	yCoor: 5,
	xSize: 3,
	ySize: 3,
};

var Room10 = {
	cleared: false,
	xCoor: 0,
	yCoor: 9,
	xSize: 4,
	ySize: 3,
};

var Room11 = {
	cleared: false,
	xCoor: 0,
	yCoor: 13,
	xSize: 4,
	ySize: 4,
};

var Room12 = {
	cleared: false,
	xCoor: 5,
	yCoor: 9,
	xSize: 3,
	ySize: 8,
};

var Room13 = {
	cleared: false,
	xCoor: 0,
	yCoor: 18,
	xSize: 8,
	ySize: 4,
};

var Room14 = {
	cleared: false,
	xCoor: 9,
	yCoor: 18,
	xSize: 3,
	ySize: 4,
};

var Room15 = {
	cleared: false,
	xCoor: 13,
	yCoor: 18,
	xSize: 4,
	ySize: 4,
};

var Room16 = {
	cleared: false,
	xCoor: 9,
	yCoor: 9,
	xSize: 8,
	ySize: 8,
};


var RoomList = new Array();
RoomList[0] = Room0;
RoomList[1] = Room1;
RoomList[2] = Room2;
RoomList[3] = Room3;
RoomList[4] = Room4;
RoomList[5] = Room5;
RoomList[6] = Room6;
RoomList[7] = Room7;
RoomList[8] = Room8;
RoomList[9] = Room9;
RoomList[10] = Room10;
RoomList[11] = Room11;
RoomList[12] = Room12;
RoomList[13] = Room13;
RoomList[14] = Room14;
RoomList[15] = Room15;
RoomList[16] = Room16;

var Door0 = {
	x: 17,
	y: 24,
	roomNumber: 0,
	initialX: 0,
	initialY: 1,
}

var Door1 = {
	x: 17,
	y: 22,
	roomNumber: 1,
	initialX: 0,
	initialY: 4,
}

var Door2 = {
	x: 19,
	y: 17,
	roomNumber: 1,
	initialX: 1,
	initialY: 0,
}

var Door3 = {
	x: 22,
	y: 17,
	roomNumber: 2,
	initialX: 1,
	initialY: 0,
}

var Door4 = {
	x: 22,
	y: 14,
	roomNumber: 3,
	initialX: 3,
	initialY: 5,
}

var Door5 = {
	x: 17,
	y: 12,
	roomNumber: 3,
	initialX: 0,
	initialY: 3,
}

var Door6 = {
	x: 22,
	y: 12,
	roomNumber: 4,
	initialX: 0,
	initialY: 3,
}

var Door7 = {
	x: 24,
	y: 8,
	roomNumber: 4,
	initialX: 1,
	initialY: 0,
}

var Door8 = {
	x: 17,
	y: 7,
	roomNumber: 5,
	initialX: 0,
	initialY: 2,
}

var Door9 = {
	x: 22,
	y: 6,
	roomNumber: 5,
	initialX: 3,
	initialY: 1,
}

var Door10 = {
	x: 8,
	y: 6,
	roomNumber: 6,
	initialX: 0,
	initialY: 3,
}

var Door11 = {
	x: 11,
	y: 2,
	roomNumber: 6,
	initialX: 2,
	initialY: 0,
}

var Door12 = {
	x: 17,
	y: 4,
	roomNumber: 6,
	initialX: 7,
	initialY: 1,
}

var Door13 = {
	x: 13,
	y: 8,
	roomNumber: 6,
	initialX: 5,
	initialY: 4,
}

var Door14 = {
	x: 4,
	y: 4,
	roomNumber: 7,
	initialX: 3,
	initialY: 2,
}

var Door15 = {
	x: 8,
	y: 2,
	roomNumber: 7,
	initialX: 6,
	initialY: 1,
}

var Door16 = {
	x: 4,
	y: 5,
	roomNumber: 8,
	initialX: 2,
	initialY: 0,
}

var Door17 = {
	x: 4,
	y: 7,
	roomNumber: 9,
	initialX: 0,
	initialY: 2,
}

var Door18 = {
	x: 4,
	y: 10,
	roomNumber: 10,
	initialX: 3,
	initialY: 1,
}

var Door19 = {
	x: 0,
	y: 12,
	roomNumber: 10,
	initialX: 0,
	initialY: 2,
}

var Door20 = {
	x: 1,
	y: 12,
	roomNumber: 11,
	initialX: 1,
	initialY: 0,
}

var Door21 = {
	x: 4,
	y: 14,
	roomNumber: 11,
	initialX: 3,
	initialY: 1,
}

var Door22 = {
	x: 4,
	y: 12,
	roomNumber: 12,
	initialX: 0,
	initialY: 3,
}

var Door23 = {
	x: 8,
	y: 10,
	roomNumber: 12,
	initialX: 2,
	initialY: 1,
}

var Door24 = {
	x: 8,
	y: 15,
	roomNumber: 12,
	initialX: 2,
	initialY: 6,
}

var Door25 = {
	x: 4,
	y: 17,
	roomNumber: 13,
	initialX: 4,
	initialY: 0,
}

var Door26 = {
	x: 4,
	y: 22,
	roomNumber: 13,
	initialX: 4,
	initialY: 3,
}

var Door27 = {
	x: 8,
	y: 19,
	roomNumber: 14,
	initialX: 0,
	initialY: 1,
}

var Door28 = {
	x: 12,
	y: 20,
	roomNumber: 14,
	initialX: 2,
	initialY: 2,
}

var Door29 = {
	x: 12,
	y: 19,
	roomNumber: 15,
	initialX: 0,
	initialY: 1,
}

var Door30 = {
	x: 14,
	y: 17,
	roomNumber: 15,
	initialX: 1,
	initialY: 0,
}

var Door31 = {
	x: 12,
	y: 17,
	roomNumber: 16,
	initialX: 3,
	initialY: 7,
}

var Door32 = {
	x: 8,
	y: 13,
	roomNumber: 16,
	initialX: 0,
	initialY: 4,
}

var Door33 = {
	x: 12,
	y: 8,
	roomNumber: 16,
	initialX: 3,
	initialY: 0,
}

var Door34 = {
	x: 17,
	y: 13,
	roomNumber: 16,
	initialX: 7,
	initialY: 4,
}

var DoorList = new Array();
DoorList[0] = Door0;
DoorList[1] = Door1;
DoorList[2] = Door2;
DoorList[3] = Door3;
DoorList[4] = Door4;
DoorList[5] = Door5;
DoorList[6] = Door6;
DoorList[7] = Door7;
DoorList[8] = Door8;
DoorList[9] = Door9;
DoorList[10] = Door10;
DoorList[11] = Door11;
DoorList[12] = Door12;
DoorList[13] = Door13;
DoorList[14] = Door14;
DoorList[15] = Door15;
DoorList[16] = Door16;
DoorList[17] = Door17;
DoorList[18] = Door18;
DoorList[19] = Door19;
DoorList[20] = Door20;
DoorList[21] = Door21;
DoorList[22] = Door22;
DoorList[23] = Door23;
DoorList[24] = Door24;
DoorList[25] = Door25;
DoorList[26] = Door26;
DoorList[27] = Door27;
DoorList[28] = Door28;
DoorList[29] = Door29;
DoorList[30] = Door30;
DoorList[31] = Door31;
DoorList[32] = Door32;
DoorList[33] = Door33;
DoorList[34] = Door34;

var ActiveDoors = new Array();
ActiveDoors[0] = 0;
ActiveDoors[1] = 0;
ActiveDoors[2] = 0;
ActiveDoors[3] = 0;

function DoorChecker(x, y){
	for (var i = 0; i < DoorList.length; i++){

		if (inRoom){
			
			if (enemiesLeft > 0){
				for (var xx = 0; xx < gridW; xx++){
					for (var yy = 0; yy < gridH; yy++){
						if (PS.data(xx, yy) == "Enemy"){
							EnemyDestroyer(xx, yy);
							activeRoom.cleared = false;
							shouldBreak = true;
						}
					}
				}
			}

			for (i = 0; i < ActiveDoors.length; i++){
				if (ActiveDoors[i].initialX == x && ActiveDoors[i].initialY == y){
					oriX = ActiveDoors[i].x;
					oriY = ActiveDoors[i].y;

					wasDoor = true;
					doorX = ActiveDoors[i].x;
					doorY = ActiveDoors[i].y;

					InitialSetup(true);
				}
			}
		}

		else if (DoorList[i].x == x && DoorList[i].y == y){
			inRoom = true;

			var activeRoomNumber
			activeRoomNumber = DoorList[i].roomNumber
			activeRoom = RoomList[activeRoomNumber];

			RoomDrawer(i, DoorList[i].initialX, DoorList[i].initialY);

			break;
		}
	}
}

function RoomDrawer(i, x, y){
	if (!activeRoom.cleared)
		StatusTextUpdate("Press Space to attack")
	
	PS.audioPlay("fx_jump8");
	
	if (i == 0){
		DrawRoom0(x, y);
	}

	if (i == 1 || i == 2){
		DrawRoom1(x, y);
	}

	if (i == 3){
		DrawRoom2(x, y);
	}

	if (i == 4 || i == 5){
		DrawRoom3(x, y);
	}

	if (i == 7 || i == 6){
		DrawRoom4(x, y);
	}
	
	if (i == 8 || i == 9){
		DrawRoom5(x, y);
	}
	
	if (i >= 10 && i <= 13){
		DrawRoom6(x, y);
	}
	
	if (i == 14 || i == 15){
		DrawRoom7(x, y);
	}
	
	if (i == 16){
		DrawRoom8(x, y);
	}
	
	if (i == 17){
		DrawRoom9(x, y);
	}
	
	if (i == 18 || i == 19){
		DrawRoom10(x, y);
	}
	
	if (i == 20 || i == 21){
		DrawRoom11(x, y);
	}
	
	if (i == 22 || i == 23 || i == 24){
		DrawRoom12(x, y);
	}
	
	if (i == 25 || i == 26){
		DrawRoom13(x, y);
	}
	
	if (i == 27 || i == 28){
		DrawRoom14(x, y);
	}
	
	if (i == 29 || i == 30){
		DrawRoom15(x, y);
	}
	
	if (i >= 31 && i <= 34){
		var clearedCounter = 0;
		
		for (i = 0; i < RoomList.length; i++){
			if (RoomList[i].cleared == true){
				clearedCounter += 1;
			}
		}
		if (clearedCounter >= 16)
			DrawRoom16(x, y);
		else {
			StatusTextUpdate("Not yet. Clear the others first");
			inRoom = false;
		}
	}
}

// Room Drawer Template
/*function DrawRoom1(xLocation, yLocation){
	gridW = 3;
	gridH = 5;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}*/

function DrawRoom0(xLocation, yLocation){
	gridW = 3;
	gridH = 3;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(2, 1, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 2, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(1, 2, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 1, {top: 0, left: 6, right: 0, bottom: 0});

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy1;
		EnemyList[0].x = 2;
		EnemyList[0].y = 0;
		
		EnemyList[1] = 0;
		EnemyList[2] = 0;
		EnemyList[3] = 0; 
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	ActiveDoors[0] = DoorList[0];

	PS.data(0,1, "Door");

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;

	if (!activeRoom.cleared)
		StatusTextUpdate("Defeat all enemies to clear the rooms");
}

function DrawRoom1(xLocation, yLocation){
	gridW = 3;
	gridH = 5;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 6, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(2, 1, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 2, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 3, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 4, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(1, 4, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 4, {top: 0, left: 6, right: 0, bottom: 3});
	PS.border(0, 3, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(1, 0, "Door");
	PS.data(0, 4, "Door");

	ActiveDoors[0] = DoorList[1];
	ActiveDoors[1] = DoorList[2];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy1;
		EnemyList[0].x = 2;
		EnemyList[0].y = 0;
		
		EnemyList[1] = Enemy2;
		EnemyList[1].x = 2;
		EnemyList[1].y = 2;

		EnemyList[2] = 0;
		EnemyList[3] = 0; 
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom2(xLocation, yLocation){
	gridW = 5;
	gridH = 8;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 6, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(3, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(4, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(4, 1, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(4, 2, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(4, 3, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(4, 4, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(4, 5, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(4, 6, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(4, 7, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(3, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(2, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(1, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 7, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 6, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 5, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 4, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 3, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(1, 0, "Door");

	ActiveDoors[0] = DoorList[3];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy1;
		EnemyList[0].x = 0;
		EnemyList[0].y = 6;
		
		EnemyList[1] = Enemy2;
		EnemyList[1].x = 2;
		EnemyList[1].y = 4;

		EnemyList[2] = Enemy3;
		EnemyList[2].x = 4;
		EnemyList[2].y = 6;

		EnemyList[3] = 0; 
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom3(xLocation, yLocation){
	gridW = 4;
	gridH = 8;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(3, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(3, 1, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(3, 2, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(3, 3, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(3, 4, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(3, 5, {top: 0, left: 0, right: 6, bottom: 0});
	PS.border(3, 6, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(3, 7, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(2, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(1, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 7, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 6, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 5, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 4, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 3, {top: 0, left: 6, right: 0, bottom: 0});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(3, 5, "Door");
	PS.data(0, 3, "Door");

	ActiveDoors[0] = DoorList[4];
	ActiveDoors[1] = DoorList[5];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 1;
		EnemyList[0].y = 1;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 3;
		EnemyList[1].y = 6;

		EnemyList[2] = Enemy2;
		EnemyList[2].x = 1;
		EnemyList[2].y = 4;

		EnemyList[3] = 0; 
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom4(xLocation, yLocation){
	gridW = 3;
	gridH = 8;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 6, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(2, 1, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 2, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 3, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 4, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 5, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 6, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 7, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(1, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 7, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 6, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 5, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 4, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 3, {top: 0, left: 6, right: 0, bottom: 0});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(0, 3, "Door");
	PS.data(1, 0, "Door");

	ActiveDoors[0] = DoorList[6];
	ActiveDoors[1] = DoorList[7];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 2;
		EnemyList[0].y = 7;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 0;
		EnemyList[1].y = 1;

		EnemyList[2] = 0;
		// EnemyList[2].x = 1;
		// EnemyList[2].y = 4;

		EnemyList[3] = 0; 
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom5(xLocation, yLocation){
	gridW = 4;
	gridH = 3;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(3, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(3, 1, {top: 0, left: 0, right: 6, bottom: 0});
	PS.border(3, 2, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(2, 2, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(1, 2, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 2, {top: 0, left: 6, right: 0, bottom: 3});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(0, 2, "Door");
	PS.data(3, 1, "Door");

	ActiveDoors[0] = DoorList[8];
	ActiveDoors[1] = DoorList[9];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 0;
		EnemyList[0].y = 0;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 2;
		EnemyList[1].y = 2;

		EnemyList[2] = 0;
		// EnemyList[2].x = 1;
		// EnemyList[2].y = 4;

		EnemyList[3] = 0; 
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom6(xLocation, yLocation){
	gridW = 8;
	gridH = 5;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 6, left: 0, right: 0, bottom: 0});
	PS.border(3, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(4, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(5, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(6, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(7, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(7, 1, {top: 0, left: 0, right: 6, bottom: 0});
	PS.border(7, 2, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(7, 3, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(7, 4, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(6, 4, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(5, 4, {top: 0, left: 0, right: 0, bottom: 6});
	PS.border(4, 4, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(3, 4, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(2, 4, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(1, 4, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 4, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 3, {top: 0, left: 6, right: 0, bottom: 0});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(0, 3, "Door");
	PS.data(2, 0, "Door");
	PS.data(7, 1, "Door");
	PS.data(5, 4, "Door");

	ActiveDoors[0] = DoorList[10];
	ActiveDoors[1] = DoorList[11];
	ActiveDoors[2] = DoorList[12];
	ActiveDoors[3] = DoorList[13];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 0;
		EnemyList[0].y = 1;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 2;
		EnemyList[1].y = 4;

		EnemyList[2] = Enemy2;
		EnemyList[2].x = 6;
		EnemyList[2].y = 3;

		EnemyList[3] = Enemy3; 
		EnemyList[3].x = 4;
		EnemyList[3].y = 1;
		
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom7(xLocation, yLocation){
	gridW = 7;
	gridH = 3;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(3, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(4, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(5, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(6, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(6, 1, {top: 0, left: 0, right: 6, bottom: 0});
	PS.border(6, 2, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(5, 2, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(4, 2, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(3, 2, {top: 0, left: 0, right: 0, bottom: 6});
	PS.border(2, 2, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(1, 2, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(3, 2, "Door");
	PS.data(6, 1, "Door");
	//PS.data(7, 1, "Door");
	//PS.data(5, 4, "Door");

	ActiveDoors[0] = DoorList[14];
	ActiveDoors[1] = DoorList[15];
	//ActiveDoors[2] = DoorList[12];
	//ActiveDoors[3] = DoorList[13];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 0;
		EnemyList[0].y = 2;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 5;
		EnemyList[1].y = 1;

		EnemyList[2] = Enemy2;
		EnemyList[2].x = 2;
		EnemyList[2].y = 0;

		EnemyList[3] = 0; 
		//EnemyList[3].x = 4;
		//EnemyList[3].y = 1;
		
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom8(xLocation, yLocation){
	gridW = 3;
	gridH = 3;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 6, bottom: 0});
	PS.border(2, 1, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 2, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(1, 2, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(2, 0, "Door");
	//PS.data(6, 1, "Door");
	//PS.data(7, 1, "Door");
	//PS.data(5, 4, "Door");

	ActiveDoors[0] = DoorList[16];
	//ActiveDoors[1] = DoorList[15];
	//ActiveDoors[2] = DoorList[12];
	//ActiveDoors[3] = DoorList[13];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 0;
		EnemyList[0].y = 0;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 1;
		EnemyList[1].y = 2;

		EnemyList[2] = 0;
		//EnemyList[2].x = 2;
		//EnemyList[2].y = 0;

		EnemyList[3] = 0; 
		//EnemyList[3].x = 4;
		//EnemyList[3].y = 1;
		
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom9(xLocation, yLocation){
	gridW = 3;
	gridH = 3;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(2, 1, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 2, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(1, 2, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 2, {top: 0, left: 6, right: 0, bottom: 3});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(0, 2, "Door");
	//PS.data(6, 1, "Door");
	//PS.data(7, 1, "Door");
	//PS.data(5, 4, "Door");

	ActiveDoors[0] = DoorList[17];
	//ActiveDoors[1] = DoorList[15];
	//ActiveDoors[2] = DoorList[12];
	//ActiveDoors[3] = DoorList[13];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 0;
		EnemyList[0].y = 0;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 2;
		EnemyList[1].y = 1;

		EnemyList[2] = 0;
		//EnemyList[2].x = 2;
		//EnemyList[2].y = 0;

		EnemyList[3] = 0; 
		//EnemyList[3].x = 4;
		//EnemyList[3].y = 1;
		
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom10(xLocation, yLocation){
	gridW = 4;
	gridH = 3;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(3, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(3, 1, {top: 0, left: 0, right: 6, bottom: 0});
	PS.border(3, 2, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(2, 2, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(1, 2, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 6});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(3, 1, "Door");
	PS.data(0, 2, "Door");
	//PS.data(7, 1, "Door");
	//PS.data(5, 4, "Door");

	ActiveDoors[0] = DoorList[18];
	ActiveDoors[1] = DoorList[19];
	//ActiveDoors[2] = DoorList[12];
	//ActiveDoors[3] = DoorList[13];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 0;
		EnemyList[0].y = 1;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 2;
		EnemyList[1].y = 0;

		EnemyList[2] = 0;
		//EnemyList[2].x = 2;
		//EnemyList[2].y = 0;

		EnemyList[3] = 0; 
		//EnemyList[3].x = 4;
		//EnemyList[3].y = 1;
		
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom11(xLocation, yLocation){
	gridW = 4;
	gridH = 4;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 6, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(3, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(3, 1, {top: 0, left: 0, right: 6, bottom: 0});
	PS.border(3, 2, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(3, 3, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(2, 3, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(1, 3, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 3, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(1, 0, "Door");
	PS.data(3, 1, "Door");
	//PS.data(7, 1, "Door");
	//PS.data(5, 4, "Door");

	ActiveDoors[0] = DoorList[20];
	ActiveDoors[1] = DoorList[21];
	//ActiveDoors[2] = DoorList[12];
	//ActiveDoors[3] = DoorList[13];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 0;
		EnemyList[0].y = 3;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 2;
		EnemyList[1].y = 1;

		EnemyList[2] = Enemy2;
		EnemyList[2].x = 2;
		EnemyList[2].y = 3;

		EnemyList[3] = 0; 
		//EnemyList[3].x = 4;
		//EnemyList[3].y = 1;
		
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom12(xLocation, yLocation){
	gridW = 3;
	gridH = 8;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(2, 1, {top: 0, left: 0, right: 6, bottom: 0});
	PS.border(2, 2, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 3, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 4, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 5, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 6, {top: 0, left: 0, right: 6, bottom: 0});
	PS.border(2, 7, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(1, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 7, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 6, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 5, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 4, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 3, {top: 0, left: 6, right: 0, bottom: 0});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(0, 3, "Door");
	PS.data(2, 1, "Door");
	PS.data(2, 6, "Door");
	//PS.data(5, 4, "Door");

	ActiveDoors[0] = DoorList[22];
	ActiveDoors[1] = DoorList[23];
	ActiveDoors[2] = DoorList[24];
	//ActiveDoors[3] = DoorList[13];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 0;
		EnemyList[0].y = 0;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 0;
		EnemyList[1].y = 7;

		EnemyList[2] = Enemy2;
		EnemyList[2].x = 2;
		EnemyList[2].y = 3;

		EnemyList[3] = 0; 
		//EnemyList[3].x = 4;
		//EnemyList[3].y = 1;
		
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom13(xLocation, yLocation){
	gridW = 8;
	gridH = 4;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(3, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(4, 0, {top: 6, left: 0, right: 0, bottom: 0});
	PS.border(5, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(6, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(7, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(7, 1, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(7, 2, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(7, 3, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(6, 3, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(5, 3, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(4, 3, {top: 0, left: 0, right: 0, bottom: 6});
	PS.border(3, 3, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(2, 3, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(1, 3, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 3, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(4, 0, "Door");
	PS.data(4, 3, "Door");
	//PS.data(2, 6, "Door");
	//PS.data(5, 4, "Door");

	ActiveDoors[0] = DoorList[25];
	ActiveDoors[1] = DoorList[26];
	//ActiveDoors[2] = DoorList[24];
	//ActiveDoors[3] = DoorList[13];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 1;
		EnemyList[0].y = 0;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 2;
		EnemyList[1].y = 2;

		EnemyList[2] = Enemy2;
		EnemyList[2].x = 5;
		EnemyList[2].y = 2;

		EnemyList[3] = Enemy3; 
		EnemyList[3].x = 7;
		EnemyList[3].y = 1;
		
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom14(xLocation, yLocation){
	gridW = 3;
	gridH = 4;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(2, 1, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(2, 2, {top: 0, left: 0, right: 6, bottom: 0});
	PS.border(2, 3, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(1, 3, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 3, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 1, {top: 0, left: 6, right: 0, bottom: 0});

	PS.data(0, 1, "Door");
	PS.data(2, 2, "Door");
	//PS.data(2, 6, "Door");
	//PS.data(5, 4, "Door");

	ActiveDoors[0] = DoorList[27];
	ActiveDoors[1] = DoorList[28];
	//ActiveDoors[2] = DoorList[24];
	//ActiveDoors[3] = DoorList[13];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 1;
		EnemyList[0].y = 0;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 0;
		EnemyList[1].y = 3;

		EnemyList[2] = 0;
		//EnemyList[2].x = 5;
		//EnemyList[2].y = 2;

		EnemyList[3] = 0; 
		//EnemyList[3].x = 7;
		//EnemyList[3].y = 1;
		
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom15(xLocation, yLocation){
	gridW = 4;
	gridH = 4;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 6, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(3, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(3, 1, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(3, 2, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(3, 3, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(2, 3, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(1, 3, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 3, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 1, {top: 0, left: 6, right: 0, bottom: 0});

	PS.data(0, 1, "Door");
	PS.data(1, 0, "Door");
	//PS.data(2, 6, "Door");
	//PS.data(5, 4, "Door");

	ActiveDoors[0] = DoorList[29];
	ActiveDoors[1] = DoorList[30];
	//ActiveDoors[2] = DoorList[24];
	//ActiveDoors[3] = DoorList[13];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 3;
		EnemyList[0].y = 3;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 3;
		EnemyList[1].y = 2;

		EnemyList[2] = Enemy2;
		EnemyList[2].x = 0;
		EnemyList[2].y = 3;

		EnemyList[3] = 0; 
		//EnemyList[3].x = 7;
		//EnemyList[3].y = 1;
		
		EnemyList[4] = 0;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

function DrawRoom16(xLocation, yLocation){
	gridW = 8;
	gridH = 8;
	PS.gridSize(gridW, gridH);

	PS.border(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, floorColor);

	PS.border(0, 0, {top: 3, left: 3, right: 0, bottom: 0});
	PS.border(1, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(2, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(3, 0, {top: 6, left: 0, right: 0, bottom: 0});
	PS.border(4, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(5, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(6, 0, {top: 3, left: 0, right: 0, bottom: 0});
	PS.border(7, 0, {top: 3, left: 0, right: 3, bottom: 0});
	PS.border(7, 1, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(7, 2, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(7, 3, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(7, 4, {top: 0, left: 0, right: 6, bottom: 0});
	PS.border(7, 5, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(7, 6, {top: 0, left: 0, right: 3, bottom: 0});
	PS.border(7, 7, {top: 0, left: 0, right: 3, bottom: 3});
	PS.border(6, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(5, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(4, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(3, 7, {top: 0, left: 0, right: 0, bottom: 6});
	PS.border(2, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(1, 7, {top: 0, left: 0, right: 0, bottom: 3});
	PS.border(0, 7, {top: 0, left: 3, right: 0, bottom: 3});
	PS.border(0, 6, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 5, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 4, {top: 0, left: 6, right: 0, bottom: 0});
	PS.border(0, 3, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 2, {top: 0, left: 3, right: 0, bottom: 0});
	PS.border(0, 1, {top: 0, left: 3, right: 0, bottom: 0});

	PS.data(3, 7, "Door");
	PS.data(0, 4, "Door");
	PS.data(3, 0, "Door");
	PS.data(7, 4, "Door");

	ActiveDoors[0] = DoorList[31];
	ActiveDoors[1] = DoorList[32];
	ActiveDoors[2] = DoorList[33];
	ActiveDoors[3] = DoorList[34];

	if (!activeRoom.cleared){
		
		EnemyList[0] = Enemy0;
		EnemyList[0].x = 1;
		EnemyList[0].y = 1;
		
		EnemyList[1] = Enemy1;
		EnemyList[1].x = 6;
		EnemyList[1].y = 2;

		EnemyList[2] = Enemy2;
		EnemyList[2].x = 4;
		EnemyList[2].y = 2;

		EnemyList[3] = Enemy3; 
		EnemyList[3].x = 6;
		EnemyList[3].y = 6;
		
		EnemyList[4] = Enemy4;
		EnemyList[4].x = 1;
		EnemyList[4].y = 5;

		EnemyPreDraw();
	}

	oriX = xLocation;
	oriY = yLocation;
	DrawPlayer(oriX, oriY);

	wasDoor = true;
	doorX = xLocation;
	doorY = yLocation;
}

// All of the functions below MUST exist, or the engine will complain!

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.init = function( system, options ) {
	"use strict";

	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	/*gridW = 8;
	gridH = 8;
	PS.gridSize( gridW, gridH );
	PS.color(PS.ALL, PS.ALL, floorColor);*/

	InitialSetup(false);
	PS.audioLoad("fx_rip");
	PS.audioLoad("fx_squirp");
	PS.audioLoad("fx_shoot3");
	PS.audioLoad("fx_bloink");
	PS.audioLoad("fx_blast2");
	PS.audioLoad("fx_jump8");
	PS.audioLoad("fx_jump8");

	// Add any other initialization code you need here
};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches over a bead

};

// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.release = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead
};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

	// Uncomment the following line to verify operation
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid
};

// PS.keyDown ( key, shift, ctrl, options )
// Called when a key on the keyboard is pressed
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F1
// [shift] = true if shift key is held down, else false
// [ctrl] = true if control key is held down, else false
// [options] = an object with optional parameters; see documentation for details

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	// Add code here for when a key is pressed
};

// PS.keyUp ( key, shift, ctrl, options )
// Called when a key on the keyboard is released
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F12
// [shift] = true if shift key is held down, false otherwise
// [ctrl] = true if control key is held down, false otherwise
// [options] = an object with optional parameters; see documentation for details

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is released

	if (!gameOver){	
		if (key == 32){
			Melee();
		}

		if (key == 101 && wasDoor){
			DoorChecker(oriX, oriY);
		}

		if (key == 1005 || key == 1007 || 
		key == 1006 || key == 1008){
			if (key == 1005){
				playerDirection = "W";
				PS.glyph(oriX, oriY, 0x02190);
			}
			
			if (key == 1007){
				playerDirection = "E";
				PS.glyph(oriX, oriY, 0x02192);
			}
			
			if (key == 1006){
				playerDirection = "N";
				PS.glyph(oriX, oriY, 0x02191);
			}
			
			if (key == 1008){
				playerDirection = "S";
				PS.glyph(oriX, oriY, 0x02193);
			}
		}
		
		if (key == 119 || key == 97 || key == 115 || key == 100){

			var newX, newY;

			if (key == 119){ // W
				if (oriY > 0){
					playerDirection = "N";
					playerGlyph = 0x02191;
					newX = oriX;
					newY = oriY - 1;
				}
				else{
					newX = oriX;
					newY = oriY;
				}
			}
			else if (key == 97){ // A
				if (oriX > 0){
					playerDirection = "W";
					playerGlyph = 0x02190;
					newX = oriX - 1;
					newY = oriY;
				}
				else{
					newX = oriX;
					newY = oriY;
				}
			}
			else if (key == 115){ // S
				if (oriY < gridH - 1){
					playerDirection = "S";
					playerGlyph = 0x02193;
					newX = oriX;
					newY = oriY + 1;
				}
				else{
					newX = oriX;
					newY = oriY;
				}
			}
			else if (key == 100){ // D
				if (oriX < gridW - 1){
					playerDirection = "E";
					playerGlyph = 0x02192;
					newX = oriX + 1;
					newY = oriY;
				}
				else{
					newX = oriX;
					newY = oriY;
				}
			}

			if (PS.data(newX, newY) == "Enemy"){
				UpdateHealth(-1);
				EnemyDestroyer(newX, newY, false);
			}
			else if (PS.data(newX, newY) == "Health"){
				if (heartDoor){
					PS.data(newX, newY, "Door");
				}
				UpdateHealth(1);
			}
			else if (PS.data(newX, newY) == "Wall"){
				newX = oriX;
				newY = oriY;
				PS.audioPlay("fx_blast2");
			}
			
			if (newX != oriX || newY != oriY){
					ErasePlayer(oriX, oriY);
					
					if (PS.data(newX, newY) == "Door"){
						
						wasDoor = true;
						doorX = newX;
						doorY = newY;

						StatusTextUpdate("Press E To Open Door")
					}
					
					DrawPlayer(newX, newY);
					PS.audioPlay("fx_blip");
			}

			oriX = newX;
			oriY = newY;
		}
	}
	
	// ***** Set Reset at some point
	else if (gameOver){
		if (key == 114){
			InitialSetup(false);
		}
	}
};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.input = function( sensors, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters
	/*
	PS.debug( "PS.input() called\n" );
	var device = sensors.wheel; // check for scroll wheel
	if ( device )
	{
		PS.debug( "sensors.wheel = " + device + "\n" );
	}
	*/
	
	// Add code here for when an input event is detected
};

