module.exports = {
    typeDefs: require('./typeDefs'),
    resolvers: require('./resolvers'),
    context: require('../utils/auth').authMiddleware
};