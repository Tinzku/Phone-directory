import React from 'react'
import axios from 'axios'


// The base url for the API
const baseUrl = 'http://localhost:3001/api/persons'

const Persons = ({ persons, onRemovePerson }) => {
  return (
    <table>
      <tbody>
        {persons.map(person => <Person key={person.name} person={person} onRemovePerson={onRemovePerson} />)}
      </tbody>
    </table>
  )
}

const Person = ({ person, onRemovePerson }) => {
  return (
    <tr>
      <td>{person.name}</td><td>{person.number}</td><td><button onClick={(event) => onRemovePerson(person.id, event)}>Remove</button></td>
    </tr>
  )
}

// The amount of props can be decreased. Following the instructions this is the result.
const NewPersonForm = ({ onAddPerson, onNameChange, onNumberChange, newName, newNumber }) => {
  return (
    <form onSubmit={onAddPerson}>
      <div>
        Name: <input value={newName} onChange={onNameChange} />
      </div>
      <div>
        Number: <input value={newNumber} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )

}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: ''
    }
  }

  addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: this.state.newName,
      number: this.state.newNumber
    }
    if (this.state.persons.map(person => person.name.toUpperCase()).includes(person.name.toUpperCase())) {
      alert(`${person.name} already exists! Please choose a different name.`)
      return
    }
    axios.post(baseUrl, person)
      .then(response => {
        this.setState({
          persons: this.state.persons.concat(response.data),
          newName: '',
          newNumber: ''
        })
      })
  }

  removePerson = (id, event) => {
    const url = `${baseUrl}/${id}`
    const person = this.state.persons.find(n => n.id === id)
    if (!window.confirm(`Are you sure you want to delete ${person.name} from your phonebook?`)) {
      return
    }
    axios
      .delete(url, person)
      .then(response => {
        this.setState({
          persons: this.state.persons.filter(person => person.id !== id)
        })
      })
  }

  handleNameChange = (event) => {
    this.setState({ newName: event.target.value })
  }

  handleNumberChange = (event) => {
    this.setState({ newNumber: event.target.value })
  }

  componentDidMount() {
    axios
      .get(baseUrl)
      .then(response => {
        this.setState({ persons: response.data })
      })
  }

  render() {
    return (
      <div>
        <h2>Phonebook</h2>
        <NewPersonForm onAddPerson={this.addPerson} onNameChange={this.handleNameChange} onNumberChange={this.handleNumberChange} newName={this.state.newName} newNumber={this.state.newNumber} />
        <h2>Numbers</h2>
        <Persons persons={this.state.persons} onRemovePerson={this.removePerson} />
      </div>

    )
  }
}

export default App
