engine.registerModule('Crosshair', '0.1.0')
	.depends('Entity')
	.defines(function() {

		engine.Component.Crosshair = engine.Entity.extend({
			init: function(game, name, x, y) {
				this._super(game, name, x, y);
				this.options = {
					color: '#FFFFFF',
					colorActive: '#3366FF'
					radius: 10,
					radiusActive: 13,
					speed: 0.02,
					speedActive: 0.2,
				};
			},
			update: function(dt) {
				
			},
			render: function(dt) {
				
			},
		});

	});