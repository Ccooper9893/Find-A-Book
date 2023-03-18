const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        //Get current users (context=authMiddleware)
        me: async (parent, args, context) => {

            if(context.user) {
                return User.findOne({
                    $or: [{_id: context.user._id}, {username: context.user.username}]
                }).populate('savedBooks')
            };

            throw new AuthenticationError('Must be logged in to view saved books!');
        },
    },
    Mutation: {
        //Deconstructing userFormData sent from signupform
        addUser: async (parent, { username, email, password }) => { 

            const user = await User.create({ username, email, password });

            const token = signToken(user); //Creating JWT token

            return { token, user } //Return token and user data
        },
        login: async (parent, { username, email, password }) => {
            console.log(username, password, email);
            const user = await User.findOne({
                $or: [{username: username}, {email: email}]
            });

            if(!user) {
                throw new AuthenticationError('No user found with email/username!');
            };

            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials!');
            };
            //If valid credentials, create a JWT and return
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async(parent, { book }, context) => {
            if(!context.user) {
                throw new AuthenticationError('Must be logged in to save books!');
            };
            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$addToSet: {savedBooks: book}},
                {new: true, runValidators: true},
            );
            return updatedUser;
        },
        removeBook: async(parent, { book }, context) => {
            if(!context.user) {
                throw new AuthenticationError('Must be logged in to save books!');
            };
            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$pull: {savedBooks:{bookId:book.bookId}}},
                {new:true},
            );
        },
    },
};

module.exports = resolvers;