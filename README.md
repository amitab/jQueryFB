# jQueryFB

To initialize: 

```javascript
$fb.init ({
    appId                             : 'xxxxxxxxxxxxx',        // your app id
    version                           : 'v2.1',                 // version of Facebook SDK
    scope                             : 'email',                // the data you need access to
    autocheck                         : true,                   // autocheck login on init()
    status                            : true,                   // optional. default is true
    xfbml                             : true,                   // optional. default is true
    loginSuccessCallback              : function(response) {
                                            // Optional. 
                                            // You can pass a login success handler in the $fb.login() method as well
                                        },
    loginFailCallback                 : function(response) {
                                            // Optional
                                            // You can pass a login fail handler in the $fb.login() method as well
                                        },
    logoutCallback                    : function(response) {
                                            // Optional
                                            // You can pass a logout handler in the $fb.logout() method as well
                                        }
});
```

To Login a user:

```javascript
$fb.login (
    function (response) {
        // Optional only if you have set login success handler in $fb.init() method. 
        // Here you can override the loginSuccessCallback set during $fb.init() method
    },
    function (response) {
        // Optional
        // Here you can override the loginSuccessCallback set during $fb.init() method
    }
);
```

To Logout a user:

```javascript
$fb.logout (
    // Optional callback function
    // Here you can override the logout callback set durin $fb.init() method
    function (response) {
        // logout callback
    }
);
```

To fetch user information:

```javascript
$fb.api({
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