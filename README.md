# Inbox

The goal of this project is to develop a web mail service, more specifically, an online inbox mail service similar to the GMAIL one from Google. 

## Functionalities

* List the inbox mails
* Read a mail from the inbox list
* Compose new mails
* Forward a mail
* Reply to a mail
* Delete a mail

## Directory structure of the application

### inbox/
This is the application’s root directory.

### package.json
This is a json file containing the name and the version of the application’s required modules.
To install de required modules, run the command:
```shell
npm install
```
Those modules will be installed in the local directory **node-modules**.

### app.js
This script implements the server. This file will contain:
* The back-end of the application
* The creation of the HTTP server through the Express api
* The middleware to automatically return the static content in the public directory
* The middleware to implement the access control
* The routing of the HTTP requests
The server is executed using the command:
```shell
node app.js
```

### public
All the static files, as stylesheet, the vue.js library, and the script containing the vue components go here, in the
subdirectories css and js respectively.

### public/login.html
This is the login form. Through this form we will send by POST the user mail address and password. The
POST request we will be generating by the form submition will be **POST /login**. As the form fields are sent by post,
the query string goes in the body of the request.

### index.html
The single page containing **all the vue components** to handle the user’s inbox operations

