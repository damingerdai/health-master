# Health Master

health master

## Setup

```bash
docker volume create daming-health-master-volume
docker volume create daming-health-master-redis-volume
docker network create daming-health-master-network

docker-compose pull
```

### Postgresql

create a user, like `dbuser`

```
	
CREATE USER dbuser WITH PASSWORD '<CUSTOM PASSWORD>';
```

create a database, like `exampledb`

```
CREATE DATABASE exampledb OWNER dbuser;
```

add permission to the database with the user:

```
GRANT ALL PRIVILEGES ON DATABASE exampledb TO dbuser.
```

## Install githook

```
chmod ug+x .go-husky/*
sh install_githooks.sh
chmod ug+x .git/hooks/*
```