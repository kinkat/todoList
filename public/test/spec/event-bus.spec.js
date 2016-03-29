describe("EventBus", function () {
          "use strict";

          var Model = function () {};
          Model.prototype = {
              addTodo: function (todo) {
                  // ... here goes some code adding todo

                  EventBus.publish("todo:added", todo);
              }
          };

          var View = function () {
              EventBus.subscribe("todo:added", this.todoAdded);
          };
          View.prototype = {
              todoAdded: function (todo) {
                  // ... here goes some code drowing todo item
              }
          };

          beforeEach(function () {
              // We need to call spyOn first before the 'new'
              // as we want the spy to be a subscribe callback
              spyOn(View.prototype, "todoAdded");

              this.model = new Model();
              this.view = new View();
          });


          it("should publish todo:added event", function () {
              var todo = {
                  title: "My task"
              };
              this.model.addTodo(todo);

              expect(this.view.todoAdded).toHaveBeenCalledWith(todo);
          });

      });