const express = require('express');

const app = express();

require('dotenv/config');

const port = 5000;
app.listen(port, () => {
  console.log(`Server's running on http://localhost:${port}`);
})