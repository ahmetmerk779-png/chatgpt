
const Database = require("better-sqlite3");

const db = new Database("bots.db");

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS bots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT NOT NULL,
        host TEXT NOT NULL,
        port INTEGER DEFAULT 25565,
        version TEXT NOT NULL,
        subserver TEXT DEFAULT '',
        auto_start INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

function getBots() {
    return db.prepare(`
        SELECT * FROM bots
        ORDER BY id ASC
    `).all();
}

function getBot(id) {
    return db.prepare(`
        SELECT * FROM bots
        WHERE id = ?
    `).get(id);
}

function addBot(bot) {
    const result = db.prepare(`
        INSERT INTO bots
        (name, username, host, port, version, subserver, auto_start)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        bot.name,
        bot.username,
        bot.host,
        bot.port || 25565,
        bot.version,
        bot.subserver || "",
        bot.auto_start ? 1 : 0
    );

    return getBot(result.lastInsertRowid);
}

function updateBot(id, bot) {
    db.prepare(`
        UPDATE bots
        SET
            name = ?,
            username = ?,
            host = ?,
            port = ?,
            version = ?,
            subserver = ?,
            auto_start = ?
        WHERE id = ?
    `).run(
        bot.name,
        bot.username,
        bot.host,
        bot.port || 25565,
        bot.version,
        bot.subserver || "",
        bot.auto_start ? 1 : 0,
        id
    );

    return getBot(id);
}

function deleteBot(id) {
    return db.prepare(`
        DELETE FROM bots
        WHERE id = ?
    `).run(id);
}

module.exports = {
    db,
    getBots,
    getBot,
    addBot,
    updateBot,
    deleteBot
};

