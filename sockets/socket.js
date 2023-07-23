const socketIO = require('socket.io')

const websocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
        }
    })

    const connectedUsers = {}

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`)
    
        socket.on("join_room", (data) => {
            // console.log(`now online: ${data.username}`)
            connectedUsers[socket.id] = data;

            console.log("joined, new:")
            // console.log(Object.values(connectedUsers))


            io.emit("joined_room", data)
            socket.emit("joined_room_coworkers", Object.values(connectedUsers))
        })

        socket.on("disconnect", () => {

            io.emit("left_room_coworker", connectedUsers[socket.id])

            delete connectedUsers[socket.id]
            // console.log("leave, remaining:")
            // console.log(Object.values(connectedUsers))
        })

        socket.on("logout", () => {
            io.emit("left_room_coworker", connectedUsers[socket.id])
            delete connectedUsers[socket.id]
        })

        socket.on("new_task", (data) => {
            io.emit("coworker_new_task", data)
        })

        socket.on("deleted_task", (data) => {
            io.emit("coworker_deleted_task", data)
        })

        socket.on("edited_task", (data) => {
            io.emit("coworker_edited_task", data)
        })

        socket.on("progress_task", (data) => {
            io.emit("coworker_progress_task", data)
        })

        socket.on("status_task", (data) => {
            io.emit("coworker_status_task", data)
        })
        
    })

    // return io
}

module.exports = websocket