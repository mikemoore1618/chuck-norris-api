
const
 express = require('express'),
 app = express(),
 axios = require('axios'),
 mongoose = require('mongoose'),
 PORT = 3000
​
mongoose.connect('mongodb://localhost/chuck-norris-search', (err) => {
 console.log(err || "Connected to MongoDB.")
})
​
const jokeSchema = new mongoose.Schema({
 body: String
}, { timestamps: true })
​
const Joke = mongoose.model('Joke', jokeSchema)
​
const apiClient = axios.create()
​
app.get("/", (req, res) => {
 const apiUrl = "https://api.chucknorris.io/jokes/random"
 apiClient({ method: 'get', url: apiUrl }).then((apiResponse) => {
  const joke = apiResponse.data.value
  res.send(`
   <h1>${joke}</h1>
   <a href="/save-joke?body=${joke}">Save To Favorites</a>
   <a href="/favorites">View All Favorites</a>
  `)
 })
})
​
app.get("/save-joke", (req, res) => {
 Joke.create(req.query, (err, brandNewJoke) => {
  if(err) return console.log(err)
  res.redirect("/")
 })
})
​
app.get("/favorites", (req, res) => {
 Joke.find({}, (err, allDemJokes) => {
  let jokeItems = ''
  allDemJokes.forEach((j) => {
   jokeItems += `<li>${j.body}</li>`
  })
  res.send(`
   <h1>Favorites:</h1>
   <ul>
    ${jokeItems}
   </ul>
   <a href="/">Back</a>
  `)
 })
})
​
app.listen(PORT, (err) => {
 console.log(err || `Server running on ${PORT}.`)
})
