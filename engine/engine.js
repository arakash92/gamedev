// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik MÃ¶ller
// fixes from Paul Irish and Tino Zijdel
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
								   || window[vendors[x]+'CancelRequestAnimationFrame'];
	}
 
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
 
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());




/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
	var _super = this.prototype;
   
	// Instantiate a base class (but only create the instance,
	// don't run the init constructor)
	initializing = true;
	var prototype = new this();
	initializing = false;
   
	// Copy the properties over onto the new prototype
	for (var name in prop) {
	  // Check if we're overwriting an existing function
	  prototype[name] = typeof prop[name] == "function" &&
		typeof _super[name] == "function" && fnTest.test(prop[name]) ?
		(function(name, fn){
		  return function() {
			var tmp = this._super;
		   
			// Add a new ._super() method that is the same method
			// but on the super-class
			this._super = _super[name];
		   
			// The method only need to be bound temporarily, so we
			// remove it when we're done executing
			var ret = fn.apply(this, arguments);        
			this._super = tmp;
		   
			return ret;
		  };
		})(name, prop[name]) :
		prop[name];
	}
   
	// The dummy class constructor
	function Class() {
	  // All construction is actually done in the init method
	  if ( !initializing && this.init )
		this.init.apply(this, arguments);
	}
   
	// Populate our constructed prototype object
	Class.prototype = prototype;
   
	// Enforce the constructor to be what we expect
	Class.prototype.constructor = Class;
 
	// And make this class extendable
	Class.extend = arguments.callee;
   
	return Class;
  };
})();



engine = Class.extend({
	init: function(wrapper, options) {
		console.log('Instantiating new engine instance...');
		var self = this;
	
		/*------------------------------
		 * Initialize canvas & context
		 *------------------------------*/
		this.wrapper = $(wrapper);
		this.wrapper.addClass('engine');
		
		//two canvases, for double buffering.
		this.wrapper.append('<canvas onContextMenu="return false;" class="engine-canvas"></canvas><canvas style="display: none;" class="engine-buffer"></canvas>');
		
		//create a rotation canvas
		this.wrapper.append('<canvas class="engine-rotationcanvas" style="display: none;"></canvas>');
		this.rotationCanvas = this.wrapper.find('.engine-rotationcanvas')[0];
		this.rotationCtx = this.rotationCanvas.getContext('2d');

		//set the canvas
		this.$canvas = this.wrapper.find('.engine-canvas');
		this.canvas = this.$canvas[0];
		this.ctx = this.canvas.getContext('2d');
		
		//buffer canvas
		this.$buffer = this.wrapper.find('.engine-buffer');
		this.buffer = this.$buffer[0];
		this.bufferCtx = this.buffer.getContext('2d');
		
		//disable image smoothing by default
		this.ctx.imageSmoothingEnabled = false;
		this.ctx.mozImageSmoothingEnabled = false;
		this.ctx.webkitImageSmoothingEnabled = false;
		this.ctx.font = "14pt monospace";

		this.bufferCtx.imageSmoothingEnabled = false;
		this.bufferCtx.mozImageSmoothingEnabled = false;
		this.bufferCtx.webkitImageSmoothingEnabled = false;
		this.bufferCtx.font = "14pt monospace";

		this.rotationCtx.imageSmoothingEnabled = false;
		this.rotationCtx.mozImageSmoothingEnabled = false;
		this.rotationCtx.webkitImageSmoothingEnabled = false;
		this.rotationCtx.font = "14pt monospace";

		//gameloop stuff
		this.fps = 0;
		this.frame_time = null;
		this.deltaTime = null;
		this.time_last = null;
		this.time_now = null;
		
		this.scene = null;

		//listen for resize
		$(window).bind('resize', function() {
			self.resizeCallback();
		});

		//options
		this.options = {
			fps: 60,
			width: 640,
			height: 320,
		};

		//set options
		var i;
		for (i in options) {
			this.options[i] = options[i];
		}
		
		//apply width, height etc
		var height = this.options.height,
			width = this.options.width;
		this.canvas.width = width;
		this.canvas.height = height;
		this.buffer.width = width;
		this.buffer.height = height;
		
		this.resizeCallback();
		
		this.input = new engine.Input();
		this.event = new engine.Event();
		this.console = new engine.Console();

		console.log('Engine initialized.');
	},

	resizeCallback: function() {
		//set canvas dimensions
		var width = 1200;
		var height = 700;

		if ($(window).width() < 1280) {
			//1280x768
			width = 960;
			height = 720;
		}
		if ($(window).width() < 1024) {
			//800x600
			width = 720;
			height = 540;
		}
		if ($(window).width() < 800) {
			width = $(window).width();
			height = $(window).height();
		}

		this.canvas.width = width;
		this.canvas.height = height;
		this.buffer.width = width;
		this.buffer.height = height;
		this.rotationCanvas.width = width;
		this.rotationCanvas.height = height;

		this.wrapper.css({
			width: width,
			height: height,
			'left': ($(window).width() - width) / 2,
			'top': ($(window).height() - height) / 2,
		});

		engine.settings.currentGame = this;
	},

	run: function() {
		this.running = true;
		this.time_last = (new Date()).getTime();
		this.time_now = (new Date()).getTime();
		this.frame_time = 1000/this.options.fps;
		
		this.gameLoop();
	},

	pause: function() {
		this.running = false;
	},

	gameLoop: function() {
		var self = this;
		setTimeout(function() {
			requestAnimationFrame(function() {
				self.gameLoop();
			});
			
			//get statistics
			self.time_now = (new Date()).getTime();
			self.deltaTime = self.time_now - self.time_last;
			self.time_last = self.time_now;
			self.fps = self.frame_time/self.deltaTime*self.options.fps;
			
			//deltaTime
			self.deltaTime = self.deltaTime/self.frame_time;
			
			//update
			self.update();
			
			//render
			self.render();
		}, self.frame_time);
	},

	update: function() {
		this.event.trigger('update_pre');

		//update
		if (this.scene !== null) {
			this.scene.update(self.deltaTime);
		}

		this.event.trigger('update_post');
	},

	render: function() {
		this.event.trigger('render_pre');

		//clear buffer & rotation
		this.bufferCtx.clearRect(0,0, this.buffer.width, this.buffer.height);
		this.rotationCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		//render
		if (this.scene !== null) {
			this.scene.render(this.bufferCtx);
		}
		
		//transfer to displayed canvas
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(this.buffer, 0, 0);

		this.event.trigger('render_post');
	},

	stage: function(scene) {
		console.log('Staging scene ' + scene.name);
		
		//if there is a scene set, unstage it.
		if (this.scene !== null) {
			this.scene.unstage();
		}
		//now stage the new scene
		this.scene = scene;
		this.scene.stage();
	},

	unstage: function() {
		this.scene.unstage();
		var stage = this.stage;
		this.stage = null;
		return stage;
	},
});



