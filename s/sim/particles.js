'use strict';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = (canvas.width = document.body.clientWidth);
const height = (canvas.height = document.body.clientHeight);

let clearCanvas = true;
let simulationSpeed = 1;
let scale = 1;
let gravitationalConstant = 1;
let borderBounce = true;

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class PhysicsObject {
  constructor(
    x,
    y,
    mass,
    color,
    radius,
    velX,
    velY,
    props = { class: 'default' }
  ) {
    this.x = x ?? width / 2;
    this.y = y ?? width / 2;
    this.mass = mass ?? 1;
    this.color = color ?? 'white';
    this.radius = radius ?? 5;
    this.velX = velX ?? 0;
    this.velY = velY ?? 0;
    this.props = props;

    this.collidedWith = [];
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  move() {
    this.forceX = 0;
    this.forceY = 0;

    //this.randomForces();
    this.attractionForce();
    this.collisionCheck();

    this.velX += this.forceX / this.mass;
    this.velY += this.forceY / this.mass;

    // bounds checks
    if (borderBounce) {
      if (this.y + this.radius >= height) {
        this.velY *= -1;
        this.y = height - this.radius;
      } else if (this.y - this.radius <= 0) {
        this.velY *= -1;
        this.y = 0 + this.radius;
      } else if (this.x + this.radius >= width) {
        this.velX *= -1;
        this.x = width - this.radius;
      } else if (this.x - this.radius <= 0) {
        this.velX *= -1;
        this.x = 0 + this.radius;
      }
    } else {
      if (this.y >= height) {
        this.y = 0;
      } else if (this.y <= 0) {
        this.y = height;
      } else if (this.x >= width) {
        this.x = 0;
      } else if (this.x <= 0) {
        this.x = width;
      }
    }
  }

  randomForces() {
    this.forceX += random(-100, 100) / 10;
    this.forceY += random(-100, 100) / 10;
  }

  attractionForce() {
    for (let i = 0, len = bodies.length; i < len; i++) {
      if (bodies[i] === this) continue;
      const dx = this.x - bodies[i].x;
      const dy = this.x - bodies[i].y;
      const combinedMass = this.mass * bodies[i].mass;
      const distanceSquared = dx ** 2 + dy ** 2;

      if (distanceSquared <= this.radius ** 2 + bodies[i].radius ** 2 + 1) {
        continue;
      }

      if (dx > 0) {
        this.forceX -= (gravitationalConstant * combinedMass) / distanceSquared;
      } else {
        this.forceX += (gravitationalConstant * combinedMass) / distanceSquared;
      }

      if (dy > 0) {
        this.forceY -= (gravitationalConstant * combinedMass) / distanceSquared;
      } else {
        this.forceY += (gravitationalConstant * combinedMass) / distanceSquared;
      }
    }
  }

  collisionCheck() {
    for (let i = 0, len = bodies.length; i < len; i++) {
      if (this === bodies[i]) continue;
      if (this.props?.nocollide || bodies[i].props?.nocollide) continue;
      if (
        this.x + this.radius >= bodies[i].x - bodies[i].radius &&
        this.x - this.radius <= bodies[i].x + bodies[i].radius &&
        this.y + this.radius >= bodies[i].y - bodies[i].radius &&
        this.y - this.radius <= bodies[i].y + bodies[i].radius &&
        this.collidedWith.indexOf(bodies[i] === -1) &&
        bodies[i].collidedWith.indexOf(this) === -1
      ) {
        this.collidedWith.push(bodies[i]);
        bodies[i].collidedWith.push(this);

        if (this.props.class === 'particle') {
          this.color = randomColor();
          if (bodies[i].props.class === 'particle') {
            bodies[i].color = randomColor();
          }
        }

        const collisionData = PhysicsObject.elasticCollision(
          this.x,
          this.y,
          this.mass,
          this.velX,
          this.velY,
          bodies[i].x,
          bodies[i].y,
          bodies[i].mass,
          bodies[i].velX,
          bodies[i].velY
        );

        this.velX = collisionData[0].x;
        this.velY = collisionData[0].y;

        bodies[i].velX = collisionData[1].x;
        bodies[i].velY = collisionData[1].y;
      }
    }
  }

  update(t) {
    if (this.props?.class === 'sun') return;
    this.x += (t * this.velX) / scale;
    this.y += (t * this.velY) / scale;
  }

  static elasticCollision(x1, y1, m1, v1x, v1y, x2, y2, m2, v2x, v2y) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const phi = dx === 0 ? Math.PI / 2 : Math.atan(dy / dx);

    const theta1 = PhysicsObject.elasticAngleFinder(v1x, v1y);
    const theta2 = PhysicsObject.elasticAngleFinder(v2x, v2y);

    const v1 = Math.sqrt(v1x ** 2 + v1y ** 2);
    const v2 = Math.sqrt(v2x ** 2 + v2y ** 2);

    // rotate
    const v1xr = v1 * Math.cos(theta1 - phi);
    const v1yr = v1 * Math.sin(theta1 - phi);
    const v2xr = v2 * Math.cos(theta2 - phi);
    const v2yr = v2 * Math.sin(theta2 - phi);

    // solve 1d
    const v1fxr =
      ((m1 - m2) / (m1 + m2)) * v1xr + ((2 * m2) / (m1 + m2)) * v2xr;
    const v2fxr =
      ((2 * m1) / (m1 + m2)) * v1xr + ((m2 - m1) / (m1 + m2)) * v2xr;
    const v1fyr = v1yr;
    const v2fyr = v2yr;

    // unrotate
    const v1fx = Math.cos(phi) * v1fxr + Math.cos(phi + Math.PI / 2) * v1fyr;
    const v1fy = Math.sin(phi) * v1fxr + Math.sin(phi + Math.PI / 2) * v1fyr;
    const v2fx = Math.cos(phi) * v2fxr + Math.cos(phi + Math.PI / 2) * v2fyr;
    const v2fy = Math.sin(phi) * v2fxr + Math.sin(phi + Math.PI / 2) * v2fyr;

    return [
      {
        x: v1fx,
        y: v1fy,
      },
      {
        x: v2fx,
        y: v2fy,
      },
    ];
  }

  static elasticAngleFinder(x, y) {
    if (x < 0) return Math.PI + Math.atan(y / x);
    if (x > 0 && y >= 0) return Math.atan(y / x);
    if (x > 0 && y < 0) return 2 * Math.PI + Math.atan(y / x);
    if (x == 0 && y == 0) return 0;
    if (x == 0 && y >= 0) return Math.PI / 2;
    return (3 * Math.PI) / 2;
  }
}

