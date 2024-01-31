<p align="center">
  <img alt="CHub Logo" src="doc/sprint0/logo.png"/>
</p>

## Team

- Ezzeldin Ismail
- Stephen Guo
- Saad Mohy-Uddin Bhatti
- Ziyao Yin
- Xinyi Ye
- Jesse Zhang
- Awais Aziz

## Tech stack

- React
- Next.js
- SurrealDB
- Typescript
- TRPC

## About CHub

We have consistently found it frustrating that students are required to manage a multitude of accounts for each individual course at the university. This inconvenience is further exacerbated by the need to navigate through various websites to access information related to grades and discussion boards. It is especially cumbersome as students often have to check multiple websites for a single course and, when considering all their courses collectively, they are compelled to create and monitor an extensive array of websites.
<br />
<br />
The primary objective of CHub is to address this issue by establishing a centralized platform that consolidates all the essential student services. By doing so, we aspire to streamline the university experience for students, eliminating the necessity to jump between numerous websites throughout their academic journey.
<br />
<br />
We hope that this project will reduce the amount of websites students need to jump around in their university career.

## Usage

### Prerequisites

- [nodev16.9.0](https://nodejs.org/download/release/v16.9.1/)
- [Docker](https://docs.docker.com/get-docker/)

### Running the application

1. Clone the repository
2. Navigate to the root directory of the repository in a terminal
3. Enter `npm i` to install the dependencies
4. Enter `npm run db` to start and initialize the database
5. Enter `npm run dev` to start the development server
6. Open a browser and navigate to `localhost:3000`

_The server will be running on `localhost:3000`_
<br />
_The database will be running on `localhost:8000`_

## Features

1. User Registration

- General users can register for the website.
- Registration involves entering chosen credentials to create a new account.

2. Profile Access Permissions

- Customizable profile access permissions for students.
- Options to select which parts of the profile are accessible to other users.

3. Course Dashboard

- Users (teachers and students) can access a course dashboard.
- Dashboard provides navigation to different parts of the course.

4. Discussion Endorsement

- Ability for teachers to endorse discussions on posts.
- Posts endorsed by instructors should be marked as "endorsed by instructor."

5. Post Creation and Discussions

- Students can create posts and engage in discussions with classmates and instructors.
- Discussions facilitated through a comment section.

6. Favorite Posts

- Students can mark specific posts as favorites.
- Favorited posts categorized into a "my favorites" section for easy access.

7. Pin Important Posts

- Teachers can pin important posts.
- Pinned posts move to a visible position on the list.

8. Request Regrade for Assignments

- Students can request a regrade for assignments and tests.
- Ability to explain which parts of the assignment need regrading and why.

9. Grade Assignments Online

- Teachers can grade assignments and tests online.
- Ability to add marks and comments for each assignment/test.

10. Calculate Average Scores

- Teachers can calculate the average scores of assignments/tests.
- Feature available for assignments with multiple student submissions.

11. Summary Chart for Completed Assignments

- Students can view a summary chart of past assignments/tests.
- Chart demonstrates the summary of completed assignments.

12. View Average Scores

- Students can view the average scores of a given assignment/test.
- Teachers can calculate the class average for an assignment.

13. File Submission and Status Check

- Students can submit assignments to the designated page.
- Ability to check the status of the submission for confirmation.

14. Upload Course Materials

- Teachers can upload course materials to the classroom.
- Uploaded files accessible to students for easy reference.

## Dependencies

**Dependencies:**

| Dependency      | Version |
| --------------- | ------- |
| @trpc/client    | ^9.27.2 |
| @trpc/next      | ^9.27.2 |
| @trpc/react     | ^9.27.2 |
| @trpc/server    | ^9.27.2 |
| bcryptjs        | ^2.4.3  |
| bootstrap       | ^5.2.2  |
| next            | ^12.3.1 |
| next-auth       | ^4.12.3 |
| react           | ^18.2.0 |
| react-bootstrap | ^2.5.0  |
| react-dom       | ^18.2.0 |
| react-query     | ^3.39.2 |
| superjson       | ^1.11.0 |
| surrealdb.js    | ^0.5.0  |
| zod             | ^3.19.1 |

**Dev Dependencies:**

| Dependency      | Version  |
| --------------- | -------- |
| @types/bcryptjs | ^2.4.2   |
| @types/node     | ^18.7.23 |
| @types/react    | ^18.0.21 |
| typescript      | ^4.8.3   |

## File structure

**`components/`** - Contains all the components used in the application

**`/database/`** - Contains the database interface and the database client

- **`interface/`** - Contains the interfaces for the fake database
- **`surrealdb/`** - Contains the code for the database client of SurrealDB
- **`testing/`** - Contains the code for database testing

**`doc/`** - Contains the documentation for the project

**`pages/`** - Contains the pages for the application

- **`api/`** - Contains the API routes for the application
- **`auth/`** - Contains the authentication pages
- **`courses/`** - Contains the course pages
- **`profile/`** - Contains the profile pages
- **`users/`** - Contains the user pages
- **`_app.tsx`** - Initializes the react frontend application
- **`index.tsx`** - Renders the react app by rendering App.js

**`public/`** - Contains the public files for the application

**`types/`** - Contains the types for the application

**`uploads/`** - Contains the uploaded files data for the application

**`utils/`** - Contains the backend utilities for the application

- **`forms/`** - Contains the form utilities for the application
- **`router/`** - Contains the router utilities for the application
- **`testing/`** - Contains the backend testing utilities for the application
- **`types/`** - Contains the types for the backend utilities
- **`trpc.ts`** - Initializes the trpc backend

**`next.config.js`** - Configuration settings for next.js application

**`package.json`** - Defines npm behaviors and packages for the application

**`README.md`** - This file!

**`state.tsx`** - Defines the state for the application

**`tsconfig.json`** - Configuration settings for compiling TypeScript code
