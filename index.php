<!DOCTYPE html>
<html>
<head>

	<title>Dev</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="apple-mobile-web-app-capable" content="yes" />

	<!--jquery & jquery ui-->
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/ui/1.10.1/jquery-ui.js"></script>

	<!-- jquery UI css -->
	<link rel="stylesheet" type="text/css" hreF="http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css">
	

	<!--bootsrap js-->
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>

	<!--bootstrap css-->
	<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">

	<!--create.js for sound-->
	<script type="text/javascript" src="http://code.createjs.com/createjs-2013.02.12.min.js"></script>
	
	<!--engine-->
	<script type="text/javascript" src="engine/engine.js"></script>
	<link rel="stylesheet" type="text/css" href="engine/engine.css">

	<style type="text/css">
		body {
			background: black;
		}
		.container-fluid {
			padding: 0;
		}
		.gui-settings {
			position: absolute;
			top: 0px;
			width: 100%;
			height: auto;
			background: rgba(255,255,255,0.3);
			border-bottom: 1px solid #777;
		}
		.gui-settings .music-volume, .gui-settings .sfx-volume {
			float: left;
			margin-right: 10px;
		}
		.gui-settings .slider {
			position: absolute;
		}


		/* Main Menu GUI */
		.gui-mainmenu {
			max-width: 240px;
			margin: 20% auto;
			background: rgba(50,50,50,0.5);
		}
		.gui-mainmenu .menu {
			width: 100%;
			height: 100%;
			border-radius: 4px;
			border: 1px solid #fff;
		}
		.gui-mainmenu .row-fluid .span12 {
			padding: 10px;
		}
		.gui-mainmenu .menu button {
			float: left;
			width: 100%;
			clear: both;
			margin: 4px 0px;
		}
	</style>
