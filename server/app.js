require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rephraseRoute = require("./routes/rephrase");
const grammarCheckRoute = require("./routes/grammarCheck");
const spellCheckRoute = require("./routes/spellChecker");
const app = express();

const PORT = process.env.PORT || 8000;

// https://api.openai.com/v1/chat/completions

//middlewares
app.use(cors()); //to prevent cross origins network errors
app.use(express.json()); // To parse application

//Routes
app.use("/api/rephrase", rephraseRoute);
app.use("/api/grammarcheck", grammarCheckRoute);
app.use("/api/spellcheck", spellCheckRoute);



//starting the server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`);
});


//Not gonna use mvc design pattern in this project
// will implement authentication on the frontend