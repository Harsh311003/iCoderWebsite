const express = require("express"); 
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin=require("../middleware/requireLogin");
const Post=mongoose.model("Post");


//for all posts 
router.get("/allpost",requireLogin,(req,res)=>{
    Post.find()                         //finding all posts  without any condition
    .populate("postedBy","_id name")  //   showing _id and name in postedBy
    .then(posts=>{
        res.json({posts:posts})   
    })
    .catch(err=>{
        console.log(err)
    })
})


//Create new post 
router.post("/createpost",requireLogin,(req,res)=>{
    const {title,body}=req.body;
    if(!title || !body )
    {
        return res.status(422).json({error :"Please add all the fields"});
    }
      req.user.password=undefined    // to remove the password from post
     
    const post=new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    });
   
});

//  my uploaded post
router.get("/mypost",requireLogin,(req,res)=>{  
    Post.find({postedBy: req.user._id})  
    .populate("postedBy","_id name")  //it will expand only _id and name
    .then(mypost=>{
        res.json({mypost:mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})
