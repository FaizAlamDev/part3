const express = require('express')

const app = express()

app.use(express.json())

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendick',
		number: '39-23-6423122',
	},
]

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)

	const person = persons.find((p) => p.id === id)
	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
})

app.get('/info', (request, response) => {
	const info = `<p>
				Phonebook has info for ${persons.length} people
				</p>
				<p>${Date()}</p>`
	response.send(info)
})

app.post('/api/persons', (request, response) => {
	const body = request.body

	const id = parseInt(Math.random() * 1000)

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'name or number missing',
		})
	}

	if (persons.find((p) => p.name === body.name)) {
		return response.status(400).json({
			error: 'name must be unique',
		})
	}

	const person = {
		id: id,
		name: body.name,
		number: body.number,
	}

	persons = persons.concat(person)

	response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter((p) => p.id !== id)

	response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`server running at port ${PORT}`)
})
