engine.registerModule('Tile')
	.depends('Spritesheet')
	.defines(function() {

		engine.Tile = Class.extend({
			init: function(sprite, x, y, width, height) {
				this.sprite = sprite;
				this.visible = true;
				this.isCollision = false;
				this.pos = new engine.Vector(x,y);
				this.absPos = new engine.Vector(0,0);
				this.width = width;
				this.height = height;
			},
			getArea: function() {
				var a = {
					left: this.pos.x,
					right: this.pos.x + this.width,
					top: this.pos.y,
					bottom: this.pos.y + this.height,
					centerX: this.pos.x + (this.width/2),
					centerY: this.pos.y + (this.height/2),
				};
				for(var i in a) {
					a[i] = Math.abs(a[i]);
				}
				return a;
			},
			update: function(dt) {
				//add to area
				if (this.isCollision) {
					engine.settings.currentGame.scene.collisionCache.push(this.getArea());
				}

				//update sprite
				if (this.sprite.hasOwnProperty('update')) {
					this.sprite.update(dt);
				}
			},
			render: function(g) {
				//set absPos
				this.absPos.x = this.pos.x;
				this.absPos.y = this.pos.y;
				this.absPos.sub(engine.settings.currentGame.scene.camera.pos);
				if (this.visible) {
					this.sprite.render(g, Math.round(this.absPos.x), Math.round(this.absPos.y), this.width, this.height);
				}
			},
		});

	});