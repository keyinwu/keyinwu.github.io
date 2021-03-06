"use strict"

let loading = true;
let scene = 0;

let myFont;
let waterFont;

let patternBuffer;
let floorBuffer;

// camera
let cameraLock = false;
let cameraX = 0;
let cameraY = 0;
let cameraZ = 1000;
let startZ = 1000;
let maxX0 = 260;
let maxX;
let maxZ = 1000;
let minZ = -10;
let delta_x = 0;
let delta_y = 0;
let xangle = 0;
let yangle = 0;
let cspeed = 2;
let movespeed;
let prevX;
let prevY;
let prevZ;
let prevS = 0;

// paper cutting materials
let large, complete, lively, animism, imagery, doll, doorgod, tigers, textures, serrations, crescents, maojiao, worship, witchcraft, zhuyou, newyear, wish, language, various;
let idnames= ["large","complete","lively","animism","imagery","doll","doorgod","tigers","textures","serrations","crescents","maojiao","worship","witchcraft","zhuyou","newyear","wish","language","various"];
let contents=[];
let symbols=[];
let floorimg;
let triggered; // object
let trigidx; // index

// models
let symtex, symtex2;
let largeM, completeM, livelyM, animismM, imageryM, dollM, doorgodM, tigersM, texturesM, serrationsM, crescentsM, maojiaoM, worshipM, witchcraftM, zhuyouM, newyearM, wishM, languageM, variousM;
let overview, fanfloor;
let models=[];
let scrollContainer = document.getElementsByClassName("container-fluid")[0];


// floor
let particle;
let connected = [];

// pattern
let psize;
let r, d;
let theta;
let bg_r;
let cpairs = [];
let colorChange = false;

// trace
let timecheck;
let stopcheck = false;

// loading
let totalAssets = 43; // 44 - 1
let assetArray = [];

// sound
let introbg, loopbg;

let usrname;

function updateLoadingBar(asset) {
  assetArray.push(asset);
  let prog = document.getElementById("progbar");
  // console.log(prog.ariaValueNow);
  prog.ariaValueNow = int(100 * assetArray.length / totalAssets);
  prog.style.width = floor(100 * assetArray.length / totalAssets) + "%";
  // let bar = document.getElementById("loadingbar");
  // bar.style.width = floor(100 * assetArray.length / totalAssets) + "%";

  if (assetArray.length == totalAssets) {
    // let barContainer = document.getElementById("loadingbar-container");
    // barContainer.style.display = "none";
    let progContainer = document.getElementById("prog-container");
    progContainer.style.display = "none";
  }

  if (asset instanceof p5.Image) {
    asset.filter(INVERT);
    asset.filter(GRAY);
    // contents[index] = asset;
  }
}

