# Models

Models are the schemas for the database this website uses [MongoDB](https://www.mongodb.com/). They're used by the MongoDB helper library, [Mongoose](https://mongoosejs.com/) to show how things are stored in the database.

For instance, the [user](user.ts) file shows how this websites users are stored, requiring a username, password, email, etc.

Models are exported and used by [controllers](../controllers/controllers.md) for database actions like adding and updating.
