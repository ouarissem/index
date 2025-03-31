const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const rooms = {};

app.use(express.static(__dirname)); // يجعل الملفات متاحة من مجلد الموقع

io.on("connection", (socket) => {
    console.log("📡 مستخدم متصل");

    socket.on("createRoom", ({ roomCode, name }) => {
        rooms[roomCode] = { players: [socket.id], moves: {} };
        socket.join(roomCode);
        console.log(`🚀 تم إنشاء الروم: ${roomCode}`);
    });

    socket.on("joinRoom", ({ roomCode, name }) => {
        if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            io.to(roomCode).emit("gameResult", `🎉 ${name} انضم إلى الروم!`);
            console.log(`✅ ${name} انضم إلى الروم: ${roomCode}`);
        } else {
            socket.emit("gameResult", "⚠️ الروم ممتلئ أو غير موجود!");
        }
    });

    socket.on("playerMove", ({ choice }) => {
        const room = Object.keys(socket.rooms).find((r) => rooms[r]);
        if (room) {
            rooms[room].moves[socket.id] = choice;
            if (Object.keys(rooms[room].moves).length === 2) {
                let moves = Object.values(rooms[room].moves);
                let result = determineWinner(moves[0], moves[1]);
                io.to(room).emit("gameResult", result);
                rooms[room].moves = {};
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("❌ مستخدم غادر");
    });
});

function determineWinner(choice1, choice2) {
    if (choice1 === choice2) return "🤝 تعادل!";
    if (
        (choice1 === "ورق" && choice2 === "حجر") ||
        (choice1 === "حجر" && choice2 === "مقص") ||
        (choice1 === "مقص" && choice2 === "ورق")
    ) {
        return "🎉 اللاعب الأول فاز!";
    }
    return "🎉 اللاعب الثاني فاز!";
}

server.listen(3000, () => {
    console.log("🚀 السيرفر يعمل على http://localhost:3000");
});