/*------------------------------
 * Debug
 *------------------------------*/
engine.Console = Class.extend({
	init: function() {
		console.log('initializing Console');
		var self = this;
		engine.settings.currentGame.wrapper.append('<div class="engine-console"><div class="debug"></div><div class="log"></div></div>');
		this.wrapperDiv = engine.settings.currentGame.wrapper.find('.engine-console');
		this.debugDiv = this.wrapperDiv.find('.debug');
		this.debugArray = [];

		setInterval(function() {
			var i,str = [];
			for(i in self.debugArray) {
				str.push(i +': ' + self.debugArray[i]);
			}
			self.debugDiv.html(str.join('<br>'));
		}, 500);
	},
	debug: function(key, value) {
		this.debugArray[key] = value;
	},
	log: function() {

	},
});


/*------------------------------
 * Engine settings
 *------------------------------*/
engine.settings = {
	engineURL: null,
	projectURL: null,
	currentGame: null,
};

engine.setup = function(settings) {
	var i;
	for(i in settings) {
		engine.settings[i] = settings[i];
	}
}




/*------------------------------
 *   Array of loaded modules
 *-----------------------------*/
engine.modules = [];



/*------------------------------
 *   Module class
 *-----------------------------*/
engine.Module = Class.extend({
	dependencies: null,
	init: function(name, version) {
		console.log('Engine.module.init: ' +name +'');
		this.name = name;
		this.version = version;
	},
	depends: function(modules) {
		console.log('Engine.module.depends: ' + modules);
		this.dependencies = modules;
		return this;
	},
	defines: function(what) {
		console.log('engine.Module.defines ' + this.name + '...');
		var self = this;
		//do we have any dependencies?
		if (this.dependencies !== null) {
			console.log('has dependencies...');
			var i;
			
			//load them
			engine.require(this.dependencies, function() {
				engine.modules[self.name] = self;
				what();
			});
		}else if (typeof what === 'function') {
			engine.modules[this.name] = this;
			what();
		}
	}
});


