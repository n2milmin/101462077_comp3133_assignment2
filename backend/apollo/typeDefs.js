const { gql } = require('apollo-server');

exports.typeDefs = gql`
    scalar Date
    type AuthPayload {
        token: String!
    }

    # Employee type
    type Employee {
        id: ID!
        first_name: String!
        last_name: String!
        email: String
        gender: String
        designation: String!
        salary: Float!
        date_of_joining: Date!
        department: String!
        employee_photo: String
        created_at: Date
        updated_at: Date
    }

    # User type
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        created_at: Date!
        updated_at: Date!
    }

    # Query type for fetching data
    type Query {
        getAllEmp: [Employee]
        searchEmpById(id: ID!): Employee
        searchEmpByD(designation: String, department: String): [Employee]
    }

    # Mutation type for creating and updating data
    type Mutation {
        login(username: String!, password: String!): AuthPayload!
        signup(
            username: String!,
            email: String!,
            password: String!
        ): AuthPayload!
        addEmp(
            first_name: String!,
            last_name: String!,
            email: String,
            gender: String,
            designation: String!,
            salary: Float!,
            date_of_joining: Date!,
            department: String!,
            employee_photo: String,
            created_at: Date,
            updated_at: Date
        ): Employee
        updateEmpById(
            id: ID!,
            first_name: String,
            last_name: String,
            email: String,
            gender: String,
            designation: String,
            salary: Float,
            date_of_joining: Date,
            department: String,
            employee_photo: String
        ): Employee
        deleteEmpByID(id: ID!): String
    }
`;
