let canvas;
let context;
const CANVAS_WIDTH =608;
const CANVAS_HEIGHT = 400;
let fpsInterval = 1000 / 30;
let now;
let then = Date.now();
let request_id;
let round = 0;
let score = 0;
let SpawnPoint = [0,CANVAS_WIDTH,0,CANVAS_WIDTH];
let power = []; // Place the coordinates of power ups in here 
let TimeLeft = 0;
let powerTime = 0;
let SpawnTime =0;
let PU = ["Speedy","bouncey","WildShot","SlowDown"]; // Place the power ups in here  
let powTime = 5000;
let attacks = []; // Place the coordinates of attacks in here
let waves = 1;
let enemy = []; //Place the coordinates of enemy in here
let p = {
    x : 300,
    y : 200,
    width : 16, //width of sprite on sprite sheet 
    height : 16,// height of sprite on sprite sheet 
    xFrame : 0,
    yFrame : 0,
    direction : "right",
    size : 30, 
    xChange : 5, 
    yChange : 5
    
}
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let attack = false;
//Power up activation 
let speed = false;
let bounce = false
let WildShot = false;
let SlowDown = false;
//Sprites
let gameFrame = 0;
const staggerFrame =5;
const ItemImage = new Image();
const PlayerImage = new Image();    // use Mordern tiles_Free
const AttackImage = new Image();
const enemyImage = new Image();
// Map 
const tileAtlas = new Image();

let tileSize = 16;

let tilesPerRow = 18;
let atlasRow = 39;

let mapRow = 38;
let mapCol = 24;

let sourceX =0;
let sourceY = 0;

document.addEventListener("DOMContentLoaded", init, false);
function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");
    window.addEventListener("keydown", activate , false);
    window.addEventListener("keyup", deactivate, false);
    load_assets([
        {"var":PlayerImage,"url":'../ca2/sprites/character.png'},
        {"var":ItemImage,"url":"../ca2/sprites/chests.png" },
        {"var":AttackImage,"url":"../ca2/sprites/projectiles.png"},
        {"var":enemyImage,"url":'../ca2/sprites/stage_three.png'},
        {"var": tileAtlas, "url": "../ca2/sprites/Map.png"}
    ],draw);
}

// Control wave of enemies
function Spawn(lads){ //Need to prevent enemies from spawning on player 
if(lads.length === 0){
    round += 1;
    SpawnTime = 0;
    while (lads.length < waves){
        let ran = randint(0,3);
        console.log("We good");
            let e = {
                x : SpawnPoint[ran],              
                y : randint(0,CANVAS_HEIGHT),
                width : 32, 
                height : 32,
                xFrame : 0,
                yFrame : 0,
                size : 35,
                xChange : 1,
                yChange : 1
            }
            lads.push(e);
            if(e.x === p.x && e.y === e.y){
                e.x = randint(0,CANVAS_WIDTH);
                e.y = randint(0,CANVAS_HEIGHT);
                lads.push(e);
            }
    }
    console.log("Enemies:",enemy);
        waves += 2;
        
    }
}



