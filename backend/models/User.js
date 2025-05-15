// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     name: { type: String, required: true },  // Make name required
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// });


// module.exports = mongoose.model('User', UserSchema);


const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: null },
  bio: { type: String, default: null },
  githubUrl: { type: String, default: null },
  linkedinUrl: { type: String, default: null },
  portfolioUrl: { type: String, default: null },
  contestsParticipated: { type: Number, default: 0 },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    browser: { type: Boolean, default: true }
  },
  platforms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Platform' // Reference the Platform model
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
