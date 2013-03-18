engine.registerModule('Scene', '0.1.0')
	.defines(function() {
		
		
		engine.Scene = Class.extend({
			init: function() {
				this.layers = [];
				this.effect = null;
				this.debug = true;
				this.gridSize = 48;
				this.gridAlpha = 0.3;
				this.gridColor = 'white';
				this.gridWidth = 1;
				this.event = new engine.Event();
				this.camera = new engine.Camera();
			},
			unstage: function() {
				this.event.trigger('unstage');
			},
			stage: function() {
				this.event.trigger('stage');
			},
			hide: function(effect, options) {
				if (engine.Scene.Effect[effect] !== undefined) {
					this.effect = new engine.Scene.Effect[effect](this, 'hide', options);
				}
			},
			update: function(dt) {
				this.event.trigger('update', dt);
				//update layers
				var i,layer;
				for (i in this.layers) {
					layer = this.layers[i];
					for(i in layer) {
						layer[i].update(dt);
					}
				}
				
				//update effects layer
				if (this.effect !== null) {
					this.effect.update(dt);
				}
			},
			drawGrid: function(g, force) {
				engine.settings.currentGame.console.debug('Camera', this.camera.x +', ' + this.camera.y);
				if (this.debug  === true || force === true) {

					var gridOffsetX = Math.abs(this.camera.x) % this.gridSize,
						gridOffsetY = Math.abs(this.camera.y) % this.gridSize,
						gridSize = this.gridSize,
						x,
						y,
						gridX = engine.settings.currentGame.canvas.width / gridSize,
						gridY = engine.settings.currentGame.canvas.height / gridSize;

					gridOffsetX = gridSize - gridOffsetX;
					gridOffsetY = gridSize - gridOffsetY;

					g.strokeStyle = this.gridColor;
					g.lineWidth = this.gridWidth;
					g.globalAlpha = this.gridAlpha;
					g.beginPath();

					if (this.camera.x < 0) {
						gridOffsetX = 0 - Math.abs(gridOffsetX);
					}
					
					if (this.camera.y < 0) {
						gridOffsetY = 0 - Math.abs(gridOffsetY);
					}
					

					for(x=-1; x < gridX+1; x++) {
						for(y=-1; y < gridY+1; y++) {
							g.rect(gridOffsetX + (x*gridSize), gridOffsetY + (y*gridSize), gridSize, gridSize);
						}
					}
					g.stroke();
				}
			},
			render: function(g) {
				//update layers
				var i,layer;
				for (i in this.layers) {
					layer = this.layers[i];
					for(i in layer) {
						layer[i].render(g);
					}
				}
				
				//render effects layer
				if (this.effect !== null) {
					this.effect.render(g);
				}

				//render grid
				this.drawGrid(g);
			},
		});

		engine.Layer = Class.extend({
			name: 'New Layer',
			visible: true,
			active: true,
			init: function(name) {
				if (typeof name == 'string') {
					this.name = name;
				}
			},
			update: function(dt) {
				if (this.active) {
					var i,e;
					for(i in this.entities) {
						e = this.entities[i];
						if (e.active) {
							e.update(dt);
						}
					}
				}
			},
			render: function(g) {
				if (this.visible) {
					var i,e;
					for(i in this.entities) {
						e = this.entities[i];
						if (e.visible) {
							e.render(g);
						}
					}
				}
			}
		});

		engine.Scene.Camera = Class.extend({
			init: function(width, height) {
				this.pos = new engine.Vector();
				this.width = width;
				this.height = height;
				this.acceleration = new engine.Vector();
				this.maxSpeed = 0.5;
			},
			update: function() {
				this.velocity.reset();
				this.event.trigger('update_pre');



				this.event.trigger('update_post');
			},
		});

		engine.Camera = engine.Vector.extend({
			init: function(x, y, width, height) {
				this._super(x,y);
				this.width = width;
				this.height = height;
			}
		});


	});