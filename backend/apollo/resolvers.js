const Employee = require('../models/employee');
const User = require('../models/user');
const { compare } = require('bcrypt');
const { GraphQLScalarType, Kind } = require('graphql');

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
    // Login query - Added error handling for non-existing user
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username: username });
      
      if (!user) {
        throw new Error("User not found");
      }

      const validate = await compare(password, user.password);

      if (!validate) {
        throw new Error("Invalid username/password");
      }

      return user;
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
      if (!username || !email || !password) {
        throw new Error("Please fill all fields");
      }

      const user = new User({ username, email, password });
      await user.save();

      return user;
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
