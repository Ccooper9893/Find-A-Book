const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        //Get current users
        getSingleUser: async (parent, args, context) => {
            if(context.user) {
                return User.findOne({
                    $or: [{_id: context.user._id}, {username: context.user.username}]
                })
            };
            throw new AuthenticationError('Must be logged in to view saved books!');
        },
    },
    Mutation: {

    },
};

module.exports = resolvers;