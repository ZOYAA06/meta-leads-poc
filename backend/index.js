require("dotenv").config();
const express = require("express");

const app = express();

const leads = [];
const clients = [];

app.use(express.json());

app.get("/test", (req, res) => {
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

app.post("/webhook", async (req, res) => {
    const leadgenId = req.body.entry[0].changes[0].value.leadgen_id;

    const response = await fetch(
        `https://graph.facebook.com/${leadgenId}?fields=id,created_time,field_data&access_token=${process.env.META_PAGE_ACCESS_TOKEN}`
    );
    console.log("Meta response status:", response.status);
    const data = await response.json();

    if (!response.ok) {
        console.log("Meta API error:", data);
        return res.sendStatus(200);
    }

    const lead = {};

    data.field_data.forEach((field) => {
        lead[field.name] = field.values[0];
    });

    console.log("Lead data:", lead);
    console.log("Lead ID:", leadgenId);
    leads.push(lead);

    clients.forEach((client) => {
        client.write(
            "data: " + JSON.stringify(lead) + "\n\n"
        );
    });


    res.sendStatus(200);
});

app.post("/leads", (req, res) => {
    console.log(req.body);
    leads.push(req.body);
    res.send("Lead received");
    clients.forEach((client) => {
        client.write(
            "data: " + JSON.stringify(req.body) + "\n\n")
    })
});

app.get("/leads", (req, res) => {
    res.json(leads);
});

app.get("/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    clients.push(res);

    req.on("close", () => {
        const index = clients.indexOf(res);

        if (index !== -1) {
            clients.splice(index, 1);
        }
    })
})

app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on port 3000")
});