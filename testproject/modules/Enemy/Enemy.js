engine.registerModule('Enemy', '0.1.0')
    .depends('Entity,Component')
    .defines(function() {
        
        engine.Enemy = engine.Entity.extend({
            health: 100,
            maxSpeed: 5,
            init: function(game, name, x, y) {
                this._super(game, name, x, y);
            },
            update: function(dt) {
                this.velocity.reset();
                
                //update components
                var i,c;
                for (i in this.components) {
                    c = this.components[c];
                    if (c.active) {
                        c.update(dt);
                    }
                }
                
                //limit acceleration, both positive and negative
                this.acceleration.limit(this.maxSpeed);
                this.acceleration.limit(0 - Math.abs(this.maxSpeed));
                
                //accelerate
                this.velocity.add(this.acceleration);
                
                //multiply velocity by deltaTime to make up for lag
                this.velocity.mult(dt);
                
                //move!
                this.pos.add(this.velocity);
            },
            render: function(g) {
                
            },
        });
        
    });