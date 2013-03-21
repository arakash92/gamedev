engine.registerModule('Character', '0.1.0')
	//.depends('Entity')
	.defines(function() {

		engine.Character = engine.Entity.extend({
			init: function(name, x, y) {
				this._super(x,y);
				this.name = name;
				this.health = 100;
				this.powerType = 'rage';
				this.mana = null;
				this.rage = null;
				this.energy = null;
				
				this.inventory = [];
				
				this.leftHand = null;
				this.rightHand = null;
			},
			update: function(dt) {

			},
			renderName: function(g) {
				g.globalAlpha = 0.7;
				g.fillStyle = 'white';
				g.fillText(this.name, this.pos.x, this.pos.y);
			},
			render: function(g) {

			},
		});

	});