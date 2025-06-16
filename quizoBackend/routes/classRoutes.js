const express = require('express');
const router = express.Router();
const Class = require('../modules/others/classSchema');
const User = require('../modules/user/userSchema');
const mongoose = require('mongoose');
<<<<<<< HEAD
=======
const passport = require('passport');
const checkUserStatus = require('../middleware/checkUserStatus')
>>>>>>> fffc95f (Nodemailer Updated)

// Generate a random join code
const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create a new class
<<<<<<< HEAD
router.post('/createClass', async (req, res) => {
    try {
        const { classTopic, className, classDescription, mentors } = req.body;
        
        const mentorUsers = await User.find({ 
            _id: { $in: mentors },
            role: 'mentor'
        });
        
        if (mentorUsers.length !== mentors.length) {
            return res.status(400).json({ message: 'One or more mentors are invalid or not mentor role' });
        }
        
=======
router.post('/createClass', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { classTopic, className, classDescription, mentors } = req.body;

        const mentorUsers = await User.find({
            _id: { $in: mentors },
            role: 'mentor'
        });

        if (mentorUsers.length !== mentors.length) {
            return res.status(400).json({ message: 'One or more mentors are invalid or not mentor role' });
        }

>>>>>>> fffc95f (Nodemailer Updated)
        const newClass = new Class({
            classTopic,
            className,
            classDescription,
            mentors,
            joinCode: generateJoinCode()
        });
<<<<<<< HEAD
        
        const savedClass = await newClass.save();
        
=======

        const savedClass = await newClass.save();

>>>>>>> fffc95f (Nodemailer Updated)
        await User.updateMany(
            { _id: { $in: mentors } },
            { $addToSet: { joindClass: savedClass._id } }
        );
<<<<<<< HEAD
        
=======

>>>>>>> fffc95f (Nodemailer Updated)
        res.status(201).json(savedClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all classes
<<<<<<< HEAD
router.get('/', async (req, res) => {
=======
router.get('/getAllClass', passport.authenticate('jwt', { session: false }), checkUserStatus, async (req, res) => {
>>>>>>> fffc95f (Nodemailer Updated)
    try {
        const classes = await Class.find()
            .populate('mentors', 'username email role')
            .populate('students', 'username email role');
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get class by ID
<<<<<<< HEAD
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid class ID' });
        }
        
        const classData = await Class.findById(id)
            .populate('mentors', 'username email role image')
            .populate('students', 'username email role image');
            
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }
        
=======
router.get('/getClass/:id', passport.authenticate('jwt', { session: false }), checkUserStatus, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid class ID' });
        }

        const classData = await Class.findById(id)
            .populate('mentors', 'username email role image')
            .populate('students', 'username email role image');

        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

>>>>>>> fffc95f (Nodemailer Updated)
        res.status(200).json(classData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update class by ID
<<<<<<< HEAD
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid class ID' });
        }
        
=======
router.put('/updateClass/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid class ID' });
        }

>>>>>>> fffc95f (Nodemailer Updated)
        if (updateData.mentors) {
            const currentClass = await Class.findById(id);
            if (!currentClass) {
                return res.status(404).json({ message: 'Class not found' });
            }
<<<<<<< HEAD
            
            const mentorUsers = await User.find({ 
                _id: { $in: updateData.mentors },
                role: 'mentor'
            });
            
            if (mentorUsers.length !== updateData.mentors.length) {
                return res.status(400).json({ message: 'One or more mentors are invalid or not mentor role' });
            }
            
            const mentorsToRemove = currentClass.mentors.filter(
                mentor => !updateData.mentors.includes(mentor.toString())
            );
            
            const mentorsToAdd = updateData.mentors.filter(
                mentor => !currentClass.mentors.includes(new mongoose.Types.ObjectId(mentor))
            );
            
=======

            const mentorUsers = await User.find({
                _id: { $in: updateData.mentors },
                role: 'mentor'
            });

            if (mentorUsers.length !== updateData.mentors.length) {
                return res.status(400).json({ message: 'One or more mentors are invalid or not mentor role' });
            }

            const mentorsToRemove = currentClass.mentors.filter(
                mentor => !updateData.mentors.includes(mentor.toString())
            );

            const mentorsToAdd = updateData.mentors.filter(
                mentor => !currentClass.mentors.includes(new mongoose.Types.ObjectId(mentor))
            );

>>>>>>> fffc95f (Nodemailer Updated)
            if (mentorsToRemove.length > 0) {
                await User.updateMany(
                    { _id: { $in: mentorsToRemove } },
                    { $pull: { joindClass: id } }
                );
            }
<<<<<<< HEAD
            
=======

>>>>>>> fffc95f (Nodemailer Updated)
            if (mentorsToAdd.length > 0) {
                await User.updateMany(
                    { _id: { $in: mentorsToAdd } },
                    { $addToSet: { joindClass: id } }
                );
            }
        }
<<<<<<< HEAD
        
        const updatedClass = await Class.findByIdAndUpdate(id, updateData, { 
            new: true,
            runValidators: true
        }).populate('mentors students');
        
        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        
=======

        const updatedClass = await Class.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        }).populate('mentors students');

        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

>>>>>>> fffc95f (Nodemailer Updated)
        res.status(200).json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete class by ID
<<<<<<< HEAD
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid class ID' });
        }
        
=======
router.delete('/deleteClass/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid class ID' });
        }

>>>>>>> fffc95f (Nodemailer Updated)
        const classToDelete = await Class.findById(id);
        if (!classToDelete) {
            return res.status(404).json({ message: 'Class not found' });
        }
<<<<<<< HEAD
        
=======

>>>>>>> fffc95f (Nodemailer Updated)
        await User.updateMany(
            { _id: { $in: [...classToDelete.mentors, ...classToDelete.students] } },
            { $pull: { joindClass: id } }
        );
<<<<<<< HEAD
        
        await Class.findByIdAndDelete(id);
        
=======

        await Class.findByIdAndDelete(id);

>>>>>>> fffc95f (Nodemailer Updated)
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Join a class using join code
<<<<<<< HEAD
router.post('/join', async (req, res) => {
    try {
        const { joinCode } = req.body;
        const userId = req.user._id;
        
=======
router.post('/joinClass', passport.authenticate('jwt', { session: false }), checkUserStatus, async (req, res) => {
    try {
        const { joinCode } = req.body;
        const userId = req.user._id;

>>>>>>> fffc95f (Nodemailer Updated)
        const classToJoin = await Class.findOne({ joinCode });
        if (!classToJoin) {
            return res.status(404).json({ message: 'Class not found with this join code' });
        }
<<<<<<< HEAD
        
=======

>>>>>>> fffc95f (Nodemailer Updated)
        const user = await User.findById(userId);
        if (classToJoin.students.includes(userId) || classToJoin.mentors.includes(userId)) {
            return res.status(400).json({ message: 'You are already in this class' });
        }
<<<<<<< HEAD
        
=======

>>>>>>> fffc95f (Nodemailer Updated)
        if (user.role === 'mentor') {
            classToJoin.mentors.push(userId);
        } else {
            classToJoin.students.push(userId);
        }
<<<<<<< HEAD
        
        user.joindClass.push(classToJoin._id);
        
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            await classToJoin.save({ session });
            await user.save({ session });
            await session.commitTransaction();
            
            res.status(200).json({ 
                message: 'Successfully joined class',
                class: classToJoin
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
=======

        user.joindClass.push(classToJoin._id);

        // Save both documents without transaction
        await classToJoin.save();
        await user.save();

        res.status(200).json({
            message: 'Successfully joined class',
            class: classToJoin
        });
>>>>>>> fffc95f (Nodemailer Updated)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;