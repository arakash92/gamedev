engine.registerModule('AI', '0.1.0')
    .depends('Enemy,Component')
    .defines(function() {
        
        engine.Component.AI = engine.Component.extend({
            //these 3 properties are defined in the Component class
            //they are re-defined for reference only.
            entity: null,
            active: true,//whether it will be updated or not
            visible: true,//whether it is visible or not
            
            energy: 100,
            energyRegen: 1,//how much energy is regained each second
            
            options: {
                
            },
            states: [
                
            ],
            init: function(name, options) {
                this._super(name);
                
                if (typeof options === 'object') {
                    var i;
                    for(i in options) {
                        this.options[i] = options[i];
                    }
                }
            },
            update: function(name, options) {
                
                //update
                
            },
        });
        
    });
    

/*


the AI Component is composed of a list of AIStates that can be activated or deactivated
States also have a priority level that determines what actions are taken

The AI Component will only run X amount of AIStates each update. This is the Energy property.

*/



