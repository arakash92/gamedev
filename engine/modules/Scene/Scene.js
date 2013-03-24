engine.registerModule('Scene', '0.1.0')
	.defines(function() {
		engine.Scene = Class.extend({
			init: function(name) {
				this.name = name;
				this.layers = [];
				this.effect = null;
				this.displayGrid = true;
				this.gridSize = 64;
				this.gridAlpha = 0.3;
				this.gridColor = 'white';
				this.gridWidth = 1;
				this.event = new engine.Event();
				this.camera = new engine.Scene.Camera(0, 0, engine.settings.currentGame.canvas.width, engine.settings.currentGame.canvas.height);
				this.collisionCache = [];
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
				//empty the collisionCache
				this.collisionCache = [];

				this.event.trigger('update', dt);

				//update camera
				this.camera.update(dt);

				//update layers
				var i,layer;
				for (i in this.layers) {
					layer = this.layers[i];
					if (layer.visible === true) {
						layer.update(dt);
					}
				}
			},
			add: function(layer, entity) {
				if (this.layers[layer] === undefined) {
					this.layers[layer] = new engine.Scene.Layer(layer);
				}
				this.layers[layer].entities.push(entity);
			},
			find: function() {

			},
			drawGrid: function(g, force) {
				if (this.displayGrid  === true || force === true) {

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
					if (layer.visible === true) {
						layer.render(g);
					}
				}
				
				//draw grid, if in editor
				if (engine.settings.isEditor === true) this.drawGrid(g);

				//render effects layer
				if (this.effect !== null) {
					this.effect.render(g);
				}
			},
		});

		engine.Scene.Layer = Class.extend({
			init: function(name) {
				this.visible = true;
				this.isCollision = false;
				this.entities = [];

				if (typeof name == 'string') {
					this.name = name;
				}else {
					this.name = 'unnamed layer';
				}
			},
			update: function(dt) {
				if (this.visible) {
					var i,e;
					for(i in this.entities) {
						e = this.entities[i];
						e.update(dt);
					}
				}
			},
			render: function(g) {
				if (this.visible) {
					var i,e,eArea,area = engine.settings.currentGame.scene.camera.getArea();
					for(i in this.entities) {
						e = this.entities[i];
						eArea = e.getArea();
						if (eArea.right > area.left &&
							eArea.left < area.right &&
							eArea.bottom > area.top &&
							eArea.top < area.bottom) {
							e.render(g);
						}
					}
				}
			},
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
				this.zoomLevel = 1;

				this.panningEnabled = false;
				this.panning = false;
				this.panningStart = new engine.Vector();
			},
			zoomIn: function() {
				this.zoomLevel += 1;
				engine.settings.currentGame.ctx.scale(1.1, 1.1);
				engine.settings.currentGame.bufferCtx.scale(1.1, 1.1);
				engine.settings.currentGame.rotationCtx.scale(1.1, 1.1);
			},
			zoomOut: function() {
				if (this.zoomLevel > 1) {
					this.zoomLevel -= 1;
					var zoom = 1/(1*1.1);
					engine.settings.currentGame.ctx.scale(zoom, zoom);
					engine.settings.currentGame.bufferCtx.scale(zoom, zoom);
					engine.settings.currentGame.rotationCtx.scale(zoom, zoom);
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
			processPanning: function(dt) {
				if (engine.settings.currentGame.input.mouse['2'] || engine.settings.currentGame.input.keys['space']) {
					if (this.panning === true) {
						//continue drag
						//has the mouse moved?
						if (engine.settings.currentGame.input.mouse.pos.x !== this.panningStart.x || engine.settings.currentGame.input.mouse.pos.y !== this.panningStart.y) {
							this.pos.x = this.panningStart.x - engine.settings.currentGame.input.mouse.pos.x;
							this.pos.y = this.panningStart.y - engine.settings.currentGame.input.mouse.pos.y;
						}
					}else {
						//start this.panning
						this.panning = true;
						this.panningStart.x = this.pos.x + engine.settings.currentGame.input.mouse.pos.x;
						this.panningStart.y = this.pos.y + engine.settings.currentGame.input.mouse.pos.y;
					}
				}else if (this.panning === true) {
					//this.panning stopped
					this.panning = false;
				}
			},
			update: function(dt) {

				//panning
				if (this.panningEnabled === true) {
					this.processPanning(dt);
				}

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
				
				this.pos.add(this.velocity.clone().mult(dt));

				/////////////////////////////////
				this.event.trigger('update_post');
			},
		});



	});