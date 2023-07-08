const jwt = require('jsonwebtoken')
const goalsRouter = require('express').Router()
const Goal = require('../models/goal')
const User = require('../models/user')

goalsRouter.get('/', async(request, response) => {
    const goals = await Goal.find({'user': request.user})
    response.json(goals)
})


goalsRouter.post('/', async(request, response) => {
    const body = request.body

    if(!request.token){
        return response.status(401).json({error: 'no token found'})
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id) {
        return response.status(401).json({error: 'token invalid'})
    }

    const user = request.user

    console.log(request.user)

    const newGoal = new Goal({
        content: body.content,
        user: user.id
    })

    const savedGoal = await newGoal.save()
    user.goals = user.goals.concat(savedGoal._id)
    await user.save()

    response.status(201).json(newGoal)
})

goalsRouter.delete('/:id', async(request, response) => {
    const id = request.params.id

    if(!request.token){
        return response.status(401).json({error: "no token found"})
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id){
        return response.status(401).json({error: "invalid token"})
    }

    const goal = await Goal.findById(id)

    console.log(goal.user)
    console.log(request.user)

    if(decodedToken.id.toString() === goal.user.toString()){
        await Goal.findByIdAndDelete(id).catch(error => next(error))

        const user = request.user
        
        user.goals = user.goals.filter(g => g.id.toString() !== id)
        await user.save()
    } else {
        return response.status(401).json({error: "invalid user"})
    }


    response.status(204).end()
})

goalsRouter.put('/:id', async(request, response) => {
    const body = request.body
    const id = request.params.id

    const updatedGoal = {
        content: body.content
    }

    const result = await Goal.findByIdAndUpdate(id, updatedGoal, {new: true})

    response.json(result)
})

module.exports = goalsRouter