engine.registerModule = function(name, version) {
	console.log('Registering module "' +name +'" version: ' + version +'.');
	var m = new engine.Module(name, version);
	return m;
};

engine.loadModule = function(name, callback, fromProject) {
	var path;
	if (fromProject === true) {
		path = engine.settings.projectURL;
	}else {
		path = engine.settings.engineURL;
	}
	//check if the module is not loaded
	if (engine.modules[name] === undefined) {
		console.log('loading modules ' + name +'...');
		//load it
		
		//do we have a callback?
		if (typeof callback === 'function') {
			var interval = setInterval(function() {
				if (engine.modules[name] !== undefined) {
					clearInterval(interval);
					console.log('module ' + name +' ready, running callback');
					callback(name);
				}
			}, 100);
		}
		
		//now load it
		$("head").append('<script type="text/javascript" src="' +path +'modules/' +name +'/' +name +'.js"></script>');
		
	}else {
		console.log('module ' + name +' is already loaded, don\'t need to load it again :P');
		return false;
	}
};

engine.require = function(modules, progress, callback, fromProject) {
	if (callback === undefined) {
		callback = progress;
		fromProject = undefined;
		progress = undefined;
	}
	var path;
	if (fromProject === true) {
		if (engine.settings.projectURL === undefined) {
			alert('Please set the projectURL via engine.setup() before loading project modules, we kinda need to know where your files are!');
			return false;
		}
		path = engine.settings.projectURL;
	}else {
		if (engine.settings.engineURL === null) {
			alert('Please set the engineURL via engine.setup() before loading modules!');
			return false;
		}
		path = engine.settings.engineURL;
	}
	
	modules = modules.replace(' ', '');
	modules = modules.split(',');
	
	var plural;
	if (modules.length > 1) {
		plural = 's';
	}else {
		plural = '';
	}
	
	var from = (fromProject === true) ? 'project' : 'core';
	
	console.log('Requireing ' + modules.length +' module' + plural +' from ' + from +' (' +modules.join(', ') +')');
	//is the callback callback defined?
	if (typeof callback === 'function') {
		var interval = setInterval(function() {
			var i;
			for(i in modules) {
				if (engine.modules[modules[i]] === undefined) {
					return false;
				}
			}
			console.log('Modules loaded. Running callback naow!');
			clearInterval(interval);
			callback();
		}, 20);
	}
	
	//load them
	if (progress !== undefined) {
		for (i in modules) {
			engine.loadModule(modules[i], progress, fromProject);
		}
	}else {
		for (i in modules) {
			engine.loadModule(modules[i], null, fromProject);
		}
	}
};






engine.Vector = Class.extend({
	init: function(x, y) {
		if (x === undefined) {
			x = 0;
		}
		if (y === undefined) {
			y = 0;
		}
		this.x = x;
		this.y = y;
	},

	limit: function(max) {
		if (max > 0) {
			if (this.x > max) {
				this.x = max;
			}
			if (this.y > max) {
				this.y = max;
			}
		}else {
			if (this.x < max) {
				this.x = max;
			}
			if (this.y < max) {
				this.y = max;
			}
		}
	},
	
	reset: function() {
		this.x = 0;
		this.y = 0;
	},
	
	add: function(v) {
		this.x += v.x;
		this.y += v.y;
	},

	sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
	},

	mult: function(num) {
		this.x *= num;
		this.y *= num;
	},

	div: function(num) {
		this.x = this.x / num;
		this.y = this.y / num;
	},

	mag: function() {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	},

	normalize: function() {
		var mag = this.mag();
		if (mag !== 0) {
			this.div(this.mag());
		}
	},
	
	invert: function() {
		if (this.x < 0) {
			this.x = Math.abs(this.x);
		}else {
			this.x = 0 - Math.abs(this.x);
		}
		if (this.y < 0) {
			this.y = Math.abs(this.y);
		}else {
			this.y = 0 - Math.abs(this.y);
		}
	},

	getAngle: function() {
		return Math.atan2(this.x, this.y);
		//radians = PI / 180 * angle;
	},
});



Math.degToRad = function(degrees) {
	return degrees * (Math.PI/180);
}
Math.radToDeg = function(radians) {
	return radians * (180/Math.PI);
}

engine.Vector.rotate = function(v, angle) {
	var s = Math.sin(angle);
	var c = Math.cos(angle);

	var nx = c * v.x - s * v.y;
	var ny = s * v.x + c * v.y;

	return new engine.Vector(nx, ny);
}



