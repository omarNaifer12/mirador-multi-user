# Mirador multi user 

Mirador Multi user is a project that aims to create a multi-user environment for the Mirador 4 viewer.

# Demo 

You can test the application at the following address : TODO

# Features

- Multi-user environment
- User management
- Media management
- Collection management 

# Installation

## Installation DEV (Docker)

- `git clone git@github.com:SCENE-CE/mirador-multi-user.git`
- `cd mirador-multi-user`
- `cp .env.dev.sample .env`
- `nvm use`
- `cd backend`
- `npm install`
- `cd ../frontend-TS`
- `npm install`
- `cd ..`
- `docker-compose up --build`

In an other terminal, run following commands to generate the database
- `docker-compose exec backend npm run typeorm:generate-migration --name=db-init`
- `docker-compose exec backend npm run typeorm migration:run -- -d ./src/config/dataSource.ts`
 
Now you can access :
- frontend to `http://localhost:4000`
- backend to `http://localhost:3000`
- backend API documentation to `http://localhost:3000/api`
- Database to `http://localhost:3306` For DBeaver or other DB client
- Caddy to `http://localhost:9000`

- ## Installation PROD (Docker)

- `git clone git@github.com:SCENE-CE/mirador-multi-user.git`
- `cd mirador-multi-user`
- `cp .env.prod.sample .env`. 

VERY IMPORTANT : 
 
You must set the JWT_SECRET and the DB_PASSWORD in the .env file.
Take care to set a


- `docker-compose up --build`

In an other terminal, run following commands to generate the database

- `docker-compose exec backend npm run typeorm:generate-migration --name=db-init`
- `docker-compose exec backend npm run typeorm migration:run -- -d ./src/config/dataSource.ts`


## Wiki 

https://github.com/SCENE-CE/mirador-multi-user/wiki 

## Maintainers

- Tetras Libre SARL (https://tetraslibre.com)
