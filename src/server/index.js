require('dotenv').config()
const express = require('express')
// removed bodyParser hence it is deprecated sinse express v. 4.16.0
// const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
});

app.get('/rover/:name', async (req, res) => {
    let { name } = req.params;
    try {
        const data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/latest_photos?api_key=${process.env.API_KEY}`).then(res => res.json());
        
        console.log(data)

        res.send(data);
    } catch (err) {
        console.log('error:', err)
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))