const express = require('express');
const { pool } = require('./db'); // Datenbankverbindung importieren
const app = express();
const port = 3000;

app.use(express.json());

// CORS aktivieren
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// GET: Alle Rezepte laden (mit Zutaten)
app.get('/api/rezepte', async (req, res) => {
    try {
        // 👈 HIER IST DEIN ERSTES SNIPPET:
        // 1. Alle Rezepte holen
        const [rezepte] = await pool.execute('SELECT * FROM rezepte');

        // 2. Für jedes Rezept die Zutaten laden
        for (let rezept of rezepte) {
            const [zutaten] = await pool.execute(
                'SELECT name FROM zutaten WHERE rezept_id = ?',
                [rezept.id]
            );
            rezept.zutaten = zutaten.map(zutat => zutat.name);
        }
        
        res.json(rezepte);
    } catch (error) {
        console.error('Fehler beim Laden der Rezepte:', error);
        res.status(500).json({ error: 'Fehler beim Laden der Rezepte' });
    }
});

// POST: Neues Rezept erstellen
app.post('/api/rezepte', async (req, res) => {
    const { name, bild_url, anleitung, schwierigkeit, zubereitungszeit, portionen, zutaten } = req.body;
    
    try {
        // 👈 HIER IST DEIN ZWEITES SNIPPET:
        // Rezept einfügen
        const [rezeptResult] = await pool.execute(
            'INSERT INTO rezepte (name, bild_url, anleitung, schwierigkeit, zubereitungszeit, portionen) VALUES (?, ?, ?, ?, ?, ?)',
            [name, bild_url, anleitung, schwierigkeit, zubereitungszeit, portionen]
        );
        const newRezeptId = rezeptResult.insertId; // Die neue ID!
        
        // Jede Zutat mit dieser ID einfügen
        for (const zutat of zutaten) {
            await pool.execute('INSERT INTO zutaten (name, rezept_id) VALUES (?, ?)', 
                [zutat, newRezeptId]);
        }
        
        res.status(201).json({ 
            id: newRezeptId, 
            message: "Rezept erfolgreich erstellt" 
        });
        
    } catch (error) {
        console.error('Fehler beim Erstellen des Rezepts:', error);
        res.status(500).json({ error: 'Fehler beim Erstellen des Rezepts' });
    }
});

// DELETE: Rezept löschen
app.delete('/api/rezepte/:id', async (req, res) => {
    const rezeptId = parseInt(req.params.id);
    
    try {
        // Zuerst alle Zutaten des Rezepts löschen
        await pool.execute('DELETE FROM zutaten WHERE rezept_id = ?', [rezeptId]);
        
        // Dann das Rezept selbst löschen
        await pool.execute('DELETE FROM rezepte WHERE id = ?', [rezeptId]);
        
        res.status(204).send();
    } catch (error) {
        console.error('Fehler beim Löschen des Rezepts:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Rezepts' });
    }
});

// Server starten
app.listen(port, () => {
    console.log(`✅ Server läuft auf http://localhost:${port}`);
});