function preload(){
  large = loadImage('images/large.jpeg', updateLoadingBar);
  complete = loadImage('images/complete.jpeg', updateLoadingBar);
  lively = loadImage('images/lively.jpeg', updateLoadingBar);
  animism = loadImage('images/animism.jpeg', updateLoadingBar);
  imagery = loadImage('images/imagery.jpeg', updateLoadingBar);
  doll = loadImage('images/doll.jpeg', updateLoadingBar);
  doorgod = loadImage('images/doorgod.jpeg', updateLoadingBar);
  tigers = loadImage('images/tigers.jpeg', updateLoadingBar);
  textures = loadImage('images/textures.jpeg', updateLoadingBar);
  serrations = loadImage('images/serrations.png', updateLoadingBar);
  crescents = loadImage('images/crescents.jpeg', updateLoadingBar);
  maojiao = loadImage('images/maojiao.png', updateLoadingBar);
  worship = loadImage('images/worship.jpeg', updateLoadingBar);
  witchcraft = loadImage('images/witchcraft.jpeg', updateLoadingBar);
  zhuyou = loadImage('images/zhuyou.jpeg', updateLoadingBar);
  newyear = loadImage('images/newyear.jpeg', updateLoadingBar);
  wish = loadImage('images/wish.jpeg', updateLoadingBar);
  language = loadImage('images/language.jpeg', updateLoadingBar);
  various = loadImage('images/various.jpeg', updateLoadingBar);

  floorimg = loadImage('images/texture3.jpeg');
  symtex = loadImage('images/texture4.jpeg');
  symtex2 = loadImage('images/texture5.jpeg');

  // loading models
  largeM = loadModel('assets/large.obj', updateLoadingBar);
  completeM = loadModel('assets/complete.obj', updateLoadingBar);
  livelyM = loadModel('assets/lively.obj', updateLoadingBar);
  animismM = loadModel('assets/animism.obj', updateLoadingBar);
  imageryM = loadModel('assets/imagery.obj', updateLoadingBar);
  dollM = loadModel('assets/doll.obj', updateLoadingBar);
  doorgodM = loadModel('assets/doorgod.obj', updateLoadingBar);
  tigersM = loadModel('assets/tigers.obj', updateLoadingBar);
  texturesM = loadModel('assets/textures.obj', updateLoadingBar);
  serrationsM = loadModel('assets/serrations.obj', updateLoadingBar);
  crescentsM = loadModel('assets/crescents.obj', updateLoadingBar);
  maojiaoM = loadModel('assets/maojiao.obj', updateLoadingBar);
  worshipM = loadModel('assets/worship.obj', updateLoadingBar);
  witchcraftM = loadModel('assets/witchcraft.obj', updateLoadingBar);
  zhuyouM = loadModel('assets/zhuyou.obj', updateLoadingBar);
  newyearM = loadModel('assets/newyear.obj', updateLoadingBar);
  wishM = loadModel('assets/wish.obj', updateLoadingBar);
  languageM = loadModel('assets/language.obj', updateLoadingBar);
  variousM = loadModel('assets/various.obj', updateLoadingBar);

  overview = loadModel('assets/overview-v2.obj', updateLoadingBar);
  fanfloor = loadModel('assets/fan-v2.obj', updateLoadingBar);

  introbg = loadSound('music/intro_bg.mp3', updateLoadingBar);
  loopbg = loadSound('music/loop_bg.mp3', updateLoadingBar);

  myFont = loadFont('fonts/Inconsolata-Medium.ttf', updateLoadingBar);
  waterFont = loadFont('fonts/WaterBrush-Regular.ttf', updateLoadingBar);
 }


function setup() {
    //folk removed
    contents = [large, complete, lively, animism, imagery, doll, doorgod, tigers, textures, serrations, crescents, maojiao, worship, witchcraft, zhuyou, newyear, wish, language, various];
    idnames = ["large", "complete", "lively", "animism", "imagery", "doll", "doorgod", "tigers", "textures", "serrations", "crescents", "maojiao", "worship", "witchcraft", "zhuyou", "newyear", "wish", "language", "various"];
    models = [largeM, completeM, livelyM, animismM, imageryM, dollM, doorgodM, tigersM, texturesM, serrationsM, crescentsM, maojiaoM, worshipM, witchcraftM, zhuyouM, newyearM, wishM, languageM, variousM];

    for (let i = 0; i < contents.length; i++) {
      let newsym = new Torus(contents[i], idnames[i], models[i], i);
      symbols.push(newsym)
    }

    createCanvas(windowWidth, windowHeight, WEBGL);
    floorBuffer = createGraphics(1000, 1000);
    perspective(3*PI/7, width/height, 0.01, (height/2) / tan(PI/6)*10); // width/height, the ratio
    cursor('grab');

    //pattern
    psize = 400;
    patternBuffer = createGraphics(psize, psize);
    patternBuffer.pixelDensity(2); // change to 3

    r = 2;
    d = 25;
    theta = 0;
    bg_r = 180;
    prevX = 0;
    prevZ = startZ;
    cpairs = [[0,0]];
    patternBuffer.background(0);
    patternBuffer.ellipseMode(CENTER);
    patternBuffer.noStroke();
    let rightColor = color(140, 10, 10);//190,10,10
    // rightColor.setAlpha(128 + 128 * sin(millis() / 1000));
    patternBuffer.fill(rightColor);
    patternBuffer.ellipse(psize / 2, psize / 2, 2*bg_r, 2*bg_r);

    particle = new Particle(cameraZ, 500-cameraX, floorBuffer);

    // setFloor();

    // introbg.play();  // to add // need user action to trigger play

}

function draw() {
    if (scene == 0) {
      drawIntro();
    }else if (scene == 1){
      resizeCanvas(windowWidth, windowHeight, WEBGL);
      drawMove();
      drawContents();
      drawScroll();
      drawFloor();
      drawPattern();
    }
}

