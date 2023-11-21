# Sprint 2 meeting
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
- **#1**: Discussion board
  - Given that I am a student using the service and I’m logged in, when I click the “create post” button, then I should be able to create a post where I can have discussions with my classmates and instructors.
- **#15**: Assignment average
  - Given that I am a student, once the assignments are graded, I should be able to see the average.
- **#2**: Grade assignments
  - Given that I am a teacher and there is at least one assignment/test submitted, when I click the “grade” button on any assignment/test, I should be able to add marks for that assignment/test.
- **#13**: Regrade assignments and tests
  - Given that I am a teacher using the service and there is an assignment that I or other instructors have graded before, when I click the “regrade” button on the assignment, then I should be able to adjust the score and comment attached to the assignment.
- **#12**: Add comments to graded assignments
  - Given that I am a teacher and there is at least one assignment/test submitted, when I click the “grade” button on any assignment/test, I should be able to add comments for that assignment/test.

## Task breakdown
- **#1**: Discussion board
  - Post class
  - Post table
  - Post router
  - Post comment class
  - Post comment table
  - Post comment router
  - display all posts
  - add/edit post
  - add/edit comment
  - see all your own posts
- **#15**: Assignment average
  - TRPC query to calculate assignment average
  - Display assignment average
- **#2**: Grade assignments
  - Add tRPC endpoints for assignment grade-related functionality
  - Display user uploads
  - Add grade for submission
- **#13**: Regrade assignments and tests
  - Check if assignment is graded
- **#12**: Add comments to graded assignments
  - add comments field to class
  - add comments to database
  - add comments to assignment router
  - add comments field to grading assignments
  - add comments field to viewing file upload

# Team capacity
We estimate that we can spend about 40 hours of work for this sprint as an entire team. This includes coding, testing, code reviews, design, documentation, and Trello task breakdown.
