const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz'); // Adjust path as needed
const mongoose = require('mongoose');





// Subject Management Routes

router.post('/subjects',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    try {
      const { subjectName } = req.body;
      const createdBy = req.user._id;

      if (!subjectName) {
        return res.status(400).json({
          success: false,
          message: 'Subject name is required'
        });
      }

      const newSubject = new Quiz({
        subjectName,
        createdBy,
        topic: []
      });

      await newSubject.save();

      res.status(201).json({
        success: true,
        message: 'Subject created successfully',
        subject: newSubject
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create subject',
        error: error.message
      });
    }
});

router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Quiz.find()
      .select('subjectName createdAt')
      .populate('createdBy', 'username');

    res.status(200).json({
      success: true,
      count: subjects.length,
      subjects
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
      error: error.message
    });
  }
});

router.put('/subjects/:subjectId',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    try {
      const { subjectId } = req.params;
      const { subjectName } = req.body;
      const userId = req.user._id;

      if (!subjectName) {
        return res.status(400).json({
          success: false,
          message: 'Subject name is required'
        });
      }

      const subject = await Quiz.findOne({
        _id: subjectId,
        createdBy: userId
      });

      if (!subject && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this subject'
        });
      }

      const updatedSubject = await Quiz.findByIdAndUpdate(
        subjectId,
        { subjectName },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Subject updated successfully',
        subject: updatedSubject
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update subject',
        error: error.message
      });
    }
});

router.delete('/subjects/:subjectId',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    try {
      const { subjectId } = req.params;
      const userId = req.user._id;

      const subject = await Quiz.findOne({
        _id: subjectId,
        createdBy: userId
      });

      if (!subject && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this subject'
        });
      }

      await Quiz.findByIdAndDelete(subjectId);

      res.status(200).json({
        success: true,
        message: 'Subject and all its content deleted successfully'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete subject',
        error: error.message
      });
    }
});








//Topic Management Routes

router.post('/subjects/:subjectId/topics',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    try {
      const { subjectId } = req.params;
      const { topicName } = req.body;
      const userId = req.user._id;

      if (!topicName) {
        return res.status(400).json({
          success: false,
          message: 'Topic name is required'
        });
      }

      const subject = await Quiz.findOne({
        _id: subjectId,
        createdBy: userId
      });

      if (!subject && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to add topics to this subject'
        });
      }

      const updatedSubject = await Quiz.findByIdAndUpdate(
        subjectId,
        {
          $push: {
            topic: {
              topicName,
              questions: []
            }
          }
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        message: 'Topic added successfully',
        subject: updatedSubject
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add topic',
        error: error.message
      });
    }
});

router.get('/subjects/:subjectId/topics', async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Quiz.findById(subjectId)
      .select('topic');

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      count: subject.topic.length,
      topics: subject.topic
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics',
      error: error.message
    });
  }
});

router.put('/subjects/:subjectId/topics/:topicId',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    try {
      const { subjectId, topicId } = req.params;
      const { topicName } = req.body;
      const userId = req.user._id;

      if (!topicName) {
        return res.status(400).json({
          success: false,
          message: 'Topic name is required'
        });
      }

      const subject = await Quiz.findOne({
        _id: subjectId,
        createdBy: userId
      });

      if (!subject && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this topic'
        });
      }

      const updatedSubject = await Quiz.findOneAndUpdate(
        {
          _id: subjectId,
          'topic._id': topicId
        },
        {
          $set: {
            'topic.$.topicName': topicName
          }
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Topic updated successfully',
        subject: updatedSubject
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update topic',
        error: error.message
      });
    }
});

router.delete('/subjects/:subjectId/topics/:topicId',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    try {
      const { subjectId, topicId } = req.params;
      const userId = req.user._id;

      const subject = await Quiz.findOne({
        _id: subjectId,
        createdBy: userId
      });

      if (!subject && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this topic'
        });
      }

      const updatedSubject = await Quiz.findByIdAndUpdate(
        subjectId,
        {
          $pull: {
            topic: { _id: topicId }
          }
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Topic and all its questions deleted successfully',
        subject: updatedSubject
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete topic',
        error: error.message
      });
    }
});

















// Question Management Routes

