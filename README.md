# GoShopping

This is a full-stack shopping list management web application that was built to learn and explore some of the languages and technolgies used.

## Features 

The web app provides shopping list management prior to account creation by using web localStorage. With account creation it offers enhanced features such as persisting lists across devices and sharing shopping lists with other users.

## Technologies Used

The backend is written in Go and uses the chi library for the routing library. It connects to a MongoDB database for user and shopping list storage.

The front-end is build with TypeScript and React. Major libraries used are Redux/rtk-query, Material UI, and React Router. The static bundle is embedded in the Go compiled executable file and served from the backend.

### How to run

If you would like to run this project locally you can use the steps below:

1. Clone the project
2. Install and run a local instance of MongoDB
3. Create a .env file with the following env variables
```
MONGO_DB_URI="mongodb://localhost"
JWT_SIGN_KEY="your-secret-key-will-go-here"
PORT=8080
```
4. Install godotenv (https://github.com/joho/godotenv) as a bin command. It is used to provide environmental variables to the app. Alternatively, you could implement another way to provide those env variables.

5. In the main project directory enter:
```
make run
```
This will run a script in the Makefile and launch both the backend as well as the React dev server. The build-and-run script would first compile the project and then run the executable file.

MongoDB should create a local database called go-shopping when the app starts up.