function entername(){
  // introbg.stop();
  loopbg.play();
  usrname = document.getElementById("floatingInput").value;
  // console.log(usrname);
  document.getElementById("input-name").style.display = "none";
  document.getElementById("intro").style.display = "none";
  scene = 1;
}

function drawIntro(){
  document.getElementById("input-name").style.display = "block";
  document.getElementById("intro").style.display = "block";
  let x = map(mouseX-width/2, -width/2+100, width/2-100, 200, 250, true);
  let y = map(mouseY-height/2, -height/2+100, height/2-100, -20, 20, true);
  camera(cameraX, -300, cameraZ - sin(frameCount / 400)*200, x, y, 0, 0, 1, 0);

  background(0);
  push();
  // fill(255);
  // textAlign(CENTER, CENTER);
  // textSize(64);
  // textFont(myFont);
  // text("Press enter to start (temporary version)", 0, 0);
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
  ambientLight(150);
  // spotLight(0, 250, 0, locX, -100, locY, 0, 1, 0, PI / 16);

  translate(350,0,-250);
  rotateZ(PI);
  // rotateY(PI/6+millis()/1800);
  rotateY(-5*PI/12+ sin(frameCount / 200) * 6*PI/12);
  scale(8,6,6);
  texture(symtex2);
  noStroke();
  // normalMaterial();
  model(overview);
  translate(0,-20,0);
  scale(0.75,1,1);
  texture(floorimg);
  model(fanfloor);
  pop();



}

function keyPressed(){
  // if (keyCode===ENTER) {
  //   scene = 1;
  // }
  if (keyCode===32 && cameraZ < 50) {
    // saveCanvas(patternBuffer, "TCT_pattern", "jpg")
    let filename = usrname.replace(/\s+/g, '-').toLowerCase() + "-" + year() + "-" + month() + "-" + day() + "-" + hour() + "-" + minute() + "-" + second();
    patternBuffer.save(filename+".jpg")
  }
}

//user perspective
function drawMove() {
  // version 1
  // // let cam = createCamera();
  // delta_x = map(mouseX-width/2, -width/2+100, width/2-100, -750, 750, true);
  // delta_y = map(mouseY-height/2, -height/2+100, height/2-100, -800, 600, true);
  // // let temp_angle = atan2(sqrt(pow(delta_x,2)+pow(delta_y,2)), cameraZ);
  // yangle = atan2(delta_x, cameraZ);
  // if (mouseIsPressed) {
  //   cameraX += cspeed*sin(yangle);
  //   cameraZ -= cspeed*cos(yangle);
  // }
  // camera(cameraX, cameraY, cameraZ, delta_x, delta_y, 0, 0, 1, 0);
  // //size/2/tan(PI/6)

  // version 2
  // console.log(cameraLock);
  if (!cameraLock) {
    document.getElementById("m_scroll").style.display = "none";
    maxX = cameraZ*tan(atan2(maxX0, startZ));
    delta_x = 0;
    // delta_y = 0;
    if (cameraZ >= 50) {
      // delta_y = map(mouseY-4*height/5, 0, height/5, 0, cameraZ*2, true);
      delta_y = lerp(delta_y, map(mouseY-height/2, 0, height/2, 0, cameraZ*2, true), 0.08);
    }

    if (abs(mouseX-width/2) < 200) {
      movespeed = map(abs(mouseX-width/2), 5, 200, 0.05, 0.4, true)
    }else {
      movespeed = map(abs(mouseX-width/2), 100, width/2-200, 0.4, 2, true)
    }
    if (mouseX < width/2) {
      cameraX -= 0.5*movespeed;
    }else{
      cameraX += 0.5*movespeed;
    }
  }
  if (cameraLock) {
    delta_x = map(mouseX-width/2, -width/2+100, width/2-100, -200, 200, true);
    delta_y = map(mouseY-height/2, -height/2+100, height/2-100, -100, 100, true);
  }
  //camera restriction
  if (cameraX < -maxX) {
    cameraX = -maxX;
  }
  if (cameraX > maxX) {
    cameraX = maxX;
  }
  if (cameraZ < minZ) {
    cameraZ = minZ;
  }
  if (cameraZ > maxZ) {
    cameraZ = maxZ;
  }

  cameraY = 8 * sin(frameCount / 120 + PI);
  /*
  if (mouseIsPressed) {
    cameraLock = false;
    if (mouseY < 2*height/3) {
      cameraZ -= cspeed;
    }
    if (mouseY > 2*height/3) {
      cameraZ += cspeed;
    }
  }
  */
  camera(cameraX, cameraY, cameraZ, delta_x, delta_y, -150, 0, 1, 0);
}

