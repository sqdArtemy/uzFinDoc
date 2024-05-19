## Name
UzFinDoc - payslips translator

![logo.png](backend/media/logo.png)


## Description
The main purpose of this relatively small web-app is the creation of an efficient and accurate payslip translation application to empower users
 globally to transcend linguistic boundaries, simplify fiscal dialogue, and enhance the user experience. Our values
 are to embrace transparent discussions where all voices heard, active listening to understand diverse views and
 respect for others. We treat this project as communal effort and implement new technologies, methodologies, and
 neutral insights that may benefit Uzbek users. In developing this application, we will utilize an agile framework
 for iterative progress, ensuring code correctness and consistent translations while maintaining high-quality standards 
 through collective code reviews. The application shall translate Uzbek to English language, comprehending
 context-specific financial terms and expressions semantics. Our aspiration is an application that links all through
 efficient, precise translations with user experience optimized.

## Visuals
Preview of the main interface:
 *To be done*

## Backend explanation and installation

In the context of this project, Python language has been used in order to implement backend functionality.
As for data storages, PostgresSQL has been used as the main database and Reddis was used in order to manage
user`s login sessions.

The structure of the backend:

    1) [ Models ]
       This module respesents the stucture of application`s data in terms of programming language.
       Models define the datya schema, relationships between other entitites(models) and different data
       trigers associated with tha data. Basically, models can be observed as the combination of database tables
       mapped to the programming language along with their constraints.

    2) [ Migrations ]
       Migrations are scripts that manage changes to the database schema over time.
       This scripts are used to control versions of the database and help to rollback to previous
       versions of data.
       For example, in order to migrate to the specific version of database, the special command
       "flask db upgrade" could be used. As for rollback to previous versions: "flask db downgrade" can
       be utilized.

    3) [ Schemas ]
       Schemas define the structure of the data which came to the backend from the frontend.
       Schema files usually handle data validation preventing corrupted data to enter the application`s
       data structures.

    4) [ Views ]
       Views are special "functions" which manipulates data that they recieve from schemas and later put this
       data into appropriate models in case of request which are sending information to our appliction. In case, if
       outer resourse desires to receive data from out applications, views provides required data taking it from
       models.

    5) [ Utilities ]
       Utilities contain some useful functions which are used in order to simplify processes in the
       backend. Futhermore, by encapsulating fequently used functions inside utilities` module, 
       DRY (Do not Repeat Yourself) programming principle could be preserved.


In order to install the project as a docker image you should perform, following steps:
    
    1) Generate environmental file (.env) by running script (python ./env_gen) in the console.

    2) Open generated .env file (location: ./backend/.env) and set environmental variables which are not filled.
        Explanation of eahc entry of .env file:
        SECRET_KEY={write here any long string of numbers and digits}
        JWT_SECRET_KEY={write here any long string of numbers and digits}
        POSTGRES_USER="postgres"
        POSTGRES_PW={password from your database}
        POSTGRES_URL={url of your database}
        POSTGRES_DB={name of your database}
        REDIS_HOST="127.0.0.1"
        REDIS_PORT="6379"
        REDIS_DB=0
        UZWORDNET_FILE="./media/uzwordnet.json"
        OPENAI_KEY={openai key}
        OPENAI_MODEL="gpt-4-turbo"
        OPENAI_TEMPERATURE=0.5

    3) Download and install PostgreSQL by following that link: https://www.postgresql.org/download/
       Installtion tutorials:
       Windows: https://www.youtube.com/watch?v=0n41UTkOBb0&ab_channel=GeekyScript
       MAC: https://www.youtube.com/watch?v=PShGF_udSpk&ab_channel=ProgrammingKnowledge
    
    4) Download and install Redis client by following that link: https://redis.io/downloads/
       Installtion tutorials:
       Windows: https://www.youtube.com/watch?v=ncFhlv-gBXQ&ab_channel=AutomationStepbyStep
       MAC: https://www.youtube.com/watch?v=lbWssnwyoZg&ab_channel=MuzafarAli

    5) Enter (flask db upgrade) command in the terminal in order to set up migrations to your database
        *NOTE: If you encountered an issue, try to set env. variable for flask with*
        Windows CLI: (set FLASK_APP=app.py)
        Unix based systems: (export FLASK_APP=app.py)

    6) Run the application with by entering (flask run) command in the command line.
       *NOTE: application could be accessed by default on the local address: http://127.0.0.1:5000 *

