const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    questionID: String,
    answer: String,
    owner: {
        type: String,
        required: true
    },
    fname: String,
    lname: String,
    image: String,
    isAnonymous: Boolean,
    upVote: Number,
    downVote: Number,
    posted: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Answers', answerSchema);