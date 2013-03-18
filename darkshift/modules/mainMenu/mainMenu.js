engine.registerModule('mainMenu', '0.1.0')
	.depends('Scene')
	.defines(function() {

		engine.mainMenu = engine.Scene.extend({
			init: function(game) {
				this._super(game);

				//get gui
				this.gui = this.game.wrapper.find('.gui-mainmenu');
			},

			stage: function() {
				var self = this;

				//start music
				this.music = engine.sound.get('music_roaming', 'music');
				
				//start button
				self.gui.find('.game-toggle-start').click(function() {

					$(this).attr('disabled', 'disabled');
				});
			},

			unstage: function() {
				var self = this;
				//slowly fade out background music over 2 seconds
			},
		});
		
	});