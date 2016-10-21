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
	const html = `<div>
									<h1>
										${data.Title}
									</h1>
									<div>
										<img src=${data.Poster} />
									</div>
								</div>`.replace(/\t|\n/g, '');

	res.json({
		body: html
	});
}


module.exports = resolver;