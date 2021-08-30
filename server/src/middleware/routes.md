# Middleware

Middleware functions are the step between (aka in the _middle_ of) the routes and controllers. Their main purpose is to validate incoming requests before passing them onto the controllers.

The most common example would be an authentication checking middleware, making sure the user is logged in and has the right password before doing an action their behalf.

Middleware are applied in [routes](../routes/routes.md), below is one example of said application using a `/likePost` route, `checkAuth` middleware, and `likePost` controller.

```ts
router.post('/likePost', checkAuth, likePost);
```

Middleware don't have to be used for anything however, some actions such as `get` requests don't need authentication.
