engine.registerModule('Crosshair', '0.1.0')
	.depends('Entity')
	.defines(function() {

		engine.components.Crosshair = engine.Component.extend({
			init: function(name, x, y) {
				this._super(name, x, y);
				this.options = {
					color: '#FFFFFF',
					colorActive: '#3366FF',
					radius: 10,
					radiusActive: 13,
					speed: 0.02,
					speedActive: 0.2,
				};
				this.arc1 = {
					start: 1.2,
					end: 1.8,
				};
				this.arc2 = {
					start: 0.2,
					end: 0.8,
				};
			},
			update: function(dt) {
				//this._super(dt);

				this.pos.x = engine.settings.currentGame.input.mouse.pos.x;
				this.pos.y = engine.settings.currentGame.input.mouse.pos.y;
				
				if (this.entity.shooting) {
					this.options.speed = 0.1;
					this.options.radius = 14;
				}else {
					this.radius = 10;
				}

				this.options.speed -= 0.01;
				
				if (this.options.speed < 0.02) {
					this.options.speed = 0.02;
				}
				
				this.arc1.start += this.options.speed;
				this.arc1.end += this.options.speed;
				
				if (this.arc1.end > 2) {
					this.arc1.end -= 2.0;
				}
				if (this.arc1.start > 2) {
					this.arc1.start -= 2.0;
				}
				
				this.arc2.start += this.options.speed;
				this.arc2.end += this.options.speed;
				
				if (this.arc2.end > 2) {
					this.arc2.end -= 2.0;
				}
				if (this.arc2.start > 2) {
					this.arc2.start -= 2.0;
				}
			},
			render: function(g) {
				//this._super(g);

				g.globalAlpha = 1;
				if (this.entity.shooting) {
					g.lineWidth = 2;
					g.strokeStyle = this.options.colorActive;
					g.fillStyle = this.options.colorActive;
				}else {
					g.lineWidth = 1;
					g.strokeStyle = this.options.color;
					g.fillStyle = this.options.color;
				}
				
				g.beginPath();
				g.arc(this.pos.x, this.pos.y, this.options.radius, this.arc1.start * Math.PI, this.arc1.end * Math.PI);
				g.stroke();
				
				if (this.entity.shooting) {
					g.beginPath();
					g.arc(this.pos.x, this.pos.y, 4, 0 * Math.PI, 1.9 * Math.PI);
					g.fill();
				}
				
				g.beginPath();
				g.arc(this.pos.x, this.pos.y, this.options.radius, this.arc2.start * Math.PI, this.arc2.end * Math.PI);
				g.stroke();
			},
		});

	});


/*
var cursor = new engine.Entity(game, 'Cursor');
cursor.arc1 = {
	start: 1.2,
	end: 1.8,
};
cursor.arc2 = {
	start: 0.2,
	end: 0.8,
};
cursor.speed = 0.02;
cursor.radius = 10;
cursor.update = function(dt) {
	this.pos.x = this.game.input.mouse.pos.x;
	this.pos.y = this.game.input.mouse.pos.y;                        
	
	if (player.shooting) {
		this.speed = 0.1;
		this.radius = 14;
	}else {
		this.radius = 10;
	}
	
	this.speed -= 0.01;
	
	if (this.speed < 0.02) {
		this.speed = 0.02;
	}
	
	this.arc1.start += this.speed;
	this.arc1.end += this.speed;
	
	if (this.arc1.end > 2) {
		this.arc1.end -= 2.0;
	}
	if (this.arc1.start > 2) {
		this.arc1.start -= 2.0;
	}
	
	this.arc2.start += this.speed;
	this.arc2.end += this.speed;
	
	if (this.arc2.end > 2) {
		this.arc2.end -= 2.0;
	}
	if (this.arc2.start > 2) {
		this.arc2.start -= 2.0;
	}
};
cursor.render = function(g) {
	if (player.shooting) {
		g.lineWidth = 2;
		g.strokeStyle = '#5588FF';
		g.fillStyle = '#5588FF';
	}else {
		g.lineWidth = 1;
		g.strokeStyle = 'white';
	}
	
	g.beginPath();
	g.arc(this.pos.x, this.pos.y, this.radius, this.arc1.start * Math.PI, this.arc1.end * Math.PI);
	g.stroke();
	
	if (player.shooting) {
		g.beginPath();
		g.arc(this.pos.x, this.pos.y, 4, 0 * Math.PI, 1.9 * Math.PI);
		g.fill();
	}
	
	g.beginPath();
	g.arc(this.pos.x, this.pos.y, this.radius, this.arc2.start * Math.PI, this.arc2.end * Math.PI);
	g.stroke();
};*/