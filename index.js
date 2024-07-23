import express from "express";
import helmet from "helmet";

const app = express();
app.use(helmet());
const port = 3000;

app.get('/', (req, res) => {
    res.status(200).send({ 'message': 'Hello World!' })
    // res.status(Status code:200).send("Hello world!")
})
app.listen(port, () => {
    console.log(`server started at port: ${port}`)
})