</head>
<body>
	
	<div id="game">
		<div class="gui">
			<div class="gui-settings">
				<div class="inner">
					<div style="display: none;" class="music-volume">
						<a title="Change music volume" class="btn-inverse btn-small toggle-music-slider"><i class="icon-white icon-music"></i></a>
						<div class="slider">
						</div>
					</div>
					<div style="display: none;" class="sfx-volume">
						<a title="Change sound effects volume" class="toggle-sfx-slider"><i class="icon-white icon-volume"></i></a>
						<div class="slider">
						</div>
					</div>
				</div>
			</div>

			<div class="gui-mainmenu">
				<div class="inner">
					<div class="container-fluid menu">
						<div class="row-fluid">
							<div class="span12">
								<button class="game-toggle-start btn-inline btn-inverse">Start Game</button>
								<button disabled="disabled" class="game-toggle-multiplayer btn-inline">Multiplayer</button>
								<button class="game-toggle-options btn-inline btn-inverse">Options</button>
								<button class="game-toggle-help btn-inline btn-inverse">Help</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="gui-hud" style="display: none;">
				<div class="top">

				</div>
				<div class="bottom">
					<div class="inner">
						<div class="left">

						</div>
						<div class="center">
							<div class="item health">
								200
							</div>
						</div>
						<div class="right">
							<div class="time">
							1:30:45
						</div>
					</div>
				</div>
			</div>
			<div class="gui-menu">

			</div>
		</div>
	</div>
	
	<script type="text/javascript">
	   	/*------------------------------
	   	 * First, setup engine and project URL's
	   	 *------------------------------*/
		engine.setup({
			'engineURL': 'http://84.212.5.59/gamedev/engine/',
			'projectURL': 'http://84.212.5.59/gamedev/darkshift/',
		});
		

		/*------------------------------
		 * Now we set the initial volume levels
		 *------------------------------*/
		engine.sound.setVolume('music', 0.4);
		engine.sound.setVolume('sfx', 0.8);
		

		/*------------------------------
		 * Set up volume mixer controls for music
		 *------------------------------*/
		$(".gui-settings .music-volume .toggle-music-slider").click(function() {
			var slider = $('.gui-settings .music-volume .slider');
			if(slider.hasClass('visible')) {
				//hide
				slider.slideUp().removeClass('visible')
			}else {
				//show
				slider.slideDown().addClass('visible');
			}
		});
		$(".gui-settings .music-volume .slider").slider({
			orientation: 'vertical',
			step: 0.1,
			value: 0.4,
			min: 0.0,
			max: 1.0,
			change: function() {
				engine.sound.setVolume($(this).slider('option', 'value'), 'music');
			},
		});


		/*------------------------------
		 * Set up volume mixer controls for music
		 *------------------------------*/
		 $(".gui-settings .sfx-volume .toggle-sfx-slider").click(function() {
			var slider = $('.gui-settings .sfx-volume .slider');
			if(slider.hasClass('visible')) {
				//hide
				slider.slideUp().removeClass('visible')
			}else {
				//show
				slider.slideDown().addClass('visible');
			}
		});
		$(".gui-settings .sfx-volume .slider").slider({
			orientation: 'vertical',
			step: 0.1,
			value: 0.8,
			min: 0.0,
			max: 1.0,
			change: function() {
				engine.sound.setVolume($(this).slider('option', 'value'), 'sfx');
			},
		});


		/*------------------------------
		 * Declare our game variable in the global scope
		 * For easy debugging (this should be removed on production)
		 *------------------------------*/
		var game;
		
		/*------------------------------
		 * Preload core modules, project modules
		 * Sound and images
		 *------------------------------*/
		engine.preload({
			core: {
				modules: 'Entity,Scene,ParticleSystem',
			},
			project: {
				modules: 'Player,mainMenu',
				sounds: {
					'music_roaming': 'sounds/roaming.ogg',
					'turret_01': 'sounds/turret_01.ogg',
				},
			},
		}, function() {

			//let's instantiate a new game instance
			game = new engine('#game', {fps: 60});
			
			//set some options
			game.ctx.imageSmoothingEnabled = false;
			game.ctx.mozImageSmoothingEnabled = false;
			game.ctx.webkitImageSmoothingEnabled = false;
			game.ctx.font = "14pt monospace";

			game.bufferCtx.imageSmoothingEnabled = false;
			game.bufferCtx.mozImageSmoothingEnabled = false;
			game.bufferCtx.webkitImageSmoothingEnabled = false;
			game.bufferCtx.font = "14pt monospace";

			game.rotationCtx.imageSmoothingEnabled = false;
			game.rotationCtx.mozImageSmoothingEnabled = false;
			game.rotationCtx.webkitImageSmoothingEnabled = false;
			game.rotationCtx.font = "14pt monospace";

			var mainMenu = new engine.mainMenu(game);
			
			var img = new Image();
			img.onload = function() {
				var player = new engine.Player(game, 'player', game.canvas.width/2, game.canvas.height/2);
				player.sprite = img;

				mainMenu.layers[0] = [player];

				game.stage(mainMenu);
				
				//go!
				game.run();
			}
			img.src = engine.settings.projectURL + 'images/player.png';

		});


		/*
		engine.require('Entity,Scene,ParticleSystem', function() {
			//core modules are ready, let's load project modules now
			
			engine.require('Player', function() {

				//let's instantiate a new game instance
				game = new engine('#game', {fps: 60});
				
				game.sound.load('music_roaming', 'sounds/roaming.ogg', function() {
					var bgMusic = game.sound.get('music_roaming');
					bgMusic.setVolume(0.5);
					bgMusic.play();
				});
	
				

				//set some options
				game.ctx.imageSmoothingEnabled = false;
				game.ctx.mozImageSmoothingEnabled = false;
				game.ctx.webkitImageSmoothingEnabled = false;
				
				game.bufferCtx.imageSmoothingEnabled = false;
				game.bufferCtx.mozImageSmoothingEnabled = false;
				game.bufferCtx.webkitImageSmoothingEnabled = false;
				game.bufferCtx.font = "14pt monospace";
				
				//create a scene
				var scene = new engine.Scene('Scene');
				
				//create an entity
				var player = new engine.Player(game, 'Afflicto', game.canvas.width/2, game.canvas.height/2);
					//attach a new particleSystem
					//player.attach(new engine.Component.ParticleSystem('Particles'));
				//add the player to layer 1
				scene.layers[0] = [player];
				
				//create a cursors entity
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
					};
				scene.layers[1] = [cursor];
				
				//stage the menu scene
				game.stage(scene);
				
				
				//go!
				game.run();
			}, true);//true for loading from the project URL (testproject)
		});
		*/
	</script>
</body>
</html>