import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY = "YOUR API KEY";
const API_URL =
  "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/";

var input = "YO";
var output = "hello";

app.get("/", (req, res) => {
  res.render("index.ejs", { input: input, output: output });
});

app.post("/submit", async (req, res) => {
  input = req.body.input;
  const choice = req.body.choice;
  console.log(input);
  console.log(choice);
  try {
    const result = await axios.get(API_URL + input, {
      params: { key: API_KEY },
    });
    console.log("Check 1 complete");
    const arr = getOutput(choice, result);
    if (typeof arr == undefined) output = "Not available right now!";
    output = getRandom(arr);
    console.log(arr);
  } catch (error) {
    output = "Not available right now!";
    console.log(output);
  }

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function getOutput(choice, result) {
  switch (choice) {
    case "Definition":
      return result.data[0].shortdef;
    case "Synonym":
      return result.data[0].meta.syns[0];
    case "Antonym":
      return result.data[0].meta.ants[0];
    default:
      return undefined;
  }
}

function getRandom(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
