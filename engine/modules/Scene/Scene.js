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
				this.camera = new engine.Scene.Camera(0, 0, engine.settings.currentGame.canvas.width, engine.settings.currentGame.canvas.height);
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

				//update camera
				this.camera.update();

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
				if (this.debug  === true || force === true) {

					var gridOffsetX = Math.abs(this.camera.pos.x) % this.gridSize,
						gridOffsetY = Math.abs(this.camera.pos.y) % this.gridSize,
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

					if (this.camera.pos.x < 0) {
						gridOffsetX = 0 - Math.abs(gridOffsetX);
					}
					
					if (this.camera.pos.y < 0) {
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
			init: function(x, y, width, height) {
				this.event = new engine.Event();

				this.width = width;
				this.height = height;
				this.pos = new engine.Vector();
				this.acceleration = new engine.Vector();
				this.velocity = new engine.Vector();
				this.maxSpeed = 3;
				this.zoomLevel = 1.0;
			},
			zoomIn: function(zoom) {
				this.zoomLevel += 1;
				engine.settings.currentGame.ctx.scale(1.1, 1.1);
				engine.settings.currentGame.bufferCtx.scale(1.1, 1.1);
				engine.settings.currentGame.rotationCtx.scale(1.1, 1.1);
			},
			zoomOut: function() {
				if (this.zoomLevel > 1.0) {
					this.zoomLevel -= 1;
					engine.settings.currentGame.ctx.scale(0.9, 0.9);
					engine.settings.currentGame.bufferCtx.scale(0.9, 0.9);
					engine.settings.currentGame.rotationCtx.scale(0.9, 0.9);
				}
			},
			getArea: function() {
				return {
					left: this.pos.x,
					right: this.pos.x + this.width,
					top: this.pos.y,
					bottom: this.pos.y + this.height,
					centerX: this.pos.x + (this.width/2),
					centerY: this.pos.y + (this.height/2),
				};
			},
			update: function() {
				engine.settings.currentGame.console.debug('Camera Zoom', this.zoomLevel);
				engine.settings.currentGame.console.debug('Camera acceleration', this.acceleration.toString());
				this.event.trigger('update_pre');
				/////////////////////////////////

				this.velocity.reset();

				this.event.trigger('update');

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

				//limit acceleration, both positive and negative
				this.acceleration.limit(this.maxSpeed);
				this.acceleration.limit(0 - Math.abs(this.maxSpeed));

				this.velocity.add(this.acceleration);

				this.pos.add(this.velocity);

				/////////////////////////////////
				this.event.trigger('update_post');
			},
		});



	});