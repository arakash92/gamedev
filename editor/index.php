<?php

function get_base_url() {
    /* First we need to get the protocol the website is using */
    $protocol = strtolower(substr($_SERVER["SERVER_PROTOCOL"], 0, 5)) == 'https://' ? 'https://' : 'http://';

    /* returns /myproject/index.php */
    $path = $_SERVER['PHP_SELF'];
    /*
     * returns an array with:
     * Array (
     *  [dirname] => /myproject/
     *  [basename] => index.php
     *  [extension] => php
     *  [filename] => index
     * )
     */
    $path_parts = pathinfo($path);
    $directory = $path_parts['dirname'];
    /*
     * If we are visiting a page off the base URL, the dirname would just be a "/",
     * If it is, we would want to remove this
     */
    $directory = ($directory == "/") ? "" : $directory;

    /* Returns localhost OR mysite.com */
    $host = $_SERVER['HTTP_HOST'];

    /*
     * Returns:
     * http://localhost/mysite
     * OR
     * https://mysite.com
     */
    return $protocol . $host . $directory;
}

function dirToArray($dir) {
    $contents = array();
    # Foreach node in $dir
    foreach (scandir($dir) as $node) {
        # Skip link to current and parent folder
        if ($node == '.')  continue;
        if ($node == '..') continue;
        # Check if it's a node or a folder
        if (is_dir($dir . DIRECTORY_SEPARATOR . $node)) {
            # Add directory recursively, be sure to pass a valid path
            # to the function, not just the folder's name
            $contents[$node] = dirToArray($dir . DIRECTORY_SEPARATOR . $node);
        } else {
            # Add node, the keys will be updated automatically
            $contents[] = $node;
        }
    }
    # done
    return $contents;
}
	
if (isset($_GET['c'])) {
	$command = explode('/', $_GET['c']);

	class backend {

		public function __construct($command) {
			$method = '_' .array_shift($command);
			$args = $command;

			call_user_func_array(array($this, $method), $args);
			die;
		}

		public function _getDirectory() {
			$stuff = dirToArray('../');
			foreach($stuff as $k => $v) {
				if ($k == 'editor' || $k == 'engine' || $k == '.git' || $k =='README.md') {
					unset($stuff[$k]);
				}
			}
			echo json_encode($stuff);
		}

		public function _loadProjectFiles($project = '') {
			$stuff = dirToArray('../' .$project);
			unset($stuff['.git']);
			echo json_encode($stuff);
		}

		public function _getEntities($project) {
			$stuff = dirToArray('../' .$project .'/entities');
			unset($stuff['.git']);
			echo json_encode($stuff);
		}

	}

	$backend = new backend($command);
	die;
}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
	
	<title>Editor</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="apple-mobile-web-app-capable" content="yes" />

	<!--jquery & jquery ui-->
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/ui/1.10.1/jquery-ui.js"></script>

	<!-- jquery UI css -->
	<link rel="stylesheet" type="text/css" hreF="http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css">
	
	<!--bootsrap js-->
	<script src="../engine/lib/bootstrap/js/bootstrap.min.js"></script>

	<!--bootstrap css-->
	<link href="../engine/lib/bootstrap/css/bootstrap.min.css" type="text/css" rel="stylesheet">

	<!-- darkstrap css -->
	<link href="../engine/lib/bootstrap/css/darkstrap.css" type="text/css" rel="stylesheet">

	<!--create.js for sound-->
	<script type="text/javascript" src="http://code.createjs.com/createjs-2013.02.12.min.js"></script>
	
	<!--engine JS-->
	<script type="text/javascript" src="../engine/engine.js"></script>

	<script type="text/javascript" src="../engine/modules/Spritesheet/Spritesheet.js"></script>

	<!--engine LESS-->
	<link rel="stylesheet/less" type="text/css" href="../engine/engine.less">

	<!-- editor LESS -->
	<link rel="stylesheet/less" type="text/css" href="style.less">

	<!-- less.js (parses LESS files) -->
	<script type="text/javascript" src="../engine/lib/less/less.js"></script>
