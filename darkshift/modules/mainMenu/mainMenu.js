engine.registerModule('mainMenu', '0.1.0')
	.depends('Scene')
	.defines(function() {

		engine.mainMenu = engine.Scene.extend({
			init: function(game) {
				this._super(game);
				var self = this;
				$(".gui-settings .music-volume .slider").slider({
					value: 0.3,
					step: 0.1,
					min: 0.0,
					max: 1.0,
					orientation: 'vertical',
					change: function() {
						self.game.setVolume(1.0 - $(this).slider('option', 'value'));
						console.log('changed value to ' + self.game.sound.volume);
					},
				});
			},

			stage: function() {
				this.game.wrapper.append('<div style="display: none;" class="gui gui-mainmenu"/>');
				this.gui = this.game.wrapper.find('.gui-mainmenu');
				this.music = engine.sound.get('music_roaming');
				this.music.setVolume(0.5);
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