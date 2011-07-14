app = {
    log: function(a){
        if (console && console.log) {
            console.log(a);
        }
    },
    _createWrap: function(prefix, key, func){
        if (key === 'createWrap') {
            return func;
        }
        return function(){
            var args = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                args += ", " + arguments[i];
            }
            app.log(prefix + key + '(' + args + ')');
            return func.apply(this, arguments);
        }
    },
    
    _setupLogging: function(){
        var wrap = function(home, prefix){
            for (var key in home) {
                if (typeof home[key] === 'function') {
                    home[key] = app._createWrap(prefix, key, home[key]);
                }
            }
        };
        
        wrap(app.control, 'app.control.');
        wrap(app.gui, 'app.gui.');
        wrap(app.actions, 'app.actions.');
    },
    
    _ajax: function(method, urlPart, parameters, callback){
        app.log(method + ',' + urlPart + ',' + parameters + ',' + callback);
        $.ajax({
            cache: false,
            data: parameters,
            dataType: 'json',
            success: function(data){
                if (callback) {
                    callback.apply(this, arguments);
                }
            },
            type: method,
            url: urlPart
        });
    },
    _get: function(urlPart, parameters, callback){
        app._ajax('GET', 'get.php?urlPart=' + urlPart, parameters, callback);
    },
    _post: function(urlPart, parameters, callback){
        app._ajax('POST', 'post.php?urlPart=' + urlPart, parameters, callback);
    },
	_login: function(username, password, callback) {
		$.ajax({
			url: 'session.php',
			data: {
				username: username,
				password: password
			},
			success: callback
		});
	},
    
    actions: {
        login: function(){
            $(app.gui.screens.credentials).slideUp(function(){
				$(app.gui.screens.tabs).slideDown();
			});
            app.control.login();
        },
        send: function(){
            var from = $('#from').val();
            var to = $('#to').val();
            var msg = $('#message').val();
            app.control.send(from, to, msg);
        },
        numbers_reload: function(){
            app.control.reload_numbers();
        },
        numbers_add: function(){
            app.control.add_number();
        }
    },
    
    control: {
        login: function(){
            var username = $('#username').val();
            var password = $('#password').val();
        	app._login(username, password, app.actions.numbers_reload);
        },
        add_number: function(){
            app._post('Numbers', {
                country: 'se',
                sms_url: 'http://hemma.wendt.se/46elks/callback.php'
            }, app.actions.numbers_reload);
        },
        reload_numbers: function(){
            app._get('Numbers', {}, app.gui.update_number_list);
        },
        send: function(from, to, msg){
            app._post('SMS', {
                from: from,
                to: to,
                message: msg
            }, function(data){
                alert(data);
            })
        }
    },
    
    gui: {
    
        update_number_list: function(data){
            var targetId = "#number_list";
            if (data.numbers.length == 0) {
                $(targetId).html('<li>No numbers.</li>');
                return;
            }
            
            $(targetId).html('');
            for (var i = 0; i < data.numbers.length; i++) {
                var number = data.numbers[i];
                var html = "<li class='number' id='" + number.id + "'>" + number.number + "</li>";
                $(html).appendTo(targetId);
            }
        },
        
        screens: {
            credentials: '#screen-credentials',
            numbers: '#screen-numbers',
            send: '#screen-send',
			tabs: '#tabs'
        },
        buttons: {
            login: '#login',
            send: '#send',
            numbers_reload: '#numbers-reload',
            numbers_add: '#numbers-add'
        }
    }
}
app._setupLogging();

$(function(){
    $(app.gui.screens.tabs).tabs();
    for (var b in app.gui.buttons) {
        $(app.gui.buttons[b]).button().click(app.actions[b]);
    }
});
