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
	<script src="engine/lib/bootstrap/js/bootstrap.min.js"></script>

	<!--bootstrap css-->
	<link href="engine/lib/bootstrap/css/bootstrap.min.css" type="text/css" rel="stylesheet">

	<!-- darkstrap css -->
	<link href="engine/lib/bootstrap/css/darkstrap.css" type="text/css" rel="stylesheet">

	<!--create.js for sound-->
	<script type="text/javascript" src="http://code.createjs.com/createjs-2013.02.12.min.js"></script>
	
	<!--engine JS-->
	<script type="text/javascript" src="engine/engine.js"></script>

	<link rel="stylesheet" type="text/css" href="engine/engine.css">

	<!-- less.js (parses LESS files) -->
	<script type="text/javascript" src="engine/lib/less/less.js"></script>

	<style type="text/css">
		body {
			background: black;
		}
		#game {
			overflow: hidden;
		}
		.container-fluid {
			padding: 0;
		}
		.gui-settings {
			position: absolute;
			z-index: 20;
			top: -14px;
			width: 100%;
			height: 30px;
			background: rgba(255,255,255,0.3);
			opacity:0.4;
			filter:Alpha(opacity=40);
			border-bottom: 1px solid #777;
			-webkit-transition: all 300ms;
			-moz-transition: all 300ms;
			-ms-transition: all 300ms;
			-o-transition: all 300ms;
			transition: all 300ms;
		}
		.gui-settings:hover {
			opacity:0.9;
			filter:Alpha(opacity=90);
			top: 0px;
		}
		.gui-settings .inner {
			padding: 4px 8px;
		}
		.gui-settings .music-volume, .gui-settings .sfx-volume {
			float: left;
			margin-right: 10px;
		}
		.gui-settings .slider {
			position: relative;
			top: 4px;
			left: 8px;
		}


		/* Main Menu GUI */
		.gui-mainmenu {
			position: relative;
			z-index: 20;
			max-width: 240px;
			margin: 20% auto;
			background: rgba(50,50,50,0.5);
		}
		.gui-mainmenu .menu {
			width: 100%;
			height: 100%;
			border-radius: 4px;
			border: 1px solid #777;
			border-top-color: #fff;
			border-bottom-color: #454545;
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



		/* preload overlay */
		.preload-overlay {
			position: absolute;
			z-index: 100;
			top: 0px;
			width: 100%;
			height: 100%;
			background: white;
		}
		.preload-overlay .logo {
			margin-bottom: 20px;
		}
		.preload-overlay .inner {
			max-width: 40%;
			margin: 20% auto;
		}
		.preload-overlay .logo img {
			width: 100%;
		}
		.preload-overlay .loading-bar {
			clear: both;
		}
		.preload-overlay .progress {
			position: relative;
		}
		.preload-overlay .progress .text {
			color: black;
			position: absolute;
			top: 0px;
			text-align: center;
			width: 100%;
			text-transform: uppercase;
			font-size: 0.9em;
			font-weight: 700;
			text-shadow: 1px 1px 1px #FFF;
			filter: dropshadow(color=#FFF, offx=1, offy=1);
		}
	</style>
</head>
<body>
	<div class="preload-overlay">
		<div class="inner">
			<div class="logo">
				<img src="darkshift/images/logo_large.png">
			</div>
			<div class="loading-bar">
				<div class="progress progress-striped active">
					<div class="text">Loading...</div>
				  	<div class="bar" style="width: 0%;"></div>
				</div>
			</div>
		</div>
	</div>
	<div id="game">
		
		<div class="gui-settings">
			<div class="inner">
				<div class="music-volume">
					<a title="Change music volume" class="btn btn-inverse btn-small toggle-music-slider"><i class="icon-white icon-music"></i></a>
					<div class="slider" style="display: none;">
					</div>
				</div>
				<div class="sfx-volume">
					<a title="Change sound effects volume" class="btn btn-inverse btn-small toggle-sfx-slider"><i class="icon-white icon-volume-up"></i></a>
					<div class="slider" style="display: none;">
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
		var slider = $('.gui-settings .music-volume .slider');
		slider.bind('mouseleave', function() {
			$(this).slideUp().removeClass('visible');
		});
		$(".gui-settings .music-volume .toggle-music-slider").click(function() {
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
		slider2 = $('.gui-settings .sfx-volume .slider');
		slider2.bind('mouseleave', function() {
			$(this).slideUp().removeClass('visible');
		});
		 $(".gui-settings .sfx-volume .toggle-sfx-slider").click(function() {
			if(slider2.hasClass('visible')) {
				//hide
				slider2.slideUp().removeClass('visible')
			}else {
				//show
				slider2.slideDown().addClass('visible');
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
		 * Create our progress bar
		 *------------------------------*/




		/*------------------------------
		 * Preload core modules, project modules
		 * Sound and images
		 *------------------------------*/
		//variables
		var bar = $(".preload-overlay .progress .bar"), loadCount = 0;
		var loadingText = bar.parent().find('.text');

		engine.preload({
			core: {
				modules: 'Entity,Scene,ParticleSystem',
			},
			project: {
				modules: 'mainMenu',
				sounds: {
					'music_roaming': 'sounds/roaming.ogg',
					'ui_up': 'sounds/ui/up.ogg',
					'ui_down': 'sounds/ui/down.ogg',
					'ui_select': 'sounds/ui/select.ogg',
				},
			},
		}, function(asset) {
			/*------------------------------
			 * Progress update
			 *------------------------------*/
			loadCount++;
			loadingText.html(asset +' loaded');
			bar.css('width', (100/8) * loadCount +'%');



		}, function() {
			/*------------------------------
			 * Fade out the loading overlay
			 *------------------------------*/
			$(".preload-overlay").hide('fade', 1000);


			/*------------------------------
			 * Initialzie the game and load the main menu
			 *------------------------------*/
			game = new engine('#game', {fps: 60});


			/*------------------------------
			 * Main Menu
			 *------------------------------*/
			//var mainMenu = new engine.mainMenu(game);
			
			//game.stage(mainMenu);


			/*------------------------------
			 * TESTING
			 *------------------------------*/
			$(".gui-mainmenu").hide();

			var scene = new engine.Scene();

			scene.event.bind('update', function(dt) {
				if (game.input.keys['left_arrow']) scene.camera.x -= 0.5;
				if (game.input.keys['right_arrow']) scene.camera.x += 0.5;
				if (game.input.keys['down_arrow']) scene.camera.y += 0.5;
				if (game.input.keys['up_arrow']) scene.camera.y -= 0.5;
			});
			
			
			
			game.stage(scene);


			/*------------------------------
			 * Run!
			 *------------------------------*/
			game.run();
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