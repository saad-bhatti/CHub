Frontend
========
The frontend is built using `Next.js <https://nextjs.org/>`_ with TypeScript and `React Bootstrap <https://react-bootstrap.github.io/>`_.
The frontend communicates with the backend using `tRPC <https://trpc.io/>`_ as the middleware.

.. include:: _templates/dependencies-and-run.rst

Pages
-----
Pages can be seen in the ``pages/`` directory.
Every file is an endpoint to our frontend application.

auth/login/
^^^^^^^^^^^
Login page for all users

profile/
^^^^^^^^
Profile page of currently logged in user

profile/edit/
^^^^^^^^^^^^^
Edit profile page of currently logged in user

users/[user]/
^^^^^^^^^^^^^
See profile of user

courses/
^^^^^^^^
Dashboard of all courses for logged in user

courses/add/
^^^^^^^^^^^^
Add new course

courses/code/[course]/
^^^^^^^^^^^^^^^^^^^^^^
Link to join course

courses/[course]/
^^^^^^^^^^^^^^^^^
Navigation page for a specific course substructure

courses/code/[course]/file/
^^^^^^^^^^^^^^^^^^^^^^^^^^^
See all course documents

courses/code/[course]/file/add-file
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Upload a file to the course

courses/code/[course]/file/[file]
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
See a course document

courses/code/[course]/enrolledStudents
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
See all students enrolled in course

courses/code/[course]/announcements
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
See all course announcements

courses/code/[course]/create-announcement
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Create a course announcement

courses/code/[course]/create-assignment
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Create a course assignment

courses/code/[course]/add-post
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Add a post for course discussion

courses/code/[course]/assignments/
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Assignments for a specific course page

courses/code/[course]/assignments/[assignmentId]
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
See assignment for course

courses/code/[course]/assignments/[assignmentId]/upload
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Upload assignment answer

courses/code/[course]/assignments/[assignmentId]/[user]/
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
See and grade user answers

courses/code/[course]/posts/
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
See all course posts

courses/code/[course]/posts/[postId]
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
See post and its comments

courses/code/[course]/posts/[postId]/add-comment
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Add a comment to post

courses/code/[course]/posts/[postId]/edit-post
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Edit post

courses/code/[course]/posts/[postId]/[commentId]/edit-comment
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Edit comment

courses/[course]/edit-course
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Edit course info

pages/courses/[course]/summary
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
See a summary (only for students)

register
^^^^^^^^
Register as a new student

.. include:: _templates/api.rst

