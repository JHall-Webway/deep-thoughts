const { User, Thought } = require('../models');

module.exports = {
    Query: {
        users: async () => {
            return User.find()
                .select('-__ -password')
                .populate('friends')
                .populate('thoughts');
        },
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        },
        thoughts: async (parent, { username }) => {
            params = username ? { username } : {};
            return Thought.find(params)
                .sort({ createdAt: -1 })
        },
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id })
        }
    }
};
