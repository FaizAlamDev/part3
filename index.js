require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req, res) => {
	return JSON.stringify(req.body)
})

app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :body'
	)
)

app.get('/', (request, response) => {
	response.send('Hello World')
})

app.get('/api/persons', (request, response) => {
	Person.find({}).then((people) => {
		response.json(people)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
	Person.find({})
		.then((result) => {
			const info = `<p>
				Phonebook has info for ${result.length} people
				</p>
				<p>${Date()}</p>`
			response.send(info)
		})
		.catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'name or number missing',
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	})
	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson)
		})
		.catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(request.params.id, person, {
		new: true,
		runValidators: true,
	})
		.then((updatedPerson) => {
			response.json(updatedPerson)
		})
		.catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end()
		})
		.catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`server running at port ${PORT}`)
})
