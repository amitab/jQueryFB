var fb_jQuery = fb_jQuery || {};

fb_jQuery.init = function (config) {

    fb_jQuery.loginSuccessCallback = config.loginSuccessCallback;
    
    if (typeof (config.loginFailCallback) === 'undefined') {
        fb_jQuery.loginFailCallback = function (response) {
            console.log('Error: ' + typeof (response) === 'undefined' ? 'No response recieved' : response.error);
        };
    } else {
        fb_jQuery.loginFailCallback = config.loginFailCallback;
    }
    
    fb_jQuery.scope = config.scope;

    fb_jQuery.statusChangeCallback = function (response) {

        if (response.status === 'connected') {
            fb_jQuery.loginSuccessCallback(response);
        } else if (response.status === 'not_authorized') {
            fb_jQuery.loginFailCallback(response);
        } else {
            fb_jQuery.loginFailCallback(response);
        }

    };

    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_UK/all.js', function () {
        FB.init({
            appId      : config.appId,
            version    : config.version
        });
        
        fb_jQuery.FB = FB;

        FB.getLoginStatus(function (response) {
            fb_jQuery.statusChangeCallback(response);
        });
    });

    fb_jQuery.api = function (parameters, successCallback, failCallback) {
        // path, method, params
        
        if (typeof (parameters.method) === 'undefined') {
            parameters.method = 'get';
        }
        
        if (typeof (parameters.params) === 'undefined') {
            FB.api(parameters.path, parameters.method, function (response) {
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
            
        } else {
        
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
        
        }
        
    };

    fb_jQuery.facebookLogin = function () {
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                fb_jQuery.loginSuccessCallback(response);
            } else {
                FB.login(function (response) {
                    fb_jQuery.statusChangeCallback(response);
                }, {
                    scope: fb_jQuery.scope,
                    return_scopes: true
                });
            }
        });
    };

    fb_jQuery.facebookLogout = function (successCallback) {
        FB.getLoginStatus(function (response) {
            if (response && response.status === 'connected') {
                FB.logout(function (response) {
                    successCallback(response);
                });
            }
        });
    };

    fb_jQuery.facebookCheckStatus = function (successCallback, failCallback) {
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


};

