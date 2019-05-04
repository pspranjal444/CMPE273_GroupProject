const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Question = require('../models/question');
const Follower = require('../models/follower');
const Topics =require('../models/topic');
// var jwt = require('jsonwebtoken');
// var crypto = require('crypto');

//5 questions to display when user is not logged in
router.get('/noLogQues', (req, res) => {
    var n = Question.count({});
    var r = Math.floor(Math.random() * n);
    var topic = req.query.topic;
    var query = null;
    if( topic != null && topic != "" )
    {
        query = {topic:topic}
    }
    Question.find(query).limit(5).skip(r).exec().then(docs=>{
       
        res.status(200).json(docs);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})


//questions to display when user is logged in using pagination
router.get('/logQues', (req, res) => {
    console.log("logques")
    let limit = Number(req.query.limit);
    let skip = limit*Number(req.query.t);
    var topic = req.query.topic;
    var query = null;
    if(topic != null && topic != "" )
    {
        query = {topic:topic}
    }
    Question.find(query).limit(limit).skip(skip).exec().then(docs=>{
       
        res.status(200).json(docs);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

//get questions created by user
router.get('/created', (req, res) => {
    console.log("logques")
    let limit = Number(req.query.limit);
    let skip = limit*Number(req.query.t);
    var createdby = req.query.createdby;
    var query = null;
    Question.find({owner: createdby}).limit(limit).skip(skip).exec().then(docs=>{
       
        res.status(200).json(docs);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})


//For ComponentDidMount which will show all question prepopulated for particular user
router.get('/', (req, res) => {
    var email=req.query.email;
    var query={owner:email};
    Question.find(query)
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

});

// for search questions
router.get('/search', (req, res) => {
    var email=req.query.email;
    var query={_id:email};
    console.log("Your Question Id is ",email);
    Question.find(query)
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

});

//For getting Items for dropdown list fof topics
router.get('/topics', (req, res) => {
    Topics.find()
        .exec()
        .then(docs => {
            console.log("Topics",docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

});

//For Creation of Questions
router.post('/create',(req,res)=>{
    var question=req.body.question;
    var owner=req.body.owner;
    var topic=req.body.topicselect;
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var userimage=req.body.userimage;
    const entry = new Question({
        _id: new mongoose.Types.ObjectId(),
        question: req.body.question,
        owner:req.body.owner,
        topic: req.body.topicselect,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        userimage:req.body.userimage,
    })
      if(req.body.question)  // Condition that checks Empty Question does not get's entered
      {
            entry.save()
            .then(docs => {
                    console.log("Question Insertion",docs);
                    res.status(200).json({
                        message:"Sucessfully Inserted"
                        })
                    })
                    .catch(err => {console.log(err)
                        res.status(204).json({
                            message: "Error in Question Insert"
                })})
    }
})

//For question Edit
router.post('/edit',(req,res)=>{
    var question=req.body.question;
    var id=req.body.qid;
    console.log("Question Id", id, question);
    var query={$set: {question:req.body.question}};
    Question.update({_id:req.body.qid},query).exec()
    .then(docs => {
        console.log("Question Updated",docs);
        res.status(200).json({
            message:"Sucessfully Updated"
            })
        })
  .catch(err => {console.log(err)
        res.status(204).json({
            message: "Error in Question Edit"
        })});
})

//For inserting details of follower who has followed that particular question
router.post('/follow', (req, res) => {
   

    const entry = new Follower({
        _id: new mongoose.Types.ObjectId(),
        questionid: req.body.qid,
        follower: req.body.follower,
        question: req.body.question,
    })
    Follower.find({ questionid: req.body.qid, follower: req.body.follower }).then(result => {
        if ((result.length===0)) {
            {
                entry.save()
                    .then(docs => {
                        console.log("Details of Follower Insertion", docs);
                        res.status(200).json({
                            success: true,
                            message: "Sucessfully Followed"
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(204).json({
                            message: "Error in Follower Insert"
                        })
                    })
            }
        }
        else{
            res.status(200).json({
                message: "You cannot follow more than once"
            })
        }
    })

})

router.get('/followNumber', (req, res) => {
    var qid = req.query.qid;
    var query = { questionid: qid };
    console.log("Your Question Id is ", qid);
    Follower.find(query)
        .exec()
        .then(docs => {
            console.log("Follow Number", docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

});



//get questions related to a topic
router.get('/topicquestion', (req, res) => {
    var topic=req.query.search;
    var query={topic:topic};
    Question.find(query)
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

});


//For force Creation of Questions
router.post('/createtest',(req,res)=>{

    for(const body of req.body){
    
    const entry = new Question({
        _id: new mongoose.Types.ObjectId(),
        question: body.question,
        owner: "rishabh0289@gmail.com",
        topic: "Singapore",
        firstname: "Kumar",
        lastname: "Rishabh",
        userimage: "https://lh5.googleusercontent.com/-XxTivlTF3uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reX9CvIjOsyYT7zeX6l9IWwRGBaow/s96-c/photo.jpg",
        posted: body.posted
    })
      if(body.question)  // Condition that checks Empty Question does not get's entered
      {
            entry.save()
            .then(docs => {
                    res.status(200).json({
                        message:"Sucessfully Inserted"
                        })
                    })
                    .catch(err => {console.log(err)
                        res.status(204).json({
                            message: "Error in Question Insert"
                })})
    }
}
})






//For getting questions followed by a user
router.get('/followedquestions',(req,res)=>{

    var user=req.query.user;
    var query={follower:user};
    Follower.find(query)
        .exec()
        .then(docs => {
            console.log("ans",docs)
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
   
});

module.exports = router;