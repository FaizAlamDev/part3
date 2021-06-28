const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://faizalam:${password}@fullstackopen.gj4zx.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
	console.log(
		'Please provide the password as an argument: node mongo.js <password>'
	)
	process.exit(1)
} else if (process.argv.length === 3) {
	Person.find({}).then((result) => {
		console.log('phonebook:')
		result.forEach((person) => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
	})
} else if (process.argv.length == 5) {
	const name = process.argv[3]
	const number = process.argv[4]

	const person = new Person({
		name: name,
		number: number,
	})

	person.save().then((result) => {
		console.log(`added ${name} number ${number} to phonebook`)
		mongoose.connection.close()
	})
} else {
	console.log('Wrong arguments provided')
	process.exit(1)
}
