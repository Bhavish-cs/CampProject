const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Connection error:", err));

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route
app.get('/', (req, res) => {
    res.send('HELLO FROM CAMP!');

})

app.get('/maecampground ', async (req, res) => {
    const camp = new Campground({ tittle: 'My Backyard', description: 'chep camping!' });
    await camp.save();
    res.send(camp)
})






app.listen(3000, () => {
    console.log('Serving on port 3000');
});