class Apple extends PhysicsObject {
  constructor(x = random(0, width), y = random(0, height)) {
    super(x, y, 10, 'red', 10, 0, 0, { class: 'apple' });
  }
}

class Particle extends PhysicsObject {
  constructor(x = random(0, width), y = random(0, height)) {
    super(x, y, 1, randomColor(), 5, random(-100, 100), random(-100, 100), {
      class: 'particle',
    });
  }
}

class Orbital extends PhysicsObject {
  constructor(x = random(0, width), y = random(0, height)) {
    super(x, y, 100, 'yellow', 15, 0, 0, {
      class: 'heavy',
      nocollide: true,
    });
  }
}

{
  /* class Sun extends PhysicsObject {
  constructor() {
    super(width / 2, height / 2, 1.989e30, 'yellow', 30);
  }
}

class Earth extends PhysicsObject {
  constructor() {
    super(width / 4, height / 4, 5.972e24, 'blue', 10);
  }
}

class Moon extends PhysicsObject {
  constructor(x = width / 4 + 15, y = width / 4 + 15) {
    super(x, y, 0.07346e24, 'white', 5);
  }
}

class Jupiter extends PhysicsObject {
  constructor() {
    super((3 / 4) * width, (3 / 4) * height, 1.898e27, 'orange', 20);
  }
} */
}

canvas.addEventListener('click', (e) => {
  bodies.push(new Apple(e.clientX, e.clientY));
});

let start = 0;

const bodies = new Array(200).fill().map((e) => new Particle());
bodies.push(...new Array(10).fill().map((e) => new Apple()));
bodies.push(...new Array(3).fill().map((e) => new Orbital()));

function loop(timestamp = 0) {
  const frameTime = ((timestamp - start) / 1000) * simulationSpeed; // framerate independence
  start = timestamp;

  if (clearCanvas) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
  }

  for (let i = 0, len = bodies.length; i < len; i++) {
    bodies[i].draw();
    bodies[i].move();
    bodies[i].update(frameTime);
  }

  for (let i = 0, len = bodies.length; i < len; i++) {
    bodies[i].collidedWith = [];
  }

  window.requestAnimationFrame(loop);
}

loop();
