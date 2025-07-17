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

// Formular-Element holen
const rezeptForm = document.getElementById("rezept-form");

// Event Listener fürs Abschicken
rezeptForm.addEventListener("submit", async function (e) {
  e.preventDefault(); // Seite soll nicht neuladen

  // Werte auslesen
  const name = document.getElementById("name").value.trim();
  const bild = document.getElementById("bild").value.trim();
  const zutatenText = document.getElementById("zutaten").value.trim();
  const anleitung = document.getElementById("anleitung").value.trim();
  const dauer = document.getElementById("dauer").value.trim();
  const personen = document.getElementById("personen").value.trim();
  const schwierigkeit = document.getElementById("schwierigkeit").value.trim();

  // Zutaten in Array umwandeln (eine pro Zeile)
  const zutaten = zutatenText.split("\n").map(z => z.trim()).filter(z => z !== "");

  // Rezept-Objekt bauen
  const neuesRezept = {
    name,
    bild_url: bild,
    zutaten,
    anleitung,
    zubereitungszeit: dauer + " Min",
    portionen: personen + " Personen",
    schwierigkeit
  };

  try {
    const res = await fetch("http://localhost:3000/api/rezepte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(neuesRezept)
    });

    if (res.ok) {
      alert("🎉 Rezept erfolgreich hinzugefügt!");
      rezeptForm.reset(); // Formular leeren
      renderRezepte(); // Galerie neu laden
    } else {
      alert("❌ Fehler beim Hinzufügen des Rezepts.");
    }
  } catch (err) {
    console.error("Fehler beim Senden:", err);
    alert("Verbindung zum Server fehlgeschlagen.");
  }
});

document.addEventListener('DOMContentLoaded', ladeRezepte);


// Initialer Aufruf
//renderRezepte();