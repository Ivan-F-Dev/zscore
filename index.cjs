const express = require("express");
const path = require('path');

const app = express();

app.use(express.static((path.join(__dirname, 'dist'))));

app.get('*path', (req, res) => {
  // Вместо nginx
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Start listening on http://localhost:${port}`);
});