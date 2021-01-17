const WIDTH = window.innerWidth - 20;
const HEIGHT = window.innerHeight - 20;
const NUMBER_OF_PARTICLES = 20;
const PARTICLE_SIZE = 6;
const PARTICLE_CHANGE_SIZE_SPEED  = 0.07;
const PARTICLE_CHANGE_SPEED  = 0.1;
const PARTICLE_MIN_SPEED  = 3;
const GRAVITY = 0.05;
const DOT_CHANGE_SIZE_SPEED = 0.2;
const DOT_CHANGE_ALPHA_SPEED = 0.1;

class Particle {
    constructor(bullet, deg) {
        this.bullet = bullet;
        this.deg = deg;
        this.ctx = this.bullet.ctx;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 3 + PARTICLE_MIN_SPEED;
        this.color = this.bullet.color;
        this.speedX = 0;
        this.speedY = -10;
        this.fallSpeed = 0;

        this.dots = []
    }

    update() {
        if (this.size > PARTICLE_CHANGE_SIZE_SPEED )
            this.size -= PARTICLE_CHANGE_SIZE_SPEED;
        
        if (this.size > 0) {
            this.dots.push({
                x: this.x,
                y: this.y,
                alpha: 1,
                size: this.size
            });
        }

        this.dots.forEach(dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
        });

        this.dots = this.dots.filter(dot => dot.size > 0 );

        if (this.dots.length == 0 ) {
            this.remove();
        }
        if (this.speed > PARTICLE_CHANGE_SPEED) {
            this.speed -= PARTICLE_CHANGE_SPEED;
        }
        
        if (this.speed < 0) {
            this.speed = 0;
        }

        this.fallSpeed += GRAVITY;

        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;

        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw() {
        this.dots.forEach(dot => {
            this.ctx.fillStyle = `rgba(${this.color}, ${dot.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }

    remove() {
        this.bullet.particles.splice( this.bullet.particles.indexOf(this), 1);
    }
}

class Bullet{
    constructor(firework) {
        this.firework = firework;
        this.ctx = firework.ctx;
        this.x = Math.random() * WIDTH;
        this.y = Math.random() * HEIGHT * 3/4;
        this.color =  Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255);
        
        this.particles = [];

        const deg = 2 * Math.PI / NUMBER_OF_PARTICLES;
        for (let index = 0; index < NUMBER_OF_PARTICLES; index++) {
            this.particles.push(new Particle(this, deg * index));
        }
    }

    update() {
        if (this.particles.length == 0) {
            this.remove();
        }
        this.particles.forEach(particle => particle.update());
    }

    draw() {
        this.particles.forEach(particle => particle.draw());
    }

    remove() {
        this.firework.bullets.splice(this.firework.bullets.indexOf(this), 1);
    }
}

class firework {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        document.body.appendChild(this.canvas);
        this.bullets = [];
        this.textX = 0;
        this.textY = 50;
        this.direction = 1;
        setInterval(() => {
            this.bullets.push(new Bullet(this));
        }, 400);

        this.loop();
    }

    loop() {
        this.bullets.forEach( bullet => bullet.update());
        this.textX += 2 * this.direction;
        if (this.textX > WIDTH - 300) {
            this.direction = -1;
        } else if (this.textX <= 10) {
            this.direction = 1
        } else {
        }
        
        
        this.draw();
        setTimeout( () => this.loop(), 20);
    }

    clearScreen() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0,0,WIDTH, HEIGHT);
    }

    draw() {
        this.clearScreen();
        this.ctx.fillStyle = "#FFF";
        // Create gradient
        var grd = this.ctx.createLinearGradient(0,0,WIDTH,0);
        grd.addColorStop(0,"red");
        grd.addColorStop(0.5,"yellow");
        grd.addColorStop(1,"green");
        this.ctx.fillStyle = grd;
        this.ctx.font = "30px Arial";
        this.ctx.fillText("Happy New Year 2021!",this.textX, this.textY);
        this.bullets.forEach(bullet => bullet.draw());
    }
}

var f = new firework();