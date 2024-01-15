/\*\*

- @api {get} /users Get all users
- @apiName GetUsers
- @apiGroup Users
-
- @apiSuccess {Object[]} users List of users.
- @apiSuccess {String} users.name User's name.
- @apiSuccess {String} users.email User's email.
  \*/

/\*\*

- @api {post} /users Create a new user
- @apiName CreateUser
- @apiGroup Users
-
- @apiParam {String} name User's name.
- @apiParam {String} email User's email.
-
- @apiSuccess {String} message Success message.
  \*/

/\*\*

- @api {get} /users/:id Get a user by ID
- @apiName GetUser
- @apiGroup Users
-
- @apiParam {String} id User's ID.
-
- @apiSuccess {String} name User's name.
- @apiSuccess {String} email User's email.
  \*/

/\*\*

- @api {put} /users/:id Update a user
- @apiName UpdateUser
- @apiGroup Users
-
- @apiParam {String} id User's ID.
- @apiParam {String} [name] User's name.
- @apiParam {String} [email] User's email.
-
- @apiSuccess {String} message Success message.
  \*/

/\*\*

- @api {delete} /users/:id Delete a user
- @apiName DeleteUser
- @apiGroup Users
-
- @apiParam {String} id User's ID.
-
- @apiSuccess {String} message Success message.
  \*/
