(function (window, $) {
    "use strict";

     function getTodoItemHTML(todo) {
        var i;
        var view = ""; 

        var template
        =   '<li id ="{{id}}" class="{{completed}} {{colorClass}}">'
        +       '<div class="view">'
        +           '<input class="toggle" type="checkbox" {{checked}}>'
        +           '<label class="label">{{title}}</label>'
        +           '<button class="destroy"></button>'
        +           '<button class="important"></button>'
        +       '</div>'
        +   '</li>';

        var completed = "";
        var checked = "";
        var colorClass = "";

        if (todo.completed) {
                completed = "completed";
                checked = "checked";
        }
        if (todo.colorClass) {
            colorClass = "colorClass";
        }
    
        template = template.replace('{{id}}', todo.id);
        template = template.replace('{{title}}', todo.title);
        template = template.replace('{{completed}}', completed);
        template = template.replace('{{checked}}', checked);
        template = template.replace('{{colorClass}}', colorClass);

        view = view + template;
        return view;
        }
        
    
    var View = function(){
        this.$todoList = $(".todo-list");
        this.$newTodo = $(".new-todo");
        this.$toggleAll = $(".toggle-all");
        this.$footer = $(".footer");

        var $view = this;

        //Creates new task
        
        this.$newTodo.change(function(e){
            $('#spinner').show();
            EventBus.publish("view:create:todo", e.target.value);
            
            e.target.value = '';
        });

        //Task is marked as completed

        this.$todoList.on("click", ".toggle", function(e){
            var liEl = $(e.target).closest("li"); 
            $('#spinner').show(); //Add spinner 

            EventBus.publish("view:update:todo", {
                id: liEl.attr("id"), 
                completed: $(e.target)[0].checked}) 
        });


        //     this.$todoList.on("click", ".label", function(e){
        //     $(this).html("").attr('contenteditable', 'true');
        //     var val = $(this).text();
        //         if (e.keyCode == 13) {
        //             console.log("enter");
        //         }
        //     console.log(val);
        // });

        //Adds important class and change task background color
        var colorClassAdd = true;
        this.$todoList.on("click", ".important", function(e){
            var liEl = $(e.target).closest("li");
            colorClassAdd = !colorClassAdd;
            $('#spinner').show();
            EventBus.publish("view:update:todo", {
            id: liEl.attr("id"),
            colorClass: colorClassAdd 
            });
            });

        // Removes task from list

        this.$todoList.on("click", ".destroy", function(e){ 
            var liEl = $(e.target).closest("li"); 
            var liElId = liEl.attr("id");
            $('#spinner').show();
            EventBus.publish("view:remove:todo", liElId);
            
        });

        //Removes all completed tasks

        this.$footer.on("click", ".clear-completed", function(e){
            var completedEl = $view.$todoList.find("li.completed ");
            $.each(completedEl, function(i,el){
                    $('#spinner').show();
                    var id = $(el).attr("id");
                    EventBus.publish("view:remove:todo", id); 
           });
        });
      
        //All tasks are marked as completed
        var completedEl = true;
        this.$toggleAll.change(function(){
            var allLiElements = $view.$todoList.find("li");
            completedEl = !completedEl;
               
            $.each(allLiElements, function(i,el){
            EventBus.publish("view:update:todo", { 
            id: $(el).attr("id"),
            completed: completedEl,
            checked: completedEl 
            });
            });
        });

    EventBus.subscribe("todos:find:done", this.show.bind(this));
    EventBus.subscribe("todos:create:done", this.addItem.bind(this));
    EventBus.subscribe("todos:update:done", this.updateItem.bind(this));
    EventBus.subscribe("todos:remove:done", this.removeItem.bind(this));
    
    };


    // $(window).hashchange( function(){
    //    var hash = 
    // })

View.prototype = {
    init: function(){
        // $('#spinner').hide();
        EventBus.request("todos:find");
    },

    show: function(todos) {
        for (var i = 0; i < todos.length; i++ ){
            $('#spinner').hide();
            this.$todoList.append(getTodoItemHTML(todos[i]));
        }
    },

    addItem: function(todo) {
        $('#spinner').hide();
        this.$todoList.append(getTodoItemHTML(todo));
        toastr.success("Added!")
    },

    updateItem: function(todo) {  
        var $el = this.$todoList.find("li[id = " + todo.id + "]");
        $el.replaceWith(getTodoItemHTML(todo));
        $('#spinner').hide();
        toastr.success("Updated!")
   },

    removeItem: function(id) {  
        this.$todoList.find("li[id = "+ id +"]").remove();
        $('#spinner').hide();
        toastr.warning("Bang, bang!")
        }
};

        // Export to window
    window.app = window.app || {};
    window.app.View = View;

})(window, $);