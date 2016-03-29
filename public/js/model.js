(function (window) {
    "use strict";

    // Model stores items and notifies
    // observers about changes.

    var Model = function (store) {
        this._store = store;
        // this.todos = []; // todos cache

        
        EventBus.reply("todos:create", this.save.bind(this)); 
        EventBus.reply("todos:update", this.save.bind(this));
        EventBus.reply("todos:find", this.find.bind(this));
        EventBus.reply("todos:read", this.read.bind(this));
        EventBus.reply("todos:remove", this.remove.bind(this));

    };

    Model.prototype = {
        find: function (query, callback) {
            var self = this;

            if(typeof query === "function") {
                callback = query;
                query = undefined;
            }

            this._store.find(query, function (err, todos) {
                if(err) {
                    EventBus.publish("todos:find:fail", err);
                } else {
                    self.todos = todos;
                    EventBus.publish("todos:find:done", todos);
                }
                if(callback) callback(err, todos);
            })
        },

        save: function (todo, callback) {
            // Create/Update todo
            var self = this;

            if(todo.id){
                //UPDATE
                this._store.save(todo, function (err, todo) {
                    if(err) {
                        EventBus.publish("todos:update:fail", err);
                    } else {
                        EventBus.publish("todos:update:done", todo);
                        
                        for (var i = 0; i < self.todos.length; i++) {
                            if (self.todos[i].id == todo.id) {
                                for (var key in todo) {
                                    self.todos[i][key] = todo[key];
                                }
                                break;
                            }
                        }
                    }

                if(callback) callback(err, todo);                                // ONE MORE TIME
                });

            } else {
                //CREATE
                this._store.save(todo, function (err, todo) { 
                    if(err) {
                        EventBus.publish("todos:create:fail", err);
                    } else {
                        self.todos.push(todo);
                        EventBus.publish("todos:create:done", todo);
                    }

                    if(callback) callback(err, todo);
                });

            }
        },

            // Create/Update todo
            // when success than publish todos:create:done/todos:update:done with todo
            // when error than publish todos:create:fail/todos:update:fail with fail
            // Update the cash
     
        read: function (id, callback) {

            var self = this;

            function updateCache(todo){
                for(var i = 0; i < self.todos.length; i++){
                    if (self.todos[i].id === todo.id) {
                        return;
                    }                         
                }
                self.todos.push(todo);
            }

            this._store.read(id, function (err, todo) {
                if(err) {
                    EventBus.publish("todos:read:fail", err);
                } else {
                    // self.todos = todos;
                    // updateCache(todo);
                    EventBus.publish("todos:read:done", todo);
                }

                if(callback) callback(err, todo);
            })
        },
            // Read the todo
            // when success than publish todos:read:done with todo
            // when error than publish todos:read:fail with fail
            // Update the cash
       
        remove: function (id, callback) {

            var self = this;

            function removeItem(id) {
                for(var i = 0; i < self.todos.length; i++){
                    if (self.todos[i].id === id) {
                        self.todos.splice(i, 1);
                    }                         
                }
                return;
            }
                        
            this._store.remove(id, function (err, msg) {
                if(err) {
                    EventBus.publish("todos:remove:fail", err);
                } else {
                    // self.todos = todos;
                    removeItem(id);
                    EventBus.publish("todos:remove:done", id);
                }
                if(callback) callback(err, todo); 
            })

            // Remove the todo
            // when success than publish todos:remove:done
            // when error than publish todos:remove:fail with fail
            // Update the cash
            
        }
    };

    // Export to window
    window.app = window.app || {};
    window.app.Model = Model;

})(window);
