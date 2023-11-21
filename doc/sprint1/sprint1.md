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
- **SPRIN-9**: Edit user profile
  - As a general user (teacher and student), I want to be able to access and edit my user profile including my nickname and alias so that other people can find me easier.
- **SPRIN-2**: Log in
  - As a general user (teacher and student), I want to be able to log in to the website using my credentials so that I can access information posted on the website.
- **SPRIN-1**: Generate classroom invitation link
  - As a teacher(Nick), I want to create online classrooms and generate corresponding links to invite my students to join the classrooms so that I can manage my students.
- **SPRIN-12**: Make announcements
  - Given that I am a teacher using the service and I’m logged in, when I click the “make an announcement” button, fill in my announcement, and click the “post” button, the whole class of students should see the announcement I just made.
- **SPRIN-10**: Access and search user profiles
  - Given that I am a user when I click on other people’s profile who's in the same course as me, I should be able to view their details.

## Task breakdown
The user stories are broken into the following subtasks:
- **SPRIN-9**: Edit user profile
  - **SPRIN-37**: Trpc query (frontend user)
  - **SPRIN-36**: Edit boxes and submit/cancel buttons
  - **SPRIN-39**: Trpc query (backend user)
- **SPRIN-2**: Log in
  - **SPRIN-21**: User class
  - **SPRIN-25**: Input boxes and log in button
  - **SPRIN-26**: Trpc query (frontend auth)
  - **SPRIN-22**: Fake database
  - **SPRIN-23**: Trpc log in query
- **SPRIN-1**: Generate classroom invitation link
  - **SPRIN-22**: Fake database
  - **SPRIN-34**: Trpc query (frontend link)
  - **SPRIN-29**: Create unique link for each course
  - **SPRIN-28**: Course class
  - **SPRIN-33**: Trpc query (backend link)
  - **SPRIN-32**: Link generating button
  - **SPRIN-31**: Display link
- **SPRIN-12**: Make announcements
  - **SPRIN-48**: Backend trpc query
  - **SPRIN-49**: Announcement class
  - **SPRIN-50**: Add announcments to the database
  - **SPRIN-51**: UI display for announcement
  - **SPRIN-52**: Frontend trpc query to retrieve announcement
  - **SPRIN-53**: UI to make an announcement
- **SPRIN-10**: Access and search user profiles
  - **SPRIN-57**: Get all similar course users trpc query
  - **SPRIN-58**: Don't display edit button when its not the page owner

# Team capacity
We estimate that we can spend about 40-50 hours of work per sprint as an entire team. This includes coding, testing, code reviews, design, documentation, and Jira task breakdown.
