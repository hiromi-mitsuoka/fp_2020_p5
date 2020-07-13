//shader
let Shader;
let shaderMode = 1;
let modeChange = 0;
//Structure
let num = 25;
let position = [num];
let sound;
let volume;
//aroundCross
let pointPos;
let pointPos_second;
let crosses;
let crosses_second;
//Amplitude
let level;
let size;
let roundCrossSize;
let canvasChange = 0;

class Cross {
  constructor(_pos, _vel, _size, _life) {
    this._pos = _pos;
    this._vel = createVector(
      random(-_vel, _vel),
      random(-_vel, _vel),
      random(-_vel, _vel)
    );
    this._size = _size;
    this._life = _life;
    this._alive = true;
  }
  update() {
    if (this._life <= 0) {
      this._alive = false;
    } else {
      this._life -= 1.0;
      this._pos.add(this._vel);
    }
  }
  draw() {
    push();
    translate(this._pos);
    stroke(255, 250, 255, this._life);
    if (size > 250 || frameCount >= 50 * 70) {
      fill(0, 0, 255);
      noStroke();
    }
    box(this._size / 20, this._size / 20, this._size + roundCrossSize);
    box(this._size / 20, this._size + roundCrossSize, this._size / 20);
    box(this._size + roundCrossSize, this._size / 20, this._size / 20);
    pop();
  }
}



function preload() {
  sound = loadSound('sound.mp3');
  Shader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  createCanvas(500, 500, WEBGL);
  frameRate(50);
  //shader
  pixelDensity(1);
  //Structure
  for (let i = 0; i < num; i++) {
    position[i] = createVector(random(-100, 100), random(-100, 100), random(-100, 100));
  }
  //aroundCross
  crosses = new Array();
  crosses_second = new Array();
  //Amplitude
  sound.play();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(0);
  level = amplitude.getLevel();
  size = map(level, 0, 1, 0, 700);

  if (frameCount % (60 * 5) == 0) {
    canvasChange++;
  }
  if (canvasChange % 3 == 0 || size <= 100) {
    drawShader();
  } else if (canvasChange % 3 == 1 && size > 100) {
    drawStructure();
  } else if (canvasChange % 3 == 2 && size > 100) {
    drawAroundCross();
  }
}



function drawShader() {
  blendMode(BLEND);
  Shader.setUniform('u_resolution', [width, height]);
  Shader.setUniform('u_time', frameCount * 0.01);
  Shader.setUniform('u_amp', level);
  Shader.setUniform('u_shaderMode', shaderMode);
  shader(Shader);
  rect(0, 0, width, height);

  if (size > 100) {
    modeChange++;
    if (modeChange % 30 == 0) {
      shaderMode = 1;
    }
  }
  if (size > 200) {
    modeChange++;
    if (modeChange % 15 == 0) {
      shaderMode = 2;
    }
  }
  if (size > 250) {
    modeChange++;
    if (modeChange % 30 == 0) {
      shaderMode = 3;
    }
  }
  if (size > 300) {
    modeChange++;
    if (modeChange % 30 == 0) {
      shaderMode = 5;
    }
  }
}

function drawStructure() {
  blendMode(MULTIPLY);
  specularMaterial(50, 200);
  directionalLight(200, 500, -500, 500);
  pointLight(200, -50, -50, 50);
  ambientLight(100);
  perspective(PI / 3, width / height, 0.1, 1000);
  camera(0, 0, 300, 0, 0, 0, 0, 1.0, 0);
  if (size > 100) {
    camera(150 * sin(frameCount * 0.004), 0, 150 * cos(frameCount * 0.005), 8, -10, -10, 0, 1.0, 0);
  }
  if (size > 200) {
    // camera(30, 300 * cos(frameCount * 0.01), -300 * sin(frameCount * 0.01), 0, 0, 0, 0, 1.0, 0);
    camera(0, -200, 0, 150 * sin(frameCount * 0.0005), 200, -100, 0, 1.0, 0);
  }
  if (size > 250) {
    camera(100 * sin(frameCount * 0.01), -100 * cos(frameCount * 0.01), -80, 30, -10, 50, 0, 1.0, 0);
  }

  fill(random(200), random(100), 100, 100);
  for (let i = 0; i < num; i++) {
    if (size > 100) {
      fill(155, 0, 155, 100);
    }
    if (size > 200) {
      fill(0, 0, 255, 200);
    }
    if (size > 250 || frameCount >= 50 * 70) {
      fill(255, 0, 0);
    }
    stroke(255);
    strokeWeight(1);
    push();
    translate(position[i]);
    rotateZ(degrees(60));
    box(5, 5, size - 50);
    box(5, size - 50, 5);
    box(size - 50, 5, 5);
    pop();
  }
}

function drawAroundCross() {
  specularMaterial(0, 200);
  directionalLight(100, 0, 255, 100, 1000, -1000, 1000);
  pointLight(100, 0, 255, 100, -50, -50, 50);
  ambientLight(0);
  perspective(PI / 3, width / height, 0.1, 2000);
  roundCrossSize = size * 0.01;

  push();
  noFill();
  strokeWeight(0.8);
  stroke(255);
  sphere(1000);

  crosses.forEach((element, index) => {
    element.update();
    if (element._alive) {
      element.draw();
    } else {
      crosses.splice(index, 1);
    }
  });
  crosses_second.forEach((element, index) => {
    element.update();
    if (element._alive) {
      element.draw();
    } else {
      crosses_second.splice(index, 1);
    }
  });

  pointPos = createVector(300 * cos(frameCount * 0.01), 0, 300 * sin(frameCount * 0.01));
  crosses.push(new Cross(pointPos, random(0.3, 0.8), size * 0.3, random(100, 200)));
  pointPos_second = createVector(0, 300 * cos(frameCount * 0.01), 300 * sin(frameCount * 0.01));
  crosses_second.push(new Cross(pointPos_second, random(0.1, 0.5), size * 0.3, random(200, 255)));
  pop();

  camera(320 * cos(-frameCount * 0.01), 30 * sin(-frameCount * 0.01), 250 * sin(-frameCount * 0.01), pointPos.x, 0, pointPos.z, 0, 1.0, 0);
  // if (size > 250) {
  //   camera(0, 0, 400, 0, 0, 0, 0, 1.0, 0);
  // }
  if (size > 250) {
    camera(pointPos.x + 100, pointPos.y - 200 * sin(-frameCount * 0.005), pointPos.z + 100 * cos(frameCount * 0.005), pointPos.x, pointPos.y, pointPos.z, 0, 1.0, 0);
  }
}