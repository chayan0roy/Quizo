const express = require('express');
const router = express.Router();
const User = require('../modules/user/userSchema');

const EmailVerificationModel = require('../modules/others/EmailVerification');

const bcrypt = require('bcryptjs')
const dotenv = require('dotenv');
const generateToken = require('../utils/generateToken')
const checkUserStatus = require('../middleware/checkUserStatus')
dotenv.config();
const passport = require('passport');

const fs = require('fs');
const path = require('path');
const { singleImageUpload } = require('../middleware/multer')


// Admin middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    next();
};




router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;

        if (!username || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newSalt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(password, newSalt)

        const newUser = new User({ username, email, password: hashPassword, phoneNumber });
        await newUser.save();

        const { auth_token } = await generateToken(newUser)

        res.status(201).json({ message: 'User registered successfully', auth_token });
        sendOtpVerificationEmail(req, res, newUser);


        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/verifyEmail', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ status: "failed", message: "Email doesn't exists" });
        }

        if (existingUser.is_verified) {
            return res.status(400).json({ status: "failed", message: "Email is already verified" });
        }

        const emailVerification = await EmailVerificationModel.findOne({ userId: existingUser._id, otp });
        if (!emailVerification) {
            if (!existingUser.is_verified) {
                await sendEmail(req, res, existingUser)
                return res.status(400).json({ status: "failed", message: "Invalid OTP, new OTP sent to your email" });
            }
            return res.status(400).json({ status: "failed", message: "Invalid OTP" });
        }

        const currentTime = new Date();
        const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
        if (currentTime > expirationTime) {
            await sendEmail(req, res, existingUser)
            return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
        }

        existingUser.is_verified = true;
        await existingUser.save();

        const { auth_token } = await generateToken(existingUser)

        await EmailVerificationModel.deleteMany({ userId: existingUser._id });
        res.status(200).json({
            status: true,
            role: existingUser.role,
            auth_token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Unable to verify email, please try again later" });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existUser = await User.findOne({ email });

        if (!existUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, existUser.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid' });
        }

        const { auth_token } = await generateToken(existUser)

        res.status(200).json({ message: 'Login successful', auth_token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})





router.get('/profile', passport.authenticate('jwt', { session: false }), checkUserStatus, async (req, res) => {
    try {
        const userId = req.user.id

        const existUser = await User.findById(userId);

        if (!existUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        res.status(200).json({ existUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/upload-profile-picture', passport.authenticate('jwt', { session: false }), checkUserStatus, singleImageUpload, async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.image) {
            const oldImagePath = path.join(__dirname, '..', user.image);

            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.warn('Failed to delete old image:', err.message);
                } else {
                    console.log('Old profile image deleted successfully.');
                }
            });
        }

        user.image = req.file.path;
        await user.save();

        res.status(200).json({
            message: 'Profile picture updated successfully',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});









//For Admin


router.get('/getAllUsers', passport.authenticate('jwt', { session: false }), checkUserStatus, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.get('/allMentors', passport.authenticate('jwt', { session: false }), checkUserStatus, isAdmin, async (req, res) => {
    try {
      const mentors = await User.find({ role: 'mentor' }).select('-password')

      res.status(200).json({
        success: true,
        mentors: mentors
      });

    } catch (error) {
      console.error('Error in /mentors route:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
});


router.patch('/updateUsersRole/:id', passport.authenticate('jwt', { session: false }), checkUserStatus, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error(error); // Optional: helps with debugging
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.delete('/deleteUsers/:id', passport.authenticate('jwt', { session: false }), checkUserStatus, isAdmin, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;

        // 1. First get the user to access their image path and other data
        const user = await User.findById(id).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Delete user's profile picture if exists
        if (user.image) {
            const imagePath = path.join(__dirname, '..', user.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // 3. Remove user from all classes (as mentor or student)
        await Class.updateMany(
            { $or: [{ mentors: id }, { students: id }] },
            { $pull: { mentors: id, students: id } },
            { session }
        );

        // 4. Delete all posts by the user and their associated media files
        const userPosts = await Post.find({ author: id }).session(session);
        for (const post of userPosts) {
            // Delete media files associated with the post
            if (post.content.media && post.content.media.length > 0) {
                for (const media of post.content.media) {
                    const mediaPath = path.join(__dirname, '..', media.url);
                    if (fs.existsSync(mediaPath)) {
                        fs.unlinkSync(mediaPath);
                    }
                    if (media.thumbnail) {
                        const thumbPath = path.join(__dirname, '..', media.thumbnail);
                        if (fs.existsSync(thumbPath)) {
                            fs.unlinkSync(thumbPath);
                        }
                    }
                }
            }
        }
        await Post.deleteMany({ author: id }).session(session);

        // 5. Delete all comments by the user and their media
        const userComments = await Comment.find({ author: id }).session(session);
        for (const comment of userComments) {
            if (comment.media && comment.media.url) {
                const mediaPath = path.join(__dirname, '..', comment.media.url);
                if (fs.existsSync(mediaPath)) {
                    fs.unlinkSync(mediaPath);
                }
            }
        }
        await Comment.deleteMany({ author: id }).session(session);

        // 6. Delete all reactions by the user
        await Reaction.deleteMany({ user: id }).session(session);

        // 7. Update weekly quizzes to remove user from leaderboard
        await WeeklyQuiz.updateMany(
            { 'leaderboard.studentId': id },
            { $pull: { leaderboard: { studentId: id } } },
            { session }
        );

        // 8. Delete user's notes and shared notes
        await Notes.deleteMany({ author: id }).session(session);
        await Notes.updateMany(
            { 'sharedWith.userId': id },
            { $pull: { sharedWith: { userId: id } } },
            { session }
        );

        // 9. Delete user's tasks
        await Task.deleteMany({ userId: id }).session(session);

        // 10. Finally delete the user
        await User.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        res.status(200).json({ success: true, message: 'User and all associated data deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    } finally {
        session.endSession();
    }
});

router.patch('/blockUsers/:id', passport.authenticate('jwt', { session: false }), checkUserStatus, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_blocked } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { is_blocked },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const action = is_blocked ? 'blocked' : 'unblocked';
        res.status(200).json({ message: `User ${action} successfully`, user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;