(function (window, $) {
    "use strict";

    function Store(url) {
        this.url = url;
    }

    Store.prototype.find = function(query, callback) {
        if(typeof query === "function") {
            callback = query;
            query = "";
        } else if (query === undefined) {
            query = "";
        } else{
            query = '?' + $.param(query);
        } 

        $.ajax({
            type: "GET",
            url: this.url + query,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, xhr) {
                callback(null, data);
            },
            error: function (xhr, status) {
                callback(new Error(xhr.responseText));
                toastr.error("Server error!")
            }
        });
    };


    Store.prototype.read = function(id, callback) {
       callback = callback || function(){};

        $.ajax({
            type: "GET",
            url: this.url + "/" + id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, xhr) {
                callback(null, data);
            },
            error: function (xhr, status) {
                callback(new Error(xhr.responseText))
                toastr.error("Server error!")
            }
        });
     };


    Store.prototype.save = function(todo, callback) {
        callback = callback || function(){};
    
        if (todo.id) {
            $.ajax({
                type: "PUT",
                url: this.url + "/" + todo.id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(todo),
                success: function (data, status, xhr) {
                     callback(null, data);
                 },
                error: function (xhr, status) {
                    callback(new Error(xhr.responseText))
                    toastr.error("Server error!")
            }
        });
        } else {
            $.ajax({

                type: "POST",
                url: this.url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(todo),
                success: function (data, status, xhr) {
                    callback(null, data);
                },
                error: function (xhr, status) {
                    callback(new Error(xhr.responseText));
                    toastr.error("Server error!")
                }
            })
          }
    };

    Store.prototype.remove = function(id, callback) {
        callback = callback || function(){};
        
         $.ajax({
            type: "DELETE",
            url: this.url + "/" + id,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (data, status, xhr) {
                callback(null, data);
            },
            error: function (xhr, status) {
                callback(new Error(xhr.responseText))
                toastr.error("Server error!")
            }
        });

    };
        // Export to window
    window.app = window.app || {};
    window.app.Store = Store;

})(window, $);
