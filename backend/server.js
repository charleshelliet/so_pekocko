const http = require('http'); //import package http de node et création serveur
const app = require('./app'); //import de app.js pour utilisation de l'app sur le serveur


const normalizePort = val => {
  //fonction qui permet de trouver un port valide, en format numérique ou chaîne de caractères
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
//configuration du port de connection en fonction de l'environnement
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  //fonction de gestion des erreurs
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//fonction qui appelle app.js pour spécifier toutes les informations de l'application
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
