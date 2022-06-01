const mongoose = require("mongoose");
const express = require("express");
const taskModel = require("../models/task");
const userModel = require("../models/user");

const router = new express.Router();


//מחזיר את כל המשימות

router.get("/api/:rout", async (req, res) => {
  try{  
    const model = req.params.rout === "tasks" ? taskModel : "users" ? userModel : null;
    console.log(model);
    const tasksOrUsers = await model.find({});
    console.log(tasksOrUsers);
    res.send(tasksOrUsers);
  }catch(error) {
    res.send(error);
  }   
});

 
// הוספת משתמש ומשימה

router.post("/api/:rout", async (req, res) => {
  try{
    //console.log(req.params.rout);
    //console.log(req.body);
    const param = req.params.rout === "tasks" ? taskModel : "users" ? userModel : null;
    //console.log(param); 
    const ob = new param(req.body);
    await ob.save();
    //console.log(ob);
    const key=param===taskModel ? "users" : userModel ? "tasks" : null 
    const array=req.body[key]
    console.log(array);
    for(arr of array){
      console.log(arr);
      console.log(req.body.id);
      const model=param===taskModel ? userModel : userModel ? taskModel : null
      const oldArrayA=await model.find({id:arr})
      console.log(oldArrayA);
      const keyB=key==="users" ? "tasks" : "tasks" ? "users" :null
      const oldArrayB=oldArrayA[0][keyB]
      console.log("aaaaaaaa"+ oldArrayB);
      const obUser=await model.findOneAndUpdate({id:arr},{[keyB]:[...oldArrayB, req.body.id]})
    }       
    res.send("Added successfully");
  }catch(error) {
    res.send(error);
  } 
})










// מחיקת משתמש ממשימה ומשימה ממשתמש

router.get("/api/:delete/:id",async(req,res)=>{
    try{
        const {id} = req.params  
        console.log(req.params);      
        const model = req.params.delete === "deleteTasks" ? taskModel : "deleteUsers" ? userModel : null;
        const schema = model ===taskModel ? userModel : userModel ? taskModel : null;
        console.log(model);
        console.log(schema);        
        const deleteUsers=await model.findOneAndDelete({ id:parseInt(id)}); 
        console.log(deleteUsers); 
        const a=schema===taskModel?"users":userModel?"tasks":null  
        console.log(a);
        const deleteTasksUsers=await schema.find({[a]:parseInt(id)})
        console.log(deleteTasksUsers);
        for(delet of deleteTasksUsers ){          
          console.log(delet);
          const array=delet[a]
          console.log(array);          
          const newUpdate=await schema.findOneAndUpdate({[a]:delet[a]},{[a]:array.filter(function(el){return (el !==parseInt(id))},{new:true})   
      })}       
          res.send("Successfully removed")       
    }catch(error) {
      res.send(error);
    } 
})

//הצגת נתונים של משתמשים למשימה ומשימות למשתמש

router.get("/api/display/:data/:id",async(req,res)=>{
  try{
    const {data,id}=req.params  
    const model=data==="taskDisplay"?taskModel:"userDisplay"?userModel:null
    console.log(`the model is: ${model}`);
    const select=model===taskModel?"users":userModel?"tasks":null
    console.log(select);
    const Data=await model.find({id:parseInt(id)}).select(select)
    console.log(Data); 
    const aa=Data[0]?.[select] 
    console.log(aa);
    const usersAndTasks =[]  
    for(a of aa){
      console.log(a);
      const schema=data==="taskDisplay"?userModel:"userDisplay"?taskModel:null
      console.log(schema);
      usersAndTasks.push(await schema.find({id:a}))
      console.log(usersAndTasks);
    }
    res.send(usersAndTasks) 

  }catch(error) {
    res.send(error);
  }   
})




//עידכון פרטי משתמש/משימה

/*router.post("/api/:id/:pp",async(req,res)=>{
  try{
    res.send("123")    
    const {id}=req.params
    //console.log(id);
    const{pp}=req.params
    //console.log(pp);
    const model=pp==="name"||pp==="email"||pp==="password"||pp==="age"||pp==="tasks" ?userModel:pp==="description"||pp==="completed"||pp==="users" ?taskModel:null
    console.log(model);
    const user=await model.find({id:id})
    //console.log(user);
    const body=req.body
    console.log( user[0][pp]);
    await model.findOneAndUpdate({ [pp]: user[0][pp] }, { [pp]: body[0][pp] })
  }catch(error) {
    res.send(error);
  } 
})*/



router.post("/api/:update/:id",async(req,res)=>{ 
  try{ 
    const {update,id}=req.params
    const model=update==="userUpdate"?userModel:"taskUpdate"?taskModel:null
    console.log(model);
    const updateUserAndTask=await model.findOneAndUpdate({id:parseInt(id)},{...req.body},{new:true})  
    console.log(req.body);
    console.log(updateUserAndTask);
    res.send("successfully updated" +  updateUserAndTask)
  }catch(error) {
    res.send(error);
  }   
})




//בדיקה האם קיימת משימה למשתמש

router.get("/api/search/:taskId/:userId",async(req,res)=>{
  try{
    const {taskId,userId}=req.params
    const user=await userModel.find({id:userId}).select("tasks") 
    console.log(user); 
    const array=user[0].tasks 
    console.log(array); 
    const taskOfArray=array.includes(taskId)?res.send("The task exists in the user"):res.send(await userModel.findOneAndUpdate({tasks:[...array]},{tasks:[...array,taskId]}))
    console.log(taskOfArray);    
  }catch(error) {
    res.send(error);
  }    
})



module.exports = router;
