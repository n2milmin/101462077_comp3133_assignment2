const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    gender: { 
        type: String, 
        required: [true, 'Other'],
        enum: ['Male', 'Female', 'Other']
     },
    designation: { type: String, required: true },
    salary:  { 
        type: Number, 
        required: true,
        min: [1000, 'That is not a payable salary.']
    },
    date_of_joining:  { type: Date, required: true },
    department: { type: String, required: true },
    employee_photo: String ,
    created_at: { type: Date, default: Date.now() },    
    updated_at: { type: Date, default: Date.now()}
})

module.exports = mongoose.model('employees', employeeSchema)