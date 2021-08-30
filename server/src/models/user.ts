import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    usernameLower: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    emailLower: {
        type: String,
        required: true,
    },
    registered: {
        type: String,
        required: true,
    },
    lastOnline: {
        type: String,
        required: true,
    },
});

export default mongoose.model('Users', userSchema);
