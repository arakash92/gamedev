engine.registerModule('Component', '0.1.0')
	.depends('Entity')
	.defines(function() {
		
		if (engine.components === undefined) {
			engine.components = {};
		}

		var oldEntity = engine.Entity;
		
		engine.Entity = oldEntity.extend({
			init: function(x, y) {
				this._super(x, y);
				this.components = [];
			},
			attach: function(name, component) {
				if (component === undefined) {
					component = name;
					name = component.name;
					
					if (this.components[name] === undefined) {
						this.components[name] = component;
					}else {
						this.components.push(name);
					}
				}else {
					this.components[name] = component;
				}

				engine.settings.currentGame.console.log('Entity received new component: ' + name, true);

				component.attached(this);
			},
			detach: function(name, component) {
				if (typeof component === 'string') {
					return this.components.splice(name);
				}else {
					var i,c;
					for(i in this.components) {
						c = this.components[i];
					}
				}

				engine.settings.currentGame.console.log('Entity lost component: ' + name, true);
			},
			update: function(dt) {
				this._super(dt);
				var i,comp;
				for(i in this.components) {
					comp = this.components[i];
					if (comp.alive === true) {
						comp.update(dt);
					}
				}
			},
			render: function(g) {
				var i,comp;
				for(i in this.components) {
					comp = this.components[i];
					if (comp.alive === true) {
						comp.render(g);
					}
				}
				this._super(g);
			},
		});
		
		engine.Component = Class.extend({
			init: function(x, y) {
				this.debug = false;
				this.entity = null;
				this.alive = true;//whether it will be updated or not
				this.visible = true;//whether it is visible or not
				if (x === undefined) {
					x = 0;
				}
				if (y === undefined) {
					y = 0
				}
				this.pos = new engine.Vector(x,y);
				this.absolutePos = new engine.Vector(0,0);
				this.size = new engine.Vector(20,20);

				engine.settings.currentGame.console.log('Component ' + name +' created', true);
			},
			/*------------------------------
			 * Returns an object with the left, right, top, bottom and center positions
			 *------------------------------*/
			getAbsoluteArea: function() {
				var pos = this.absolutePos;
				if (pos !== null) {
					return {
						left: pos.x,
						right: pos.x + this.size.x,
						top: pos.y,
						bottom: pos.y + this.size.y,
						centerX: pos.x + (this.size.x/2),
						centerY: pos.y + (this.size.y/2),
					};
				}
				return null;
			},
			attached: function(entity) {
				this.entity = entity;
				engine.settings.currentGame.console.log('Component "' +this.name +'" notified of new parent entity', true);
			},
			dettached: function(entity) {
				this.entity = null;
				engine.settings.currentGame.console.log('Component "' +this.name +'" lost its parent entity', true);
			},
			update: function(dt) {
				this.absolutePos.x = this.entity.absolutePos.x + this.pos.x;
				this.absolutePos.y = this.entity.absolutePos.y + this.pos.y;
			},
			render: function(g) {
				this.renderDebug(g);
			},
			renderDebug: function(g, force) {
				if (this.debug === true || force === true) {
					g.fillStyle = 'white';
					g.globalAlpha = 1;
					g.strokeStyle = 'white';
					g.fillText(this.name, this.absolutePos.x, this.absolutePos.y);
				}
			},
		});
		
	});