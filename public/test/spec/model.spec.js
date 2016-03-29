describe("Model", function () {
    "use strict";

    var store, model,
        allTodos = [
            { id: 1, title: "The first task", completed: false },
            { id: 2, title: "The second task", completed: true },
            { id: 3, title: "The third task", completed: false },
            { id: 4, title: "The fourth task", completed: true },
            { id: 5, title: "The fifth task", completed: false },
            { id: 6, title: "The sixth task", completed: true },
            { id: 7, title: "The seventh task", completed: false }
        ];

    beforeEach(function () {
        store = jasmine.createSpyObj("store", ["find", "save", "read", "remove"]);
        model = new app.Model(store);
    });

    describe("find", function () {

        it("should fill model with todos", function () {
            store.find.and.callFake(function (query, callback) {
                callback(null, allTodos);
            });

            model.find();

            expect(model.todos).toEqual(allTodos);
        });

        it("should publish 'todos:find:done' on success", function () {
            store.find.and.callFake(function (query, callback) {
                callback(null, allTodos);
            });

            spyOn(EventBus, "publish");

            model.find();

            expect(EventBus.publish).toHaveBeenCalledWith("todos:find:done", allTodos);
        });

        it("should publish 'todos:find:fail' on error", function () {
            var err = new Error("error");

            store.find.and.callFake(function (query, callback) {
                callback(err);
            });

            spyOn(EventBus, "publish");

            model.find();

            expect(EventBus.publish).toHaveBeenCalledWith("todos:find:fail", err);
        });
    });

    describe("read", function () {

        it("should publish 'todos:read:done' on success", function () {
            var id = 4;

            store.read.and.callFake(function(id,callback){
                callback(null, {"id": id});
            });

            spyOn(EventBus, "publish");

            model.read(id, function(){
                expect(EventBus.publish).toHaveBeenCalledWith("todos:read:done", {"id":id});
            });

        });


        it("should publish 'todos:read:fail' on error", function () {
            var err = new Error("error");

            store.read.and.callFake(function (id, callback) {
                callback(err);
            });

            spyOn(EventBus, "publish");

            model.read();

            expect(EventBus.publish).toHaveBeenCalledWith("todos:read:fail", err);
        });
    });


    describe("remove", function () {

        xit("should publish 'todos:remove:done' on success", function () {
            var id = 4;

            store.remove.and.callFake(function(id,callback){
                callback(null, {"id": id});
            });

            spyOn(EventBus, "publish");

            model.remove(id, function(){
                expect(EventBus.publish).toHaveBeenCalledWith("todos:remove:done", {"id":id});
            });

        });


        it("should publish 'todos:remove:fail' on error", function () {
            var err = new Error("error");

            store.remove.and.callFake(function (id, callback) {
                callback(err);
            });

            spyOn(EventBus, "publish");

            model.remove();

            expect(EventBus.publish).toHaveBeenCalledWith("todos:remove:fail", err);
        });
    });


    describe("save", function () {
        it("should add new todo", function (done) {
            var newTodo = { id: 1000, title: "The n-th task", completed: false };

            model.todos = allTodos.slice(0); // set initial state

            store.save.and.callFake(function (todo, callback) {
                callback(null, newTodo);
            });

            model.save({
                title: "The n-th task"
            }, function(err, todo) {
                expect(todo).toEqual(newTodo);
                expect(model.todos).toContain(jasmine.objectContaining(newTodo));
                expect(model.todos.length).toBe(allTodos.length + 1);

                done();
            });
        });

        it("should update existing todo", function (done) {
            var updatedTodo = { id: 6, title: "The sixth task updated", completed: true };

            model.todos = allTodos.slice(0); // set initial state

            store.save.and.callFake(function (todo, callback) {
                callback(null, updatedTodo);
            });

            model.save(updatedTodo, function(err, todo) {
                expect(todo).toEqual(updatedTodo);
                expect(model.todos).toContain(jasmine.objectContaining(updatedTodo));
                expect(model.todos.length).toBe(allTodos.length);

                done();
            });
        });

        it("should publish 'todos:create:done' on success", function () {
            var newTodo = { id: 1000, title: "The n-th task", completed: false };

            store.save.and.callFake(function (todo, callback) {
                callback(null, newTodo);
            });

            spyOn(EventBus, "publish");

            model.save({
                title: "The n-th task"
            });

            expect(EventBus.publish).toHaveBeenCalledWith("todos:create:done", newTodo);
        });

        xit("should publish 'todos:create:fail' on error", function () {

            var err = new Error("error");

            store.save.and.callFake(function (todo, callback) {
                callback(err);
            });

            spyOn(EventBus, "publish");

            model.save();

            expect(EventBus.publish).toHaveBeenCalledWith("todos:save:fail", err);
        });

        
        it("should publish 'todos:update:done' on success", function () {
            var updatedTodo = { id: 6, title: "The sixth task updated", completed: true };

            store.save.and.callFake(function (todo, callback) {
                callback(null, updatedTodo);
            });

            spyOn(EventBus, "publish");

            model.save(updatedTodo);

            expect(EventBus.publish).toHaveBeenCalledWith("todos:update:done", updatedTodo);
        });

        xit("should publish 'todos:update:fail' on error", function () {
        });
    });
});
