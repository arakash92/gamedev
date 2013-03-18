engine.registerModule('mainMenu', '0.1.0')
	.depends('Scene')
	.defines(function() {

		engine.mainMenu = engine.Scene.extend({
			init: function(game) {
				this._super(game);
				var self = this;
				
			},

			stage: function() {
				this.game.wrapper.append('<div style="display: none;" class="gui gui-mainmenu"/>');
				this.gui = this.game.wrapper.find('.gui-mainmenu');
				this.music = engine.sound.get('music_roaming', 'music');
			},

			unstage: function() {
				var self = this;
				//slowly fade out background music over 2 seconds

				var currentVolume = this.music.getVolume();

				var startFadeout = (new Date()).getTime();

				var interval = setInterval(function() {
					
					if ((new Date()).getTime() - startFadeout > 2000) {
						clearInterval(interval);
					}

				}, 1000/10);
			},
		});
		
	});