engine.Graphics = Class.extend({
	init: function(context) {
		this.context = context;
		var i;
		
		for(i in this.context) {
			this[i] = this.context[i];
		}
	},
});





engine.Event = Class.extend({
	init: function() {
		this.listeners = [];
		console.log('event object initialized');
	},

	bind: function(event, callback) {
		if (this.listeners[event] === undefined) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	},

	trigger: function(event, params) {
		//are there any listeners for this event?
		if (this.listeners[event] !== undefined) {
			//run them all
			var i;
			for(i in this.listeners[event]) {
				this.listeners[event][i](params);
			}
		};
	},

});







engine.sound = function() {};

engine.sound.event = new engine.Event();

engine.sound.initted = false;

engine.sound.onComplete = [];

engine.sound.volumeLevels = [];

engine.sound.getVolume = function(type) {
	return engine.sound.volumeLevels[type];
}

engine.sound.setVolume  = function(volume, type) {
	console.log('setting ' + type +' volume to ' + volume);
	engine.sound.volumeLevels[type] = volume;
	engine.sound.event.trigger('setVolume', {'volume': volume});

	if (engine.sound.instances[type] !== undefined) {
		var i,name,sound,instance,array;
		for(i in engine.sound.instances[type]) {
			name = engine.sound.instances[type][i];
			for(sound in engine.sound.instances[type][i]) {
				instance = engine.sound.instances[type][i][sound];
				instance.setVolume(volume);
			}
		}
	}
}


engine.sound.init = function() {
	if (engine.sound.initted == false) {
		engine.sound.initted = true;
		createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashPlugin]);
		createjs.Sound.addEventListener('loadComplete', function(e) {
			if (typeof engine.sound.onComplete[e['id']] === 'function') {
				engine.sound.onComplete[e['id']](e);
				engine.sound.onComplete.splice(e['id']);
			}
		});
	}
};

engine.sound.load = function(name, file, complete) {
	if (typeof complete === 'function') {
		engine.sound.onComplete[name] = complete;
	}
	createjs.Sound.registerSound(engine.settings.projectURL + file, name);
};

engine.sound.instances = {};

engine.sound.get = function(name, type) {
	if (type === undefined) {
		var type = 'sfx';
	}
	var instance = createjs.Sound.play(name);
	if (engine.sound.instances[type] === undefined) {
		engine.sound.instances[type] = {'name': [instance]};
	}else if (engine.sound.instances[type][name] === undefined) {
		engine.sound.instances[type][name] = [instance];
	}else {
		engine.sound.instances[type][name].push(instance);
	}
	return instance;
},



engine.preload = function(stuff, progressCallback, callback) {
	if (typeof callback !== 'function') {
		callback = progressCallback;
	}
	console.log('Preloading lots of stuff...');
	var i,loadedStuff = {};


	//load stuff from core?
	if (stuff.core !== undefined) {
		//load modules
		if(stuff.core.modules !== undefined) {
			//add to loadedStuff
			loadedStuff[stuff.core.modules] = false;
			if (progressCallback !== undefined) {
				engine.require(stuff.core.modules, progressCallback, function() {
					loadedStuff[stuff.core.modules] = true;
				});
			}else {
				engine.require(stuff.core.modules, function() {
					loadedStuff[stuff.core.modules] = true;
				});
			}
		}
		//more core stuff?
	}

	//load stuff from project
	if (stuff.project !== undefined) {
		//modules
		if (stuff.project.modules !== undefined) {
			//add to loadedStuff
			loadedStuff[stuff.project.modules] = false;

			if (progressCallback !== undefined) {
				engine.require(stuff.project.modules, progressCallback, function() {
					loadedStuff[stuff.project.modules] = true;
				}, true);//true: loads them from the project URL instead of the core engine
			}else {
				engine.require(stuff.project.modules, function() {
					loadedStuff[stuff.project.modules] = true;
				}, true);//true: loads them from the project URL instead of the core engine
			}
		}
		//images (coming soon)

		//sounds
		//make sure to init the sound class
		engine.sound.init();

		if (stuff.project.sounds !== undefined) {
			loadedStuff['sound'] = {};
			for(i in stuff.project.sounds) {
				loadedStuff['sound'][i] = false;
			}
			

			for(i in stuff.project.sounds) {
				engine.sound.load(i, stuff.project.sounds[i], function(e) {
					loadedStuff['sound'][e.id] = true;
					if (progressCallback !== undefined) {
						progressCallback(e.id);
					}
					
					for(var ii in loadedStuff['sound']) {
						if (loadedStuff['sound'][ii] !== true) {
							return false;
						}
					}
					//they're all ready. we can set the entire object to true now
					loadedStuff['sound'] = true;
				});
			}
		}
	}



	var interval = setInterval(function() {
		for (i in loadedStuff) {
			if (loadedStuff[i] !== true) {
				//not ready!, just return
				return;
			}
		}

		//seems we didn't return. They are now ready
		console.log('Preloading done!. Running callback :)');
		clearInterval(interval);
		callback();

	}, 20);
};



