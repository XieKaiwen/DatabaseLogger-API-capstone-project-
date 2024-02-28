import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let apiKey = '';

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs"); 
    // Login page
});

app.post("/login", async(req, res) => {
    console.log(req.body);
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    if(email.length == 0 || password.length == 0){
        res.render("index.ejs", {
            error: "Please fill in both fields"
            // ensuring that the user fills in both the username and password
        });
    }

    try{
        const response = await axios.get(`https://www.JadeDiabetes.com/api/1.0/login.json?email=${email}&password=${password}`);
        const data = response.data;
        console.log(data);
        if(data.result == true){
            apiKey = data.token;
            // if the username and password are correct and data.result == true
            res.redirect("/choice");
        } else{
            // if the username and password are wrong or there is an error
            res.status(401);
            throw new Error(data.message);
        }

    } catch(error){
        console.log(error.message, error.status);
        res.render("index.ejs", {
            error: error.message
        });
    }

});

app.get("/choice", (req, res) => {
    res.render("choices.ejs");
});

// The 3 choices lead to the same ejs file but with a different header, the ejs file will also be rendered differently for each choice

app.get("/add", (req, res) => {
    res.render("log.ejs", {
        header: "Add Log"
    });
});

app.get("/update", (req, res) => {
    res.render("log.ejs", {
        header: "Update Log"
    });
});

app.get("/delete", (req, res) =>{
    res.render("log.ejs", {
        header: "Delete Log"
    });
});

app.post("/addSubmit", async (req, res) => {
    console.log(req.body);
    const logType = req.body.logTypes;
    const value = req.body.value;
    const note = req.body.notes;
    // adding a log
    try{
        const response = await axios.get(`https://www.JadeDiabetes.com/api/1.0/add.json?token=${apiKey}&value=${value}&log_type=${logType}&notes=${note}`);
        const data = response.data;
        console.log(data);
        if(data.result){
            res.render("result.ejs",{
                content: `Successfully added! Log_ID for the added data is ${data.id}`
            });
            // shows a message if successful, if not successful, throwing an error with the error message returned by the API
        }
        else{
            throw new Error(data.message);
        }
    }catch(error){
        res.render("log.ejs", {
            header:"Add Log",
            error: error.message
        });
    }   
    
});

app.post("/updateSubmit", async (req, res) => {
    console.log(req.body);
    const logID = req.body.logID;
    const logType = req.body.logTypes;
    const value = req.body.value;
    const note = req.body.notes;
    try{
        const response = await axios.get(`https://www.JadeDiabetes.com/api/1.0/update.json?token=${apiKey}&log_id=${logID}&value=${value}`);
        const data = response.data;
        console.log(data);
        if(data.result){
            await axios.get(`https://www.JadeDiabetes.com/api/1.0/update.json?token=${apiKey}&log_id=${logID}&time=${data.updated}`);
            res.render("result.ejs",{
                content: `Successfully updated! Updated log ID ${logID}`
            });
        }
        else{
            throw new Error(data.message);
        }
    }catch(error){
        res.render("log.ejs", {
            header:"Update Log",
            error: error.message
        });
    }   
    
});

app.post("/deleteSubmit", async (req, res) => {
    console.log(req.body);
    const logID = req.body.logID;
    try{
        const response = await axios.get(`https://www.JadeDiabetes.com/api/1.0/delete.json?token=${apiKey}&log_id=${logID}`);
        const data = response.data;
        console.log(data);
        if(data.result){
            res.render("result.ejs",{
                content: `Successfully Delete! Deleted log ID ${logID}`
            });
        }
        else{
            throw new Error(data.message);
        }
    }catch(error){
        res.render("log.ejs", {
            header:"Delete Log",
            error: error.message
        });
    }   
    
});

app.get("/logout", async(req,res) =>{
    try {
        const response = await axios.get(`https://www.JadeDiabetes.com/api/1.0/logout.json?token=${apiKey}`);
        console.log(response.data);
        if(response.data.result){
            res.redirect("/");
        }
        else{
            throw new Error(response.data.message);
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }
});


app.get("/log-range", async(req,res) => {
    try {
        const response = await axios.get(`https://www.JadeDiabetes.com/api/1.0/log_range?token=${apiKey}`);
        const data = response.data;
        // getting the timing of first entry and timing of last entry 
        if(data.result){
            res.render("log-range.ejs", {
                startDate: data.start_date,
                lastDate: data.end_date
            });
        }
        else{
            throw new Error(data.message);
        }
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
})




app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