</head>
<body>
	
	<div id="wrapper">
		<div id="top">
			<div class="btn-toolbar">
				<div class="btn-group menu-file">
					<a class="btn btn-small dropdown-toggle" data-toggle="dropdown">File <span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a onClick="engine.editor.newProject();">New project</a></li>
						<li><a onClick="editor.openProject();">Open Project</a></li>
						<li class="divider"></li>
						<li><a>Save project</a></li>
					</ul>
				</div>

				<div class="btn-group menu-view">
					<a class="btn btn-small dropdown-toggle" data-toggle="dropdown">View <span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a class="toggle-grid" onClick="editor.toggleGrid()"><i class="icon icon-ok"></i> Grid</a></li>
					</ul>
				</div>

				<div class="btn-group menu-new">
					<a class="btn btn-small dropdown-toggle" data-toggle="dropdown">New <span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a class="new-scene" onClick="editor.newScene()"><i class="icon icon-film"></i> Scene</a></li>
					</ul>
				</div>
			</div>
		</div>

		<div id="mid" class="panel">
			<div id="gamepanel" class="panel">
				<div id="game">
				</div>
			</div>
			<div id="rightpanel" class="panel panel-vertical resize-left">
				<div class="inner">
					<div id="layers-view" class="view">
						<header>
							<a class="title pull-left">Layers</a>
							<a class="pull-right add-layer btn btn-mini"><i class="icon-plus"></i> New</a>
						</header>
						<article>
							<ul class="layers">
								
							</ul>
						</article>
					</div>

					<div id="layer-properties" class="view">
						<header>
							<a class="title pull-left">Layer Properties</a>
						</header>
						<article>
							<input type="text" placeholder="layer name" class="layer-name">
						</article>
					</div>

					<div id="spritesheets-view" class="view">
						<header>
							<a class="title pull-left">Spritesheets</a>
						</header>
						<article>
							<select class="spritesheets">
							</select>
							<div class="tiles">
							</div>
						</article>
					</div>
				</div>
			</div>
		</div>

		<div id="bottom" class="panel resize-top">
			<div id="project-panel" class="pull-left panel resize-right">
				<div class="inner">
					<div id="project-view" class="view">
						<h4 class="project-name">No project</h4>
						<ul class="assets">
							
						</ul>
					</div>
				</div>
			</div>

			<div id="debug-panel" class="pull-left panel">
				<div class="inner">
					<div id="debug-view" style="width: 50%;" class="panel pull-left">
						<div style="padding: 8px; width:auto;">
							<h4>Debug</h4>
							<div class="editor-debugger">
								
							</div>
						</div>
					</div>

					<div id="log-view" style="width: 50%;" class="panel pull-left">
						<div class="inner" style="padding: 8px; width: auto;">
							<h4>Console</h4>
							<div class="editor-log">
								Welcome<br>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


	<!-- Open Project Modal -->
	<div id="open-project-modal" class="modal hide fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	  <div class="modal-header">
	    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	    <h3 id="myModalLabel">Open Project</h3>
	  </div>
	  <div class="modal-body">
	    
	  </div>
	  <div class="modal-footer">
	    <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
	    <button data-dismiss="modal" class="btn btn-primary">Open</button>
	  </div>
	</div>


	<!-- New Scene Modal -->
	<div id="new-scene-modal" class="modal hide fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	  <div class="modal-header">
	    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	    <h3 id="myModalLabel">New Scene</h3>
	  </div>
	  <div class="modal-body">
	   	<input type="text" class="scene-name" placeholder="Scene name" class="input-large">
	  </div>
	  <div class="modal-footer">
	    <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
	    <button data-dismiss="modal" class="btn btn-primary">Create</button>
	  </div>
	</div>


	<script type="text/javascript">


		/*------------------------------
		 * Base URL
		 *------------------------------*/
		var URL = '<?=get_base_url()?>';
		URL = URL.replace('http://', '');
		URL = URL.split('/');
		URL[URL.length-1] = '';
		URL = 'http://' + URL.join('/');
		


		/*------------------------------
		 * Editor object
		 * This holds data about our current project
		 *------------------------------*/
		var editor = {
			view: {
				grid: true,
			},
			project: {
				name: null,
				scenes: {},
			},
			selectedLayer: null,
			selectedTile: null,
		};


		/*------------------------------
		 * Game variable
		 *------------------------------*/
		var game;


		/*------------------------------
		 * Process views
		 *------------------------------*/
		$(".view").wrapInner('<div class="inner"/>');
		$(".view > .inner > header").prepend('<a title="Toggle" class="toggle-view arrow"><i class="icon-white icon-chevron-down"></i></a>')
			.find('.title').addClass('toggle-view').parents('.view').find('article').addClass('visible');

		//toggle view
		$(".view .toggle-view").click(function() {
			var article = $(this).parents('.view').find('article');
			if (article.hasClass('visible')) {
				//hide
				article.slideUp().removeClass('visible');
				article.siblings('header').find('.toggle-view.arrow i').removeClass('icon-chevron-down').addClass('icon-chevron-right');
			}else {
				//show
				article.slideDown().addClass('visible');
				article.siblings('header').find('.toggle-view.arrow i').addClass('icon-chevron-down').removeClass('icon-chevron-right');
			}
		});

		$(window).resize(function() {
			$('body').css('overflow', 'hidden');
			var height = $(window).height();
			var width = $(window).width();
			
			height -= 26;

			var mid = height * 0.7;

			var bottom = height - mid;

			$("#mid").css('height', mid);
			$("#bottom").css('height', bottom);

			$("#gamepanel").css('width', width * 0.7);
			$("#rightpanel").css('width', width * 0.3);

			$("#project-panel").css('width', width * 0.3);
			$("#debug-panel").css('width', width * 0.7);
		});
		$(window).trigger('resize');
	

		

		/*------------------------------
		 * Resize Top
		 *------------------------------*/
		$(".resize-top").each(function() {
			var self = $(this);
			$(this).prepend('<div class="resize-handle-top resize-handle"><div class="handle"><div class="bar"></div></div></div>');
			$(this).find('.resize-handle')
				.bind('mousedown', function() {
					$(this).addClass('dragging');
					$('body').addClass('dragging');

					$(document).bind('mousemove.panel', function(e) {
						var offset = self.offset();
						var top = offset.top;
						var mouseTop = e.pageY;

						var current = self.height();

						if (mouseTop > top) {
							self.css('height', current + (top-mouseTop));
							//increase previous siblings
							self.prevAll('.panel').each(function() {
								$(this).css('height', '-=' + (top-mouseTop));
							});
						}else if (mouseTop < top) {
							self.css('height', current - (mouseTop-top));

							//decrease previous siblings
							self.prevAll('.panel').each(function() {
								$(this).css('height', '+=' + (mouseTop-top));
							});
						}

						//trigger resize on the game
						engine.settings.currentGame.event.trigger('resize');
					});
				});
			$(document).bind('mouseup', function() {
				self.removeClass('dragging');
				$('body').addClass('dragging');
				$(document).unbind('mousemove.panel');
			});
		});
		
		/*------------------------------
		 * Resize Left
		 *------------------------------*/
		$(".resize-left").each(function() {
			var self = $(this);
			$(this).prepend('<div class="resize-handle-left resize-handle"><div class="handle"><div class="bar"></div></div></div>');
			$(this).find('.resize-handle')
				.bind('mousedown', function() {
					$('body').addClass('dragging');
					$(this).addClass('dragging');

					$(document).bind('mousemove.panel', function(e) {
						var position = self.position();
						var left = position.left;

						var mouseLeft = e.pageX;

						var currentWidth = self.width();

						if (mouseLeft > left) {
							if (currentWidth + (left-mouseLeft) > 100) {
							self.css('width', currentWidth + (left-mouseLeft));
								//increase previous siblings
								self.prevAll('.panel').each(function() {
									$(this).css('width', '-=' + (left-mouseLeft));
								});
							}
						}else if (mouseLeft < left) {
							self.css('width', currentWidth - (mouseLeft-left));

							//decrease previous siblings
							self.prevAll('.panel').each(function() {
								$(this).css('width', '+=' + (mouseLeft-left));
							});
						}
						//trigger resize on the game
						engine.settings.currentGame.event.trigger('resize');
					});
				});

			$(document).bind('mouseup', function() {
				self.removeClass('dragging');
				$('body').removeClass('dragging');
				$(document).unbind('mousemove.panel');
			});
		});
		
		
		/*------------------------------
		 * Resize Right
		 *------------------------------*/
		$(".resize-right").each(function() {
			var self = $(this);
			$(this).prepend('<div class="resize-handle-right resize-handle"><div class="handle"><div class="bar"></div></div></div>');
			$(this).find('.resize-handle')
				.bind('mousedown', function() {
					$('body').addClass('dragging');
					$(this).addClass('dragging');

					$(document).bind('mousemove.panel', function(e) {
						var width = self.width();
						var position = self.position();
						var right = position.left + width;

						var mousex = e.pageX;

						if (mousex > right) {
							//increase width
							var increase = mousex - right;
							self.css('width', '+=' + increase);

							self.nextAll('.panel').each(function() {
								if ($(this).width() - increase > 60) {
									$(this).css('width', '-=' + increase);
								}
							});
						}else if (mousex < right) {
							//decrease width
							var decrease = right - mousex;
							if (width - decrease > 60) {
								self.css('width', '-=' + decrease);
								self.next('.panel').css('width', '+=' + decrease);
							}
						}

						//remove excess width
						var maxWidth = self.parent().width();

						var totalWidth = 0;
						self.parent().children('.panel').each(function() {
							totalWidth += $(this).width();
						});

						if (totalWidth > maxWidth) {
							//remove excess width
							var numPanels = self.parent().children('.panel').length;
							var remove = totalWidth - maxWidth / numPanels;
							self.parent().children('.panel').css('width', '-=' + remove);
						}

						//trigger resize on the game
						engine.settings.currentGame.event.trigger('resize');
					});
				});

			$(document).bind('mouseup', function() {
				self.removeClass('dragging');
				$('body').removeClass('dragging');
				$(document).unbind('mousemove.panel');
			});
		});
		


		/*------------------------------
		 * Show a list of projects
		 *------------------------------*/
		editor.openProject = function() {
			$.post(URL +'/editor/?c=getDirectory', function(data) {
				data = $.parseJSON(data);

				var i,str = '';
				for(i in data) {
					if (isNaN(i)) {
						str += '<input type="radio" name="project" value="' +i +'" style="display: inline;"> <a>' +i +'</a><br>';
					}
				}
				
				$("#open-project-modal .modal-body").html('<div class="project-list">' + str + '</div>');
				$("#open-project-modal .modal-body .project-list").find('a').click(function() {
					$(this).parent().find('input').prop('checked', false);
					$(this).prev('input').prop('checked', true);
				});
				$("#open-project-modal").modal('show');
			});
		}

		/*------------------------------
		 * Open a project button
		 *------------------------------*/
		$("#open-project-modal .modal-footer .btn-primary").click(function() {
			var selected = $("#open-project-modal").find('.project-list input:checked').val();
			editor.loadProjectFiles(selected);
			$("#project-view .project-name").html(selected);
		});
		


		/*------------------------------
		 * Render project files in project-view
		 *------------------------------*/
		editor.displayDir = function(dir) {
			var i,node,str='';
			for(i in dir) {
				node = dir[i];
				
				if (typeof node === 'object' || typeof node === 'function') {
					//directory
					str += '<li data-node="' + i +'" class="folder"><a><i class="icon-white icon-folder-close"></i> ' + i +'</a><ul style="display: none;">';
					str += editor.displayDir(node);
					str += '</ul></li>';
				}else  {
					//file
					str +='<li class="file"><a><i data-node="' +node +'" class="icon-white icon-file"></i> ' + node +'</a></li>';
				}
			}
			return str;
		}




		/*------------------------------
		 * Loads project files from a directory
		 *------------------------------*/
		editor.loadProjectFiles = function(project) {
			console.log('Loading project ' + project +'...');

			//set the active project name
			editor.project.name = project;

			//notify engine of new project URL
			engine.settings.projectURL = 'http://192.168.1.137/gamedev/' +project +'/';

			$.post(URL +'/editor/?c=loadProjectFiles/' + project, function(dir) {
				dir = $.parseJSON(dir);
				
				editor.directory = dir;

				//render the directory in the assets view
				$("#project-view ul.assets").html(editor.displayDir(dir));

				//open the tilesets
				console.log('-------------');
				var spritesheets = [];
				var i,sheet,ext;
				if (dir.spritesheets !== undefined) {
					for(i in dir.spritesheets) {
						sheet = dir.spritesheets[i];
						sheet = sheet.split('.');
						ext = sheet.pop();
						if (ext === 'json') {
							spritesheets.push(sheet +'.json');
						}
					}
				}
				spritesheets = spritesheets.join(',');

				//load the spritesheet
				editor.loadSpritesheet(spritesheets, function() {
					var view = $("#spritesheets-view");
					view.find(".spritesheets").html("");

					var name,sheet,slug;
					for(name in engine.spritesheets) {
						sheet = engine.spritesheets[name];
						slug = name.replace(' ', '-');
						//append to spritesheet dropdown
						view.find('.spritesheets').append('<option value="' +name +'">' +name +'</option>');

						//create the tileset view, if it doesn't exist.
						var tileset = view.find('.tiles').find('[data-spritesheet="' +name +'"]');
						if (!tileset[0]) {
							view.find('.tiles').append('<div data-spritesheet="' +name +'"></div>');
							var tileset = view.find('.tiles').find('[data-spritesheet="' +name +'"]');
						}

						//get the background image
						var bgImage = sheet.image.src;

						//loop through the frames
						var i,div,tile;
						for(i in sheet.sprites) {
							tile = sheet.sprites[i];

							//create a div
							tileset.append('<div data-tile="' +i.replace(' ', '') +'" title="' +i.replace(' ', '') +'" class="tile"></div>');

							//store it
							div = tileset.find('[data-tile="' +i.replace(' ', '') +'"]');

							//add pixel-art class to disable image smoothing
							div.addClass('pixel-art');

							//set background, width and height
							var x = 0 - Math.abs(tile.x);
							var y = 0 - Math.abs(tile.y);
							div.css({
								width: tile.width,
								height: tile.height,
								backgroundPosition: x +'px ' + y +'px',
								'background-image': 'url(' +bgImage +')',
							});
						}
					}
				});
			});
		}


		/*------------------------------
		 * Setup tileset events
		 *------------------------------*/

		//$(document).on('#spritesheets-view .tiles')


		/*------------------------------
		 * Select Tile
		 *------------------------------*/
		$(document).on('click', '#spritesheets-view .tiles .tile', function() {
			//remove selected on all
			$(this).parents('.tiles').find('.tile').removeClass('selected');
			$(this).addClass('selected');
			//find the spritesheet
			var spritesheet = $(this).parent().attr('data-spritesheet');
			var tile = $(this).attr('data-tile');
			editor.selectTile(spritesheet, tile);
		});


		editor.selectTile = function(spritesheet, tile) {
			console.log('Attempting to select tile "' + tile +'" from spritesheet "' +spritesheet +'"...');

			if (engine.spritesheets[spritesheet].sprites[tile] !== undefined) {
				//select it
				editor.selectedTile = engine.spritesheets[spritesheet].sprites[tile];
				console.log('Tile ' + tile +' selected');
			}else {
				alert('Error: tile "' + tile +'" not found in the spritesheet "' +spritesheet +'"!');
				return false;
			}
		}


		/*------------------------------
		 * DEVELOPMENT MODE
		 *------------------------------*/
		//editor.loadProjectFiles('etheria');



		/*------------------------------
		 * Make layers sortable
		 *------------------------------*/
		$("#layers-view ul.layers").sortable({
			axis: 'y',
			items: 'li',
			delay: 100,
			opacity: 0.7,
		});


		/*------------------------------
		 * Toggle visibility
		 *------------------------------*/
		$(document).on('click', '#layers-view ul.layers li .visible', function() {
			if ($(this).hasClass('on')) {
				//turn off
				$(this).removeClass('on');
			}else {
				//turn on
				$(this).addClass('on');
			}
		});


		/*------------------------------
		 * Select layer
		 *------------------------------*/

		editor.selectLayer = function(id) {
			editor.selectedLayer = id;
		}

		$(document).on('click', '#layers-view ul.layers li', function() {
			$("#layers-view ul.layers li").removeClass('selected');
			$(this).addClass('selected');
			//get the id
			var id = $(this).attr('data-id');
			console.log('Selecting layer ' + id);
			//select it
			editor.selectLayer(id);
		});




		/*------------------------------
		 * Add Layer event
		 *------------------------------*/
		$(document).on('click', '#layers-view .add-layer', function() {
			editor.createLayer();
		});


		/*------------------------------
		 * Create Layer
		 *------------------------------*/
		editor.createLayer = function() {
			console.log('Attempting to create layer...');
			//is there an active scene?
			if (game.scene !== null) {
				
				//create the layer object
				var newLayer = new engine.Scene.Layer('new layer');

				//add it to the scene
				var id = game.scene.layers.push(newLayer);

				//create the html element
				$("#layers-view ul.layers").append('<li data-id="' +id +'"><div class="handle"></div><div class="item"><div class="inner"><div class="visible"></div><div class="name">new layer</div></div></div><a class="delete"><i class="icon-white icon-remove"></i></a></li>');

			}else {
				console.log('No active scene. Aborting.');
			}
		};






		/*------------------------------
		 * Select layer
		 *------------------------------*/
		editor.selectLayer = function(layer) {

		};

		/*------------------------------
		 * Load spritesheet
		 *------------------------------*/
		editor.loadSpritesheet = function(spritesheet, callback) {
			spritesheet = $.trim(spritesheet, ',');
			engine.preload({
				project: {
					spritesheets: spritesheet,
				},
			}, null, callback);
		};


		/*------------------------------
		 * View -> Toggle Grid
		 *------------------------------*/
		editor.toggleGrid = function() {
			if (editor.view.grid === true) {
				editor.view.grid = false;
				$(".menu-view .toggle-grid .icon").removeClass('icon-ok');
			}else {
				editor.view.grid = true;
				$(".menu-view .toggle-grid .icon").addClass('icon-ok');
			}
			//set in active scene
			if (game !== undefined) {
				if (game.scene !== null) {
					game.scene.displayGrid = editor.view.grid;
				}
			}
		};



		/*------------------------------
		 * New -> Scene
		 *------------------------------*/
		editor.newScene = function() {
			//check that we have an open project
			if (editor.project.name === undefined) {
				alert('Please open or create a project before adding scenes!');
				return false;
			}
			
			//open the new scene modal
			$("#new-scene-modal").modal('show').find('.scene-name').val('');
		};


		$("#new-scene-modal .modal-footer .btn-primary").click(function() {
			//get scene name
			var name = $("#new-scene-modal .scene-name").val();

			//create it
			editor.project.scenes[name] = new engine.Scene(name);

			//set grid or not
			editor.project.scenes[name].displayGrid = editor.view.grid;

			//hook into update, set up scene editing
			editor.project.scenes[name].event.bind('update_pre', function(dt) {
				//Tile placement
				if (game.input.mouse['1']) {
					//are we placing or removing a tile?
					if (game.input.keys['shift'] == true) {
						//remove tile
						console.log('removing tile');
					}else {
						//place tile
						console.log('placing tile');
					}
				}
			});

			//render
			editor.project.scenes[name].event.bind('render_post', function(g) {
				g.globalAlpha = 1;
				//do we have a tile selected?
				if (editor.selectedTile !== null) {
					g.fillStyle = 'white';
					editor.selectedTile.render(g, game.input.mouse.pos.x-16, game.input.mouse.pos.y-16, 32, 32);
				}
			});

			//stage scene
			game.stage(editor.project.scenes[name]);
		});




		/*------------------------------
		 * Load Scene
		 *------------------------------*/
		editor.loadScene = function(scene) {
			if (editor.project.name === undefined) {
				alert('Cannot open scene, not in a proejct.');
				return false;
			}
			console.log('Loading scene ' + scene +'...');
			//do an ajax call to fetch the scene JSON
			game.scene = null;
			$.post(URL +'/' + editor.project.name +'/scenes/' + scene, function(data) {
				console.log(data);

				var scene = new engine.Scene(data.name);

				game.stage(scene);
			});
		}



		/*------------------------------
		 * Setup directory browsing events
		 * Including opening of scenes etc
		 *------------------------------*/
		 //open & close folders
		$(document).on('click', '#project-view ul.assets li a', function() {
			var self = $(this);
			/*------------------------------
			 * Folders
			 *------------------------------*/
			if (self.parent().hasClass('folder')) {
				//toggle files
				if (self.parent().hasClass('visible')) {
					//hide
					self.parent().removeClass('visible').children('ul').slideUp();
					self.children('.icon-white').addClass('icon-folder-close').removeClass('icon-folder-open');
				}else {
					//show
					self.parent().addClass('visible').children('ul').slideDown();
					self.children('.icon-white').removeClass('icon-folder-close').addClass('icon-folder-open');
				}

			}else if (self.parent().hasClass('file')) {
				/*------------------------------
				 * File
				 *------------------------------*/
				console.log(self.parents('.folder a').text());
				if (self.parent().text() == 'entities') {
					var entityName = $(this).text();
					console.log('selecting ' + entityName);
				}
			}
		});

		//Open scenes
		$(document).on('click', '#project-view ul.assets [data-node="scenes"] ul li a', 'click', function() {
			var scene = $.trim($(this).text());
			editor.loadScene(scene);
		});



		/*------------------------------
		 * Initial Engine setup
		 *------------------------------*/
		engine.setup({
			engineURL: 'http://192.168.1.137/gamedev/engine/',
			projectURL: 'http://192.168.1.137/gamedev/etheria/',
			isEditor: true,
		});



		/*------------------------------
		 * Preload stuff
		 *------------------------------*/
		engine.preload({
			core: {
				modules: 'Scene,Entity',
			}
		}, null, function() {

			/*------------------------------
			 * Instantiate game
			 *------------------------------*/
			game = new engine('#game');


			/*------------------------------
			 * Camera zooming
			 *------------------------------*/
			$(game.wrapper).bind('mousewheel', function(e, d, x, y) {
				if (game.scene !== null) {
					if (y == 1) {
						game.scene.camera.zoomIn();
					}else if (y == -1) {
						game.scene.camera.zoomOut();
					}
				}
			});


			/*------------------------------
			 * Camera dragging
			 *------------------------------*/
			var dragStart = new engine.Vector();
			var dragging = false;
			game.event.bind('update_pre', function() {
				if (game.input.mouse['2'] || game.input.keys['space']) {
					if (dragging === true) {
						//continue drag

						//has the mouse moved?
						if (game.input.mouse.pos.x !== dragStart.x || game.input.mouse.pos.y !== dragStart.y) {
							game.scene.camera.pos.x = dragStart.x - game.input.mouse.pos.x;
							game.scene.camera.pos.y = dragStart.y - game.input.mouse.pos.y;
						}
					}else {
						//start dragging
						dragging = true;
						dragStart.x = game.scene.camera.pos.x + game.input.mouse.pos.x;
						dragStart.y = game.scene.camera.pos.y + game.input.mouse.pos.y;
					}
				}else if (dragging === true) {
					//dragging stopped
					dragging = false;
				}
			});


			/*------------------------------
			 * Run!
			 *------------------------------*/
			game.run();
		});
		
		
		
	</script>

</body>
</html>