function draw(){
    
    window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval){
        return;
    }
    then = now - (elapsed % fpsInterval);
    //mapload
    for(let r = 0; r < 24;r += 1){
        for(let c =0; c < 38;c += 1){
        context.drawImage(tileAtlas, c * tileSize,r * tileSize,tileSize,tileSize,
        c * tileSize,r * tileSize,tileSize,tileSize,);
        }
    }
    //player
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(PlayerImage,p.width * p.xFrame,p.height*p.yFrame,p.width,p.height,p.x,p.y,p.size,p.size);
    context.fillStyle = "white";
    context.font = "12px Verdana";
    context.fillText(`Score:${score}`,20,20);
    //Spawn enemies 
    if(enemy.length === 0){
            SpawnTime += 1;
            context.fillStyle = "red";
            context.font = "25px Verdana";
            context.fillText("Wave Incoming!",200,150);
            context.fillText(`Wave:${round}`,200,200);
            if (SpawnTime > 75){
                Spawn(enemy);
            }
    }
    gameFrame +=1;
    // enemy chasing 
   for (let e of enemy){
        context.drawImage(enemyImage,e.width * e.xFrame,e.height*e.yFrame,e.width,e.height,e.x,e.y,e.size,e.size);
        if(SlowDown){
            e.xChange = 0;
            e.yChange = 0;
            TimeLeft += 1;
            if(TimeLeft > 75){
                SlowDown = false;
                powerTime =0;
                e.xChange = 1;
                e.yChange = 1;
            }
        }

        if(e.x < p.x && e.y < p.y){
            e.x = e.x + e.xChange;
            e.y = e.y + e.yChange;
            e.yFrame =1;
            if(gameFrame % staggerFrame === 0){
                if (e.xFrame === 3){
                    e.xFrame =0;
                }
                else{
                    e.xFrame += 1;
                }
            }
        }else if (e.x < p.x && e.y > p.y){
            e.x = e.x + e.xChange;
            e.y = e.y - e.yChange;
            e.yFrame = 3;
            if(gameFrame % staggerFrame === 0){
                if (e.xFrame === 3){
                    e.xFrame =0;
                }
                else{
                    e.xFrame += 1;
                }
            }
        }else if (e.x > p.x && e.y < p.y){
            e.x = e.x - e.xChange;
            e.y = e.y + e.yChange;
            e.yFrame = 7;
            if(gameFrame % staggerFrame === 0){
                if (e.xFrame === 3){
                    e.xFrame =0;
                }
                else{
                    e.xFrame += 1;
                }
            }
        }
        else if (e.x > p.x && e.y > p.y){
            e.x = e.x - e.xChange;
            e.y = e.y - e.yChange;
            e.yFrame = 5;
            if(gameFrame % staggerFrame === 0){
                if (e.xFrame === 3){
                    e.xFrame =0;
                }
                else{
                    e.xFrame += 1;
                }
            }
        } 
        else if (e.x < p.x && e.y === p.y){
            e.x = e.x + e.xChange;
            e.yFrame =2;
            if(gameFrame % staggerFrame === 0){
                if (e.xFrame === 3){
                    e.xFrame =0;
                }
                else{
                    e.xFrame += 1;
                }
            }
        } 
        else if (e.x > p.x && e.y === p.y){
            e.x = e.x - e.xChange;
            e.yFrame = 6;
            if(gameFrame % staggerFrame === 0){
                if (e.xFrame === 3){
                    e.xFrame =0;
                }
                else{
                    e.xFrame += 1;
                }
            }
        }
        else if(e.y < p.y && e.x === p.x){
            e.y = e.y + e.yChange;
            e.yFrame = 0;
            if(gameFrame % staggerFrame === 0){
                if (e.xFrame === 3){
                    e.xFrame =0;
                }
                else{
                    e.xFrame += 1;
                }
            }
        } 
        else if (e.y > p.y && e.x === p.x){
            e.y = e.y - e.yChange;
            e.yFrame =4;
            if(gameFrame % staggerFrame === 0){
                if (e.xFrame === 3){
                    e.xFrame =0;
                }
                else{
                    e.xFrame += 1;
                }
            }
        }
    }
    // enemy collision //
    for (let e of enemy){
        if (player_collides(e)){
            stop();
            return;
        }
    }
    // attacking enemy // 
    for (let a of attacks){
        let bullet_be_gone = attacks.indexOf(a);
        if (enemy_attacked(a)) {
            attacks.splice(bullet_be_gone,1);
            score += 100;
        }
    }
    //power ups 
    powerTime += 1;
    if(speed === false && bounce === false && power.length === 0 && SlowDown ===false && WildShot === false && powerTime > 500){
        //setTimeout(power_ups_pick,1000);
        power_ups_pick();

    }
    
    for (let pp of power){ // Draws power up
        context.fillStyle ="green";
        context.drawImage(ItemImage,pp.width*pp.xFrame,pp.height*pp.yFrame,pp.width,pp.height,pp.x,pp.y,pp.size,pp.size);
        if (power_ups_collides(pp)){ // When player collision is true then the power up is no longer rendered 
            let po = randint(0,PU.length-1);
            let der = PU[po];
            console.log(der);
            power_up(der);
           power.splice(power.indexOf(pp),1);
            
        }
    }

    if(bounce){
        if(TimeLeft < 25){
            context.fillStyle = "white";
            context.font = "15px Verdana";
            context.fillText("Bouncy",300,20);
        }else{
            context.clearRect(300,20,12,12);
        }
    }

    if(speed){
        p.xChange =20;
        p.yChange = 20;
        TimeLeft += 1;
        if(TimeLeft < 35){
            context.fillStyle = "white";
            context.font = "15px Verdana";
            context.fillText("Speed",300,20);
        }else{
            context.clearRect(300,20,12,12);
        }
            if(TimeLeft > 200){
                speed =false;
                p.xChange = 8;
                p.yChange =8;
                powerTime = 0;
            }
    }

    // Movement  Barriers //
    if (p.x + p.size >= canvas.width){
        moveRight = false;
        p.x = canvas.width - p.size;
    }
    if (p.x <= 0){
        moveLeft = false;
        p.x = 0;
    }

    if (p.y + p.size >= CANVAS_HEIGHT){
        moveDown = false;
        p.y = canvas.height - p.size
    }

    if (p.y <= 0){
        moveUp = false;
        p.y = 0;
    }
    // Movement
    if (moveLeft){
        p.x = p.x - p.xChange;
        p.yFrame = 3;
        if(gameFrame % staggerFrame === 0){
            if (p.xFrame === 3){
                p.xFrame =0;
            }
            else{
                p.xFrame += 1;
            }
        }
    }
    if (moveRight){
        p.x = p.x + p.xChange;
        p.yFrame = 2;
        if(gameFrame % staggerFrame === 0){
            if (p.xFrame === 3){
                p.xFrame =0;
            }
            else{
                p.xFrame += 1;
            }
        }

    }
    if (moveUp){
        p.y = p.y - p.yChange;
        p.yFrame = 1;
        if(gameFrame % staggerFrame === 0){
            if (p.xFrame === 3){
                p.xFrame =0;
            }
            else{
                p.xFrame += 1;
            }
        }
    }
    if (moveDown){
        p.y = p.y + p.yChange;
        p.yFrame = 0;
        if(gameFrame % staggerFrame === 0){
            if (p.xFrame === 3){
                p.xFrame =0;
            }
            else{
                p.xFrame += 1;
            }
        }
    }
    // Attack//
    if(attack){
        if(TimeLeft > 75){
            WildShot =false;
            TimeLeft = 0;
            powerTime =0;
        }
        if(WildShot){
            Wild(p.direction);
            TimeLeft += 1;
        }

        else{
            shoot(p.direction);
        }
    }



   for (let a of attacks){
        context.fillStyle ="red";
        context.drawImage(AttackImage,a.width * a.xFrame,a.height*a.yFrame,a.width,a.height,a.x,a.y,a.size,a.size);
        let out = attacks.indexOf(a);
        a.x = a.x + a.xChange;
        a.y = a.y + a.yChange;
        if (bounce){
            if (a.x + a.size >= canvas.width){
                a.xChange = -a.xChange;
            }
            else if (a.x - a.size <= 0){
                a.xChange = -a.xChange;
            }
        
            else if (a.y + a.size >= CANVAS_WIDTH){
                a.yChange = -a.yChange;
            }
        
            else if (a.y - a.size <= 0){
                a.yChange = -a.yChange;
            }
            TimeLeft += 1;
            if(TimeLeft > 2000){
                bounce =false;
                powerTime = 0;
            }
        }
        else{
            if(a.x + a.size < 0 || a.x + a.size > 600 || a.y + a.size < 0 || a.y + a.size > CANVAS_HEIGHT){
                attacks.splice(out,1);
        }
    }
   
    }
}




