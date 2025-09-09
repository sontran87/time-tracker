// Server Express
const app = require("./app");
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
