var $fb = $fb || {};

$fb.init = function (config) {
    
    var settings = {
        appId      : config.appId,
        status     : typeof (config.status) === 'undefined' ? true : config.status,
        xfbml      : typeof (config.xfbml) === 'undefined' ? true : config.xfbml,
        version    : typeof (config.version) === 'undefined' ? 'v2.0' : config.version
    };
    
    var defaultFailCallback = function (response) {
        console.log('Error: ' + typeof (response) === 'undefined' ? 'No response recieved' : response.error);
    };
    
    var callIfAvailiable = function (response, intendedFunction, defaultFunction) {
        if (typeof (intendedFunction) === 'undefined') {
            defaultFunction(response);
        } else {
            intendedFunction(response);
        }
    };
    
    $fb.loginSuccessCallback = config.loginSuccessCallback;

    if (typeof (config.loginFailCallback) === 'undefined') {
        $fb.loginFailCallback = defaultFailCallback;
    } else {
        $fb.loginFailCallback = config.loginFailCallback;
    }

    $fb.scope = config.scope;
    $fb.autocheck = typeof (config.autocheck) === 'undefined' ? true : config.autocheck;

    var statusChangeCallback = function (response, successCallback, failCallback) {

        if (response.status === 'connected') {
            callIfAvailiable(response, successCallback, $fb.loginSuccessCallback);
        } else {
            callIfAvailiable(response, failCallback, $fb.loginFailCallback);
        }

    };

    // Asynchronously load the facebook javascript sdk
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_UK/all.js', function () {
        FB.init(settings);

        $fb.FB = FB;

        // Login dialouge is popped open if user isn't logged in
        $fb.login = function (successCallback, failCallback) {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    callIfAvailiable(response, successCallback, $fb.loginSuccessCallback);
                } else {
                    FB.login(function (response) {
                        statusChangeCallback(response, successCallback, failCallback);
                    }, {
                        scope: $fb.scope,
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
                        callIfAvailiable(response, callback, function () {
                            console.log('User logged out');
                        });
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
        if ($fb.autocheck) {
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });
        }
    });

};

