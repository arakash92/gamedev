engine.registerModule('SpriteAnim', '0.1.0')
	.depends('Spritesheet,Component')
	.defines(function() {

		engine.components.SpriteAnim = engine.Component.extend({
			init: function(x, y, speed, sprites, animation, pingPong, width, height) {
				this._super(x,y);
				if (width === undefined) {
					width = 32;
					height = 32;
				}
				this.size.x = width;
				this.size.y = height;
				this.sprites = sprites;
				this.speed = speed;
				this.animation = animation;
				this.pingPong = (pingPong !== undefined) ? pingPong : false;
				this.position = 0;
				this.backwards = false;
				this.lastUpdate = (new Date()).getTime();
			},
			update: function(dt) {

				//parent update
				this._super(dt);
				
				//is this an animation?
				if (this.animation.length > 0) {
					if (engine.settings.currentGame.time_now - this.lastUpdate > this.speed) {
						this.lastUpdate = engine.settings.currentGame.time_now;
						
						if (this.backwards === true && this.position > 0) {
							//move backwards
							this.position--;
						}else if (this.position < this.animation.length-1) {
							//move forward
							this.position++;
						}else if (this.pingPong === true) {
							//start moving backwards
							this.backwards = true;
							this.position--;
						}else {
							//start over at 0
							this.position = 0;
						}
					}
				}
			},
			render: function(g) {
				this.sprites[this.position].render(g, this.absolutePos.x, this.absolutePos.y-(this.size.y/2), this.size.x, this.size.y);
			},
		});

	});