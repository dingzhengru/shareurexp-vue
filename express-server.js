// optional: allow environment to specify port
const port = process.env.PORT || 80

// wire up the module
const express = require('express') 
const history = require('connect-history-api-fallback');

// create server instance
const app = express() 

app.use(history());

// bind the request to an absolute path or relative to the CWD
app.use(express.static('dist'))
// start the server
app.listen(port, () => console.log(`Listening on port ${port}`))