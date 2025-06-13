const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const routes = require('./routes/routes');
const axios=require("axios");
const allowedOrigins = ["http://localhost:3001", "http://localhost:3000","http://localhost:3000/email","localhost", `${process.env.FRONTEND_API_BASE_URL}`]; // Add your actual domain here

const { French, Spanish, German, Italian } = require('./models/QnA');
const frenchData = require('./models/frenchData.json');
const spanishData = require('./models/spanishData.json');
// const germanData = require('./models/german.json');
// const italianData = require('./models/italian.json');
const { LessonSpanish, LessonFrench, LessonGerman, LessonItalian} = require('./models/LessonsModel');
const frenchlessonData = require('./models/french.json');
const spanishlessonData = require('./models/spanish.json');
const germanlessonData = require('./models/german.json');
console.log(frenchData, "French Data");


const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();



const cookieParser=require("cookie-parser")
app.use(cookieParser());
app.use(bodyParser.json());





const session = require('express-session');
const MongoStore = require('connect-mongo');


const port = 2000; // Change as needed

// Connect to MongoDB
mongoose.connect('mongodb+srv://ns29260156:MT5hy206fPW0Eoy5@cluster0.gvlue5p.mongodb.net/Verbello');

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["POST","GET","PUT"],
  credentials: true, // Allow credentials (cookies)
  // credentials: 'include',
};



/*async function seedAllLanguages() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect('mongodb+srv://ns29260156:MT5hy206fPW0Eoy5@cluster0.gvlue5p.mongodb.net/Verbello', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Seed French Data
    // await French.insertMany(frenchData);
    // console.log("French data seeded successfully!");
    //add lesson Data
    // await LessonFrench.insertMany(frenchlessonData);
    // console.log("French lesson data seeded successfully!");

    // Seed Spanish Data
    await Spanish.insertMany(spanishData);
    console.log("Spanish data seeded successfully!");
    //add lesson Data
    await LessonSpanish.insertMany(spanishlessonData);
    console.log("Spanish lesson data seeded successfully!");

    // Seed German Data
    // await German.insertMany(germanData);
    // console.log("German data seeded successfully!");
    //add Germanlesson Data
     await LessonGerman.insertMany(germanlessonData);
    console.log("German lesson data seeded successfully!");

    // // Seed Italian Data
    // await Italian.insertMany(italianData);
    // console.log("Italian data seeded successfully!");

  } catch (error) {
    console.error("Error seeding data:", error);
  }
}
seedAllLanguages();  */

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

axios.default.withCredentials = true;

app.use(express.json());



// Configure express-session and connect-mongo for session management
// app.use(session({
//   secret: '1965', // Change this to a secure secret key
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: 'mongodb://localhost:27017/Final_Project',

//   }),
//   cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Session cookie lasts for 1 day
// }));

app.use(
  session({
    name: "cookie.sid",
    secret: "key777",
    secure: false,
    maxAge: 1000 * 60 * 60 * 7,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://ns29260156:MT5hy206fPW0Eoy5@cluster0.gvlue5p.mongodb.net/Verbello",
    }),
  })
);

// Custom middleware to check if the user is authenticated
// const authenticateUser = (req, res, next) => {
//   if (req.session && req.session.user) {
//     // User is authenticated
//     next();
//   } else {
//     // User is not authenticated
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// };




// async function deleteAllData() {
//   try {
//     // Connect to MongoDB
//     // await mongoose.connect('mongodb+srv://your-db-url/Verbello', {
//     //   useNewUrlParser: true,
//     //   useUnifiedTopology: true,
//     // });

//     // Delete all documents from each collection
//     await French.deleteMany({});
//     console.log("All French quiz data deleted.");
    
//     // await Spanish.deleteMany({});
//     // console.log("All Spanish quiz data deleted.");
    
//     // await German.deleteMany({});
//     // console.log("All German quiz data deleted.");
    
//     // await Italian.deleteMany({});
//     // console.log("All Italian quiz data deleted.");

//     // Close connection after deleting
//     process.exit(0);
//   } catch (error) {
//     console.error("Error deleting data:", error);
//     process.exit(1);
//   }
// }

// deleteAllData();






// Use the user router
app.use('/api', routes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
