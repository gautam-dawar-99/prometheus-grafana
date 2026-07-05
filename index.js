const express = require("express");
const {doSomeHeavyTask} = require("./util");

const client = require("prom-client");    // Metric collecn

const app = express();
const PORT = process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({register:client.register});

app.get("/", async (req, res) => {
    res.json({
        status: "Success",
        message: "Server is up and running"
    });
});

app.get("/slow",async (req,res)=>{
    try{
        const timeTaken = await doSomeHeavyTask();
        return res.json({
            status:"Success",
            message:`Heavy task completed in ${timeTaken}ms`,
        });
    }
    catch(err){
        return res.status(500).json({status:"Error",error:"Internal Server Eror"});
    }
});
app.get("/metrics", async (req,res)=>{
    res.setHeader('Content-Type',client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
})

app.listen(PORT,()=>{
    console.log(`Express Server started at http://localhost:${PORT}`)
});

