const express = require('express');
const router = express.Router();
const Class = require('../modules/others/classSchema');
const User = require('../modules/user/userSchema');
const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const passport = require('passport');
const checkUserStatus = require('../middleware/checkUserStatus')



const isAdmin = (req, res, next) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({ message: 'Forbidden: Admin access required' });
	}
	next();
};

const isMentor = (req, res, next) => {
	if (req.user.role !== 'mentor') {
		return res.status(403).json({ message: 'Forbidden: Mentor access required' });
	}
	next();
};



const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = path.join(__dirname, '../uploads/class-logos');
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const uniqueName = `class-logo-${Date.now()}${ext}`;
		cb(null, uniqueName);
	}
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		const allowedTypes = ['.jpeg', '.jpg', '.png', '.gif'];
		const ext = path.extname(file.originalname).toLowerCase();
		if (allowedTypes.includes(ext)) {
			cb(null, true);
		} else {
			cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF)'));
		}
	},
	limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});





// For Admin

router.post('/createClass', passport.authenticate('jwt', { session: false }), isAdmin, upload.single('classLogo'), async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { classTopic, className, classDescription, joinCode, mentors } = req.body;

		// Validate required fields
		if (!classTopic || !className || !joinCode) {
			if (req.file) fs.unlinkSync(req.file.path);
			return res.status(400).json({
				success: false,
				message: 'Class topic, name and join code are required'
			});
		}

		let mentorIds = [];
		if (mentors) {
			try {
				mentorIds = Array.isArray(mentors) ? mentors : JSON.parse(mentors);

				if (!mentorIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
					throw new Error('Invalid mentor ID format');
				}

				const mentorUsers = await User.find({
					_id: { $in: mentorIds },
					role: 'mentor'
				}).session(session);

				if (mentorUsers.length !== mentorIds.length) {
					throw new Error('Some mentors not found or not valid mentors');
				}
			} catch (error) {
				if (req.file) fs.unlinkSync(req.file.path);
				return res.status(400).json({
					success: false,
					message: 'Invalid mentors data',
					error: error.message
				});
			}
		}

		const existingClass = await Class.findOne({ joinCode }).session(session);
		if (existingClass) {
			if (req.file) fs.unlinkSync(req.file.path);
			return res.status(400).json({
				success: false,
				message: 'Join code must be unique'
			});
		}

		const newClass = new Class({
			classTopic,
			className,
			classDescription,
			joinCode,
			mentors: mentorIds,
			classLogo: req.file ? `/uploads/class-logos/${req.file.filename}` : undefined
		});

		const savedClass = await newClass.save({ session });

		if (mentorIds.length > 0) {
			await User.updateMany(
				{ _id: { $in: mentorIds } },
				{ $addToSet: { joinedClass: savedClass._id } },
				{ session }
			);
		}

		await session.commitTransaction();

		res.status(201).json({
			success: true,
			message: 'Class created successfully',
			class: savedClass
		});

	} catch (error) {
		await session.abortTransaction();

		// Clean up uploaded file if error occurred
		if (req.file && fs.existsSync(req.file.path)) {
			fs.unlinkSync(req.file.path);
		}

		console.error('Error creating class:', error);

		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message: 'Join code must be unique'
			});
		}

		if (error instanceof multer.MulterError) {
			return res.status(400).json({
				success: false,
				message: 'File upload error',
				error: error.message
			});
		}

		res.status(500).json({
			success: false,
			message: 'Failed to create class',
			error: error.message
		});
	} finally {
		session.endSession();
	}
}
);

