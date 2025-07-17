const mysql = require('mysql2/promise');

// Verbindungspool erstellen
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Dein MySQL-Passwort hier eintragen
    database: 'rezeptbuch_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verbindung testen
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Datenbankverbindung erfolgreich!');
        connection.release();
    } catch (error) {
        console.error('❌ Datenbankverbindung fehlgeschlagen:', error);
    }
}

testConnection();

module.exports = { pool };