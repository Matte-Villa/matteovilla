let stats = [];

class utente {      // classe per contenere dati sql
    constructor(p, u, w, l, s) {
        this.propic = p;
        this.username = u;
        this.vittorie = w;
        this.sconfitte = l;
        this.serie = s;
    }
}

function recuperaDati() {
    fetch('stat_globali.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'stat_globali' })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Risposta php non ok');
            }
            return response.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                stats.push(new utente(data[i]["imgprofilo"], data[i]["utente"], data[i]["vittorie"], data[i]["sconfitte"], data[i]["serie"]));    // metto i dati in un array di classi
                ordina(1);
            }
        })
        .catch(error => {
            console.error('Problema nel fetch', error);
        });
}

function ordina(num) {          // ordina l'array in base a vittorie/serie/rapporto
    switch (num) {
        case 0:
            stats.sort((a, b) => b.vittorie - a.vittorie);
            break;
        case 1:
            stats.sort((a, b) => b.serie - a.serie);
            break;
        case 2:
            stats.sort((a, b) => Number(b.vittorie) / Number(b.sconfitte + 1) - Number(a.vittorie) / Number(a.sconfitte + 1));
            break;

        default:
            break;
    }


    creaTab();
}

function creaTab() {        // gestisce la creazione della tabella classifica

    let tab = document.getElementById("tab");

    while (tab.firstChild) {
        tab.firstChild.remove();
    }

    let head = document.createElement("thead");

    let tr = document.createElement("tr");

    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");
    let td6 = document.createElement("td");

    td1.textContent = "Posizione";
    td2.textContent = "Giocatore";
    td3.textContent = "Vittorie";
    td4.textContent = "Sconfitte";
    td5.textContent = "Serie di Vittorie";
    td6.textContent = "V/S";

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);

    head.appendChild(tr);
    tab.appendChild(head);

    for (let i = 0; i < stats.length; i++) {
        let tr1 = document.createElement("tr");
        for (let j = 0; j < 6; j++) {
            let td = document.createElement("td");
            switch (j) {
                case 0:
                    td.textContent = (i + 1) + "º";
                    tr1.appendChild(td);
                    break;
                case 1:
                    let div = document.createElement("div");
                    let div1 = document.createElement("div");
                    let div2 = document.createElement("div");
                    let img = document.createElement("img");

                    div.id = "div_img";

                    img.src = "../img/profilo/" + stats[i].propic + ".png";
                    img.width = 75;
                    img.height = 75;

                    div1.appendChild(img);
                    div2.textContent = stats[i].username;

                    div.appendChild(div1);
                    div.appendChild(div2);
                    td.appendChild(div);
                    tr1.appendChild(td);
                    tab.appendChild(tr1);
                    break;
                case 2:
                    td.textContent = stats[i].vittorie;
                    tr1.appendChild(td);
                    break;
                case 3:
                    td.textContent = stats[i].sconfitte;
                    tr1.appendChild(td);
                    break;
                case 4:
                    td.textContent = stats[i].serie;
                    tr1.appendChild(td);
                    break;
                case 5:
                    td.textContent = Math.floor((Number(stats[i].vittorie) / (Number(stats[i].sconfitte) + 1)) * 100) / 100;      // gestisco la divisione per 0
                    tr1.appendChild(td);
                    break;
                default:
                    break;
            }
            tab.appendChild(tr1);
        }
    }




}
