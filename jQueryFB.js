var $fb = $fb || {};

$fb.init = function (config) {

    var scope = typeof (config.scope) === 'undefined' ? {} : config.scope,
        
        autocheck = typeof (config.autocheck) === 'undefined' ? true : config.autocheck,
        
        settings = {
            appId      : config.appId,
            status     : getValue(config.status, true),
            xfbml      : getValue(config.xfbml, true),
            version    : getValue(config.version, 'v2.0')
        },
        
        defaultFailCallback = function (response) {
            console.log('Error: ' + getValue(response.error, 'No response recieved'));
        },
        
        defaultLogoutCallback = function () {
            console.log('User Logged out');
        },
        
        // returns intendedValue if it is defined else it returns defaultValue
        getValue = function(intendedValue, defaultValue) {
            return typeof (intendedValue) === 'undefined' ? defaultValue : intendedValue;
        },
        
        // calls intendedFunction if defined else calls defaultFunction
        callIfAvailiable = function (response, intendedFunction, defaultFunction) {
            if (typeof (intendedFunction) === 'undefined') {
                defaultFunction(response);
            } else {
                intendedFunction(response);
            }
        },
        
        loginSuccessCallback = config.loginSuccessCallback,
        
        logoutCallback = getValue(config.logoutCallback, defaultLogoutCallback),
        
        loginFailCallback = getValue(config.loginFailCallback, defaultFailCallback),
        
        statusChangeCallback = function (response, successCallback, failCallback) {

            if (response.status === 'connected') {
                callIfAvailiable(response, successCallback, loginSuccessCallback);
            } else {
                callIfAvailiable(response, failCallback, loginFailCallback);
            }

        };

    // Asynchronously load the facebook javascript sdk
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_UK/all.js', function () {
        // todo: add before loading SDK event
        FB.init(settings);
        // todo: add after loading SDK event
        
        // expose FB
        $fb.FB = FB;

        // Login dialouge is popped open if user isn't logged in
        $fb.login = function (successCallback, failCallback) {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    callIfAvailiable(response, successCallback, loginSuccessCallback);
                } else {
                    FB.login(function (response) {
                        statusChangeCallback(response, successCallback, failCallback);
                    }, {
                        scope: scope,
                        return_scopes: true
                    });
                }
            });
        };

        // user is logged out of App
        $fb.logout = function (callback) {
            FB.getLoginStatus(function (response) {
                if (response && response.status === 'connected') {
                    FB.logout(function (response) {
                        callIfAvailiable(response, callback, logoutCallback);
                    });
                }
            });
        };

        // Checks login status
        $fb.checkLoginStatus = function (successCallback, failCallback) {
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response, successCallback, failCallback);
            });
        };

        // Method to use FB.ui() call
        $fb.ui = function (params, successCallback, failCallback) {
            FB.ui(params, function (response) {
                if (response && !response.error_code) {
                    successCallback(response);
                } else {
                    callIfAvailiable(response, failCallback, defaultFailCallback);
                }
            });
        };

        // Method to use the FB.api() call
        $fb.api = function (parameters, successCallback, failCallback) {
            // path, method, params

            if (typeof (parameters.method) === 'undefined') {
                parameters.method = 'get';
            }

            FB.api(parameters.path, parameters.method, parameters.params, function (response) {
                if (!response || response.error) {
                    callIfAvailiable(response, failCallback, defaultFailCallback);
                } else {
                    successCallback(response);
                }
            });

        };
        
        // Auto check login status after SDK is loaded
        if (autocheck) {
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });
        }
    });

};

