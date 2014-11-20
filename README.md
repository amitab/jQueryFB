# jQueryFB

A jQuery plugin that adds Facebook Javascript SDK asynchronously.

To initialize: 

```javascript
$(document).fb.init ({
    appId                             : 'xxxxxxxxxxxxx',        // your app id
    version                           : 'v2.1',                 // version of Facebook SDK
    scope                             : 'email',                // the data you need access to
    autocheck                         : true,                   // autocheck login on init()
    status                            : true,                   // optional. default is true
    xfbml                             : true,                   // optional. default is true
    preInitCallback                   : function () {
                                            // Optional. Fires before FB.init() is called
                                        },
    postInitCallback                   : function () {
                                            // Optional. Fires after FB.init() is called
                                        },
    loginSuccessCallback              : function(response) {
                                            // Optional. 
                                            // You can pass a login success handler in the $(document).fb.login() method as well
                                        },
    loginFailCallback                 : function(response) {
                                            // Optional
                                            // You can pass a login fail handler in the $(document).fb.login() method as well
                                        },
    logoutCallback                    : function(response) {
                                            // Optional
                                            // You can pass a logout handler in the $(document).fb.logout() method as well
                                        }
});
```

To Login a user:

```javascript
$(document).fb.login (
    function (response) {
        // Optional only if you have set login success handler in $(document).fb.init() method. 
        // Here you can override the loginSuccessCallback set during $(document).fb.init() method
    },
    function (response) {
        // Optional
        // Here you can override the loginSuccessCallback set during $(document).fb.init() method
    }
);
```

To Logout a user:

```javascript
$(document).fb.logout (
    // Optional callback function
    // Here you can override the logout callback set durin $(document).fb.init() method
    function (response) {
        // logout callback
    }
);
```

To fetch user information:

```javascript
$(document).fb.api({
        path: '/me',
        method: 'get', // default is get. Can use post, delete
        params: { fields: 'last_name' } // parameters to pass to Graph API call
    },
    function(response) {
        // success callback
    },
    function(response) {
        // failure callback
    }
);
```