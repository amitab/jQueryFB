# jQueryFB

To initialize: 

```javascript
$fb.init({
    appId                             : 'xxxxxxxxxxxxx',        // your app id
    version                           : 'v2.1',                 // version of Facebook SDK
    scope                             : 'email',                // the data you need access to
    autocheck                         : true,                   // autocheck login on init()
    status                            : true,                   // optional. default is true
    xfbml                             : true,                   // optional. default is true
    loginSuccessCallback              : function(response) {
                                            // required
                                        },
    loginFailCallback                 : function(response) {
                                            // optional
                                        },
    logoutCallback                    : function(response) {
                                            // optional
                                        }
});
```

To Login a user:

```javascript
$fb.login(
    optional_success_handler,
    optional_failure_handler
);
```

To Logout a user:

```javascript
$fb.logout(
    // optional callback function
    function(response) {
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