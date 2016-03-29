(function(window) {
    // "use strict";

    var Controller = function() {

    EventBus.subscribe("view:create:todo", this.createTodo.bind(this));
    EventBus.subscribe("view:update:todo", this.updateTodo.bind(this));
    EventBus.subscribe("view:remove:todo", this.removeTodo.bind(this));
    }

    Controller.prototype = { 
        createTodo:function(title){
            EventBus.request("todos:create", {
            title:title
            });
         },

        updateTodo:function(todo) {
            EventBus.request("todos:update", todo)
        },

        removeTodo:function(id) {
            EventBus.request("todos:remove", id)
        }
      
    }

        // Export to window
    window.app = window.app || {};
    window.app.Controller = Controller;

})(window);
