engine.registerModule('puck')
	.depends('Entity')
	.defines(function() {

		project.entities.puck = engine.Entity.extend({
			render: function(g) {
				g.globalAlpha = 1;
				g.fillStyle = '#FF4444';
				g.fillRect(this.absolutePos.x, this.absolutePos.y, 10, 10);
			},
			renderEditor: function(g) {
				this.render(g);
			},
		});

	});