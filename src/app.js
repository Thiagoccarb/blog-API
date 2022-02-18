const express = require('express');
const cors = require('cors');

const router = require('./controllers/router');
const error = require('./middlwares/error');

// const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

app.use(express.json());

app.use('/', router);

app.use(error);

// app.listen(PORT, () => console.log(`running on port ${PORT}`));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

module.exports = app;