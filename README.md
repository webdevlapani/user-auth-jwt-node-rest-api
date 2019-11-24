# node-express-sequalize-starter

This project uses [yarn](https://yarnpkg.com/) package manager.
This project validates the commit message by [this](https://github.com/marionebl/commitlint/tree/master/%40commitlint/config-conventional) convention

## Pre-request installation
  - node (latest)
  - NPM (latest)

### Install yarn

```sh
npm install -g yarn
```

### Install dependencies

```sh
yarn
```
### Create new .env file in projectFolder

```
    copy and paste all thing from .env.example file and do changes according
    set NODE_ENV=production if you wants to run app on production mode
```

### Create one db 

```
    Create one database name as 'VyakarMaster' and set your username and password of mysql database in /server/config/dbConfig.js file
```

### To run the project in development or production mode

```sh
yarn start

after runing above script your server will start on localhost:<<PORT set on .env file>>
``` 
#### For creating database migrations

```sh
yarn migration:create <migration-name>
```

#### For running the database migrations

```sh
yarn db:migrate
```
