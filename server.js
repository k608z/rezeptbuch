const express = require('express');
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

// Rezept-Daten
let rezepte = [
    {
        id: 1,
        name: "Spaghetti Carbonara",
        bild_url: "bilder/carbonara.jpeg",
        zutaten: [
            "200g Spaghetti",
            "100g Pancetta oder Guanciale",
            "2 Eigelb",
            "50g Parmesan, gerieben",
            "Schwarzer Pfeffer",
            "Salz"
        ],
        anleitung: "1. Nudeln in reichlich Salzwasser al dente kochen. 2. Pancetta in einer Pfanne knusprig anbraten. 3. Eigelb mit Parmesan und Pfeffer verquirlen. 4. Heiße Nudeln zur Pancetta geben, vom Herd nehmen und die Ei-Käse-Mischung unterrühren. 5. Mit Pasta-Wasser cremig rühren und sofort servieren.",
        schwierigkeit: "Mittel",
        zubereitungszeit: "20 Min",
        portionen: "2 Personen"
    },
    {
        id: 2,
        name: "Fluffige Pfannkuchen",
        bild_url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=2070",
        zutaten: [
            "250g Mehl",
            "2 Eier",
            "500ml Milch",
            "1 Prise Salz",
            "2 EL Zucker",
            "1 TL Backpulver",
            "Butter zum Braten"
        ],
        anleitung: "1. Alle trockenen Zutaten in einer Schüssel vermengen. 2. Eier und Milch verquirlen und zu den trockenen Zutaten geben. 3. Zu einem glatten Teig verrühren und 10 Minuten ruhen lassen. 4. Butter in einer Pfanne erhitzen und Pfannkuchen portionsweise goldbraun backen.",
        schwierigkeit: "Einfach",
        zubereitungszeit: "15 Min",
        portionen: "4 Personen"
    },
    {
        id: 3,
        name: "Chicken Tikka Masala",
        bild_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071",
        zutaten: [
            "500g Hühnchenbrust",
            "200ml Joghurt",
            "400ml Kokosmilch",
            "200g Tomaten, passiert",
            "1 Zwiebel",
            "3 Knoblauchzehen",
            "2 TL Garam Masala",
            "1 TL Kurkuma",
            "1 TL Paprika",
            "Salz und Pfeffer"
        ],
        anleitung: "1. Hähnchen in Joghurt und Gewürzen marinieren (mindestens 30 Min). 2. Zwiebel und Knoblauch anbraten. 3. Mariniertes Hähnchen anbraten. 4. Tomaten und Kokosmilch hinzufügen, 20 Min köcheln lassen. 5. Mit Reis und Naan servieren.",
        schwierigkeit: "Mittel",
        zubereitungszeit: "45 Min",
        portionen: "3 Personen"
    },
    {
        id: 4,
        name: "Caesar Salad",
        bild_url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=2070",
        zutaten: [
            "1 Romana Salat",
            "100g Parmesan",
            "2 Scheiben Toastbrot",
            "2 Knoblauchzehen",
            "4 EL Olivenöl",
            "1 Eigelb",
            "1 EL Dijon-Senf",
            "2 EL Zitronensaft",
            "4 Sardellen"
        ],
        anleitung: "1. Croutons aus Toastbrot rösten. 2. Für das Dressing Eigelb, Senf, Zitronensaft und Sardellen vermixen. 3. Langsam Olivenöl einrühren. 4. Salat waschen und zerteilen. 5. Mit Dressing, Croutons und Parmesan servieren.",
        schwierigkeit: "Einfach",
        zubereitungszeit: "15 Min",
        portionen: "2 Personen"
    },
    {
        id: 5,
        name: "Schokoladen-Lava-Kuchen",
        bild_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=2070",
        zutaten: [
            "100g dunkle Schokolade",
            "50g Butter",
            "1 Ei",
            "1 Eigelb",
            "2 EL Zucker",
            "2 EL Mehl",
            "1 Prise Salz",
            "Butter für die Förmchen"
        ],
        anleitung: "1. Schokolade und Butter schmelzen. 2. Ei, Eigelb und Zucker schaumig rühren. 3. Schokolade unterrühren, dann Mehl und Salz. 4. In gefettete Förmchen füllen. 5. 12-14 Min bei 200°C backen. 6. Sofort stürzen und servieren.",
        schwierigkeit: "Mittel",
        zubereitungszeit: "25 Min",
        portionen: "2 Personen"
    },
    {
        id: 6,
        name: "Vegetarische Lasagne",
        bild_url: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=2070",
        zutaten: [
            "9 Lasagneplatten",
            "2 Zucchini",
            "1 Aubergine",
            "500g Ricotta",
            "400g Mozzarella",
            "100g Parmesan",
            "500ml Tomatensauce",
            "2 Knoblauchzehen",
            "Basilikum, Oregano"
        ],
        anleitung: "1. Gemüse in Scheiben schneiden und anbraten. 2. Ricotta mit Kräutern würzen. 3. Lasagneplatten, Gemüse, Ricotta und Sauce schichten. 4. Mit Mozzarella und Parmesan bestreuen. 5. 35 Min bei 180°C backen.",
        schwierigkeit: "Mittel",
        zubereitungszeit: "60 Min",
        portionen: "6 Personen"
    }
];

// GET: Alle Rezepte
app.get('/api/rezepte', (req, res) => {
    res.json(rezepte);
});

app.post('/api/rezepte', (req, res) => {
    const neuesRezept = req.body;
    neuesRezept.id = Date.now(); // einfache ID erzeugen
    rezepte.push(neuesRezept);
    res.status(201).json(neuesRezept); // als Bestätigung zurücksenden
});

app.delete('/api/rezepte/:id', (req, res) => {
    const id = parseInt(req.params.id);
    rezepte = rezepte.filter(rezept => rezept.id !== id);
    res.status(204).send(); // Kein Inhalt zurück, aber erfolgreich
});




// Server starten
app.listen(port, () => {
    console.log(`✅ Server läuft auf http://localhost:${port}`);
});
