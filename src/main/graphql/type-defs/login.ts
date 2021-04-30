import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        login(email: String!, password: String!): User!
    }

    extend type Mutation {
        signUp(
            firstName: String!
            lastName: String!
            email: String!
            birthDate: DateTime!
            password: String!
            passwordConfirmation: String!
        ): User!
    }

    type User {
        accessToken: String!
        name: String!
    }
`
