const express = require('express');
const router = express.Router();
const ClassTest = require('../models/ClassTest');
const mongoose = require('mongoose');

// Create a new class test
router.post('/', async (req, res) => {
    try {
        const { 
            classId, 
            createdBy, 
            testName, 
            questions, 
            testDescription, 
            totalPoints, 
            timeLimit, 
            testDate, 
            testDuration, 
            startTime, 
            endTime 
        } = req.body;

        // Validate required fields
        if (!classId || !createdBy || !testName || !testDescription || 
            !testDate || !testDuration || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate ObjectId references
        if (!mongoose.Types.ObjectId.isValid(classId) || 
            !mongoose.Types.ObjectId.isValid(createdBy) ||
            (questions && !mongoose.Types.ObjectId.isValid(questions))) {
            return res.status(400).json({ message: 'Invalid reference ID' });
        }

        // Validate time consistency
        if (new Date(startTime) >= new Date(endTime)) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        const newTest = new ClassTest({
            classId,
            createdBy,
            testName,
            questions,
            testDescription,
            totalPoints: totalPoints || 0,
            timeLimit: timeLimit || 30,
            testDate,
            testDuration,
            startTime,
            endTime
        });

        const savedTest = await newTest.save();
        res.status(201).json(savedTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all class tests
router.get('/', async (req, res) => {
    try {
        const tests = await ClassTest.find()
            .populate('classId', 'className')
            .populate('createdBy', 'username email')
            .populate('questions', 'subjectName topicName');
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single test by ID
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid test ID' });
        }

        const test = await ClassTest.findById(req.params.id)
            .populate('classId', 'className')
            .populate('createdBy', 'username email')
            .populate('questions', 'subjectName topicName questions');
        
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a test
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid test ID' });
        }

        const { 
            testName, 
            questions, 
            testDescription, 
            totalPoints, 
            timeLimit, 
            testDate, 
            testDuration, 
            startTime, 
            endTime 
        } = req.body;

        const updateData = {};

        if (testName) updateData.testName = testName;
        if (questions) {
            if (!mongoose.Types.ObjectId.isValid(questions)) {
                return res.status(400).json({ message: 'Invalid questions ID' });
            }
            updateData.questions = questions;
        }
        if (testDescription) updateData.testDescription = testDescription;
        if (totalPoints) updateData.totalPoints = totalPoints;
        if (timeLimit) updateData.timeLimit = timeLimit;
        if (testDate) updateData.testDate = testDate;
        if (testDuration) updateData.testDuration = testDuration;
        if (startTime) updateData.startTime = startTime;
        if (endTime) updateData.endTime = endTime;

        // Validate time consistency if both times are being updated
        if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        const updatedTest = await ClassTest.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('classId', 'className')
         .populate('createdBy', 'username email')
         .populate('questions', 'subjectName topicName');

        if (!updatedTest) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json(updatedTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a test
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid test ID' });
        }

        const deletedTest = await ClassTest.findByIdAndDelete(req.params.id);
        
        if (!deletedTest) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json({ message: 'Test deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get tests by class ID
router.get('/class/:classId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.classId)) {
            return res.status(400).json({ message: 'Invalid class ID' });
        }

        const tests = await ClassTest.find({ classId: req.params.classId })
            .populate('classId', 'className')
            .populate('createdBy', 'username email')
            .populate('questions', 'subjectName topicName');
            
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get tests by creator
router.get('/creator/:userId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const tests = await ClassTest.find({ createdBy: req.params.userId })
            .populate('classId', 'className')
            .populate('createdBy', 'username email')
            .populate('questions', 'subjectName topicName');
            
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get upcoming tests (not yet started)
router.get('/upcoming/:classId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.classId)) {
            return res.status(400).json({ message: 'Invalid class ID' });
        }

        const now = new Date();
        const tests = await ClassTest.find({ 
            classId: req.params.classId,
            startTime: { $gt: now }
        })
        .populate('classId', 'className')
        .populate('createdBy', 'username email')
        .populate('questions', 'subjectName topicName');
        
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;