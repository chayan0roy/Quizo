const mongoose = require('mongoose');

const classTestSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testName: {
        type: String,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    selectedQuestions: [
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
                    options: [String],
                    correctAnswer: {
                        type: String,
                        required: true
                    },
                    marks: {
                        type: Number,
                        default: 1
                    }
                }
            ]
        }
    ],
    testDescription: {
        type: String,
        required: true
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    testDate: {
        type: Date,
        required: true
    },
    testDuration: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const ClassTest = mongoose.model('ClassTest', classTestSchema);

module.exports = ClassTest;