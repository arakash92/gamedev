engine.registerModule('Spritesheet', '0.1.0')
	.defines(function() {

		engine.spritesheets = [];

		engine.Spritesheet = Class.extend({
			Sprite: Class.extend({
				init: function(image, x, y, w, h) {
					this.image = image;
					this.x = x;
					this.y = y;
					this.width = w;
					this.height = h;
				},
				render: function(g, x, y, width, height) {
					if (width === undefined) {
						width = this.width;
					}
					if (height === undefined) {
						height = this.height;
					}
					g.globalAlpha = 1;
					g.drawImage(this.image, this.x, this.y, this.width, this.height, x, y, width, height);
				},
				update: function(dt) {
				},
			}),

			init: function(sheet, callback) {
				var self = this;

				this.ready = false;
				this.image = null;
				this.sprites = [];
				
				sheet = sheet.replace('.json', '') +'.json';
				console.log('Initializing spritesheet "' +sheet +'"...');
				
				//fetch the spritesheet JSON from texturepacker
				$.post(engine.settings.projectURL +'spritesheets/' + sheet, function(data) {
					console.log(data);
					//do we need to load the image?
					var imgReady = false;
					if (engine.images[data.meta.image] === undefined)  {
						//load the image
						engine.images[data.meta.image] = new Image();
						engine.images[data.meta.image].onload = function() {
							self.image = engine.images[data.meta.image];
							imgReady = true;
						};
						engine.images[data.meta.image].src = engine.settings.projectURL +'/spritesheets/' + data.meta.image;
					}else {
						imgReady = true;
					}

					//wait for image
					var interval = setInterval(function() {
						if (imgReady === true) {
							clearInterval(interval);
							//create sprites for them now
							var i,sprite;
							for(i in data.frames) {
								sprite = new self.Sprite(self.image, data.frames[i].frame.x, data.frames[i].frame.y, data.frames[i].frame.w, data.frames[i].frame.h);
								self.sprites[i] = sprite;
							}
							self.ready = true;
							callback();
						}
					}, 100);

				});
			},
			get: function(name) {
				return this.sprites[name];
			},
		});




		engine.Spritesheet.require = function(spritesheets, progress, callback) {
			spritesheets = spritesheets.replace(' ', '');
			console.log('Requiring spritesheets: ' + spritesheets);
			spritesheets = spritesheets.split(',');

			var i,loadedSheets=[];
			for(i in spritesheets) {
				loadedSheets[spritesheets[i].replace('.json', '')] = false;
			}

			var i,sheet;
			for(i in spritesheets) {
				sheet = new engine.Spritesheet(spritesheets[i], function() {
					if (typeof progress === 'function') {
						progress(spritesheets[i].replace('.json', ''));
					}
					loadedSheets[spritesheets[i].replace('.json', '')] = true;
				});
				engine.spritesheets[spritesheets[i].replace('.json', '')] = sheet;
			}

			var interval = setInterval(function() {

				for(var i in engine.spritesheets) {
					if (engine.spritesheets[i].ready === false) {
						return;
					}
				}
				clearInterval(interval);
				callback();
			}, 100);
		}

	});