router.get('/getAllClass', passport.authenticate('jwt', { session: false }), checkUserStatus, isAdmin, async (req, res) => {

	try {
		const classes = await Class.find();
		res.status(200).json(classes);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get('/getClass/:id', passport.authenticate('jwt', { session: false }), checkUserStatus, isAdmin, async (req, res) => {
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


		res.status(200).json(classData);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put('/updateClass/:id', passport.authenticate('jwt', { session: false }), isAdmin, upload.single('classLogo'), async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { id } = req.params;
		const { classTopic, className, classDescription, joinCode, mentors } = req.body;

		// 1. Find the existing class
		const existingClass = await Class.findById(id).session(session);
		if (!existingClass) {
			if (req.file) fs.unlinkSync(req.file.path);
			return res.status(404).json({
				success: false,
				message: 'Class not found'
			});
		}

		// 2. Validate join code uniqueness if being changed
		if (joinCode && joinCode !== existingClass.joinCode) {
			const codeExists = await Class.findOne({ joinCode }).session(session);
			if (codeExists) {
				if (req.file) fs.unlinkSync(req.file.path);
				return res.status(400).json({
					success: false,
					message: 'Join code must be unique'
				});
			}
		}

		// 3. Process mentors if provided
		let mentorIds = existingClass.mentors;
		if (mentors !== undefined) {
			try {
				// Parse mentors (accept both array and JSON string)
				mentorIds = Array.isArray(mentors) ? mentors : JSON.parse(mentors);

				// Validate all mentor IDs
				if (!mentorIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
					throw new Error('Invalid mentor ID format');
				}

				// Verify all mentors exist and have mentor role
				const mentorUsers = await User.find({
					_id: { $in: mentorIds },
					role: 'mentor'
				}).session(session);

				if (mentorUsers.length !== mentorIds.length) {
					throw new Error('Some mentors not found or not valid mentors');
				}
			} catch (error) {
				if (req.file) fs.unlinkSync(req.file.path);
				return res.status(400).json({
					success: false,
					message: 'Invalid mentors data',
					error: error.message
				});
			}
		}

		// 4. Handle logo update/removal
		let classLogo = existingClass.classLogo;
		if (req.file) {
			// Delete old logo if exists
			if (classLogo) {
				const oldLogoPath = path.join(__dirname, '..', classLogo);
				if (fs.existsSync(oldLogoPath)) fs.unlinkSync(oldLogoPath);
			}
			classLogo = `/uploads/class-logos/${req.file.filename}`;
		} else if (req.body.removeLogo === 'true') {
			// Handle explicit logo removal
			if (classLogo) {
				const oldLogoPath = path.join(__dirname, '..', classLogo);
				if (fs.existsSync(oldLogoPath)) fs.unlinkSync(oldLogoPath);
			}
			classLogo = undefined;
		}

		// 5. Update the class
		const updatedClass = await Class.findByIdAndUpdate(
			id,
			{
				classTopic: classTopic || existingClass.classTopic,
				className: className || existingClass.className,
				classDescription: classDescription !== undefined ? classDescription : existingClass.classDescription,
				joinCode: joinCode || existingClass.joinCode,
				mentors: mentorIds,
				classLogo
			},
			{ new: true, session }
		);

		// 6. Update mentor relationships
		if (mentors !== undefined) {
			// Remove class from previous mentors no longer in list
			await User.updateMany(
				{
					_id: { $in: existingClass.mentors },
					joinedClass: id
				},
				{ $pull: { joinedClass: id } },
				{ session }
			);

			// Add class to new mentors
			await User.updateMany(
				{ _id: { $in: mentorIds } },
				{ $addToSet: { joinedClass: id } },
				{ session }
			);
		}

		await session.commitTransaction();

		res.status(200).json({
			success: true,
			message: 'Class updated successfully',
			class: updatedClass
		});

	} catch (error) {
		await session.abortTransaction();

		// Clean up uploaded file if error occurred
		if (req.file && fs.existsSync(req.file.path)) {
			fs.unlinkSync(req.file.path);
		}

		console.error('Error updating class:', error);

		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message: 'Join code must be unique'
			});
		}

		res.status(500).json({
			success: false,
			message: 'Failed to update class',
			error: error.message
		});
	} finally {
		session.endSession();
	}
}
);

