# Sprint meeting
## Participants
- Ezzeldin Ismail
- Stephen Guo
- Saad Mohy-Uddin Bhatti
- Ziyao Yin
- Xinyi Ye
- Jesse Zhang
- Awais Aziz

## Meeting
In this meeting, we discussed:
- what user stories we would like to focus on for this sprint
- the priorities
- the time estimations for each task
- created subtasks
- discussed any potential blockers we should tackle first

# Goals for this sprint
Complete the following user stories:
- **#28**: Endorse student discussions
  - As a teacher(Nick), I want to have the ability to endorse discussions that bring value to the post so that I can provide positive feedback to students that come up with meaningful questions or answers.
- **#31**: Change profile access control
  - As a student(Nicolle), I want to be able to customize my profile access permission so that I can decide whether I want other people to view my profile or not.
- **#29**: Pin student discussions
  - As a teacher(Nick and Ben), I want to be able to pin important posts so that it stays on top of the list and can be viewed by all the students.
- **#21**: Request a regrade
  - As a student(Nicolle), I want to be able to request a regrade for assignments and tests in order to earn marks for misgraded parts of my assignment.
- **#30**: View grades as a student
  - As a student(Nicolle), I want to be able to view my past assignments/tests I have completed in a summary chart so that I can track my progress.
- **#35**: Favorite posts
  - As a student(Nicolle), I want to be able to favourite particular posts so that I can easily find/access them later.
  **#34**: User registration page
  - As a general user, I want to be able to register for the website so I can utilize the websites services.
  **#27**: Course editing page
  - As an instructor, I want to be able to edit the course information so students will be aware of unexpected changes to the course as a whole

## Task breakdown
The user stories are broken into the following subtasks:
- **#28**: Endorse student discussions
  - Add endorse button to posts (frontend)
- **#31**: Change profile access control
  - Edit the user type (backend)
  - Add edit button to profile page (frontend)
  - Implement feature when viewing user page (frontend)
- **#29**: Pin student discussions
  - Add an edit form (frontend)
- **#21**: Request a regrade
  - Add regrade field to assignment class (backend)
  - Add regrade field to surreal assignment db (backend)
  - Trpc endpoint to add a regrade (backend)
  - Show to teacher if a regrade is requested (frontend)
- **#30**: View grades as a student
  - Get assignments given user and course router (backend)
  - Display student grades (frontend)
- **#35**: View grades as a student
  - TRPC router (backend link)
  - Add favorite button and filter (frontend)
  - Edit Post.ts field (backend)
- **#34**: User registration page
  - TRPC router (backend link)
  - Implement frontend registration page (frontend)
- **#27**: Course editing page
  - Frontend course editing page for teachers (frontend)

# Spikes
There are no spikes to report currently for sprint 4. However, if we were to encounter a spike, time would be taken to research such spikes
until we have sufficient data to estimate the tasks.

# Team capacity
We estimate that we can spend about 50 hours of work for the sprint as an entire team. This includes coding, testing, code reviews, design, documentation, and Trello task breakdown.
