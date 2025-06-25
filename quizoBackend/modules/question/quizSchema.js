const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: [
        {
            topicName: {
                type: String,
                required: true
            },
            questions: [
                {
                    questionText: {
                        type: String,
                        required: true
                    },
                    options: [
                        {
                            type: String,
                            required: true
                        }
                    ],
                    correctAnswer: {
                        type: String,
                        required: true
                    }
                }
            ]
        }
    ]
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
