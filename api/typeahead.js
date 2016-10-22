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
	console.log(response)
	if (response.body.Response === 'True') {
		let data = response.body
		if (data.Plot.length > 160) {
			data.Plot = data.Plot.slice(0, 160) + '...';
		}
		const html = `<div style=${styles.container}>
									<div style=${styles.imgDiv}>
										<img style=${styles.img} src=${data.Poster} />
									</div>
									<div style=${styles.textContainer}>
										<div>
											<h4>
												${data.Title}
											</h4>
											<p>
												${data.Plot}
											</p>
										</div>
										<div>
											<div>
												Year Released: ${data.Year}
											</div>
											<div>
												<a href="http://imdb.com/title/${data.imdbID}" target="_blank">
												IMDB Rating: ${data.imdbRating}
												</a>
											</div>
										</div>
									</div>	
								</div>`.replace(/\t|\n/g, '');
		results = [{
			title: html,
			text: `http://omdbapi.com/i=${data.imdbID}`
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

const styles = {
	imgDiv: '"width: 180px;height: 260px; object-fit: contain; margin-right:20px;"',
	img: '"height: 100%;"',
	container: '"display:flex; width:360px; background:#eee;"',
	textContainer: '"margin-right:10px; margin-bottom:10px; font-size: 11px; display:flex; flex-direction:column; justify-content: space-between;"'	
}

module.exports = typeahead;