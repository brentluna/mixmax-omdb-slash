const should = require('should');
const app = require('./server.js');
const supertest = require('supertest');

describe('GET /resolver', function() {
	it('responds with html', function(done) {
		this.timeout(8000)
		supertest(app)
			.get('/typeahead?text=alcatraz')
			.set('Accept', 'application/json')
			.expect('Content-Type', /text/)
			.expect(200, done);
	});
});