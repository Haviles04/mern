const asyncHandler = require('express-async-handler');

// @desc Get Goals
// @route GET /api/goals
// @acess Private
const getGoals = asyncHandler(async(req, res) => {
    res.status(200).json({ message: 'Get goals' })
})

// @desc Set Goals
// @route POST /api/goals
// @acess Private
const setGoals = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new error('Please add a text field');
    }
    res.status(200).json({ message: 'Set goals' })
})

// @desc Update Goal
// @route PUT /api/goals/id
// @acess Private
const updateGoals = asyncHandler( async (req, res) => {
    res.status(200).json({ message: `Updated goal ${req.params.id}` })
})

// @desc Delete Goal
// @route GET /api/goals/id
// @acess Private
const deleteGoals = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Deleted goal ${req.params.id}` })
});



module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals
}