import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        login(email: String!, password: String!): User!
    }

    type User {
        auth: Auth
    }
    
    type Auth {
        accessToken: String!
        name: String!
        expirationIn: Float!
        typeOfToken: String!
    }
`
