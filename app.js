console.log("Rezeptbuch geladen");

// DOM-Elemente
const rezeptGalerie = document.getElementById('rezept-galerie');
const rezeptModalTitel = document.getElementById('rezept-modal-title');
const rezeptModalBody = document.getElementById('rezept-modal-body');
const rezeptModal = new bootstrap.Modal(document.getElementById('rezept-modal'));

let rezepte = []; // Wird per fetch() vom Server gefüllt

async function ladeRezepte() {
    try {
        const response = await fetch('http://localhost:3000/api/rezepte');
        rezepte = await response.json();
        renderRezepte(); // Rendert die geladenen Daten
    } catch (err) {
        console.error("Fehler beim Laden der Rezepte:", err);
    }
}

// Rezept-Daten
/*
let rezepte = [
    {
        id: 1,
        name: "Spaghetti Carbonara",
        bild_url: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D4",
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
*/
// Schwierigkeitsgrad-Farben
function getSchwierigkeitsFarbe(schwierigkeit) {
    switch(schwierigkeit) {
        case 'Einfach': return 'success';
        case 'Mittel': return 'warning';
        case 'Schwer': return 'danger';
        default: return 'primary';
    }
}

// Rezept-Karten rendern
function renderRezepte() {
    console.log("Rendere Rezepte...");
    rezeptGalerie.innerHTML = '';
    
    rezepte.forEach(rezept => {
        const schwierigkeitsFarbe = getSchwierigkeitsFarbe(rezept.schwierigkeit);
        
        const rezeptKarteHTML = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card fade-in h-100" onclick="zeigeRezeptDetails(${rezept.id})">
                    <div style="position: relative;">
                        <img src="${rezept.bild_url}" class="card-img-top" alt="${rezept.name}">
                        <span class="difficulty-badge badge bg-${schwierigkeitsFarbe}">${rezept.schwierigkeit}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${rezept.name}</h5>
                        <button class="btn btn-primary btn-sm me-2" onclick="zeigeRezeptDetails(${rezept.id})">Details</button>
                        <button class="btn btn-danger btn-sm" onclick="loescheRezept(${rezept.id})">Löschen</button>
                        <p class="card-text">
                            <small class="text-muted">
                                ⏱️ ${rezept.zubereitungszeit} | 👥 ${rezept.portionen}
                            </small>
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        rezeptGalerie.innerHTML += rezeptKarteHTML;
    });
}

// Rezept-Details im Modal anzeigen
function zeigeRezeptDetails(rezeptId) {
    console.log("Zeige Details für Rezept:", rezeptId);
    
    const rezept = rezepte.find(r => r.id === rezeptId);
    if (!rezept) {
        console.error("Rezept nicht gefunden:", rezeptId);
        return;
    }

    // Modal-Titel setzen
    rezeptModalTitel.innerText = rezept.name;

    // Zutaten-Liste erstellen
    let zutatenHTML = '<h6>🥘 Zutaten:</h6><ul>';
    rezept.zutaten.forEach(zutat => {
        zutatenHTML += `<li>${zutat}</li>`;
    });
    zutatenHTML += '</ul>';

    // Zeit-Informationen
    const zeitInfoHTML = `
        <div class="time-info">
            <span class="time-badge">⏱️ ${rezept.zubereitungszeit}</span>
            <span class="time-badge">👥 ${rezept.portionen}</span>
            <span class="time-badge bg-${getSchwierigkeitsFarbe(rezept.schwierigkeit)} text-white">${rezept.schwierigkeit}</span>
        </div>
    `;

    // Anleitung
    const anleitungHTML = `
        <h6>📝 Zubereitung:</h6>
        <p>${rezept.anleitung}</p>
    `;

    // Rezept-Bild
    const bildHTML = `<img src="${rezept.bild_url}" alt="${rezept.name}">`;

    // Alles zusammenfügen
    rezeptModalBody.innerHTML = bildHTML + zeitInfoHTML + zutatenHTML + '<hr>' + anleitungHTML;

    // Modal anzeigen
    rezeptModal.show();
}

async function loescheRezept(id) {
    const bestaetigt = confirm("Möchtest du dieses Rezept wirklich löschen?");
    if (!bestaetigt) return;

    try {
        const res = await fetch(`http://localhost:3000/api/rezepte/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            alert("Rezept gelöscht!");
            await renderRezepte(); // Aktualisiere Anzeige
        } else {
            alert("Fehler beim Löschen.");
        }
    } catch (err) {
        console.error("Fehler beim Löschen:", err);
    }
}


document.addEventListener('DOMContentLoaded', ladeRezepte);


// Initialer Aufruf
//renderRezepte();