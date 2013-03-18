engine.registerModule('World', '0.1.0')
	.depends('Scene')
	.defines(function() {

		engine.World = engine.Scene.extend({
			init: function() {
				this._super();
			},	
		});

		engine.World.Camera = engine.Vector.extend({

		});

	});