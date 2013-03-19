engine.registerModule('Component', '0.1.0')
    .depends('Entity')
    .defines(function() {
        
        var oldEntity = engine.Entity;
        
        engine.Entity = oldEntity.extend({
            init: function(x, y) {
                this._super(x, y);
                this.components = [];
            },
            attach: function(name, component) {
                if (component === undefined) {
                    component = name;
                    name = component.name;
                    
                    if (this.components[name] === undefined) {
                        this.components[name] = component;
                    }else {
                        this.components.push(name);
                    }
                }else {
                    this.components[name] = component;
                }
                component.attached(this);
            },
            detach: function(name, component) {
                if (typeof component === 'string') {
                    return this.components.splice(name);
                }else {
                    var i,c;
                    for(i in this.components) {
                        c = this.components[i];
                    }
                }
            },
            update: function(dt) {
                this._super(dt);
                var i;
                for(i in this.components) {
                    this.components[i].update(dt);
                }
            },
            render: function(g) {
                this._super(g);
                var i;
                for(i in this.components) {
                    this.components[i].render(g);
                }
            },
        });
        
        engine.Component = Class.extend({
            entity: null,
            active: true,//whether it will be updated or not
            visible: true,//whether it is visible or not
            
            init: function(name) {
                this.name = name;
            },
            attached: function(entity) {
                this.entity = entity;
            },
            dettached: function(entity) {
                this.entity = null;
            },
            update: function(dt) {
                
            },
            render: function(g) {
                
            },
        });
        
    });