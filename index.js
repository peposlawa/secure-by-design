import express from "express"; // import express
import helmet from "helmet"; // import helmet for security
import dataJson from "./data.json" assert { type: "json" }; // import the data from the json file
import { v4 as uuidv4 } from "uuid"; // import uuid to generate unique ids
import moment from "moment";

const app = express(); // create express app
app.use(helmet()); // add some security headers to the responses
const port = 3000; // we will use this port
app.use(express.json()); // we will use json in the body of the requests

app.get("/", (req, res) => {
  res.status(200).send({
    error: false,
    data: "Hello World!", // Return the modified data
  });
});
// GET all activities
app.get("/activities", (req, res) => {
  try {
    if (!Array.isArray(dataJson)) {
      return res.status(500).send({
        error: true,
        data: "Data format issue!",
      });
    }

    // Map over all users in dataJson
    const responseData = dataJson.map((user) => ({
      user_id: user.user_id,
      userName: user.userName,
      data: user.data.map((activity) => ({
        ...activity,
        activity_submitted: activity.activity_submitted || Date.now(), // Ensure timestamp is there
      })),
    }));
    return res.status(200).send({
      error: false,
      data: responseData,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).send({
      error: true,
      data: "Internal Server Error",
    });
  }
});

// GET user by user_id
app.get("/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const user = dataJson.find((user) => user.user_id === userId);

  if (!user) {
    return res.status(404).send({
      error: true,
      data: "User not found",
    });
  }

  const responseData = {
    user_id: user.user_id,
    userName: user.userName,
    data: user.data.map((activity) => ({
      ...activity,
      activity_submitted: activity.activity_submitted || Date.now(), // Ensure timestamp is there
    })),
  };

  return res.status(200).send({
    error: false,
    data: responseData,
  });
});

// POST a new activity
// app.post('/activities', (req, res) => {
//   const newActivity = req.body.newActivity;

//   if (!newActivity || !newActivity.user_id || !newActivity.activity_type || !newActivity.activity_duration) {
//     return res.status(400).send({
//       error: true,
//       data: 'Please provide all required fields: user_id, activity_type, and activity_duration',
//     });
//   }

//   // Find the user with the provided user_id
//   const user = dataJson.find(user => user.user_id === newActivity.user_id);

//   if (!user) {
//     return res.status(404).send({
//       error: true,
//       data: 'User not found',
//     });
//   }

//   // Create a new activity object with a UUID and current timestamp
//   const activity = {
//     id: uuidv4(),
//     activity_submitted: Date.now(),
//     activity_type: newActivity.activity_type,
//     activity_duration: newActivity.activity_duration
//   };

//   // Add the new activity to the user's activities
//   user.data.push(activity);

//   return res.status(200).send({
//     error: false,
//     data: activity,
//   });
// });
app.post("/activities", (req, res) => {
  const { user_id, activity_type, activity_duration } = req.body;

  if (!user_id || !activity_type || !activity_duration) {
    return res.status(400).send({
      error: true,
      data: "Please provide all required fields: user_id, activity_type, and activity_duration",
    });
  }

  const user = dataJson.find((user) => user.user_id === user_id);

  if (!user) {
    return res.status(404).send({
      error: true,
      data: "User not found",
    });
  }

  const activity = {
    id: uuidv4(),
    activity_submitted: moment().toISOString(),
    activity_type,
    activity_duration,
  };

  user.data.push(activity);

  return res.status(200).send({
    error: false,
    data: activity,
  });
});

// PUT a new activity
app.put("/activities", (req, res) => {
  try {
    const newActivity = req.body; //

    // Log the received request body for debugging
    console.log("Received new activity:", newActivity);

    // Validate request body
    if (
      !newActivity ||
      !newActivity.user_id ||
      !newActivity.activity_type ||
      !newActivity.activity_duration
    ) {
      return res.status(400).send({
        error: true,
        data: "Please provide all required fields: user_id, activity_type, and activity_duration",
      });
    }

    const userId = newActivity.user_id.toString(); // Ensure user_id is treated as a string
    const activityId = newActivity.activity_id.toString(); // Unique ID for the activity

    const user = dataJson.find((user) => user.user_id === userId); // Find the user

    // Check if user exists
    if (!user) {
      console.log("User not found for user_id:", userId); // Log the user_id for debugging
      return res.status(404).send({
        error: true,
        data: "User not found",
      });
    }
    const existingActivityIndex = user.data.findIndex(
      (activity) => activity.id === activityId
    ); // Check if the activity already exists
    if (existingActivityIndex !== -1) {
      // Update existing activity
      user.data[existingActivityIndex] = {
        ...user.data[existingActivityIndex],
        activity_type: newActivity.activity_type,
        activity_duration: newActivity.activity_duration,
        activity_submitted: moment().toISOString(), // Update timestamp
      };
      return res.status(200).send({
        error: false,
        data: user.data[existingActivityIndex],
      });
    } else {
      // Add new activity
      const activity = {
        id: uuidv4(),
        activity_submitted: moment().toISOString(), // Use moment to get current time in ISO format
        activity_type: newActivity.activity_type,
        activity_duration: newActivity.activity_duration,
      };

      user.data.push(activity);

      res.status(200).send({
        error: false,
        data: activity,
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error); // Log the error for debugging
    res.status(500).send({
      error: true,
      data: "An unexpected error occurred",
    });
  }
});

// app.delete('/activities/activity_id', (req, res)=>{

// })
// DELETE an activity by URL parameter
app.delete("/activities/:activity_id", (req, res) => {
  const { user_id } = req.body; // Extract user_id from request body
  const { activity_id } = req.params; // Extract activity_id from URL parameters

  if (!user_id || !activity_id) {
    return res.status(400).send({
      error: true,
      data: "Please provide both user_id and activity_id",
    });
  }

  // Find the user by user_id
  const user = dataJson.find((user) => user.user_id === user_id);

  if (!user) {
    return res.status(404).send({
      error: true,
      data: "User not found",
    });
  }

  // Find the index of the activity to delete
  const activityIndex = user.data.findIndex(
    (activity) => activity.id === activity_id
  );

  if (activityIndex === -1) {
    return res.status(404).send({
      error: true,
      data: "Activity not found",
    });
  }

  // Remove the activity from the user's activities
  user.data.splice(activityIndex, 1);

  return res.status(200).send({
    error: false,
    data: "Activity deleted successfully",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