function mouseWheel(event) {
  if (scene == 1 && !cameraLock) {
    //console.log(event.delta);
    // cameraLock = false;
    let delta = event.delta;
    if (delta > 200) {
      delta = 200;
    }
    if (delta < -200) {
      delta = -200;
    }
    delta = lerp(prevS, delta, 0.2);
    let speed = delta * -0.05;
    cameraZ += speed;
    prevS = delta;
  }
}

function mouseClicked() {
  if (cameraLock) {
    cameraLock = false;
    symbols[trigidx].enter = false;
    symbols[trigidx].close = true;
    // console.log(trigidx, symbols[trigidx].close);
  }
}

function drawScroll() {
  const scrollSpeed = 5;
  if (mouseY > height * 2/3) {
    if (triggered) {
      document.getElementById(triggered+"-1").style.display = "block";
      document.getElementById(triggered+"-2").style.display = "block";
      document.getElementById("m_scroll").style.display = "none";
      triggered = null;
    }
    scrollContainer.scrollTop += scrollSpeed;
  } else if (mouseY < height * 1/3) {
    scrollContainer.scrollTop -= scrollSpeed;
  }
  scrollContainer.scrollTop = constrain(scrollContainer.scrollTop, 0, 1200);

}

function drawContents() {
  // if (cameraZ >= 50) {
  background(0);
// }
  ambientLight(200);

  // Contents on Display
  if (cameraZ >= 650) {
    if (cameraZ > 700) {
      contentsSetup(symbols[0], 0,0,900);
      contentsSetup(symbols[1], -230,0,800);
      contentsSetup(symbols[3], -170,0,700);
      contentsSetup(symbols[4], 170,0,700);
      contentsSetup(symbols[2], 230,0,800);
    }
    contentsSetup(symbols[5], -110,0,600);
    contentsSetup(symbols[6], 0,0,680);
    contentsSetup(symbols[7], 110,0,600);
  }
  // if (cameraZ < 670 && cameraZ >= 600) {  // transition // future dev
  //   push();
  //   rotateY(atan2(cameraX, cameraZ))
  //   translate(0, 0, 590);
  //   let textalp = map(abs(cameraZ-650), 10, 20, 255, 0);
  //   fill(255, textalp);
  //   textAlign(CENTER, CENTER);
  //   textSize(48);
  //   textFont(waterFont);
  //   text("2. Textures", 0, 0);
  //   pop();
  // }
  if (cameraZ < 650 && cameraZ >= 450) {
    contentsSetup(symbols[8], -110,0,500);
    contentsSetup(symbols[9], -55,0,400);
    contentsSetup(symbols[10], 55,0,400);
    contentsSetup(symbols[11], 110,0,500);

  }
  if (cameraZ < 450 && cameraZ >= 250) {
    contentsSetup(symbols[12], -100,0,300);
    contentsSetup(symbols[13], 0,0,300);
    contentsSetup(symbols[14], 100,0,300);
    contentsSetup(symbols[15], -60,0,200);
    contentsSetup(symbols[16], 60,0,200);
  }
  if (cameraZ < 250 && cameraZ >= 50) {
    document.getElementById("hint").style.display = "none";
    contentsSetup(symbols[17], 0,0,100);
    contentsSetup(symbols[18], 0,0,0);
  }

  //show pattern
  if (cameraZ < 50) {
    document.getElementById("hint").style.display = "block";
    push();
    translate(0, 0, -100);
    // rotateZ(frameCount * 0.03)
    // rotateX(frameCount * 0.02)
    texture(patternBuffer);
    noStroke();
    plane(130);
    pop();
  }

}

