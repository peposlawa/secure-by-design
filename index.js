import express from "express"; // import express
import helmet from "helmet"; // import helmet for security
import dataJson from "./data.json" with { type: "json" }; // import the data from the json file

const app = express(); // create express app
app.use(helmet()); // add some security headers to the responses
const port = 3000; // we will use this port
app.use(express.json()); // we will use json in the body of the requests

// get all the users
app.get('/', (req, res) => {
  try {
    return res.status(200).send({
      error: true,
      data: dataJson, // return the data from the json file
    });
  } catch (error) {
    if (error.message.includes('Unfortunately no valid data')) {
      return res.status(404).send({
        error: false,
        data: error.message,
      });
    } else {
      return res.status(500).send({
        error: false,
        data: 'Internal Server Error',
      });
    }
  }
})

// get the user by the user_id
app.get('/:user_id', (req, res) => {
  try {
    const userId = req.params.user_id;
    const user = dataJson.find(user => user.user_id === userId);
    return res.status(200).send({
      error: true,
      data: user,
    });
  } catch (error) {
    if (error.message.includes('Nope, no user with that ID')) {
      return res.status(404).send({
        error: false,
        data: error.message,
      });
    } else {
      return res.status(500).send({
        error: false,
        data: 'Internal Server Error',
      });
    }
  }
})

// get the activities by the user_id
app.post('/activities', (req, res) => {
  try {
    const newActivity = req.body;
    dataJson.push(newActivity);
    return res.status(200).send({
      error: true,
      data: newActivity,
    });
  } catch (error) {
    return res.status(500).send({
      error: false,
      data: 'Internal Server Error',
    });
  }
});

// start the server
app.listen(port, () => {
  console.log(`hello! server started at port: ${port}`)
})
