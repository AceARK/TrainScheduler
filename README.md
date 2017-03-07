# TrainScheduler 

Train Scheduler App
----------------------------
Firebase powered app that allows users to check schedule of trains existing in database, or sign in with Github and 'add'/'edit' trains.

Features:
* Real-time train schedule taken from Firebase and displayed.
* Data updated every minute using `setInterval()`.
* Firebase authentication to enable Github sign in.
* User's name, and github profile pic displayed on page once signed in.
* Signing in with Github enables users to 'Add Train', or 'Edit' train details.
* Regex validation for train time inputs. CSS color change to show wrong inputs in textboxes.
* Editing includes 'Update' (table data changes to editable textbox for updating data), 'Remove' (removes a train from Firebase), and a 'Go back to table' button (if you change your mind about editing).

---------------------------
Uses HTML, CSS, Bootstrap, JavaScript, JQuery, and Google Firebase database.