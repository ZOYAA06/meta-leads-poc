const express = require ("express");

const app = express();

const leads = [];
const clients = [];

app.use(express.json());

app.get("/test" , (req , res) => {
    res.send("Backend is working");
});

app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === "meta-leads-test") {
        res.send(challenge);
    }
});

app.post("/leads" , (req,res) =>{
    console.log(req.body);
    leads.push(req.body);
    res.send("Lead recieved");
    clients.forEach((client) =>{
        client.write(
            "data: " +JSON.stringify(req.body) +"\n\n" )
 } )
});

app.get("/leads" , (req,res) =>{
    res.json(leads);
});

app.get("/events" , (req ,res) => {
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control" , "no-cache");
res.setHeader("Connection" , "keep-alive");
clients.push(res);

req.on("close" ,() => {
    const index = clients.indexOf(res);

    if(index !== -1){
        clients.splice(index , 1);
    }
})
})

app.listen(3000 , () => {
console.log("Server is running on port 3000")
} );