
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// JSON isteklerini okuyabilmek için
app.use(express.json());

// Dashboard dosyalarını yayınla
app.use(express.static(path.join(__dirname, "public")));

// Ana sayfa
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Socket.IO bağlantısı
io.on("connection", (socket) => {
    console.log(`🌐 Dashboard bağlandı: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`❌ Dashboard ayrıldı: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════╗
║   Minecraft AFK Dashboard        ║
║   Server çalışıyor               ║
║                                  ║
║   http://localhost:${PORT}          ║
╚══════════════════════════════════╝
    `);
});

