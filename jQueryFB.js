(function ($) {
    
    'use strict';
    
    $.fn.fb = {};
    
    $.fn.fb.init = function (config) {
        
        function getValue(intendedValue, defaultValue) {
            // returns intendedValue if it is defined else it returns defaultValue
            return typeof (intendedValue) === 'undefined' ? defaultValue : intendedValue;
        }
        
        function callIfAvailiable(callbacks, response) {
            
            if (typeof (callbacks) == 'undefined') {
                return;
            }
            
            if (typeof (callbacks.intendedFunction) === 'undefined') {

                if (typeof (callbacks.defaultFunction) === 'undefined') {
                    return;
                } else {
                    callbacks.defaultFunction(response);
                }

            } else {
                callbacks.intendedFunction(response);
            }
        }
        
        var options = $.extend({
            
            scope                   : {},
            autocheck               : false,
            appId                   : undefined,
            status                  : true,
            xfbml                   : true,
            version                 : 'v2.1',
            loginSuccessCallback    : undefined,
            logoutCallback          : function () {
                window.console.log('User Logged out');
            },
            loginFailCallback       : function (response) {
                window.console.log('Error: ' + getValue(response.error, 'No response recieved'));
            },
            preInitCallback         : undefined,
            postInitCallback        : undefined
            
        }, config);
        
        if (!options.appId) {
            throw new Error("appId not provided in config.");
        }
        
        function statusChangeCallback(response, successCallback, failCallback) {

            if (response.status === 'connected') {
                            
                if (!options.loginSuccessCallback && !successCallback) {
                    throw new Error("Must provide loginSuccessCallback either in config or with the .login() function.");
                }

                callIfAvailiable({
                    intendedFunction: successCallback,
                    defaultFunction: options.loginSuccessCallback
                }, response);

            } else {

                callIfAvailiable({
                    intendedFunction: failCallback,
                    defaultFunction: options.loginFailCallback
                }, response);

            }

        }

        // Asynchronously load the facebook javascript sdk
        $.ajaxSetup({ cache: true });
        $.getScript('//connect.facebook.net/en_UK/all.js', function () {
            (function (FB) {
                
                callIfAvailiable({
                    intendedFunction: options.preInitCallback
                });
                
                FB.init({
                    appId      : options.appId,
                    status     : options.status,
                    xfbml      : options.xfbml,
                    version    : options.version
                });
                
                callIfAvailiable({
                    intendedFunction: options.postInitCallback
                });

                // expose FB
                $.fn.fb.FB = FB;

                // Login dialouge is popped open if user isn't logged in
                $.fn.fb.login = function (successCallback, failCallback) {
                    FB.getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            
                            callIfAvailiable({
                                intendedFunction: successCallback,
                                defaultFunction: options.loginSuccessCallback
                            }, response);
                            
                        } else {
                            FB.login(function (response) {
                                statusChangeCallback(response, successCallback, failCallback);
                            }, {
                                scope: options.scope,
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
                                
                                callIfAvailiable({
                                    intendedFunction: callback,
                                    defaultFunction: options.logoutCallback
                                }, response);
                                
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
                $.fn.fb.ui = function (parameters, successCallback, failCallback) {
                    
                    if (!parameters) {
                        throw new Error("Must provide parameters to .ui() method.");
                    }
                    
                    FB.ui(parameters, function (response) {
                        if (response && !response.error_code) {
                            
                            if (!successCallback) {
                                throw new Error("Must provide successCallback to .ui() method.");
                            }
                            successCallback(response);
                            
                        } else {
                            
                            callIfAvailiable({
                                intendedFunction: failCallback
                            }, response);
                            
                        }
                    });
                };

                // Method to use the FB.api() call
                $.fn.fb.api = function (parameters, successCallback, failCallback) {
                    
                    if (!parameters) {
                        throw new Error("Must provide parameters to .api() method.");
                    }
                    
                    // path, method, params
                    parameters.method = getValue(parameters.method, 'get');

                    FB.api(parameters.path, parameters.method, parameters.params, function (response) {
                        if (!response || response.error) {
                            
                            callIfAvailiable({
                                intendedFunction: failCallback
                            }, response);
                            
                        } else {
                            
                            if (!successCallback) {
                                throw new Error("Must provide successCallback to .api() method.");
                            }
                            successCallback(response);
                        }
                    });

                };

                // Auto check login status after SDK is loaded
                if (options.autocheck) {
                    FB.getLoginStatus(function (response) {
                        statusChangeCallback(response);
                    });
                }
            }(FB));
        });
    };

}(jQuery));

