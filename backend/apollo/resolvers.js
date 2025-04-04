const Employee = require('../models/employee')
const User = require('../models/user')
const { compare } = require('bcrypt');

exports.resolvers = {
    Query: {
        login: async (_, {username, password}) => {
            const user = await User.findOne({ username: username })
            const validate = await compare(password, user.password)
            
            if(!validate){
                throw new Error("Invalid username/password")
            }

            return user
        },

        getAllEmp: async () => await Employee.find(),

        searchEmpById: async (_, { id }) => await Employee.findById({"_id": id}),

        searchEmpByD: async (_, {designation, department}) => {
                return designation? 
                    await Employee.find({ designation: designation }) :
                    await Employee.find({ department: department })
        }
    },

    Mutation: {
        signup: async (_, {username, email, password}) => {
            if(!username || !email || !password){
                throw new Error("Please fill all areas")
            }

            const user = new User({username, email, password})
            await user.save()

            return user
        },

        addEmp: async (_, args) => {
            const emp = new Employee(args)
            await emp.save()

            return emp
        },

        updateEmpById: async (_, { id, ...args }) =>  await Employee.findByIdAndUpdate( id, {...args}),

        deleteEmpByID: async (_, { id }) => {
            try {
                await Employee.findByIdAndDelete(id)
                return "Employee deleted."
            } catch (e) {
                console.log(e.message)
                throw new Error(e.message)}
        }
    }
}