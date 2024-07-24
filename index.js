import express from "express"; // import express
import helmet from "helmet"; // import helmet for security
import dataJson from "./data.json" with { type: "json" }; // import the data from the json file
import { v4 as uuidv4 } from 'uuid'; // import uuid to generate unique ids

const app = express(); // create express app
app.use(helmet()); // add some security headers to the responses
const port = 3000; // we will use this port
app.use(express.json()); // we will use json in the body of the requests

// get all the users
app.get('/activities', (req, res) => {
    return res.status(200).send({
      error: false,
      data: dataJson, // return the data from the json file
    });
})

// get the user by the user_id
app.get('/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const user = dataJson.find(user => user.user_id === userId);
    if (!user) {
      return res.status(404).send({
        error: true,
        data: 'User not found',
      });
    }
    return res.status(200).send({
      error: false,
      data: user,
    });
})

// add a new activity
app.post('/activities', (req, res) => {
    const newActivity = req.body.newActivity;
    
    if (!newActivity) {
      return res.status(400).send({
        error: true,
        data: 'Please provide the activity',
      });
    }
    
    const activity = {
      ...newActivity,
      id: uuidv4(),
      activity_submitted: Date.now(),
    }

    dataJson.push(activity);

    return res.status(200).send({
      error: false,
      data: newActivity,
    });
});

// start the server
app.listen(port, () => {
  console.log(`hello! server started at port: ${port}`)
})