//3D Pattern
function drawPattern() {
  let moved = sqrt(pow(cameraX-prevX,2)+pow(cameraZ-prevZ,2));
  // console.log(moved);
  if (moved < 1 && r < 12){ // to change
    if (!stopcheck) {
      timecheck = frameCount;
      stopcheck = true;
      r += 0.01;
    } else {
      if (frameCount - timecheck > 100) {
        // cpairs.push(camtoPatt(cameraX, cameraZ));
        r += 0.05;
        particle.collect(cameraZ, cameraX);
        colorChange = !colorChange;
        stopcheck = false;
        // updateFloor();
        updateConnection();
      }else {
        r += 0.01;
      }
    }
  }else if (r < 6){
    stopcheck = false;
    r += 0.08;
  }else{
    stopcheck = false;
    r = 1;
  }
  //lerp
  prevX = lerp(prevX, cameraX, 0.3);
  prevZ = lerp(prevZ, cameraZ, 0.3);

  d = map(prevZ, 0, startZ, 0, bg_r);
  theta = map(atan2(prevX, prevZ), -atan2(maxX, startZ), atan2(maxX, startZ), -PI/12, PI/12, true);
  // d = map(cameraZ, 0, startZ, 0, bg_r);
  // theta = map(atan2(cameraX, cameraZ), -atan2(maxX, startZ), atan2(maxX, startZ), -PI/12, PI/12, true);

  // version 1
  patternBuffer.push();
  patternBuffer.translate(patternBuffer.width / 2, patternBuffer.height / 2);
  patternBuffer.rotate(PI * millis() / 3.0 / 2500); //3.0
  for (let j = 0; j < 12; j++) {
    let x = d * cos(theta+j*PI/6);
    let y = d * sin(theta+j*PI/6);

    patternBuffer.ellipseMode(CENTER);
    patternBuffer.noStroke();
    if (!colorChange) {
      patternBuffer.fill(0);
    }else{
      patternBuffer.fill(140, 10, 10);
    }
    patternBuffer.ellipse(x, y, r, r);
  }
  patternBuffer.pop();

  // version 2 -- recursice??? too slow
  // let xy = camtoPatt(cameraX, cameraZ);
  // patternBuffer.push();
  // patternBuffer.translate(patternBuffer.width/2, patternBuffer.height/2)
  // patternBuffer.ellipseMode(CENTER);
  // patternBuffer.noStroke();
  // patternBuffer.fill(0);
  // patternBuffer.rotate(PI * millis() / 10.0 / 2500); //3.0
  // censym([xy], r, cpairs);
  // patternBuffer.pop();
}

function contentsSetup(symbol, cx, cy, cz, logging=false) {
  push();
  translate(cx, cy, cz);
  translate(0,10,10);
  symbol.update(cx, cz+10, cameraX, cameraZ, prevZ);
  if (logging) { // for debugging
    symbol.logging();
  }
  cameraLock = cameraLock || symbol.isLock();
  triggered = triggered || symbol.isScroll();
  if (symbol.isScroll()) {
    trigidx = symbol.getIndex();
    // console.log(triggered, trigidx);
  }
  pop();
}

// function setFloor() { // tried to optimize
//   floorBuffer.background(0);
//   floorBuffer.push();
//   floorBuffer.translate(0, 500);
//   // floorBuffer.stroke(180);
//   floorBuffer.stroke(143, 94, 127);
//   // floorBuffer.stroke(207, 157, 205);
//   floorBuffer.strokeWeight(2);
//   floorBuffer.noFill();
//   floorBuffer.arc(0, 0, 2000, 2000, -PI/6, PI/6, PIE);
//   floorBuffer.pop();
//   floorBuffer.push();
//   floorBuffer.tint(255, 180);
//   // floorBuffer.image(floorimg, 900, 500, 80, 80);
//   // floorBuffer.image(floorimg, 680, 500, 80, 80);
//   floorBuffer.pop();
// }

function drawFloor() {
    // to optimize
    floorBuffer.background(0);
    floorBuffer.push();
    floorBuffer.translate(0, 500);
    // floorBuffer.stroke(180);
    floorBuffer.stroke(158, 144, 156);
    // floorBuffer.stroke(207, 157, 205);
    floorBuffer.strokeWeight(2);
    floorBuffer.noFill();
    floorBuffer.arc(0, 0, 2000, 2000, -PI/6, PI/6, PIE); // 2000
    floorBuffer.pop();
    floorBuffer.push();
    floorBuffer.tint(255, 180);
    // floorBuffer.image(floorimg, 900, 500, 80, 80);
    // floorBuffer.image(floorimg, 680, 500, 80, 80);
    floorBuffer.pop();

    // if (requestAnimationFrame(drawFloor) % 3 == 0) {
    particle.update(cameraZ-25, 500-cameraX);
    // }
    particle.show();
    particle.showCol();

    push();
    translate(0, 80, 500);
    rotateY(-PI/2);
    rotateX(PI/2);
    texture(floorBuffer);
    noStroke();
    plane(1000);
    pop();

    drawConnection();

}

