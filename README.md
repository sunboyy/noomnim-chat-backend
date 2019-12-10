# Noomnim Chat - Microservices
This is the microservices for backend of Noomnim Chat

## Setting Up
1. Import database from the file `database.sql`.

## Contribution
Make sure you have ESLint and EditorConfig extension installed and enabled on your editor to follow coding conventions.

## Connecting to the web
A front-end repository for this project can be found at https://github.com/pongpong41/noomnim-chat-frontend.

## Running with Docker Compose

1. Clone frontend and backend project side-by-side without renaming the folder
2. Run `docker-compose up` inside the backend project (Don't open the web yet)
3. Open phpMyAdmin on `http://localhost:8888`, login with username `root` and password `password` and import database from file `database.sql`
4. The web application is now ready on `http://localhost`

> Note: Make sure that you are not using port 80 and 8888 otherwise it won't work. In case that the web doesn't work after importing the database, try restarting the Docker Compose. To remove all MySQL data, delete folder `data` from the backend repository folder.
