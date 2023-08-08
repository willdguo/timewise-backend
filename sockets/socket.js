const socketIO = require('socket.io')

const websocket = (server) => {
    const io = socketIO(server, {
        cors: {
            // origin: "http://localhost:3000",
            // origin: "https://workspace-kappa.vercel.app",
            // origin: "https://cowork-backend.onrender.com"
            origin: "http://34.217.73.248:3001"
        }
    })

    const connectedUsers = {}

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`)
    
        socket.on("join_room", (data) => {

            if (socket.room) {

                let currUser;

                if(socket.room && connectedUsers[socket.room]) {
                    currUser = connectedUsers[socket.room].find(u => u.socket === socket.id)
                    connectedUsers[socket.room] = connectedUsers[socket.room].filter(u => u.socket !== socket.id)
                }
    
                socket.to(socket.room).emit("left_room_coworker", {...currUser})

                socket.leave(socket.room)
            }

            socket.join(data.room)
            socket.room = data.room

            if(!connectedUsers[data.room]) {
                connectedUsers[data.room] = []
            }

            connectedUsers[data.room].push({...data, socket: socket.id}) // why keep socket.id?

            socket.to(socket.room).emit("joined_room", data)
            socket.emit("joined_room_coworkers", connectedUsers[data.room])
        })

        socket.on("disconnect", () => {

            let currUser;

            if(socket.room && connectedUsers[socket.room]) {
                currUser = connectedUsers[socket.room].find(u => u.socket === socket.id)
                connectedUsers[socket.room] = connectedUsers[socket.room].filter(u => u.socket !== socket.id)
            }

            socket.to(socket.room).emit("left_room_coworker", {...currUser})
        })

        socket.on("logout", () => {
            let currUser;

            if(socket.room && connectedUsers[socket.room]) {
                currUser = connectedUsers[socket.room].find(u => u.socket === socket.id)
                connectedUsers[socket.room] = connectedUsers[socket.room].filter(u => u.socket !== socket.id)
            }

            socket.to(socket.room).emit("left_room_coworker", {...currUser})
        })

        socket.on("new_task", (data) => {
            socket.to(socket.room).emit("coworker_new_task", data)
        })

        socket.on("deleted_task", (data) => {
            socket.to(socket.room).emit("coworker_deleted_task", data)
        })

        socket.on("edited_task", (data) => {
            socket.to(socket.room).emit("coworker_edited_task", data)
        })

        socket.on("progress_task", (data) => {
            socket.to(socket.room).emit("coworker_progress_task", data)
        })

        socket.on("status_task", (data) => {
            socket.to(socket.room).emit("coworker_status_task", data)
        })

    })
}

module.exports = websocket