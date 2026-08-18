const app = require('./app');
const { port } = require('./config');

app.listen(port, () => {
  console.log(`🚀 Hope Somalia Foundation API Server running on http://localhost:${port}`);
});
