const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz'); // Adjust path as needed
const mongoose = require('mongoose');

// Create a new quiz
router.post('/createQuiz', async (req, res) => {
    try {
        const { subjectName, topicName, createdBy, questions } = req.body;
        
        // Validate required fields
        if (!subjectName || !createdBy || !questions || questions.length === 0) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate each question
        for (const question of questions) {
            if (!question.questionText || !question.options || !question.correctAnswer) {
                return res.status(400).json({ message: 'Each question must have text, options, and correct answer' });
            }
            if (!question.options.includes(question.correctAnswer)) {
                return res.status(400).json({ message: 'Correct answer must be one of the options' });
            }
        }

        const newQuiz = new Quiz({
            subjectName,
            topicName,
            createdBy,
            questions
        });

        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all quizzes
router.get('/getAllQuiz', async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('createdBy', 'username email');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single quiz by ID
router.get('/getSingleQuiz/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid quiz ID' });
        }

        const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'username email');
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a quiz
router.put('/updateQuiz/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid quiz ID' });
        }

        const { subjectName, topicName, questions } = req.body;
        const updateData = {};

        if (subjectName) updateData.subjectName = subjectName;
        if (topicName) updateData.topicName = topicName;
        if (questions) {
            // Validate questions if they're being updated
            for (const question of questions) {
                if (!question.questionText || !question.options || !question.correctAnswer) {
                    return res.status(400).json({ message: 'Each question must have text, options, and correct answer' });
                }
                if (!question.options.includes(question.correctAnswer)) {
                    return res.status(400).json({ message: 'Correct answer must be one of the options' });
                }
            }
            updateData.questions = questions;
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'username email');

        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a quiz
router.delete('/deleteQuiz/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid quiz ID' });
        }

        const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
        
        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get quizzes by subject
router.get('/subject/:subjectName', async (req, res) => {
    try {
        const quizzes = await Quiz.find({ 
            subjectName: new RegExp(req.params.subjectName, 'i') 
        }).populate('createdBy', 'username email');
        
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get quizzes by creator
router.get('/creator/:userId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const quizzes = await Quiz.find({ createdBy: req.params.userId })
            .populate('createdBy', 'username email');
            
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;