require('dotenv').config();
TOKEN = require('jsonwebtoken');
SECRET = process.env.TOKEN
EXPIRE = process.env.TOKEN_EXPIRE;
module.exports = {
    signToken: function({ username, email, _id }) {
        return TOKEN
            .sign({ data: { username, email, _id }}, SECRET, { expiresIn: EXPIRE })
    },
    authMiddleware: function ({ req }) {
        token = req.body.token || req.query.token || req.headers.authorization;
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }
        if (!token) {
            return req;
        }

        try {
            const { data } = TOKEN.verify(token, SECRET, { maxAge: EXPIRE})
            req.user = data
        } catch {
            console.log('Invalid Token')
        }

        return req;
    }
};