function shoot(facing){
    if (facing === "down") {
        let a = {
            x : (p.x + (p.size/2)),
            y : (p.y +(p.size/2)), 
            size : 10,
            width : 8,
            height : 8,
            xFrame :1,
            yFrame : 1,
            xChange : 0,
            yChange : 10
        }
        attacks.push(a);
    } else if (facing === "up") {
        let a = {
            x : (p.x + (p.size/2)),
            y : (p.y +(p.size/2)), 
            size : 10,
            width : 8,
            height : 8,
            xFrame :1,
            yFrame : 1,
            xChange : 0,
            yChange : -10
        }
        attacks.push(a);
    } else if (facing === "right") {
        let a = {
            x : (p.x + (p.size/2)),
            y : (p.y +(p.size/2)), 
            size : 10,
            width : 8,
            height : 8,
            xFrame :1,
            yFrame : 1,
            xChange : 10,
            yChange : 0
        }
        attacks.push(a);
    }else if (facing === "left") {
        let a = {
            x : (p.x + (p.size/2)),
            y : (p.y +(p.size/2)), 
            size : 10,
            width : 8,
            height : 8,
            xFrame :1,
            yFrame : 1,
            xChange : -10,
            yChange : 0
        }
        attacks.push(a);
    }

    for (let a of attacks){
        context.fillStyle ="red";
        context.fillRect(a.x,a.y,a.size,a.len);
        context.drawImage(AttackImage,a.width * a.xFrame,a.height*a.yFrame,a.width,a.height,a.x,a.y,a.size,a.size);
        let out = attacks.indexOf(a);
        a.x = a.x + a.xChange;
        a.y = a.y + a.yChange;
        if (bounce){
            if (a.x + a.size >= canvas.width){
                a.xChange = -a.xChange;
            }
            else if (a.x - a.size <= 0){
                a.xChange = -a.xChange;
            }
        
            else if (a.y + a.size >= canvas.height){
                a.yChange = -a.yChange;
            }
        
            else if (a.y - a.size <= 0){
                a.yChange = -a.yChange;
            }
            
        }
        else{
            if(a.x + a.size < 0 || a.x + a.size > CANVAS_WIDTH || a.y + a.size < 0 || a.y + a.size > 400){
                attacks.splice(out,1);
        }

    }
}
}