router.delete('/deleteClass/:id', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
	try {
		const { id } = req.params;
		console.log(id);


		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Invalid class ID' });
		}


		const classToDelete = await Class.findById(id);
		if (!classToDelete) {
			return res.status(404).json({ message: 'Class not found' });
		}

		await User.updateMany(
			{ _id: { $in: [...classToDelete.mentors, ...classToDelete.students] } },
			{ $pull: { joindClass: id } }
		);

		await Class.findByIdAndDelete(id);

		res.status(200).json({ message: 'Class deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});









// For Mentor


















// For Student

router.post('/join', 
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    try {
      const { joinCode } = req.body;
      const studentId = req.user._id;

      // Verify class exists
      const classObj = await Class.findOne({ joinCode });
      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Check if already in class
      if (classObj.students.includes(studentId) || 
          classObj.mentors.includes(studentId)) {
        return res.status(400).json({
          success: false,
          message: 'Already in this class'
        });
      }

      // Add to pending students
      classObj.students.push(studentId);
      await classObj.save();

      res.status(200).json({
        success: true,
        message: 'Join request submitted',
        classId: classObj._id
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Join request failed',
        error: error.message
      });
    }
});

router.get('/:classId/pending',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    try {
      const { classId } = req.params;
      const mentorId = req.user._id;

      // Verify mentor permissions
      const classObj = await Class.findOne({
        _id: classId,
        mentors: mentorId
      }).populate({
        path: 'students',
        match: { joinedClass: { $ne: classId } },
        select: '_id username email'
      });

      if (!classObj) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      res.status(200).json({
        success: true,
        pendingStudents: classObj.students.filter(s => s !== null)
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pending students',
        error: error.message
      });
    }
});

router.post('/approve',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { classId, studentId } = req.body;
      const mentorId = req.user._id;

      // Verify mentor permissions
      const classObj = await Class.findOne({
        _id: classId,
        mentors: mentorId
      }).session(session);

      if (!classObj) {
        await session.abortTransaction();
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      // Verify student is pending
      if (!classObj.students.includes(studentId)) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Student not in pending list'
        });
      }

      // Add to student's joined classes
      await User.findByIdAndUpdate(
        studentId,
        { $addToSet: { joinedClass: classId } },
        { session }
      );

      await session.commitTransaction();
      res.status(200).json({
        success: true,
        message: 'Student approved'
      });

    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        success: false,
        message: 'Approval failed',
        error: error.message
      });
    } finally {
      session.endSession();
    }
});











// For Mentor and Student

router.get('/getMyClasses', passport.authenticate('jwt', { session: false }), checkUserStatus, isMentor, async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId)
			.populate({
				path: 'joinedClass',
				populate: [
					{ path: 'mentors', select: 'username email role image' },
					{ path: 'students', select: 'username email role image' }
				]
			});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.status(200).json(user.joinedClass);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});


router.get('/:classId/students',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    try {
      const { classId } = req.params;
      const userId = req.user._id;

      const isAuthorized = await Class.findOne({
        _id: classId,
        $or: [
          { mentors: userId },
          { createdBy: userId }
        ]
      });

      if (!isAuthorized && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view students'
        });
      }

      const students = await User.find({
        joinedClass: classId
      }).select('_id username email phoneNumber role');

      res.status(200).json({
        success: true,
        count: students.length,
        students
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch students',
        error: error.message
      });
    }
});


router.delete('/:classId/students/:studentId',
  passport.authenticate('jwt', { session: false }),
  checkUserStatus,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { classId, studentId } = req.params;
      const userId = req.user._id;

      const isAuthorized = await Class.findOne({
        _id: classId,
        $or: [
          { mentors: userId },
          { createdBy: userId }
        ]
      }).session(session);

      if (!isAuthorized && (req.user.role !== 'admin' || req.user.role !== 'mentor')) {
        await session.abortTransaction();
        return res.status(403).json({
          success: false,
          message: 'Not authorized to remove students'
        });
      }

      await Class.findByIdAndUpdate(
        classId,
        { $pull: { students: studentId } },
        { session }
      );

      await User.findByIdAndUpdate(
        studentId,
        { $pull: { joinedClass: classId } },
        { session }
      );

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: 'Student removed from class'
      });

    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        success: false,
        message: 'Failed to remove student',
        error: error.message
      });
    } finally {
      session.endSession();
    }
});




module.exports = router;