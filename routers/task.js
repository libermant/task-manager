const mongoose = require("mongoose");
const express = require("express");
const taskModel = require("../models/task");
const userModel = require("../models/user");

const router = new express.Router();

//מחזיר את כל המשימות

router.get("/api/:rout", async (req, res) => {
  try {
    const model =
      req.params.rout === "tasks" ? taskModel : "users" ? userModel : null;
    const tasksOrUsers = await model.find({});
    res.send(tasksOrUsers);
  } catch (error) {
    res.send(error);
  }
});

// הוספת משתמש ומשימה

router.post("/api/:rout", async (req, res) => {
  try {
    const param =
      req.params.rout === "tasks" ? taskModel : "users" ? userModel : null;
    const ob = new param(req.body);
    await ob.save();
    const key = param === taskModel ? "users" : userModel ? "tasks" : null;
    const array = req.body[key];
    console.log(array);
    for (arr of array) {
      console.log(arr);
      console.log(req.body.id);
      const model =
        param === taskModel ? userModel : userModel ? taskModel : null;
      const oldArrayA = await model.find({ id: arr });
      console.log(oldArrayA);
      const keyB = key === "users" ? "tasks" : "tasks" ? "users" : null;
      const oldArrayB = oldArrayA[0][keyB];
      console.log("aaaaaaaa" + oldArrayB);
      const obUser = await model.findOneAndUpdate(
        { id: arr },
        { [keyB]: [...oldArrayB, req.body.id] }
      );
    }
    res.send("Added successfully");
  } catch (error) {
    res.send(error);
  }
});

// מחיקת משתמש ממשימה ומשימה ממשתמש

router.get("/api/:delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const model =
      req.params.delete === "deleteTasks"
        ? taskModel
        : "deleteUsers"
        ? userModel
        : null;
    const schema =
      model === taskModel ? userModel : userModel ? taskModel : null;
    const deleteUsers = await model.findOneAndDelete({ id: parseInt(id) });
    const a = schema === taskModel ? "users" : userModel ? "tasks" : null;
    const deleteTasksUsers = await schema.find({ [a]: parseInt(id) });
    for (delet of deleteTasksUsers) {
      const array = delet[a];
      const newUpdate = await schema.findOneAndUpdate(
        { [a]: delet[a] },
        {
          [a]: array.filter(
            function (el) {
              return el !== parseInt(id);
            },
            { new: true }
          ),
        }
      );
    }
    res.send("Successfully removed");
  } catch (error) {
    res.send(error);
  }
});

//הצגת נתונים של משתמשים למשימה ומשימות למשתמש

router.get("/api/display/:data/:id", async (req, res) => {
  try {
    const { data, id } = req.params;
    const model =
      data === "taskDisplay" ? taskModel : "userDisplay" ? userModel : null;
    const select = model === taskModel ? "users" : userModel ? "tasks" : null;
    const Data = await model.find({ id: parseInt(id) }).select(select);
    const aa = Data[0]?.[select];
    const usersAndTasks = [];
    for (a of aa) {
      const schema =
        data === "taskDisplay" ? userModel : "userDisplay" ? taskModel : null;
      usersAndTasks.push(await schema.find({ id: a }));
    }
    res.send(usersAndTasks);
  } catch (error) {
    res.send(error);
  }
});

router.post("/api/:update/:id", async (req, res) => {
  try {
    const { update, id } = req.params;
    const model =
      update === "userUpdate" ? userModel : "taskUpdate" ? taskModel : null;
    console.log(model);
    const updateUserAndTask = await model.findOneAndUpdate(
      { id: parseInt(id) },
      { ...req.body },
      { new: true }
    );
    console.log(req.body);
    console.log(updateUserAndTask);
    res.send("successfully updated" + updateUserAndTask);
  } catch (error) {
    res.send(error);
  }
});

//בדיקה האם קיימת משימה למשתמש

router.get("/api/search/:taskId/:userId", async (req, res) => {
  try {
    const { taskId, userId } = req.params;
    const user = await userModel.find({ id: userId }).select("tasks");
    const array = user[0].tasks;
    const taskOfArray = array.includes(taskId)
      ? res.send("The task exists in the user")
      : res.send(
          await userModel.findOneAndUpdate(
            { tasks: [...array] },
            { tasks: [...array, taskId] }
          )
        );
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
