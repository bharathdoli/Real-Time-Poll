const mongoose = require('mongoose');
const pollschema = new mongoose.Schema({
    question:String,
    options:[
        {text:String,votes:Number}  
    ],
    voters:[String]
});
const Poll = mongoose.model("Poll",pollschema);
module.exports = Poll;
