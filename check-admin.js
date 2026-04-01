const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const userSchema = new mongoose.Schema({
  email: String,
  role: String,
  name: String
}, { strict: false });

const User = mongoose.model('User', userSchema, 'users');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const u = await User.findOne({ email: 'admin@pandeycare.com' });
  console.log(u);
  process.exit(0);
}
main();
