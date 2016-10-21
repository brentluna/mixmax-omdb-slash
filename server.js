const express = require('express');
const bodyParser = require('body-parser');
const sync = require('synchronize');
const cors = require('cors');
const app = express();
const typeahead = require('./api/typeahead');
const resolver = require('./api/resolver');


const corsOptions = {
	origin: /^[^.\s]+\.mixmax\.com$/,
  credentials: true
};


app.use((req, res, next) => {
	sync.fiber(next);
});

app.get('/typeahead', cors(corsOptions), typeahead);
app.get('/resolver', cors(corsOptions), resolver);

app.listen(process.env.PORT || 9145);
