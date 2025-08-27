// --------------------------- ↓ SETTING UP DEPENDENCIES ↓ --------------------------------
require("dotenv").config();
const express = require("express");
const cors  = require("cors");    // Enables Cross Origin Resource Sharing
const mongoose = require("mongoose");    

// ---------------------------- ↓ INITIAL APP CONFIGURATION ↓ -----------------------------
const port = process.env.PORT || 3000; 
const app = express();    

// -------------------------------- ↓ MIDDLEWARE SETUP ↓ -----------------------------------

app.use(express.json());

con
app.use(cors("*"));



// ---------------------------------- ↓ API ROUTES ↓ --------------------------------------

// app.get("/example", async (req, res) =>{
//     res.send("Hello I am a messages form the backend");
// })
// console.log("day");



// -----------------------------Database Connection + app start up ----------------------------------------





(async() => {
    try {
        mongoose.set("autoIndex", false);

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected!");

        await Task.syncIndexes();
        console.log("✅ Indexes created!")  

        app.listen(port, () => {
            console.log(`to do app is live on ${port}`);
        });
    
    } catch (error) {
        console.error("❌Startup error:", error);
        process.exit(1);
        
    }

})();

// data structure
const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    dateCreated: {type: Date, default: Date.now, required: true},
    completed: {type: Boolean, required: true, default: false} 
});

taskSchema.index({duedate: 1 });
taskSchema.index({ dateCreated: 1});


const Task = mongoose.model("Task", taskSchema);







// -------------------------------------- TASK ROUTES --------------------------------------

// let taskId = 1;

// const tasks = [
// {id: taskId++, completed: true, title: "Wash car",description:"My car is filthy and needs it's annual clean", dueDate:"10/08/25", createdOn: "28/07/2025" },
// {id: taskId++, completed: true, title: "Make dinner",description:"we need to eat ", dueDate:"01/08/25", createdOn: "28/07/2025" },
// {id: taskId++, completed: false, title: "Play games",description:"Keep Daughter entertained", dueDate:"25/10/25", createdOn: "28/07/2025" },
// {id: taskId++, completed: false, title: "Read book",description:"Enjoy a new book", dueDate:"10/11/25", createdOn: "28/07/2025" },

// ];



app.get("/tasks", async(req, res) => {
    try {
        const{ sortBy } = req.query;

        let sortOption = {};

        if (sortBy === "dueDate"){
            sortOption = { dueDate: 1}            
        } else if (sortBy === "dateCreated") {
            sortOption = { dateCreated: 1 };
        }

        const tasks = await Task.find({}).sort(sortOption);
        res.json(tasks);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error grabbing tasks!"});
    }
});  



app.post("/tasks/todo", async (req, res) => {
    try {

        const {title, description,dueDate} = req.body;

        const taskData = { title, description, dueDate };
        const createTask = new Task(taskData);
        const newTask = await createTask.save();

        res.json({ task: newTask, massage: "New task created successfully!"});

    }   catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error creating the tasks!"});
    }
})


app.patch("/tasks/complete/:id", async (req, res) => {
    try {
        const { completed } = req.body;
        const taskId = req.params.id;

        const completedTask = await Task.findByIdAndUpdate(taskId, { completed }, {new: true});

        if (!completedTask) {
            return res.status(404).json({ message: "Task not found!" });
        }
        
        res.json({ task: completedTask, message: "Task set to 'complete'"});
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: " Error completing the task!"});
        
    }
});


app.patch("/tasks/notComplete/:id", async(req, res) => {
    try {
        const { completed } = req.body;
        const taskId = req.params.id;

        const taskNotComplete = await Task.findByIdAndUpdate(taskId, {completed}, {new: true});

        if (!taskNotComplete) {
            return res.status(404).json({ message: "Task not found" });

        }
        res.json({ task: taskNotComplete, message: "Task set to 'not complete'"});
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: " Error setting the task to 'not complete'!"});
        
    }

});


app.delete("/tasks/delete/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found"});

        }
        res.json({ task: deletedTask, message: "Task deleted successfully" });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error deleting the task!" });        
    }
});



app.put("/tasks/update/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, dueDate } = req.body;

        const taskData = { title, description, dueDate };
        const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, { new: true});

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });            
        }
        
        res.json({ task: updatedTask, message: "Task updated successfully!" });

    } catch (error) {        
        console.error("Error:", error);
        res.status(500).json({ message: " Error editing the task!" });            
    }
});









