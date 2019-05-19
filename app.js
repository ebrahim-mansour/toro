const path = require('path')
const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const usersRouter = require('./src/routes/usersRouter');
const traineeProfileRouter = require('./src/routes/traineeProfileRouter');
const coachProfileRouter = require('./src/routes/coachProfileRouter');

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

const Chat = require('./src/models/chat');

io.on('connection', (socket) => {
  socket.on('join', async options => {

    const user = { ...options }
    const roomId = user.roomId;
    // Adding the user to the room
    socket.join(roomId);
    
    // Get old chat from database
    let messages = await Chat.getMessagesOfRoom(roomId);
    messages.forEach(message => {
      socket.emit('message', message);
    });
  });
  
  socket.on('sendMessage', async (messageInfo, callback) => {
    // Preparing the message id
    let id;
    let maxId = await Chat.getMaxId();
    if (maxId) {
      id = maxId + 1;
    } else {
      id = 1;
    }
    const senderName = messageInfo.username;
    const roomId = parseInt(messageInfo.roomId);
    const message = messageInfo.message;
    
    let newMessage = new Chat({
      id,
      message,
      senderName,
      roomId
    });
    // Save chat to database
    Chat.addMessage(newMessage);

    io.to(roomId).emit('message', newMessage);
    callback();
  });
});

// using pug as a template engine
app.set('views', './src/views');
app.set('view engine', 'pug');

// serve static files such as images, CSS files, and JavaScript files
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Express Validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    let namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg,
      value
    };
  }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res) => {
  let user = req.user;

  if (user !== undefined) {
    let role = req.user.role;

    if (req.isAuthenticated()) {
      if (role == 1) {
        res.redirect('/coachProfile');
      } else {
        res.redirect('/traineeProfile');
      }
    }
  } else {
    return res.render('index');
  }
});

app.use('/users', usersRouter);
app.use('/traineeProfile', traineeProfileRouter);
app.use('/coachProfile', coachProfileRouter);

app.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out!');
  return res.redirect('/users/login');
});

app.use( (req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

server.listen(port, (err) => {
  if (err) throw err
  console.log('running on http://localhost:' + port);
});