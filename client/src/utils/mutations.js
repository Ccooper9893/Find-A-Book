import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($input: Book!) {
        saveBook(book: $input) {
            user
        }
    }
`;

export const REMOVE_BOOK = gql`

`;
