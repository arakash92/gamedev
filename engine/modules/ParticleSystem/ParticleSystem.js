engine.registerModule('ParticleSystem', '0.1.0')
	.depends('Component')
	.defines(function() {
		
		engine.Component.ParticleSystem = engine.Component.extend({
			init: function(name, options) {
				this._super(name);
				this.frozen = false;
				this.particles = [];
				this.birthCycle = [];
				this.particlesAlive = 0;
				this.options = {
					maxParticles: 200,
					birthRate: 6,
					particleShape: 'rect',
					particleSprite: null,
					particleColor: '#FF3344',
					particleSizeMin: 2,
					particleSizeMax: 5,
				};
				if (typeof options == 'object') {
					var i;
					for (i in options) {
						this.options[i] = options[i];
					}
				}
			},
			
			//Spawn a new particle
			spawn: function(count) {
				engine.settings.currentGame.console.log('Spawning ' + count +' particles.');
			},
			update: function(dt) {
				//increment birthCycle
				this.birthCycle+= 1 / this.options.birthRate;
				
				//spawn particles
				if (this.birthCycle >= 1) {
					this.spawn(Math.round(this.birthCycle));
					this.birthCycle = 0;
				}

				//
			},
			render: function(g) {
				
				//render all particles
				var i,p;
				for(i in this.particles) {
					p = this.particles[i];
				}
			},
		});
		
		
		
		//particle Class
		engine.Component.ParticleSystem.Particle = Class.extend({
			pos: new engine.Vector(),
			color: null,
			shape: 'rect',
			
			init: function(x, y) {
				this.pos.x = x;
				this.pos.y = y;
			},
		});
		
	});