engine.Input = Class.extend({
	init: function() {
		var self = this;
		this.keys = {};
		
		$(document).keydown(function(e) {
			self.keys[engine.Input.keyNames[e.which]] = true;
		});
	
		$(document).keyup(function(e) {
			self.keys[engine.Input.keyNames[e.which]] = false;
		});
		
		$(engine.settings.currentGame.canvas).bind('mousedown', function(e) {
			self.mouse[e.which] = true;
		});
		$(document).bind('mouseup', function(e) {
			self.mouse[e.which] = false;
		});
		
		this.mouse = {
			1: false,
			2: false,
			3: false,
			pos: new engine.Vector(),
			lastMove: (new Date()).getTime(),
			speed: new engine.Vector(),
		};
		
		$(document).bind('mousemove', function(e) {
			//update lastMove
			self.mouse.lastMove = (new Date()).getTime();
			
			//get mouse X and Y on the window
			var x = e.pageX;
			var y = e.pageY;
			
			//normalize to be relative to the canvas
			var canvasOffset = engine.settings.currentGame.$canvas.offset();
			x -= canvasOffset.left;
			y -= canvasOffset.top;
			
			//get the difference since last move, we'll store this as the mouse speed
			self.mouse.speed.x = Math.abs(self.mouse.pos.x - x);
			self.mouse.speed.y = Math.abs(self.mouse.pos.y - y);
			
			//finally, update the new position
			self.mouse.pos.x = x;
			self.mouse.pos.y = y;
		});
	},
});

engine.Input.keyCodes = {
		'backspace':8,
		'tab':9,
		'enter':13,
		'shift':16,
		'ctrl':17,
		'alt':18,
		'pause_break':19,
		'caps_lock':20,
		'escape':27,
		'page_up':33,
		'page down':34,
		'end':35,
		'home':36,
		'left_arrow':37,
		'up_arrow':38,
		'right_arrow':39,
		'down_arrow':40,
		'insert':45,
		'delete':46,
		'0':48,
		'1':49,
		'2':50,
		'3':51,
		'4':52,
		'5':53,
		'6':54,
		'7':55,
		'8':56,
		'9':57,
		'a':65,
		'b':66,
		'c':67,
		'd':68,
		'e':69,
		'f':70,
		'g':71,
		'h':72,
		'i':73,
		'j':74,
		'k':75,
		'l':76,
		'm':77,
		'n':78,
		'o':79,
		'p':80,
		'q':81,
		'r':82,
		's':83,
		't':84,
		'u':85,
		'v':86,
		'w':87,
		'x':88,
		'y':89,
		'z':90,
		'left_window key':91,
		'right_window key':92,
		'select_key':93,
		'numpad 0':96,
		'numpad 1':97,
		'numpad 2':98,
		'numpad 3':99,
		'numpad 4':100,
		'numpad 5':101,
		'numpad 6':102,
		'numpad 7':103,
		'numpad 8':104,
		'numpad 9':105,
		'multiply':106,
		'add':107,
		'subtract':109,
		'decimal point':110,
		'divide':111,
		'f1':112,
		'f2':113,
		'f3':114,
		'f4':115,
		'f5':116,
		'f6':117,
		'f7':118,
		'f8':119,
		'f9':120,
		'f10':121,
		'f11':122,
		'f12':123,
		'num_lock':144,
		'scroll_lock':145,
		'semi_colon':186,
		'equal_sign':187,
		'comma':188,
		'dash':189,
		'period':190,
		'forward_slash':191,
		'grave_accent':192,
		'open_bracket':219,
		'backslash':220,
		'closebracket':221,
		'single_quote':222,
		'space': 32,
	};

engine.Input.keyNames = {};
for (var i in engine.Input.keyCodes) {
	var value = engine.Input.keyCodes[i];
	engine.Input.keyNames[value] = i;
}
