require('./config/connection').once('open', async () => {

  await (ApolloServer = new (require('apollo-server-express'))
    .ApolloServer(require('./schemas')))
    .start();

  server = (express = require('express'))()
    .use(express.urlencoded({ extended: false }))
    .use(express.json());

  ApolloServer.applyMiddleware({ app: server });

  server.listen(PORT = process.env.PORT || 3001, console.log(`API server running on port ${PORT}`))});