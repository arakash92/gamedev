engine.registerModule('SocketIO', '0.1.0')
	.defines(function() {

		//change the scene module to run a network update 12 times per sec
		var oldScene = engine.Scene;

		engine.Scene = oldScene.extend({
			init: function() {
				this._super();
				this.network_lastUpdate = (new Date()).getTime();
				this.network_tick = 1000/12;
			},
			update: function(dt) {
				this._super();
				var now = (new Date()).getTime();
				if (now - this.lastUpdate > this.network_tick) {
					this.network_delta = now / this.network_tick;
					this.network_lastUpdate = now;
				}
			},
		});
	});