function randint(min,max){
    return Math.round(Math.random() * (max - min)) + min;
}
// Activates movement when keys pressed

function activate(event){
    let key = event.key;
    
    if(key === "A" || key === "a"){
        moveLeft = true;
        
    } else if(key === "ArrowLeft"){
        attack = true;
        p.direction = "left";
    }
    else if(key === "D" || key === "d"){
        moveRight = true;
    } else if(key === "ArrowRight"){
        attack = true;
        p.direction = "right";
    }
    else if (key === "W" || key === "w"){
        moveUp = true;
        
    } else if(key === "ArrowUp"){
        attack = true;
        p.direction = "up";
    }
    else if (key === "S" || key === "s"){
        moveDown = true;
        
    }
    else if(key === "ArrowDown"){
        attack = true;
        p.direction = "down";
    }
}
//deactivates movement when keys aren't pressed 
function deactivate(event){
    let key = event.key;
    
    if(key === "A" || key === "a"){
        moveLeft = false;
        p.yFrame = 3;
        p.xFrame =0;
    } else if(key === "D" || key === "d"){
        moveRight = false;
        p.yFrame = 2;
        p.xFrame =0;
    } else if (key === "W" || key === "w"){
        moveUp = false;
        p.yFrame = 1;
        p.xFrame =0;
    } else if (key === "S" || key === "s"){
        moveDown = false;
        p.yFrame = 0;
        p.xFrame =0;
    } else if (key === "ArrowLeft"){
        attack = false;
    }else if (key === "ArrowRight"){
        attack = false;
    }else if (key === "ArrowDown"){
        attack = false;
    }else if (key === "ArrowUp"){
        attack = false;
    }
}



