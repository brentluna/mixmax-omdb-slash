const sync = require('synchronize');
const request = require('request');


function typeahead(req, res) {
	const term = req.query.text.trim();

	if (!term) {
		res.json([{
			title: '<i>(enter a search term)</i>',
			text: ''
		}]);
		return;
	}

	let response;
	try {
		response = sync.await(request({
			url: 'http://omdbapi.com',
			qs: {
				t: term,
				limit: 5
			},
			gzip: true,
			json: true, 
			timeout: 10 * 1000
		}, sync.defer()));
	} catch(e) {
		res.status(500).send('Error');
		return;
	}

	if (response.statusCode !== 200 || !response.body) {
		res.status(500).send('Error');
		return;
	}


	let results = [];
	if (response.body.Response === 'True') {
		results = [{
			title:`<h1>${response.body.Title}</h1>`,
			poster: `<img src=${response.body.Poster} />`
		}];
	}

	if (!results.length) {
		res.json([{
			title: '<i>(no results)</i>',
			text: ''
		}])
	} else {
		res.json(results);
	}
}

module.exports = typeahead;