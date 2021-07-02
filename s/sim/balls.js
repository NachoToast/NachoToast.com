'use strict';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = (canvas.width = document.body.clientWidth);
const height = (canvas.height = document.body.clientHeight);

let snakes = false;
let simulationSpeed = 1;
simulationSpeed /= 1e15;
// simulationSpeed *= 100000;

let gravitationalConstant = 6.674e-11;
//gravitationalConstant *= 10e12;
//let universalGravity = 9.81;
let universalGravity = 0;

const bodies = [];

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

class PhysicsObject {
  constructor(x, y, velX, velY, color, mass, radius, props = {}) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.mass = mass;
    this.radius = radius;
    this.props = props;

    bodies.push(this);
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  move(t) {
    if (this.props?.immovable) return;

    const attractionForces = this.attractionForce();
    //const attractionForces = { x: 0, y: 0 };
    this.velY +=
      ((attractionForces.y + this.mass * universalGravity) * t) / this.mass;

    this.velX += (attractionForces.x * t) / this.mass;

    if (this.y + this.radius >= height) {
      this.velY *= -0.5;
      this.y = height - this.radius;
    }

    if (this.y - this.radius <= 0) {
      this.velY *= -0.5;
      this.y = 0 + this.radius;
    }

    if (this.x + this.radius >= width) {
      this.velX *= -0.5;
      this.x = width - this.radius;
    }

    if (this.x - this.radius <= 0) {
      this.velX *= -0.5;
      this.x = 0 + this.radius;
    }
  }

  attractionForce() {
    let forceX = 0;
    let forceY = 0;
    for (let i = 0, len = bodies.length; i < len; i++) {
      if (bodies[i] !== this) {
        const dx = this.x - bodies[i].x;
        const dy = this.y - bodies[i].y;
        const combinedMass = this.mass * bodies[i].mass;
        const distance = Math.max(
          Math.sqrt(dx ** 2 + dy ** 2),
          this.radius + bodies[i].radius
        );
        if (dx > 0) {
          forceX -= (gravitationalConstant * combinedMass) / distance ** 2;
        } else if (dx < 0) {
          forceX += (gravitationalConstant * combinedMass) / distance ** 2;
        }

        if (dy > 0) {
          forceY -= (gravitationalConstant * combinedMass) / distance ** 2;
        } else if (dy < 0) {
          forceY += (gravitationalConstant * combinedMass) / distance ** 2;
        }
      }
    }

    return { x: forceX / bodies.length, y: forceY / bodies.length };
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;
  }
}

class Apple extends PhysicsObject {
  constructor(
    x = random(0, width),
    y = random(0, height),
    color = `rgba(${random(0, 255)},${random(0, 255)},${random(0, 255)},${
      random(20, 100) / 100
    })`
  ) {
    super(x, y, 0, 0, color, 0.1, 15);
  }
}

class Heavy extends PhysicsObject {
  constructor(
    x = random(0, width),
    y = random(0, height),
    color = `rgba(${random(0, 255)},${random(0, 255)},${random(0, 255)},${
      random(20, 100) / 100
    })`
  ) {
    super(x, y, 0, 0, color, 100, 17);
  }
}

class Random extends PhysicsObject {
  constructor(
    x = random(0, width),
    y = random(0, height),
    color = `rgba(${random(0, 255)},${random(0, 255)},${random(0, 255)},${
      random(20, 100) / 100
    })`
  ) {
    super(x, y, 0, 0, color, random(0, 100), random(0, 17));
  }
}

class Sun extends PhysicsObject {
  constructor() {
    super(width / 2, height / 2, 0, 0, 'yellow', 1.989e30, 30, {
      // immovable: true,
    });
  }
}

class Earth extends PhysicsObject {
  constructor() {
    super(random(0, width), random(0, height), 0, 0, 'blue', 5.972e24, 20);
  }
}

class Moon extends PhysicsObject {
  constructor() {
    super(random(0, width), random(0, height), 0, 0, 'white', 0.07346e24, 10);
  }
}

class Jupiter extends PhysicsObject {
  constructor() {
    super(random(0, width), random(0, height), 0, 0, 'orange', 1.898e27, 25);
  }
}

document.addEventListener('click', (e) => {
  bodies.push(new Apple(e.clientX, e.clientY));
});

let start = 0;
function loop(timestamp) {
  const frameTime = ((timestamp - start) / 1000) * simulationSpeed; // framerate independence
  start = timestamp;

  if (!snakes) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
  }

  for (let i = 0, len = bodies.length; i < len; i++) {
    bodies[i].draw();
    bodies[i].move(frameTime);
    bodies[i].update();
  }

  window.requestAnimationFrame(loop);
}

setTimeout(() => {
  new Sun();
  new Earth();
  new Moon();
  new Jupiter();

  new Heavy();
  new Random();
  new Apple();
}, 200);

loop();
