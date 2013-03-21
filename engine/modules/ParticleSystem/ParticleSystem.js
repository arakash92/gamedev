engine.registerModule('ParticleSystem', '0.1.0')
	//.depends('Component')
	.defines(function() {
		
		/*------------------------------
		 * Component
		 *------------------------------*/
		engine.components.ParticleSystem = engine.Component.extend({
			
			/*------------------------------
			 * Particle Class
			 *------------------------------*/
			Particle: Class.extend({
				init: function(x, y) {
					if (x === undefined) x = 0;
					if (y === undefined) y = 0;

					//movement
					this.pos = new engine.Vector(x, y);
					this.absolutePos = new engine.Vector(0,0);
					this.velocity = new engine.Vector();
					this.acceleration = new engine.Vector();
					this.decceleration = 0.01;

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
						g.globalAlpha = this.alpha;
						g.fillStyle = 'white';
						g.fillRect(this.absolutePos.x + this.pos.x, this.absolutePos.y + this.pos.y, 2, 2);
					}
				},
			}),

			/*------------------------------
			 * Constructor
			 *------------------------------*/
			init: function(name, x, y, options) {
				this._super(name, x, y);
				
				this.particles = [];
				this.particlesAlive = 0;

				this.birthCycle = 0;

				this.options = {
					maxParticles: 500,
					longevity: 2000,
					birthRate: 1,
					color: 'random',//can be a color value or simply 'random'
					direction: 'random',//random,vertical,horizontal,left,right,up,down
					directionDegree: 15,//randomness in direction in degrees
					velocity: 2,//initial particle velocity
					fadeout: true,//whether particles will fade out when dying
				};

				//pre allocate particles
				var i;
				for(i = 0; i < this.options.maxParticles; i++) {
					this.particles.push(new this.Particle());
				}
			},

			hexValues: ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'],

			getRandomColor: function() {
				var color = '#';
				for(var i = 0; i < 6;i++) {
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
						p.pos.x = this.pos.x;
						p.pos.y = this.pos.y;
						p.alive = true;
						p.born = (new Date()).getTime();
						p.longevity = this.options.longevity;
						p.absolutePos = this.absolutePos;

						//color
						if (this.options.color == 'random') {
							//p.color = this.getRandomColor();
							p.color = 'red';
						}

						//alpha
						p.alpha = 1.0;

						//fadeout
						p.fadeout = this.options.fadeout;

						p.acceleration.x = Math.randomBetween(-3,3);
						p.acceleration.y = Math.randomBetween(-3,3);

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
		
	});