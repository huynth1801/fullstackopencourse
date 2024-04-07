const mongoose = require('mongoose');

// if (process.argv.length < 5) {
//   console.log('Usage: node mongo.js <password> <name> <phone number>');
//   process.exit(1);
// }

const password = process.argv[2];
// const name = process.argv[3];
// const phoneNumber = process.argv[4];

const url = `mongodb+srv://huuhuy1801:${password}@cluster0.hk2ocni.mongodb.net/phonebook`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const phonebookEntrySchema = new mongoose.Schema({
  name: String,
  number: String
});

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema);

// const entry = new PhonebookEntry({
//   name: name,
//   number: phoneNumber
// });

// entry.save()
//   .then(() => {
//     console.log(`Added ${name} number ${phoneNumber} to phonebook`);
//     mongoose.connection.close();
//   })
//   .catch((error) => {
//     console.error('Error saving entry:', error.message);
//     mongoose.connection.close();
//   });

PhonebookEntry.find({}).then(result => {
  console.log('phonebook:');
  result.forEach(note => {
    console.log(`${note.name} ${note.number}`);
  })
  mongoose.connection.close()
})
