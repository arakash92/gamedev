engine.registerModule('Character')
	.depends('Entity')
	.defines(function() {

		engine.entities['Character'] = engine.Entity.extend({
			init: function(name, x, y, width, height) {
				//constructor
				this._super(x, y, width, height);
				if (typeof name === 'string') {
					this.name = name;
				}else {
					this.name = 'unnamed player';
					alert('Character expects parameter 1 (name) to be of type string');
				}
			},
			render: function(g) {
				g.globalAlpha = 1;
				g.fillText(this.name);
			},
		});

	});