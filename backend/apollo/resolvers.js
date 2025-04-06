const Employee = require('../models/employee');
const User = require('../models/user');
const { compare } = require('bcrypt');
const { GraphQLScalarType, Kind } = require('graphql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom scalar for Date',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString(); 
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});


module.exports = {
  Date: dateScalar,
  Query: {
    // Login query
    login: async (_, { username, password }) => {
      // Find the user 
      const user = await User.findOne({ username: username });
    
      if (!user) {
        throw new Error("Invalid username/password"); 
      }
    
      // Compare the given password 
      const isValidPassword = await bcrypt.compare(password, user.password);
    
      if (!isValidPassword) {
        throw new Error("Invalid username/password");
      }
    
      // Generate a JWT token 
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } 
      );
    
      return {token};
    },

    // Get all employees
    getAllEmp: async () => await Employee.find(),

    // Get employee by ID
    searchEmpById: async (_, { id }) => await Employee.findById({ "_id": id }),

    // Search employee by designation or department
    searchEmpByD: async (_, { designation, department }) => {
      if (designation) {
        return await Employee.find({ designation: designation });
      }
      if (department) {
        return await Employee.find({ department: department });
      }
      throw new Error("Please provide either a designation or department");
    }
  },

  Mutation: {
    // Signup mutation
    signup: async (_, { username, email, password }) => {
      console.log("Start signup")
      if (!username || !email || !password) {
        console.log("Fill all fields")
        throw new Error("Please fill all fields");
      }
    
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("User exists")
        throw new Error("Email already in use");
      }
    
      const hashedPassword = await bcrypt.hash(password, 12);
    
      const user = new User({
        username,
        email,
        password: hashedPassword, 
      });
      await user.save();
      console.log("user saved")
    
      // Generate a JWT token 
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } 
      );
    
      return {token};
    },

    // Add new employee
    addEmp: async (_, args) => {
      const emp = new Employee(args);
      await emp.save();

      return emp;
    },

    // Update employee by ID and return the updated employee
    updateEmpById: async (_, { id, ...args }) => {
      const updatedEmp = await Employee.findByIdAndUpdate(id, { ...args }, { new: true });
      return updatedEmp;
    },

    // Delete employee by ID
    deleteEmpByID: async (_, { id }) => {
      try {
        await Employee.findByIdAndDelete(id);
        return "Employee deleted.";
      } catch (e) {
        console.log(e.message);
        throw new Error(e.message);
      }
    }
  }
};
