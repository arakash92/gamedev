engine.registerModule('Player', '0.1.0')
	
	.defines(function() {
		
		engine.Player = engine.Entity.extend({
			init: function(x, y) {
				this._super(x, y);
				this.health = 100;
				this.speed = 1;
				this.maxSpeed = 4;
				this.moving = false;
				this.bullets = [];
				this.shooting = false;
				this.lastShot = (new Date()).getTime();
				this.shootTimer = 150;
				this.direction = new engine.Vector();
				this.angle = 0;
			},
			update: function(dt) {
				//parent update
				this._super(dt);
				//update HUD
				//$(".gui-hud .health").html(this.health);

				//get direction
				this.direction.x = engine.settings.currentGame.input.mouse.absolutePos.x;
				this.direction.y = engine.settings.currentGame.input.mouse.absolutePos.y;
				this.direction.sub(this.pos);
				this.direction.normalize();

				//set the angle, based on direction vector
				this.angle = this.direction.getAngle();

				//constrain to screen
				if (this.pos.x < 0) {
					//this.pos.x = 0;
				}else if (this.pos.x > engine.settings.currentGame.canvas.width) {
					//this.pos.x = engine.settings.currentGame.canvas.width;
				}
				if (this.pos.y < 0) {
					//this.pos.y = 0;
				}else if (this.pos.y > engine.settings.currentGame.canvas.height) {
					//this.pos.y = engine.settings.currentGame.canvas.height;
				}
				
				
				//update bullets
				for(var i in this.bullets) {
					var b = this.bullets[i];
					if (b.pos.x > 0 || b.pos.x < engine.settings.currentGame.canvas.width || b.pos.y > 0 || b.pos.y < engine.settings.currentGame.canvas.height) {
						b.update(dt);
					}
				}
				//delete bullets
				for(i in this.bullets) {
					var b = this.bullets[i];
					if (b.pos.x > 0 || b.pos.x < engine.settings.currentGame.canvas.width || b.pos.y > 0 || b.pos.y < engine.settings.currentGame.canvas.height) {
						this.bullets.splice[i];
					}
				}
				
				
				
				//shoot
				if (engine.settings.currentGame.input.mouse[1] && engine.settings.currentGame.time_now - this.lastShot > this.shootTimer) {
					this.shooting = true;
					this.shoot();
					//push backwards
					var shootForce = new engine.Vector(this.direction.x, this.direction.y);
					shootForce.invert();
					shootForce.mult(3);
					shootForce.add(new engine.Vector(-1 + Math.random()*2, -1 + Math.random()*2));
					this.acceleration.add(shootForce);
					
					//whenever we shoot, we want to move backwards a littlebit
					this.lastShot = engine.settings.currentGame.time_now;
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

				if (engine.settings.currentGame.input.keys['w']) {
					this.moving = true;
					this.acceleration.y -= this.speed;
				}
				if (engine.settings.currentGame.input.keys['s']) {
					this.moving = true;
					this.acceleration.y += this.speed;
				}
				if (engine.settings.currentGame.input.keys['a']) {
					this.moving = true;
					this.acceleration.x -= this.speed;
				}
				if (engine.settings.currentGame.input.keys['d']) {
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
				this._super(g);

				g.globalAlpha = 1;

				var i;
				for(i in this.bullets) {
					this.bullets[i].render(g);
				}
				
				
				
				/*
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
				*/
				
				
				var rotationCtx = engine.settings.currentGame.rotationCtx;
				rotationCtx.save();

				rotationCtx.translate( this.absolutePos.x, this.absolutePos.y);
				var angle = 135 - this.angle;
				rotationCtx.rotate( angle );
				rotationCtx.drawImage( this.sprite, -24, -24, 48, 48);

				rotationCtx.restore();
				
				g.drawImage(engine.settings.currentGame.rotationCanvas, 0, 0);

			},
			
			shoot: function() {
				var self = this;
				//play turret_01
				var instance = engine.sound.get('player_turret_01');
				instance.setVolume(0.4);
				instance.play();

				//spawn a new bullet at the player
				var bullet = {
					pos: new engine.Vector(),
					absolutePos: new engine.Vector(),
					velocity: new engine.Vector(),
					direction: new engine.Vector(),
					acceleration: new engine.Vector(),
					maxSpeed: 5,
					update: function(dt) {
						this.absolutePos.x = this.pos.x - engine.settings.currentGame.scene.camera.pos.x;
						this.absolutePos.y = this.pos.y - engine.settings.currentGame.scene.camera.pos.y;
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
						g.globalAlpha = 1;
						g.beginPath();
						g.moveTo(this.absolutePos.x,this.absolutePos.y);
						g.lineTo(this.absolutePos.x+ this.direction.x*15,this.absolutePos.y+this.direction.y*15);
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
				
				this.bullets.push(bullet);
			},
			
			die: function() {
				
			},
		});
		
	});