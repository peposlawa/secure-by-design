import express from 'express'; // import express
import helmet from 'helmet'; // import helmet for security
import dataJson from './data.json' assert { type: 'json' }; // import the data from the json file
import { v4 as uuidv4 } from 'uuid'; // import uuid to generate unique ids

const app = express(); // create express app
app.use(helmet()); // add some security headers to the responses
const port = 3000; // we will use this port
app.use(express.json()); // we will use json in the body of the requests

// GET all activities
app.get('/activities', (req, res) => {
  try {
    // Ensure dataJson is an array
    if (!Array.isArray(dataJson)) {
      return res.status(500).send({
        error: true,
        data: 'Internal Server Error: Data format issue',
      });
    }

    // Map over all users in dataJson
    const responseData = dataJson.map(user => ({
      user_id: user.user_id,
      userName: user.userName,
      data: user.data.map(activity => ({
        ...activity,
        id: activity.id || uuidv4(),  // Generate a new UUID if not present
        activity_submitted: activity.activity_submitted || Date.now()  // Use current timestamp if not present
      }))
    }));

    return res.status(200).send({
      error: false,
      data: responseData,  // Return the modified data
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).send({
      error: true,
      data: 'Internal Server Error',
    });
  }
});

// GET user by user_id
app.get('/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const user = dataJson.find(user => user.user_id === userId);

  if (!user) {
    return res.status(404).send({
      error: true,
      data: 'User not found',
    });
  }

  const responseData = {
    user_id: user.user_id,
    userName: user.userName,
    data: user.data.map(activity => ({
      ...activity,
      id: activity.id || uuidv4(),  // Generate a new UUID if not present
      activity_submitted: activity.activity_submitted || Date.now()  // Use current timestamp if not present
    }))
  };

  return res.status(200).send({
    error: false,
    data: responseData,
  });
});

// POST a new activity
app.post('/activities', (req, res) => {
  const newActivity = req.body.newActivity;

  if (!newActivity || !newActivity.user_id || !newActivity.activity_type || !newActivity.activity_duration) {
    return res.status(400).send({
      error: true,
      data: 'Please provide all required fields: user_id, activity_type, and activity_duration',
    });
  }

  // Find the user with the provided user_id
  const user = dataJson.find(user => user.user_id === newActivity.user_id);

  if (!user) {
    return res.status(404).send({
      error: true,
      data: 'User not found',
    });
  }

  // Create a new activity object with a UUID and current timestamp
  const activity = {
    id: uuidv4(),
    activity_submitted: Date.now(),
    activity_type: newActivity.activity_type,
    activity_duration: newActivity.activity_duration
  };

  // Add the new activity to the user's activities
  user.data.push(activity);

  return res.status(200).send({
    error: false,
    data: activity,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
