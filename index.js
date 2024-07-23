import express from "express";

const app = express();
const port = 3000;



app.get('/', (req, res) => {
    res.status(400).send({'message': 'Hello World!'})
    // res.status(Status code:200).send("Hello world!")
})
app.listen(port, () => {
    console.log(`server started at port: ${port}`)
})
