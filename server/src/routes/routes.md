# Routes

Routes (or _routers_) are the intial API endpoints, they tell the server what to do for different paths (aka _routes_).

For instance, the following code will call the `signup` function whenever a `post` request is sent to the signup page (`nachotoast.com/signup`).

```ts
router.post('/signup', signup);
```

These functions like `signup` and `login` are called `controllers` and are imported from the `controllers` directory.

Routes need to be imported into the `index.ts` file to work, otherwise how will the server know to use them?
