require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose
	.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		console.log('connected to mongodb')
	})
	.catch((error) => {
		console.log('error connecting to mongodb: ', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		unique: true,
	},
	number: {
		type: String,
		minLength: 8,
		validate: {
			validator: function (v) {
				return /^\d{2,3}-\d*$/.test(v)
			},
			message: (props) => `${props.value} is not a valid phone number`,
		},
	},
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

personSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Person', personSchema)
