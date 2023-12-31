const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const config = require('./config/config.json');

const app = express();
const PORT = config.port || 8081;

mongoose.connect('mongodb://localhost:27017/wiki-music-recommendation-api', {
  useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB: ', err));

const toplevelSchema = new mongoose.Schema({
    query: String,
    type: String,
    genres: [String],
    members: {
        current: [String],
        past: [String]
    },
    yearsActive: String
});

const Result = mongoose.model('Result', toplevelSchema);

app.get('/', (req, res) => {
    res.send(`
        <html>
            <body>
                <h2>Enter a song or music group:</h2>
                <form action="/search" method="get">
                    <input type="text" name="q" placeholder="e.g. The_Beatles" required>
                    <button type="submit">Submit</button>
                </form>
            </body>
        </html>
    `);
});

app.get('/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).send('Please provide a song or music group name in the query string.');
    }

    try {
        const response = await axios.get(`https://en.wikipedia.org/wiki/${query}`);
        const $ = cheerio.load(response.data);

        const genres = [];
        const members = {
            current: [],
            past: []
        };
        let yearsActive = '';

        $('table.infobox tbody tr').each((index, element) => {
            const key = $(element).find('th').text().trim();

            if (key === 'Genres') {
                $(element).find('td a').each((i, genreElement) => {
                    genres.push($(genreElement).text().trim());
                });
            }

            if (key === 'Members' || key === 'Current members') {
                $(element).find('td a').each((i, memberElement) => {
                    members.current.push($(memberElement).text().trim());
                });
            }

            if (key === 'Past members') {
                $(element).find('td a').each((i, memberElement) => {
                    members.past.push($(memberElement).text().trim());
                });
            }

            if (key === 'Years active') {
                yearsActive = $(element).find('td').text().trim();
            }
        });

        if (genres.length === 0 && members.current.length === 0 && members.past.length === 0 && !yearsActive) {
            return res.status(404).send('Information not found.');
        }

        res.json({ genres, members, yearsActive });

    } catch (error) {
        res.status(500).send('Something went wrong, try again later.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
