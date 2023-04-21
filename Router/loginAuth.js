const express = require('express');
const router = express.Router();
const EmployeeSchema = require('../Models/EmployeeModel');
require('dotenv').config();

router.post('/api/login', async (req, res) => {
    const confirmCode = req.header('confirmCode');
    if(confirmCode !== process.env.ADMIN_CODE){
        return res.status(401).json({ error: "Invalid Confirmation Code" });
    }
    try{
        const employeeData = new EmployeeSchema(req.body);
        const employeePhn = await EmployeeSchema.findOne({ phone: employeeData.phone });
        if (employeePhn) {
            res.status(422).json({message: "Employee Already Exists"});
        } else {
            const data = await employeeData.save();
            res.status(201).json({
                data: data,
                message: "Employee Information Stored Successfully"
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'Registration Failed'
        });
    }
});

router.get('/api/getemployeeid/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const employeeData = await EmployeeSchema.findById(id);
        res.status(201).json(employeeData);
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'failed to get Employee Information'
        });
    }
});

router.get('/api/getemployee/:phn', async (req, res) => {
    try{
        const phn = req.params.phn;
        const employeeData = await EmployeeSchema.find({ phone: phn });
        if (employeeData.length === 0) {
            return res.status(404).json({
                message: "Employee does not exist with the provided phone number"
            });
        }
        res.status(201).json(employeeData);
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'failed to get Employee Information'
        });
    }
});

router.patch('/api/updateemployee/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const updates = {};
        for (const key in req.body) {
            if (key === 'ref_no') {
                continue;
            }
            if (req.body[key] !== undefined && req.body[key] !== '') {
                updates[key] = req.body[key];
            }
        }
        const updateEmployee = await EmployeeSchema.findById(id);
        if (!updateEmployee) {
            return res.status(404).json({ message: "Employee Not Found" });
        }
        const { phone, email } = updates;
        if (phone || email) {
            const duplicateEmployee = await EmployeeSchema.findOne({ $or: [{ phone }, { email }] });
            if (duplicateEmployee && duplicateEmployee._id != id) {
                return res.status(409).json({ message: "Phone Number or email already exists" });
            }
        }
        const updatedEmployee = await EmployeeSchema.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        res.status(201).json({
            data: updatedEmployee,
            message: "Employee Information Update Successfully"
        });
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'Notification failed to Update'
        });
    }
});

router.get('/api/getnumbers', async (req, res) => {
    try{
        const numbers = await EmployeeSchema.find({}, { phone: 1, emp_id: 1, _id: 0 });
        res.status(201).json(numbers);
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'failed to get phone numbers'
        });
    };
});

module.exports = router;