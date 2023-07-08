const jwt = require('jsonwebtoken')
const tasksRouter = require('express').Router()
const Task = require('../models/task')
const User = require('../models/user')

tasksRouter.get('/', async(request, response) => {
    const tasks = await Task.find({'user': request.user})
    response.json(tasks)
})

tasksRouter.post('/', async(request, response) => {
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

    const newTask = new Task({
        content: body.content,
        status: body.status,
        progress: body.progress,
        user: user.id
    })

    const savedTask = await newTask.save()
    user.tasks = user.tasks.concat(savedTask._id)
    await user.save()

    response.status(201).json(newTask)
})

tasksRouter.delete('/:id', async(request, response) => {
    const id = request.params.id

    if(!request.token){
        return response.status(401).json({error: "no token found"})
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id){
        return response.status(401).json({error: "invalid token"})
    }

    const task = await Task.findById(id)

    console.log(task.user)
    console.log(request.user)

    if(decodedToken.id.toString() === task.user.toString()){
        await Task.findByIdAndDelete(id).catch(error => next(error))

        const user = request.user
        user.tasks = user.tasks.filter(t => t.id.toString() !== id)
        await user.save()
    } else {
        return response.status(401).json({error: "invalid user"})
    }


    response.status(204).end()
})

tasksRouter.put('/:id', async(request, response) => {
    const body = request.body
    const id = request.params.id

    const updatedTask = {
        content: body.content,
        status: body.status,
        progress: body.progress,
    }

    const result = await Task.findByIdAndUpdate(id, updatedTask, {new: true})

    response.json(result)
})

module.exports = tasksRouter