function player_collides(e){
    if (p.x + p.size < e.x  || e.x +e.size < p.x || 
        p.y > e.y + e.size || p.y + p.size < e.y ){
            return false;
        } else{
            e.xChange = 0;
            e.yChange = 0;
            return true;
        }
}



function enemy_attacked(a){
    for (let e of enemy){
        
        if(!(a.x + a.size < e.x  || e.x +e.size < a.x || 
            a.y > e.y + e.size || a.y + a.size < e.y )){
                let hit = enemy.indexOf(e);
                enemy.splice(hit,1);
                return true;
            }
             
}
}

// Power ups: speed, bouncey  bullets, spazy shotgun 

function power_ups_pick(){  // creates coordinates of Power Up 
    while(power.length < 1){

        let pp = {
            //x : randint(0,600),
            //y : randint(0,400),
            x : 300,
            y : 200,
            width :16,
            height :16,
            xFrame :5,
            yFrame : 0,
            size : 25
        
        }
        power.push(pp);
    }
   
}

function power_up(pu){ // directs program to a function which acts as power up 
    if(pu === "Speedy"){
        TimeLeft = 0;
        speed = true;
    }
    if (pu === "bouncey"){
        TimeLeft = 0;
        bounce = true;
    }
    if(pu === "WildShot"){
        TimeLeft = 0;
        WildShot = true;
    }
    if(pu === "SlowDown"){
        TimeLeft = 0;
        SlowDown = true;
    }
}

function power_ups_collides(pp){ // Detects if player has hit the power up 
        if (p.x + p.size < pp.x  || pp.x +pp.size < p.x || 
        p.y > pp.y + pp.size || p.y + p.size < pp.y ){
            return false;
        } else{
            return true;  
        }
    }



function Wild(facing){
    if (facing === "down") {
        let a = {
            x : (p.x + (p.size/2)),
            y : (p.y +(p.size/2)), 
            size : 5,
           
            xChange : randint(-10,10),
            yChange : 10
        }
        attacks.push(a);
    } else if (facing === "up") {
        let a = {
            x : (p.x + (p.size/2)),
            y : (p.y +(p.size/2)), 
            size : 5,
            xChange : randint(-10,10),
            yChange : -10
        }
        attacks.push(a);
    } else if (facing === "right") {
        let a = {
            x : p.x+3,
            y : (p.y +3), 
            size : 5,
            xChange : 10,
            yChange : randint(-10,10)
        }
        attacks.push(a);
    }else if (facing === "left") {
        let a = {
            x : (p.x + (p.size/2)),
            y : (p.y +(p.size/2)), 
            size : 5,
            xChange : -10,
            yChange : randint(-10,10)
        }
        attacks.push(a);
    }
    for (let a of attacks){
        context.fillStyle ="red";
        context.fillRect(a.x,a.y,a.size,a.len);
        let out = attacks.indexOf(a);
        a.x = a.x + a.xChange;
        a.y = a.y + a.yChange;
        if(a.x + a.size < 0 || a.x + a.size > CANVAS_WIDTH || a.y + a.size < 0 || a.y + a.size > CANVAS_HEIGHT){
                attacks.splice(out,1);
        }

    }
}
   
function load_assets(assets,callback){
    let num_assets = assets.length;
    let loaded = function() {
        console.log("loaded");
        num_assets = num_assets -1;
        if(num_assets === 0){
            callback();
        }
    };
    for (let asset of assets){
        let element = asset.var;
        if(element instanceof HTMLImageElement){
            console.log("img");
            element.addEventListener("load",loaded,false);
        }
        else if (element instanceof HTMLAudioElement){
            console.log("audio");
            element.addEventListener("canplaythrough",loaded, false);
        }
        element.src =asset.url;
    }
}


function stop(){
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, true);
    window.cancelAnimationFrame(draw);
    context.fillStyle = "red";
    context.font = "25px Verdana";
    waves = 1;
    context.fillText("GAME OVER",200,150);
    context.font = "25px Verdana";
    context.fillText(`Score:${score}`,200,200);
    context.fillStyle = "red";
    context.fillText(`Rounds:${round}`,200,250);
}