## Frontend Structure

```
1) [ Components ]

Components are the fundamental building blocks of the React application. They represent reusable UI elements, encapsulating 
both visual presentation (using JSX in `.tsx` files) and styling (often using CSS preprocessors like Sass in `.scss` files).
* Each component has a specific responsibility, handling its own state and logic. 
Components can be nested to create complex UI hierarchies.
* Examples of components: header, navigation bar, card, form, button, etc.

2) [ Services ]

Services are responsible for fetching and managing data from external sources, typically APIs. 
They often utilize libraries like `axios` to make network requests and handle responses.
* Services encapsulate the logic for interacting with APIs, keeping your components clean and focused on UI. 
This separation of concerns promotes maintainability and testability.
* Services can provide methods for fetching data, creating, updating, and deleting resources on the server.

3) [ Stores ]

Stores are centralized state management containers that hold application-wide data. In this example,
MobX is used to provide reactive updates, ensuring components automatically re-render whenever the data in the store changes.
* Stores manage data access and mutations. Components can access data from stores using MobX observables 
and react to changes through computed properties.
* By using MobX, a clear separation between UI and data logic can be established, 
making the components more predictable and easier to reason about.
```

## Frontend Installation

### 1. Install Node.js

* Node.js is essential for running JavaScript outside of a web browser. Think of it as the engine that powers the React application.
* **Download:** Get the latest version of Node.js from [https://nodejs.org/](https://nodejs.org/) and install it on your computer.


### 2. Enter The Project Directory

* In your terminal, type:
  ```bash
  cd frontend
  ```

### 3. Install Dependencies

* Dependencies are like building blocks for your project.
* Run this command:
  ```bash
  npm install
  ```

### 4. Start the Server

* This command launches the React application:
  ```bash
  npm run dev
  ```

### 5. Open The Project in a Web Browser

* Vite will provide you with a URL, usually `http://localhost:5173/`. Copy and paste this URL into your web browser to see your running React application!

## Usage
 *To be filled out*


## Support
  *To be Filled out*

## Roadmap
  *To be filled out*

## License
Mention out team members contacts:

- Name: Tashyan Artyom
  - LinkedIn: [Artyom Tashyan](https://www.linkedin.com/in/artyom-tashyan-aa4782230)
  - Telegram: [sqd_artemy](https://t.me/sqd_artemy)
  - Email: sqd.artemy@gmail.com

- Name: Ravshan Ubaydullayev
  - Telegram: [MostValuablePlayer](https://t.me/MostValuablePlayer)
  - Email: ravshanltd@gmail.com

- Name: Saidjon Khaydar-Zade
  - LinkedIn: [Saidjon Khaydar-Zade](LinkedIn_URL_here)
  - Telegram: [pyrokko](https://t.me/pyrokko)
  - Email: saidjonzade06@gmail.com

- Name: Pavel Tin
  - LinkedIn: [Pavel Tin](LinkedIn_URL_here)
  - Telegram: [paultinka](https://t.me/paultinka)
  - Email: Email_here

- Name: Farrukh Utkurov
  - LinkedIn: [Farrukh Utkurov](LinkedIn_URL_here)
  - Telegram: [BombmoB](https://t.me/BombmoB)
  - Email: Email_here

- Name: Komiljon Yuldashev
  - LinkedIn: [Komiljon Yuldashev](https://www.linkedin.com/in/komiljon-yuldashev-006549222)  
  - Telegram: [JohnnyKoshev](https://t.me/JohnnyKoshev)
  - Email: komilzonu5@gmail.com
## Project status
WIP - Work In Progress

Improvements:
*To be filled out*
