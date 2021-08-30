# Routes

Routes (or _routers_) are the intial API endpoints, they tell the server what to do for different paths (aka _routes_).

For instance, the following code will call the `signup` function whenever a `post` request is sent to the signup page (`nachotoast.com/u/signup`).

```ts
router.post('/signup', signup);
```

These functions (such as `signup` and `login`) are called `controllers` and are imported from the [controllers](../controllers/controllers.md) directory.

Routes need to be imported into the [index](../index.ts) file to work.
