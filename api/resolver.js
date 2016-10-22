const sync = require('synchronize');
const request = require('request');

function resolver(req, res) {
	let term = req.query.text.trim();
	console.log('inside' + term);
	let paramType;
	if (/^http:\/\/omdbapi\.com\/\S+/.test(term)) {
		paramType = 'i'
		term = term.replace(/^http:\/\/omdbapi\.com\/i=/, '');
	} else {
		paramType = 't';
	}
	console.log(term, paramType);
	handleSearchInput(paramType, term, req, res);

}





function handleSearchInput(paramType, term, req, res) {
	let response;
	try {
		response = sync.await(request({
			url: `http://omdbapi.com/?${paramType}=${term}`,
			gzip: true,
			json: true,
			timeout: 15 * 1000
		}, sync.defer()));
	} catch(e) {
		res.status(500).send('Error');
		return;
	}
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

	res.json({
		body: html
	});
}

const styles = {
	imgDiv: '"width: 180px;height: 260px; object-fit: contain; margin-right:20px;"',
	img: '"height: 100%;"',
	container: '"display:flex; width:360px; background:#eee;"',
	textContainer: '"margin-right:10px; font-size: 14px; display:flex; flex-direction:column; justify-content: space-between;"'


	
}


module.exports = resolver;