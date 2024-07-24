import express from "express";
import helmet from "helmet";
import dataJson from "./data.json" with { type: "json" };



const app = express();
app.use(helmet());
const port = 3000;

app.get('/', (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      payload: dataJson,
    });

  } catch (error) {
    if (error.message.includes('No valid data ')) {
      return res.status(404).send({
        success: false,
        payload: error.message,
      });
    } else {
      return res.status(500).send({
        success: false,
        payload: 'Internal Server Error',
      });
    }
  }
})
app.get('/:user_id', (req, res) => {
  try {
    const userId = req.params.user_id;
    return res.status(200).send({
      success: true,
      payload: user,
    });

  } catch (error) {
    if (error.message.includes('No user with that ID')) {
      return res.status(404).send({
        success: false,
        payload: error.message,
      });
    } else {
      return res.status(500).send({
        success: false,
        payload: 'Internal Server Error',
      });
    }
  }
})

app.post('/activities', async (req, res) => {
  try {
    const pushActivity = await req.body.dataJson;
    return res.status(200).send({
      success: true,
      payload: pushActivity,
    })
  } catch (error) {
    if (error.message.includes('No valid data ')) {
      return res.status(404).send({
        success: false,
        payload: error.message,
      });
    } else {
      return res.status(500).send({
        success: false,
        payload: 'Internal Server Error',
      });
    }
  }
});


app.listen(port, () => {
  console.log(`server started at port: ${port}`)
})
