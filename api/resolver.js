const sync = require('synchronize');
const request = require('request');

function resolver(req, res) {
	const term = req.query.text.trim();
	console.log(term);

	handleSearchString(term, req, res);

}


function handleSearchString(term, req, res) {
	let response;
	try {
		response = sync.await(request({
			url: `http://omdbapi.com/?t=${term}`,
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