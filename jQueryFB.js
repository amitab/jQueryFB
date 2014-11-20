(function ($) {
    
    $.fn.fb = {};
    
    $.fn.fb.init = function (config) {

        var getValue = function (intendedValue, defaultValue) {
                // returns intendedValue if it is defined else it returns defaultValue
                return typeof (intendedValue) === 'undefined' ? defaultValue : intendedValue;
            },

            // calls intendedFunction if defined else calls defaultFunction
            callIfAvailiable = function (intendedFunction, defaultFunction, response) {
                if (typeof (intendedFunction) === 'undefined') {
                    
                    if (typeof (defaultFunction) === 'undefined') {
                        return;
                    } else {
                        defaultFunction(response);
                    }
                    
                } else {
                    intendedFunction(response);
                }
            },

            scope = typeof (config.scope) === 'undefined' ? {} : config.scope,

            autocheck = typeof (config.autocheck) === 'undefined' ? true : config.autocheck,

            settings = {
                appId      : config.appId,
                status     : getValue(config.status, true),
                xfbml      : getValue(config.xfbml, true),
                version    : getValue(config.version, 'v2.0')
            },

            defaultFailCallback = function (response) {
                window.console.log('Error: ' + getValue(response.error, 'No response recieved'));
            },

            defaultLogoutCallback = function () {
                window.console.log('User Logged out');
            },

            loginSuccessCallback = config.loginSuccessCallback,

            logoutCallback = getValue(config.logoutCallback, defaultLogoutCallback),

            loginFailCallback = getValue(config.loginFailCallback, defaultFailCallback),
            
            preInitCallback = getValue(config.preInitCallback),
            
            postInitCallback = getValue(config.postInitCallback),

            statusChangeCallback = function (response, successCallback, failCallback) {

                if (response.status === 'connected') {
                    callIfAvailiable(successCallback, loginSuccessCallback, response);
                } else {
                    callIfAvailiable(failCallback, loginFailCallback, response);
                }

            };

        // Asynchronously load the facebook javascript sdk
        $.ajaxSetup({ cache: true });
        $.getScript('//connect.facebook.net/en_UK/all.js', function () {
            (function (FB) {
                
                callIfAvailiable(preInitCallback);
                
                FB.init(settings);
                
                callIfAvailiable(postInitCallback);

                // expose FB
                $.fn.fb.FB = FB;

                // Login dialouge is popped open if user isn't logged in
                $.fn.fb.login = function (successCallback, failCallback) {
                    FB.getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            callIfAvailiable(successCallback, loginSuccessCallback, response);
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
                $.fn.fb.logout = function (callback) {
                    FB.getLoginStatus(function (response) {
                        if (response && response.status === 'connected') {
                            FB.logout(function (response) {
                                callIfAvailiable(callback, logoutCallback, response);
                            });
                        }
                    });
                };

                // Checks login status
                $.fn.fb.checkLoginStatus = function (successCallback, failCallback) {
                    FB.getLoginStatus(function (response) {
                        statusChangeCallback(response, successCallback, failCallback);
                    });
                };

                // Method to use FB.ui() call
                $.fn.fb.ui = function (params, successCallback, failCallback) {
                    FB.ui(params, function (response) {
                        if (response && !response.error_code) {
                            successCallback(response);
                        } else {
                            callIfAvailiable(failCallback, defaultFailCallback, response);
                        }
                    });
                };

                // Method to use the FB.api() call
                $.fn.fb.api = function (parameters, successCallback, failCallback) {
                    // path, method, params

                    if (typeof (parameters.method) === 'undefined') {
                        parameters.method = 'get';
                    }

                    FB.api(parameters.path, parameters.method, parameters.params, function (response) {
                        if (!response || response.error) {
                            callIfAvailiable(failCallback, defaultFailCallback, response);
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
            }(FB));
        });

    };

}(jQuery));

