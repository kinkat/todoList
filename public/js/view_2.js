(function (window, $) {
    "use strict";

    vartodoItemTemplate =  

    function getTodoItemHTML(todo) {
        var vartodoItemTemplate
        var completed
        var checked

    }

template = template.replace("{{id}}", todo.id);
title
completed
checked

return template

var View = function(){
this.$todoList = $(".todo-list");
this.$newTodo = $(".new-todo");
this.$newTodo.change(function(e){
    EventBus.publish("view:create:todo", e.target.value);
    e.target.value = '';
});

this.$todoList.on("click", ".toggle", function(e){
    EventBus.publish("view:update:todo", {
        id:id,
        completed = e.target.checked; 
    });

});

EventBus.subscribe("todos:find:done", this.show.bind(this));
EventBus.subscribe("todos:create:done", this.addItem.bind(this));
EventBus.subscribe("todos:update:done", this.updateItem.bind(this));

    
};

View.prototype = {
    init: function(){
        EventBus.request("todos:find")
    };

    show: function(todos) {

    },

    addItem: function(todo) {
        this.$todoList.append(getTodoItemHTML(todo));

    },

    updateItem: function(todo) { 
        var $el = this.$todoList.find("[data")

    },
}


        // Export to window
    window.app = window.app || {};
    window.app.View = View;

})(window, $);