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

				<div class="btn-group">
					<a class="btn btn-small dropdown-toggle" data-toggle="dropdown">File <span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a onClick="engine.editor.newProject();">New project</a></li>
						<li><a onClick="editor.openProject();">Open Project</a></li>
						<li class="divider"></li>
						<li><a>Save project</a></li>
					</ul>
				</div>

				<div class="btn-group">
					<a class="btn btn-small dropdown-toggle" data-toggle="dropdown">Edit <span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a onClick="engine.editor.newProject();">New project</a></li>
						<li><a>Open project</a></li>
						<li class="divider"></li>
						<li><a>Save project</a></li>
					</ul>
				</div>

			</div>
		</div>

		<div id="mid" class="panel">
			<div id="gamepanel" class="panel">
				<div id="game">
				</div>
			</div>
			<div id="rightpanel" class="panel resize-left">
				<div class="inner">
					<div id="layers-view" class="view">
						<h4>Layers</h4>
						<ul class="nav nav-pills nav-stacked">
							<li><a>Collision</a></li>
							<li class="active"><span>y</span><a>Foreground</a></li>
							<li><a>Entities</a></li>
							<li><a>Background</a></li>
						</ul>
					</div>
					<div id="inspector" class="view">
						<h4>Inspector</h4>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
							tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
							quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
							consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
							cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
							proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
					</div>
				</div>
			</div>
		</div>

		<div id="bottom" class="panel resize-top">
			<div id="debug-view" style="display: none;" class="pull-left view">
				<div class="pull-left editor-debugger view panel">
					
				</div>
				<div class="pull-left editor-log view panel">
					<p>this is the log panel</p>
				</div>
			</div>
			<div id="project-view" class="pull-left panel view resize-left">
				<h4>Assets</h4>
				<ul class="assets">
					
				</ul>
			</div>
			<div id="entities-view" class="view panel pull-right resize-left">
				<h4>Entities</h4>
				<p>
					<i>No entities</i>
				</p>
			</div>
		</div>
	</div>


	<!-- Modal -->
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



	<script type="text/javascript">
		var URL = '<?=get_base_url()?>';

		$(".view").wrapInner('<div class="inner"/>');

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
			$("#project-view").css('width', 300);
			$("#entities-view").css('width', width - $("#project-view").width());
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
								self.prevAll('.panel, .view').each(function() {
									$(this).css('width', '-=' + (left-mouseLeft));
								});
							}
						}else if (mouseLeft < left) {
							self.css('width', currentWidth - (mouseLeft-left));

							//decrease previous siblings
							self.prevAll('.panel, .view').each(function() {
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
		
		
		var editor = {};
		

		/*------------------------------
		 * Open project
		 *------------------------------*/
		editor.openProject = function() {
			$.post(URL +'/?c=getDirectory', function(data) {
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
		$("#open-project-modal .modal-footer .btn-primary").click(function() {
			var selected = $("#open-project-modal").find('.project-list input:checked').val();
			editor.loadProjectFiles(selected);
		});
		


		/*------------------------------
		 * Load project files
		 *------------------------------*/

		editor.loadProjectFiles = function(project) {
			console.log('Loading project ' + project +'...');
			$.post(URL +'/?c=loadProjectFiles/' + project, function(dir) {
				dir = $.parseJSON(dir);
				console.log(dir);
				var ul = $("#project-view .assets");

				var i,node;
				for(i in dir) {
					node = dir[i];

					if (typeof node === 'object' || node instanceof 'Array') {
						//directory
						ul.append('<li class="folder"><i data-node="' +i +'" class="icon-white icon-folder-close"></i> ' + i +'</li>');
					}else  {
						//file
						ul.append('<li class="file"><i data-node="' +i +'" class="icon-white icon-file"></i> ' + i +'</li>');
					}
				}
			});
		}




		/*------------------------------
		 * Initial Engine setup
		 *------------------------------*/
		engine.setup({
			engineURL: 'http://localhost/gamedev/engine/',
			projectURL: 'http://localhost/gamedev/etheria/',
			isEditor: true,
		});

		//define game variable
		var game;

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
			 * Create scene, add some entities etc
			 *------------------------------*/
			var testScene = new engine.Scene('Test Scene');
			
			//create some entities
			var player = new engine.Entity(game.canvas.width/2, game.canvas.height/2);
			player.debug = true;

			testScene.debug = true;
			testScene.editorMode = true;

			testScene.layers = [[player]];


			/*------------------------------
			 * Camera zooming
			 *------------------------------*/
			$(engine.settings.currentGame.wrapper).bind('mousewheel', function(e, d, x, y) {
				if (y == 1) {
					testScene.camera.zoomIn();
				}else if (y == -1) {
					testScene.camera.zoomOut();
				}
			});

			/*------------------------------
			 * Camera dragging
			 *------------------------------*/
			var dragStart = new engine.Vector();
			var dragging = false;
			testScene.event.bind('update', function() {
				//camera dragging
				if (game.input.mouse['2'] || game.input.keys['space']) {
					if (dragging === true) {
						//continue drag
						game.console.log('dragging...');

						//has the mouse moved?
						if (game.input.mouse.pos.x !== dragStart.x || game.input.mouse.pos.y !== dragStart.y) {
							testScene.camera.pos.x = dragStart.x - game.input.mouse.pos.x;
							testScene.camera.pos.y = dragStart.y - game.input.mouse.pos.y;
						}

					}else {
						//start dragging
						game.console.log('Drag start', true);
						
						dragging = true;
						dragStart.x = testScene.camera.pos.x + game.input.mouse.pos.x;
						dragStart.y = testScene.camera.pos.y + game.input.mouse.pos.y;
					}
				}else if (dragging === true) {
					game.console.log('Drag stopped', true);
					dragging = false;
				}
			});

			/*------------------------------
			 * Stage!
			 *------------------------------*/
			game.stage(testScene);



			/*------------------------------
			 * Run!
			 *------------------------------*/
			game.run();
		});
		
		
		
	</script>

</body>
</html>