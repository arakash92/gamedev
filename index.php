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
	

	<!--bootsrap js-->
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>

	<!--bootstrap css-->
	<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">

	<!--create.js for sound-->
	<script type="text/javascript" src="http://code.createjs.com/createjs-2013.02.12.min.js"></script>
	
	<!--engine-->
	<script type="text/javascript" src="engine/engine.js"></script>
	<link rel="stylesheet" type="text/css" href="engine/engine.css">
</head>
<body>
	
	<div id="game">
		<div class="gui-splash">

		</div>
		<div class="gui-hud">
			
		</div>
		<div class="gui-menu">

		</div>
	</div>
	
	<script type="text/javascript">
	   
	   	/*------------------------------
	   	 * First, setup engine and project URL's
	   	 *------------------------------*/
		engine.setup({
			'engineURL': 'http://192.168.1.137/gamedev/engine/',
			'projectURL': 'http://192.168.1.137/gamedev/testproject/',
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
				modules: 'Player',
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