# FB jQuery

To initialize: 

```
fb_jQuery.init({
    appId: 'xxxxxxxxxxxxx',
    version: 'v2.1',
    scope: 'email', // the data you need access to
    loginSuccessCallback: function() {
        $('#status').html('User Connected');
    },
    loginFailCallback: function() {
        $('#status').html('User not Connected');
    }
});
```

To Login a user:

```
fb_jQuery.login();
```

To Logout a user:

```
fb_jQuery.logout(
    function(response) {
        // logout callback
    }
);
```

To fetch user information:

```
fb_jQuery.api({
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