// function drawFloor() {
//   // floorBuffer.background(0);
//   // particle.update(cameraZ-25, 500-cameraX);
//   // particle.show();
//   push();
//   translate(0, 80, 500);
//   rotateY(-PI/2);
//   rotateX(PI/2);
//   texture(floorBuffer);
//   noStroke();
//   plane(1000);
//   pop();
//
//   drawConnection();
// }

// function updateFloor() {
//     // to optimize
//     // setFloor()
//     // if (requestAnimationFrame(drawFloor) % 3 == 0) {
//     // }
//     particle.showCol();
//     updateConnection();
// }


function drawConnection() {
  for (var i = 0; i < connected.length/2; i++) {
    push();
    translate(connected[2*i][0], connected[2*i][1], connected[2*i][2]);
    rotateZ(-PI/2);
    if (connected[2*i][4]>=0) {
      rotateX(-PI/6);
    }else {
      rotateX(PI/6);
    }
    stroke(255, 80);
    // stroke(199, 189, 97);
    // stroke(255, 245, 153);
    strokeWeight(1);
    noFill();
    arc(0, 0, connected[2*i][3], connected[2*i][3], -abs(connected[2*i][4]), abs(connected[2*i][4]));
    pop();

    push();
    translate(connected[2*i+1][0], connected[2*i+1][1], connected[2*i+1][2]);
    rotateZ(-PI/2);
    rotateX(PI/2);
    stroke(255, 80);
    strokeWeight(1);
    noFill();
    arc(0, 0, connected[2*i+1][3], connected[2*i+1][3], -abs(connected[2*i+1][4]), abs(connected[2*i+1][4]));
    pop();
  }
}

function updateConnection() {
    for (var i = 0; i < particle.collection.length; i++) {
      let x = 500 - particle.collection[i].y;
      let z = particle.collection[i].x;
      let gamma = atan2(x, z);
      connected[2*i] = [];
      connected[2*i+1] = [];
      if (gamma>=0) {
        let dr = sin(PI/6-gamma)*(x/asin(gamma));
        connected[2*i] = [x/4+sqrt(3)*z/4, 80+dr/tan(gamma), sqrt(3)*x/4+3*z/4, dr*2/sin(gamma), gamma];
        let symx = -x/2+sqrt(3)*z/2;
        let symz = sqrt(3)*x/2+z/2;
        connected[2*i+1] =[symx, 80+symz*sqrt(3), 0, 4*symz, PI/6];
      }else {
        let dr = sin(PI/6+gamma)*(-x/asin(-gamma));
        connected[2*i] = [x/4-sqrt(3)*z/4, 80+dr/tan(-gamma), -sqrt(3)*x/4+3*z/4, dr*2/sin(-gamma), gamma];
        let symx = -x/2-sqrt(3)*z/2;
        let symz = -sqrt(3)*x/2+z/2;
        connected[2*i+1] =[symx, 80+symz*sqrt(3), 0, 4*symz, PI/6];
      }
    }
}

// camera position mapping to pattern
function camtoPatt(x, z) {
  d = map(z, 0, startZ, 0, bg_r);
  theta = map(atan2(x, z), -atan2(maxX, startZ), atan2(maxX, startZ), -PI/12, PI/12, true);
  let px = d * cos(theta-PI/2);
  let py = d * sin(theta-PI/2);
  return [px, py]
}

function censym(xy, r, cp) {
  if (cp.length == 1) {
    for (let i = 0; i < xy.length; i++) {
      patternBuffer.ellipse(2*cp[0][0]-xy[i][0], 2*cp[0][1]-xy[i][1], r, r);
    }
  }else{
    for (let i = 0; i < xy.length; i++) {
      // console.log(cp);
      // console.log(xy);
      let newx = 2*cp[cp.length-1][0]-xy[i][0];
      let newy = 2*cp[cp.length-1][1]-xy[i][1];
      patternBuffer.ellipse(newx, newy, r, r);
      xy.push([newx, newy]);
    }
    cp.pop();
    censym(xy, r, cp);
  }
}
