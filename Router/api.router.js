const express=require("express");
const {UserModel}= require("../Model/user.model")
const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config()
const APIRouter=express.Router();
APIRouter.post("/register",async(req,res)=>{
    const {username,email,password}=req.body;
    try {
        if(!username||!email||!password){
           return res.status(400).send({msg:"Please Provied All Details"})
        }
        const finedUserEmail= await UserModel.findOne({email})
        if(finedUserEmail){
            return res.status(400).send({msg:"User Already Registerd"})
        }
        const finedUsername= await UserModel.findOne({username})
        if(finedUsername){
            return res.status(400).send({msg:"Username Not Avilable"})
        }
        bcrypt.hash(password,+process.env.soltRounds, async(err,hash_pass)=>{
            if(err){
                return res.status(400).send({msg:err})
            }
            const newUSer = new UserModel({
                username,
                email,
                password:hash_pass
            })
            await newUSer.save();
         return   res.status(201).send({msg:"User Register"})
        })
        
    } catch (error) {
        res.status(404).send({msg:error})
    }
})
APIRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        if(!email||!password){
            return res.status(400).send({msg:"Please Provied All Details"})
         }
         const user= await UserModel.findOne({email})
         if(!user){
             return res.status(400).send({msg:"User Already Registerd"})
         }
         bcrypt.compare(password,user.password, async(err,result)=>{
            if(err){
                return res.status(400).send({msg:err})

            }
            const token=jwt.sign({id:user.id}, process.env.key);
            return res.status(201).send({msg:"User Login", token})
         })
    } catch (error) {
        res.status(404).send({msg:error})
        
    }
})
APIRouter.get("/users",async(req,res)=>{
    try {
        const users= await UserModel.find();
        res.status(200).send(users)
    } catch (error) {
        res.status(404).send({msg:error})
        
    }
})
module.exports={
    APIRouter
}