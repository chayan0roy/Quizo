const express = require('express');
const router = express.Router();
const InterviewQuestion = require('../models/InterviewQuestion'); // Adjust path as needed
const mongoose = require('mongoose');

// Create new interview questions
router.post('/', async (req, res) => {
    try {
        const { subjectName, topicName, createdBy, questions } = req.body;
        
        // Validate required fields
        if (!subjectName || !createdBy || !questions || questions.length === 0) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate createdBy is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(createdBy)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Validate each question
        for (const question of questions) {
            if (!question.questionText || !question.answer) {
                return res.status(400).json({ 
                    message: 'Each question must have both question text and answer'
                });
            }
            if (question.difficulty && !['easy', 'medium', 'hard'].includes(question.difficulty)) {
                return res.status(400).json({ 
                    message: 'Difficulty must be either easy, medium, or hard'
                });
            }
        }

        const newInterviewQuestions = new InterviewQuestion({
            subjectName,
            topicName,
            createdBy,
            questions
        });

        const savedQuestions = await newInterviewQuestions.save();
        res.status(201).json(savedQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all interview questions
router.get('/', async (req, res) => {
    try {
        const questions = await InterviewQuestion.find()
            .populate('createdBy', 'username email role');
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get interview questions by ID
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid question set ID' });
        }

        const questionSet = await InterviewQuestion.findById(req.params.id)
            .populate('createdBy', 'username email role');
        
        if (!questionSet) {
            return res.status(404).json({ message: 'Question set not found' });
        }

        res.json(questionSet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update interview questions
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid question set ID' });
        }

        const { subjectName, topicName, questions } = req.body;
        const updateData = {};

        if (subjectName) updateData.subjectName = subjectName;
        if (topicName) updateData.topicName = topicName;
        if (questions) {
            // Validate questions if they're being updated
            for (const question of questions) {
                if (!question.questionText || !question.answer) {
                    return res.status(400).json({ 
                        message: 'Each question must have both question text and answer'
                    });
                }
                if (question.difficulty && !['easy', 'medium', 'hard'].includes(question.difficulty)) {
                    return res.status(400).json({ 
                        message: 'Difficulty must be either easy, medium, or hard'
                    });
                }
            }
            updateData.questions = questions;
        }

        const updatedQuestions = await InterviewQuestion.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'username email role');

        if (!updatedQuestions) {
            return res.status(404).json({ message: 'Question set not found' });
        }

        res.json(updatedQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete interview questions
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid question set ID' });
        }

        const deletedQuestions = await InterviewQuestion.findByIdAndDelete(req.params.id);
        
        if (!deletedQuestions) {
            return res.status(404).json({ message: 'Question set not found' });
        }

        res.json({ message: 'Question set deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get questions by subject
router.get('/subject/:subjectName', async (req, res) => {
    try {
        const questions = await InterviewQuestion.find({ 
            subjectName: new RegExp(req.params.subjectName, 'i') 
        }).populate('createdBy', 'username email role');
        
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get questions by topic
router.get('/topic/:topicName', async (req, res) => {
    try {
        const questions = await InterviewQuestion.find({ 
            topicName: new RegExp(req.params.topicName, 'i') 
        }).populate('createdBy', 'username email role');
        
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get questions by difficulty
router.get('/difficulty/:level', async (req, res) => {
    try {
        const level = req.params.level.toLowerCase();
        if (!['easy', 'medium', 'hard'].includes(level)) {
            return res.status(400).json({ message: 'Invalid difficulty level' });
        }

        const questions = await InterviewQuestion.aggregate([
            { $unwind: "$questions" },
            { $match: { "questions.difficulty": level } },
            { $group: { 
                _id: "$_id",
                subjectName: { $first: "$subjectName" },
                topicName: { $first: "$topicName" },
                createdBy: { $first: "$createdBy" },
                questions: { $push: "$questions" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" }
            }},
            { $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy"
            }},
            { $unwind: "$createdBy" },
            { $project: {
                "createdBy.password": 0,
                "createdBy.__v": 0
            }}
        ]);

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get questions by creator
router.get('/creator/:userId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const questions = await InterviewQuestion.find({ createdBy: req.params.userId })
            .populate('createdBy', 'username email role');
            
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;