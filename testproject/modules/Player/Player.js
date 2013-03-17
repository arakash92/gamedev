engine.registerModule('Player', '0.1.0')
    .depends('Entity')
    .defines(function() {
        
        engine.Player = engine.Entity.extend({
            init: function(game, name, x, y) {
                this._super(game, name, x, y);
                this.health = 100;
                this.speed = 1;
                this.maxSpeed = 4;
                this.moving = false;
                this.bullets = [];
                this.shooting = false;
                this.lastShot = (new Date()).getTime();
                this.shootTimer = 150;
                this.direction = new engine.Vector();
            },
            update: function(dt) {
                
                //constrain to screen
                if (this.pos.x < 0) {
                    this.pos.x = 0;
                }else if (this.pos.x > this.game.canvas.width) {
                    this.pos.x = this.game.canvas.width;
                }
                if (this.pos.y < 0) {
                    this.pos.y = 0;
                }else if (this.pos.y > this.game.canvas.height) {
                    this.pos.y = this.game.canvas.height;
                }
                
                //get direction
                this.direction.x = this.game.input.mouse.pos.x;
                this.direction.y = this.game.input.mouse.pos.y;
                this.direction.sub(this.pos);
                this.direction.normalize();
                
                //update bullets
                for(var i in this.bullets) {
                    var b = this.bullets[i];
                    if (b.pos.x > 0 || b.pos.x < this.game.canvas.width || b.pos.y > 0 || b.pos.y < this.game.canvas.height) {
                        b.update(dt);
                    }
                }
                //delete bullets
                for(i in this.bullets) {
                    var b = this.bullets[i];
                    if (b.pos.x > 0 || b.pos.x < this.game.canvas.width || b.pos.y > 0 || b.pos.y < this.game.canvas.height) {
                        this.bullets.splice[i];
                    }
                }
                
                
                
                //shoot
                if (this.game.input.mouse[1] && this.game.time_now - this.lastShot > this.shootTimer) {
                    console.log('shooting');
                    this.shooting = true;
                    this.shoot();
                    //cpush backwards
                    var shootForce = new engine.Vector(this.direction.x, this.direction.y);
                    shootForce.invert();
                    shootForce.mult(5);
                    shootForce.add(new engine.Vector(-1 + Math.random()*2, -1 + Math.random()*2));
                    this.acceleration.add(shootForce);
                    
                    //whenever we shoot, we want to move backwards a littlebit
                    this.lastShot = this.game.time_now;
                }else {
                    this.shooting = false;
                }
                
                //reset velocity
                this.velocity.reset();
                
                //deccelerate
                if (this.acceleration.x > 0) {
                    this.acceleration.x -= this.maxSpeed / 30;
                    if (this.acceleration.x < 0) {
                        this.acceleration.x = 0;
                    }
                }else if (this.acceleration.x < 0) {
                    this.acceleration.x += this.maxSpeed / 30;
                    if (this.acceleration.x > 0) {
                        this.acceleration.x = 0;
                    }
                }
                
                if (this.acceleration.y > 0) {
                    this.acceleration.y -= this.maxSpeed / 30;
                    if (this.acceleration.y < 0) {
                        this.acceleration.y = 0;
                    }
                }else if (this.acceleration.y < 0) {
                    this.acceleration.y += this.maxSpeed / 30;
                    if (this.acceleration.y > 0) {
                        this.acceleration.y = 0;
                    }
                }
                
                
                
                //handle movement
                this.moving = false;
                if (this.game.input.keys['w']) {
                    this.moving = true;
                    this.acceleration.y -= this.speed;
                }
                if (this.game.input.keys['s']) {
                    this.moving = true;
                    this.acceleration.y += this.speed; 
                }
                if (this.game.input.keys['a']) {
                    this.moving = true;
                    this.acceleration.x -= this.speed;
                }
                if (this.game.input.keys['d']) {
                    this.moving = true;
                    this.acceleration.x += this.speed;
                }
                
                //limit acceleration, both positive and negative
                this.acceleration.limit(this.maxSpeed);
                this.acceleration.limit(0 - Math.abs(this.maxSpeed));
                
                //accelerate
                this.velocity.add(this.acceleration);
                
                //multiply velocity by deltaTime to make up for lag
                this.velocity.mult(dt);
                
                //move!
                this.pos.add(this.velocity);
            },
            
            render: function(g) {
                //this.renderDebug(g);
                
                var i;
                for(i in this.bullets) {
                    this.bullets[i].render(g);
                }
                
                function rotateVector(v, angle) {
                    var newX = Math.cos(angle) * (v.x) - Math.sin(angle) * (v.y);
                    var newY = Math.sin(angle) * (v.x) + Math.cos(angle) * (v.y);
                    return new engine.Vector(newX, newY);
                }
                
                
                var top = new engine.Vector(this.direction.x, this.direction.y);
                var bottomLeft = rotateVector(top, 90);
                var bottomRight = rotateVector(top, 180);
                
                top.mult(30);
                bottomLeft.mult(15);
                bottomRight.mult(15);
                
                top.add(this.pos);
                bottomLeft.add(this.pos);
                bottomRight.add(this.pos);
                
                g.strokeStyle = 'white';
                g.fillStyle = 'red';
                
                g.beginPath();
                g.moveTo(top.x, top.y);
                g.lineTo(bottomRight.x, bottomRight.y);
                g.lineTo(bottomLeft.x, bottomLeft.y);
                g.lineTo(top.x, top.y);
                g.stroke();
                
                g.fillRect(top.x-2, top.y-2, 4,4)
            },
            
            shoot: function() {
                //spawn a new bullet at the player
                var bullet = {
                    pos: new engine.Vector(),
                    velocity: new engine.Vector(),
                    direction: new engine.Vector(),
                    acceleration: new engine.Vector(),
                    maxSpeed: 5,
                    update: function(dt) {
                        this.velocity.reset();
                        
                        //set the direction
                        this.acceleration = this.direction;
                        
                        this.velocity.add(this.acceleration);
                        
                        this.velocity.mult(13);
                        
                        this.velocity.mult(dt);
                        
                        this.pos.add(this.velocity);
                    },
                    render: function(g) {
                        g.fillStyle = 'white';
                        g.strokeStyle = 'white';
                        g.beginPath();
                        g.moveTo(this.pos.x,this.pos.y);
                        g.lineTo(this.pos.x+ this.direction.x*10,this.pos.y+this.direction.y*10);
                        g.stroke();
                        //g.fillRect(this.pos.x-2, this.pos.y-2, 4, 4);
                    },
                };
                
                var pos = new engine.Vector(this.direction.x, this.direction.y);
                pos.mult(20);
                pos.add(this.pos);
                bullet.pos = pos;
                
                bullet.direction.x = this.direction.x;
                bullet.direction.y = this.direction.y;
                
                //console.log(bullet.direction);
                this.bullets.push(bullet);
            },
            
            die: function() {
                
            },
        });
        
    });