router.post('/subjects/:subjectId/topics/:topicId/questions',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    try {
      const { subjectId, topicId } = req.params;
      const { questions } = req.body; 
      const userId = req.user._id;

      // Validate input
      if (!questions || (Array.isArray(questions) && questions.length === 0)) {
        return res.status(400).json({
          success: false,
          message: 'At least one question is required'
        });
      }

      // Verify authorization
      const subject = await Quiz.findOne({
        _id: subjectId,
        createdBy: userId
      });

      if (!subject && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to add questions'
        });
      }

      // Convert single question to array for uniform processing
      const questionsToAdd = Array.isArray(questions) ? questions : [questions];

      // Validate each question
      for (const question of questionsToAdd) {
        if (!question.questionText || !question.options || !question.correctAnswer) {
          return res.status(400).json({
            success: false,
            message: 'Each question must have text, options, and correct answer'
          });
        }
      }

      // Add questions to topic
      const updatedSubject = await Quiz.findOneAndUpdate(
        { 
          _id: subjectId,
          'topic._id': topicId 
        },
        { 
          $push: { 
            'topic.$.questions': { 
              $each: questionsToAdd 
            } 
          } 
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        message: `${questionsToAdd.length} question(s) added successfully`,
        subject: updatedSubject
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add questions',
        error: error.message
      });
    }
});


router.get('/subjects/:subjectId/topics/:topicId/questions', async (req, res) => {
  try {
    const { subjectId, topicId } = req.params;

    const subject = await Quiz.findOne(
      { _id: subjectId },
      { 
        topic: { 
          $elemMatch: { _id: topicId } 
        } 
      }
    );

    if (!subject || !subject.topic.length) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    const questions = subject.topic[0].questions;

    res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message
    });
  }
});


router.put('/subjects/:subjectId/topics/:topicId/questions',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { subjectId, topicId } = req.params;
      const { questions } = req.body; // Array of { _id, updates }
      const userId = req.user._id;

      // Verify authorization
      const subject = await Quiz.findOne({
        _id: subjectId,
        createdBy: userId
      }).session(session);

      if (!subject && req.user.role !== 'admin') {
        await session.abortTransaction();
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update questions'
        });
      }

      // Process updates (can be single or multiple)
      const updates = Array.isArray(questions) ? questions : [questions];
      const bulkOps = [];

      for (const update of updates) {
        if (!update._id || !update.updates) {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            message: 'Each update must contain question _id and updates'
          });
        }

        const updateFields = {};
        for (const [key, value] of Object.entries(update.updates)) {
          updateFields[`topic.$[topic].questions.$[question].${key}`] = value;
        }

        bulkOps.push({
          updateOne: {
            filter: {
              _id: subjectId,
              'topic._id': topicId,
              'topic.questions._id': update._id
            },
            update: { $set: updateFields },
            arrayFilters: [
              { 'topic._id': topicId },
              { 'question._id': update._id }
            ]
          }
        });
      }

      if (bulkOps.length > 0) {
        await Quiz.bulkWrite(bulkOps, { session });
      }

      await session.commitTransaction();
      
      res.status(200).json({
        success: true,
        message: `${updates.length} question(s) updated successfully`
      });

    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        success: false,
        message: 'Failed to update questions',
        error: error.message
      });
    } finally {
      session.endSession();
    }
});


router.delete('/subjects/:subjectId/topics/:topicId/questions',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { subjectId, topicId } = req.params;
      const { questionIds } = req.body; // Can be single ID or array
      const userId = req.user._id;

      // Verify authorization
      const subject = await Quiz.findOne({
        _id: subjectId,
        createdBy: userId
      }).session(session);

      if (!subject && req.user.role !== 'admin') {
        await session.abortTransaction();
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete questions'
        });
      }

      // Convert to array if single ID
      const idsToDelete = Array.isArray(questionIds) ? questionIds : [questionIds];

      const updatedSubject = await Quiz.findByIdAndUpdate(
        subjectId,
        {
          $pull: {
            'topic.$[topic].questions': {
              _id: { $in: idsToDelete }
            }
          }
        },
        {
          arrayFilters: [{ 'topic._id': topicId }],
          new: true,
          session
        }
      );

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: `${idsToDelete.length} question(s) deleted successfully`,
        subject: updatedSubject
      });

    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        success: false,
        message: 'Failed to delete questions',
        error: error.message
      });
    } finally {
      session.endSession();
    }
});










module.exports = router;