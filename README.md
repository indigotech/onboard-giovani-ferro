## Taqtile - Onboarding

### Project Name

Onboarding Server

### Description

This project is part of the Taqtile onboarding process. It is designed to help new team members become familiar with the company's technology stack, development patterns, git flow and best practices through **hands-on experience** using git issues to guide the process.

The goal of this project is to develop a server capable of:

- Storing data in a database
- Performing CRUD (Create, Read, Update, Delete) operations on the stored data

### Environment and Tools

- **Node.js**: Runtime environment for JavaScript and TypeScript.
- **TypeScript**: Strongly typed programming language for building scalable applications.
- **Fastify**: Web framework for building APIs.
- **Prisma ORM**: Database toolkit for PostgreSQL.
- **PostgreSQL**: Relational database management system.
- **Docker**: Used to run the PostgreSQL database in a container.

### Steps to Run and Debug

1. **Install Dependencies**:
   Run the following command to install all required dependencies:

   ```bash
   npm install
   ```

2. **Set Up the Database**:

- Ensure Docker is installed and running on your machine.
- Create a .env file in the root of your project and add the following:

  ```bash
  DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
  ```

  Replace `user`, `password`, `localhost`, `5432`, and `mydatabase` with your PostgreSQL credentials.

- Start a PostgreSQL container using Docker-compose:

  ```bash
  docker-compose up
  ```

3. **Generate Prisma Client**:

- Run the following command to generate the Prisma client:

  ```bash
  npx prisma generate
  ```

- This will create the Prisma client in the `client`
-  directory, which is used by your application to interact with the database.

1. **Run Migrations**:

- Apply the database schema to your PostgreSQL database using Prisma migrations:

  ```bash
  npx prisma migrate dev --name init
  ```

- This command will:

  - Create the necessary tables in your database based on the `schema.prisma` file.
  - Track the migration history in the database.

- If you make changes to your `schema.prisma` file in the future, run the same command with a new migration name to apply the updates.

1. **Start the Server**:

- To start the server in production mode, run the following command:

  ```bash
  npm run start
  ```

- To start the server in development mode with live reload, run:

  ```bash
  npm run dev
  ```

- The server will start and listen on the port defined in your code (default: `30001`). You can access the API endpoints using a tool like Postman or your browser.
