var fb_jQuery = fb_jQuery || {};

fb_jQuery.init = function (config) {
    
    var settings = {
        appId      : config.appId,
        status     : typeof (config.status) === 'undefined' ? true : config.status,
        xfbml      : typeof (config.xfbml) === 'undefined' ? true : config.xfbml,
        version    : typeof (config.version) === 'undefined' ? 'v2.0' : config.version
    };
    
    fb_jQuery.loginSuccessCallback = config.loginSuccessCallback;

    if (typeof (config.loginFailCallback) === 'undefined') {
        fb_jQuery.loginFailCallback = function (response) {
            console.log('Error: ' + typeof (response) === 'undefined' ? 'No response recieved' : response.error);
        };
    } else {
        fb_jQuery.loginFailCallback = config.loginFailCallback;
    }

    fb_jQuery.scope = config.scope;

    var statusChangeCallback = function (response) {

        if (response.status === 'connected') {
            fb_jQuery.loginSuccessCallback(response);
        } else if (response.status === 'not_authorized') {
            fb_jQuery.loginFailCallback(response);
        } else {
            fb_jQuery.loginFailCallback(response);
        }

    };

    // Asynchronously load the facebook javascript sdk
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_UK/all.js', function () {
        FB.init(settings);

        fb_jQuery.FB = FB;

        // Method to use the FB.api() call
        fb_jQuery.api = function (parameters, successCallback, failCallback) {
            // path, method, params

            if (typeof (parameters.method) === 'undefined') {
                parameters.method = 'get';
            }

            FB.api(parameters.path, parameters.method, parameters.params, function (response) {
                if (!response || response.error) {
                    if (typeof (failCallback) === 'undefined') {
                        console.log('Error: ' + typeof (response) === 'undefined' ? 'No response recieved' : response.error);
                    } else {
                        failCallback(response);
                    }
                } else {
                    successCallback(response);
                }
            });

        };

        // Login dialouge is popped open if user isn't logged in
        fb_jQuery.login = function () {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    fb_jQuery.loginSuccessCallback(response);
                } else {
                    FB.login(function (response) {
                        statusChangeCallback(response);
                    }, {
                        scope: fb_jQuery.scope,
                        return_scopes: true
                    });
                }
            });
        };

        // user is logged out of App
        fb_jQuery.logout = function (successCallback) {
            FB.getLoginStatus(function (response) {
                if (response && response.status === 'connected') {
                    FB.logout(function (response) {
                        successCallback(response);
                    });
                }
            });
        };

        // Checks login status
        fb_jQuery.checkLoginStatus = function (successCallback, failCallback) {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    successCallback(response);
                } else {
                    if (typeof (failCallback) === 'undefined') {
                        console.log('Error: ' + typeof (response) === 'undefined' ? 'No response recieved' : response.error);
                    } else {
                        failCallback(response);
                    }
                }
            });
        };

        // Method to run FB.ui()
        fb_jQuery.ui = function (params, successCallback, failCallback) {
            FB.ui(params, function (response) {
                if (response && !response.error_code) {
                    successCallback(response);
                } else {
                    if (typeof (failCallback) === 'undefined') {
                        console.log('Error: ' + typeof (response) === 'undefined' ? 'No response recieved' : response.error);
                    } else {
                        failCallback(response);
                    }
                }
            });
        };
        
        // Auto check login status after SDK is loaded
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    });

};

