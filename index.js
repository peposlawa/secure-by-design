import express from "express";

const app = express();
const port = 3000;

app.listen(port, (req, res) => {
    console.log(`server started at port: ${port}`)
})

app.get('/', (req, res) => {
    res.send("Hello world!")
})