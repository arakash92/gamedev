engine.registerModule('Entity', '0.1.0')
    .defines(function() {
        engine.Entity = Class.extend({
            init: function(game, name, x, y) {
                this.game = game;
                this.debug = false;
                this.pos = new engine.Vector();
                this.acceleration = new engine.Vector();
                this.velocity = new engine.Vector();
                this.onUpdate;
                this.onRender;
                
                if (typeof name == 'string') {
                    this.name = name;
                }
                if (x !== undefined) {
                    this.pos.x = x;
                }
                if (y !== undefined) {
                    this.pos.y = y;
                }
            },

            applyForce: function(force) {

            },
            
            update: function(dt) {
                if (typeof this.onUpdate == 'function') {
                    this.onUpdate(dt);
                }
            },
            
            renderDebug: function(g) {
                g.fillStyle = 'white';
                g.textAlign = 'center';
                g.fillText(this.name, this.pos.x, this.pos.y);
            },
            
            render: function(g) {
                this.renderDebug(g);
                if (typeof this.onRender == 'function') {
                    this.onRender(g);
                }
            },
        });
    });