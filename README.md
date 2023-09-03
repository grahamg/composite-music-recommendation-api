# Composite Music Recommendation API 🎵

This API allows users to search for a song or music group and retrieve information like genres, members, years active, and more.

Using this collected data from serveral scraped websites and APIs, a collection of resulting YouTube videos are presented to the
user as recommendations of similar or related music in the same genre and time period. Intermediate results used to come to the
final result set are cached within a MongoDB instance.

## Features 🌊

- Web interface for easy searching.
- Fetches data from Wikipedia, Bandcamp by scraping data from pages.
- Recommendations are based on a variety of sources (API clients, page scraping),
  where the results are compared against each other for the purpose of
  sanity checking and eliminating bad results from a single source.
- In the request lifecycle, API results from each pluggable module are
  collected, cached and used to sanity check each others results.
- Intermediate module results are cached as graph in MongoDB.
- Pluggable middleware modules defined in a JSON configuration file.
- Music recommendation results are presented as a list of linked youtube videos.

## Getting Started 🤙

### Library Dependencies

- Node.js
- MongoDB
- Express
- Puppeteer
- Mocha
- Chai
- Sinon 

### Installation

1. Clone the repository:
   ```bash
   git clone https://www.github.com/grahamg/composite-music-recommendation-api composite-music-recommendation-api
   cd composite-music-recommendation-api
   ```

2. Install the required packages:
   ```bash
   npm install
   ```

3. Populate the configuration file values from the blank template.
   ```bash
   cp ./src/config/config.template.json ./src/config/config.json
   vim ./src/config/config.json
   ```

4. Start MongoDB on your machine.

5. Run the server:
   ```bash
   node ./src/index.js
   ```

6. Open your browser and navigate to `http://localhost:8081/` to use the web interface.

### Configuration

The project uses a `config.json` file to define pluggable middlewares. To add or remove a middleware module, simply update the `middlewares` hash map in the `config.json` file.

Example:
```json
{
	"administrators": {
		"John Doe": "john.doe@gmail.com"
	},
	"port": 8081,
	"database": {
		"path": "./database/client.js",
		"connection": "mongodb://localhost:27017/composite-music-recommend-api"
	},
	"middleware": {
		"wikipedia": {
			"key": "...",
			"path": "./middleware/wikipedia.js"
		},
		"lastfm": {
			"key": "...",
			"path": "./middleware/lastfm.js"
		},
		"discorgs": {
			"key": "...",
			"path": "./middleware/discorgs.js"
		},
		"musicovery": {
			"key": "...",
			"path": "./middleware/musicovery.js"
		},
		"tastedive": {
			"key": "...",
			"path": "./middleware/tastedive.js"
		},
		"youtube": {
			"key": "...",
			"path": "./middleware/youtube.js"
		}
	}
}
```

## Contributing 🏄‍♂️

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

## License 🌺

This project is licensed under the MIT License.
