const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const resolvers = require("./apollo/resolvers");  
const {typeDefs} = require("./apollo/typeDefs");  
const dotenv = require('dotenv');
dotenv.config();

// MongoDB Atlas connection string from environment variables
const mongodb_atlas_url = process.env.MONGODB_URL;

// MongoDB connection function
const connectDB = async() => {
  try{
    mongoose.connect(mongodb_atlas_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(success => {
      console.log('Success Mongodb connection')
    }).catch(err => {
      console.log('Error Mongodb connection')
    });
  } catch(error) {
      console.log(`Unable to connect to DB : ${error.message}`);
  }
}

// Create Apollo Server instance
async function startServer() {
  // Define Express app
  const app = express();
  app.use(express.json());
  app.use(cors({
    origin: 'https://comp3133a2frontend.vercel.app/', 
    credentials: true
  }));

  const server = new ApolloServer({
    typeDefs: typeDefs,  
    resolvers: resolvers,  
    context: ({ req }) => {
      // Add authentication logic here if needed
      return { req };
    }
  });

  // Await sever start 
    await server.start();
  
  // Apply Apollo Server middleware to Express
  server.applyMiddleware({ app });
  
  // Start the server and connect to MongoDB
  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
    connectDB();  // MongoDB connection
  });
}

startServer()