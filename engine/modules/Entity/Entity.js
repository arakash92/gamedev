engine.registerModule('Entity', '0.1.0')
	.defines(function() {
		engine.Entity = Class.extend({
			init: function(x, y, width, height) {
				engine.settings.currentGame.console.log('Entity created', true);

				//active & visible
				this.active = true;
				this.visible = true;

				this.debug = false;
				this.pos = new engine.Vector();
				this.size = new engine.Vector(10,10);
				this.offset = new engine.Vector();
				this.absolutePos = new engine.Vector();
				this.acceleration = new engine.Vector();
				this.velocity = new engine.Vector();

				this.event = new engine.Event();

				if (x !== undefined) {
					this.pos.x = x;
				}
				if (y !== undefined) {
					this.pos.y = y;
				}
				if (width !== undefined) {
					this.size.x = width;
				}
				if (height !== undefined) {
					this.size.y = height;
				}
			},
			getArea: function() {
				var left = Math.abs(this.pos.x - (this.size.x/2)) + this.offset.x;
				var right = Math.abs(left + this.size.x) + this.offset.x;
				var top = Math.abs(this.pos.y - this.size.y) + this.offset.y;
				var bottom = Math.abs(top + this.size.y) + this.offset.y;
				return {
					left: left,
					right: right,
					top: top,
					bottom: bottom,
					centerX: Math.abs(this.pos.x),
					centerY: Math.abs(this.pos.y),
				}
			},
			applyForce: function(force) {
				
			},
			
			update: function(dt) {
				this.velocity.reset();
				this.event.trigger('update_pre', dt);

				this.absolutePos.x = this.pos.x;
				this.absolutePos.y = this.pos.y;
				this.absolutePos.sub(engine.settings.currentGame.scene.camera.pos);

				this.event.trigger('update_post');
				this.pos.add(this.velocity);
			},
			updateEditor: function(dt) {
				
			},
			
			renderDebug: function(g, force) {
				if (this.debug === true || force === true) {
					g.fillStyle = 'white';
					g.globalAlpha = 1;
					g.fillRect(this.absolutePos.x - (this.size.x/2), this.absolutePos.y - (this.size.y-2), this.size.x, this.size.y);
				}
			},
			
			render: function(g) {
				this.renderDebug(g);
			},
			renderEditor: function(g) {

			},
		});
	});