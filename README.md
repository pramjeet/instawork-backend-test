This application is using `Express.js` for routing, `express-validator` for input validation, `Objection.js` as ORM and `knex` for running migrations. `knex` is also a dependency of `Objection.js`.

The database being used is `MySQL`.

I havn't used `env variables` as they are very less in numbers. So, I skipped using `dotenv`. 

## Steps to run:

Clone the repo and run `npm install` or `yarn`.

Install `knex` globally with `npm i knex -g`.

Make a new database with name `instawork`, if you wanna use different name then make sure to update it in `knexfile.js` in the root directory.

Make sure to give privileges to the database user.

```sql
CREATE DATABASE instawork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON instawork . * TO 'test'@'localhost';
```

**Update database details in the `knexfile.js` in the root directory.**

Run migrations with the following command in terminal, it will generate the DB schema.

```
knex migrate:latest
```

After successfully running the migrations, the app is ready to use.

Run it with
```
npm start
//or
yarn start
```

The api will be accessible at `localhost:5000`, if you wanna use a different port, then just use the env variable `PORT`

```
PORT=5001 yarn start
```

Once the app is running, api will available at `http://localhost:5000/members`
Below are the examples using CURL, make sure to change the url and data appropriately.


#### Get all members
```
curl -X GET http://localhost:5000/members
```

#### Add new member
```
curl -X POST \
  http://localhost:5000/members \
  -H 'content-type: application/json' \
  -d '{
	"firstName":"Pramjeet",
	"lastName":"Ahlawat",
	"emailId":"pram@test.com",
	"phoneNumber":"9123456789",
	"role":"admin"
  }'
```

#### Modify a member
```
curl -X PUT \
  http://localhost:5000/members/1 \
  -H 'content-type: application/json' \
  -d '{
	"lastName":"Singh"
  }'
```

#### Delete a member
```
curl -X DELETE http://localhost:5000/members/1
```

