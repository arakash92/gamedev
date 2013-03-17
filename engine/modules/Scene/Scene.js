engine.registerModule('Scene', '0.1.0')
    .defines(function() {
        
        
        
        engine.Scene = Class.extend({
            init: function(name) {
                this.layers = [];
                this.effect = null;
                this.drawGrid= false;
                if (typeof name == 'string') {
                    this.name = name;
                }
            },
            hide: function(effect, options) {
                if (engine.Scene.Effect[effect] !== undefined) {
                    this.effect = new engine.Scene.Effect[effect](this, 'hide', options);
                }
            },
            show: function(effect) {
                
            },
            update: function(dt) {
                //update layers
                var i,layer;
                for (i in this.layers) {
                    layer = this.layers[i];
                    for(i in layer) {
                        layer[i].update(dt);
                    }
                }
                
                //update effects layer
                if (this.effect !== null) {
                    this.effect.update(dt);
                }
            },
            render: function(g) {
                //update layers
                var i,layer;
                for (i in this.layers) {
                    layer = this.layers[i];
                    for(i in layer) {
                        layer[i].render(g);
                    }
                }
                
                //render effects layer
                if (this.effect !== null) {
                    this.effect.render(g);
                }
            }
        });
        
        
        engine.Layer = Class.extend({
            name: 'New Layer',
            visible: true,
            active: true,
            init: function(name) {
                if (typeof name == 'string') {
                    this.name = name;
                }
            },
            update: function(dt) {
                if (this.active) {
                    var i,e;
                    for(i in this.entities) {
                        e = this.entities[i];
                        if (e.active) {
                            e.update(dt);
                        }
                    }
                }
            },
            render: function(g) {
                if (this.visible) {
                    var i,e;
                    for(i in this.entities) {
                        e = this.entities[i];
                        if (e.visible) {
                            e.render(g);
                        }
                    }
                }
            }
        });
        
        
        engine.Scene.Effect = Class.extend({
            scene: null,
            type: 'show',
            options: {
                duration: 1000,
            },
            init: function(scene, type, options) {
                this.scene = scene;
                this.type = type;
                var i;
                for(i in options) {
                    this.options[i] = options[i];
                }
            }
        });
        
        engine.Scene.Effect.Fade = engine.Scene.Effect.extend({
            update: function(dt) {
                if (this.type == 'show') {
                    
                }else {
                    
                }
            },
            render: function(g) {
                
            },
        });
        
        
        engine.Camera = engine.Vector.extend({
            
        });
        
    });