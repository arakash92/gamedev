engine.registerModule('ParticleSystem', '0.1.0')
	.depends('Component')
	.defines(function() {
		
		/*------------------------------
		 * Component
		 *------------------------------*/
		engine.components.ParticleSystem = engine.Component.extend({
			/*------------------------------
			 * Constructor
			 *------------------------------*/
			init: function(x, y, options) {
				this._super(x, y);
				
				this.particles = [];
				this.particlesAlive = 0;

				this.birthCycle = 0;

				this.options = {
					maxParticles: 500,
					gravity: new engine.Vector(),
					longevity: 3000,
					birthRate: 1,
					color: 'random',//can be a color value or simply 'random'
					direction: 'random',//random,vertical,horizontal,left,right,up,down
					directionDegree: 45,//randomness in direction in degrees
					velocity: 2,//initial particle velocity
					fadeout: true,//whether particles will fade out when dying
					width: 1,
					height: 1,
				};

				//set options
				var i;
				for(i in options) {
					this.options[i] = options[i];
				}

				//pre allocate particles
				for(i = 0; i < this.options.maxParticles; i++) {
					this.particles.push((new engine.components.ParticleSystem.Particle()));
				}
			},

			hexValues: ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'],

			getRandomColor: function() {
				var color = '#';
				for(var i = 0; i < 3;i++) {
					color += this.hexValues[Math.randomBetween(0, this.hexValues.length)]
				}
				return color;
			},

			spawn: function(count) {
				var i,p,counter = 0;
				for(i in this.particles) {
					
					p = this.particles[i];
					if (p.alive === false && counter < count) {
						//rescurrect
						p.pos.x = this.entity.pos.x;
						p.pos.y = this.entity.pos.x;
						p.pos.add(this.pos);
						p.alive = true;
						p.born = (new Date()).getTime();
						p.longevity = this.options.longevity;
						

						//size
						p.size.x = this.options.width;
						p.size.y = this.options.height;

						//color
						if (this.options.color == 'random') {
							//p.color = this.getRandomColor();
							p.color = 'red';
						}else {
							p.color = this.options.color;
						}

						//alpha
						p.alpha = 1.0;

						//fadeout
						p.fadeout = this.options.fadeout;

						//set the direction
						var direction = new engine.Vector();
						switch(this.options.direction) {
							case 'random':
								direction.x = Math.randomBetween(-1,1);
								direction.y = Math.randomBetween(-1,1);
								direction.normalize();
							break;
							case 'left':
								direction.x = -1
								direction.y = 0;
								direction.normalize();
								direction.rotate(Math.degToRad(Math.randomBetween(0-Math.abs(this.options.directionDegree), Math.abs(this.options.directionDegree))));
							break;
							case 'right':
								direction.x = 1
								direction.y = 0;
								direction.normalize();
								direction.rotate(Math.degToRad(Math.randomBetween(0-Math.abs(this.options.directionDegree), Math.abs(this.options.directionDegree))));
							break;
							case 'up':
								direction.x = 0
								direction.y = -1;
								direction.normalize();
								direction.rotate(Math.degToRad(Math.randomBetween(0-Math.abs(this.options.directionDegree), Math.abs(this.options.directionDegree))));
							break;
							case 'down':
								direction.x = 0
								direction.y = 1;
								direction.normalize();
								direction.rotate(Math.degToRad(Math.randomBetween(0-Math.abs(this.options.directionDegree), Math.abs(this.options.directionDegree))));
							break;
						}

						direction.mult(this.options.velocity);
						//multiply by velocity
						
						//set accel
						p.acceleration.x = direction.x;
						p.acceleration.y = direction.y;

						//set decceleration
						p.decceleration = this.options.velocity / 500;

						counter++;
					}
					if (counter >= count) {
						return true;
					}
				}
			},

			update: function(dt) {
				//super update
				this._super(dt);

				engine.settings.currentGame.console.debug(this.name +' absPos', this.absolutePos.toString());

				//increment birthCycle
				this.birthCycle += this.options.birthRate * dt;

				//spawn new particles
				if (this.birthCycle >= 1) {
					this.spawn(Math.round(this.birthCycle));
					this.birthCycle = 0;
				}

				//update particles
				var i,p;
				for(i in this.particles) {
					p = this.particles[i];
					p.acceleration.add(this.options.gravity);
					p.update(dt);
				}
			},

			render: function(g) {
				this._super(g);

				var i,p;
				for(i in this.particles) {
					p = this.particles[i];
					if (p.alive) {
						p.render(g);
					}
				}
			},
		});
		
		/*------------------------------
			 * Particle Class
			 *------------------------------*/
		engine.components.ParticleSystem.Particle = Class.extend({
			init: function(x, y) {
				if (x === undefined) x = 0;
				if (y === undefined) y = 0;

				//movement
				this.pos = new engine.Vector(x, y);
				this.absolutePos = new engine.Vector(0,0);
				this.velocity = new engine.Vector();
				this.acceleration = new engine.Vector();
				this.decceleration = 0.001;

				this.size = new engine.Vector(1,1);
				this.alpha = 1;
				this.color = 'white';
				this.shape = 'rect';
				this.fadeout = true;

				this.alive = false;
				this.born = (new Date()).getTime();
				this.longevity = 5000;
			},

			update: function(dt) {
				//set alive
				if ((new Date()).getTime() - this.born > this.longevity) {
					this.alive = false;
				}
				if (this.alive) {
					//reset velocity
					this.velocity.reset();

					//fadeout
					//this.alpha -= (engine.settings.currentGame.frame_time) / this.longevity;
					this.alpha -= (engine.settings.currentGame.frame_time) / this.longevity * dt;
					if (this.alpha < 0) {
						this.alpha = 0;
					}

					//deccelerate
					this.acceleration.decrease(this.decceleration);

					//set velocity
					this.velocity.add(this.acceleration);

					//move it by the velocity, multiplied by deltatime
					this.pos.add(this.velocity.mult(dt));
					//undo deltatime
					this.velocity.div(dt);
				}
			},
			render: function(g) {
				if (this.alive) {
					this.absolutePos.x = this.pos.x;
					this.absolutePos.y = this.pos.y;
					this.absolutePos.sub(engine.settings.currentGame.scene.camera.pos);

					g.globalAlpha = this.alpha;
					g.fillStyle = this.color;
					g.fillRect(this.absolutePos.x, this.absolutePos.y, this.size.x, this.size.y);
				}
			},
		});
	});