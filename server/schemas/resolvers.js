const { User, Thought } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
    Query: {
        me: async (parent, args, { user }) => {
            if (user) {
                return await User.findOne({ _id: user._id })
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends');
            };
            throw new AuthenticationError('Not logged in');
        },
        users: async () => {
            return await User.find()
                .select('-__ -password')
                .populate('friends')
                .populate('thoughts');
        },
        user: async (parent, { username }) => {
            return await User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        },
        thoughts: async (parent, { username }) => {
            params = username ? { username } : {};
            return await Thought.find(params)
                .sort({ createdAt: -1 });
        },
        thought: async (parent, { _id }) => {
            return await Thought.findOne({ _id });
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            user = await User.create(args);
            return {
                user,
                token: signToken(user)
            };
        },
        login: async (parent, { email, password }) => {
            user = await User.findOne({ email })
            
            if (!user) {
                throw new AuthenticationError('Incorrect credentials')
            };

            correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            };
            return {
                user,
                token: signToken(user)
            };
        },
        addThought: async (parent, args, context) => {
            if (context.user) {
                thought = await Thought.create({ ...args, username: context.user.username });
                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought.id } },
                    { new: true }
                );
                return thought;
            };
            throw new AuthenticationError('You need to be logged in');
        },
        addReaction: async (parent, { thoughtId, reactionBody }, { user }) => {
            if (user) {
                updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId },
                    { $push: { reactions: { reactionBody, username: user.username }}},
                    { new: true, runValidators: true }
                );
                return updatedThought;
            }
            throw new AuthenticationError('You need to be logged in');
        },
        addFriend: async (parent, { friendId }, { user }) => {
            if (user) {
                updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in');
        }
    }
};
