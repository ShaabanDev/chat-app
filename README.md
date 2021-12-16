# Node.js realtime Chat-App
Chat App built using NodeJs, Express, JavaScript, Socket.IO, Mustache, Moment.js, Google Maps.

## Hosted Domain Link

[Chat-Link](http://mo-sh-chat-app.herokuapp.com/)

## Quick start

```bash
# clone the repo
git clone https://github.com/mosh3ban/Chat-App.git 
# install 
npm install
# run
npm start
# for development environment run
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

<p align="center">
  <img src="https://github.com/start-angular/angular2-node-socket-io-chat-app/blob/master/public/Sequence-Diagram.png" alt="Node Socket.io Chat" width="800" height="577"/>
</p>

## File Structure

Here's an overview of how the files are laid out in this project:

```
chat-app
|
├── public/                  * Where our client code is stored
│   ├── css/                  * All of our chat-css styles files are here
│   │   ├── styles.css      	        
│   │   └── styles.min.css      		  
|   |   
│   ├── imgs/                        
|   |	|
│   │   └── favicon.png 					    
|   |   
│   ├── js/                    * All of our js client code is here
│     |
│       └── chat.js 		      	      
|    
├── src/                     * Server side code (socket.io,express,node)
    ├── utils/                * utils for server side
    │   ├── messages.js     	  * to generate messages all with timestamp
    │   └── users.js      		  * Storing users data (id, username, room) and control them.
    |
    └── index.js		         * App entry point
```
