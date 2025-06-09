// le carte vanno da 1 a 40, le decine rappresentano il seme e le unità il valore

let carte_rimaste = [];     // carte nel mazzo
let carte_giocatore = [];   // carte prese dal giocatore
let carte_avversario = [];
let mano_giocatore = [];    // carte in mano al giocatore
let mano_avversario = [];
let carte_in_tavola = [];
let presa = [];             // vettore che contiene i valori che il giocatore di turno vuole prendere
let mazziere;
let turnoGiocatore;
let scoperteAvversario = false;     // booleano che dice se l'avversario gioca con le carte scoperte in seguito a una bussata
let scope_giocatore = 0;
let scope_avversario = 0;
let ultima_presa = true;            // variabile per controllare a chi vanno le ultime carte che rimangono in tavola
let punteggioTotale_giocatore = 0;
let punteggioTotale_avversario = 0;
let bussato = false;        // variabile per non consentire di bussare più di una volta per mano
let valoreMatta = -1;       // contiene il valore da sostituire con quello della matta nel calcolo del punteggio

const PUNTEGGIO_VITTORIA = 21;
const COLONNE = 5;

function vinto() {               // modifica valori sql
    fetch("vittoria.php")
        .then(risposta => risposta.json());
}

function perso() {               // modifica valori sql
    fetch("sconfitta.php")
        .then(risposta => risposta.json());
}

function inizializza() {         // gestisce l'avvio di nuovi round

    carte_giocatore = [];
    carte_avversario = [];
    mano_giocatore = [];
    mano_avversario = [];
    scope_giocatore = 0;
    scope_avversario = 0;
    valoreMatta = -1;

    for (let i = 1; i < 41; i++) {
        carte_rimaste.push(i);
    }

    shuffle(carte_rimaste);

    for (let i = 0; i < 4; i++) {
        let x = carte_rimaste.pop();
        carte_in_tavola.push(x);
    }

    scegliMazziere();
    distribuisciCarte();
    organizzaCarte();

    document.getElementById("prendi").addEventListener("click", tira);
    document.getElementById("resa").addEventListener("click", resa);
    document.getElementById("box-bussata").addEventListener("click", bussa);
    document.getElementById("info").addEventListener("click", info);

    setTimeout(() => {


        if (mazziere && puntiTavola()) {
            setTimeout(() => {
                gioca_bot();
            }, 5000);
        }
        else if (!turnoGiocatore)
            gioca_bot();
    }, 4000);
}

function distribuisciCarte() {   // dà le carte ai giocatori
    for (let i = 1; i < 4; i++) {
        let x = carte_rimaste.pop();
        mano_giocatore.push(x);
    }
    for (let i = 1; i < 4; i++) {
        let x = carte_rimaste.pop();
        mano_avversario.push(x);
    }

}

function scegliMazziere() {      // sceglie casualmente il mazziere e quindi chi gioca per primo
    mazziere = Boolean(Math.floor(Math.random() * 2));
    let d = document.createElement("dialog");
    if (mazziere) {
        d.textContent = "Sei il mazziere";
        turnoGiocatore = false;
        test = true;
    }
    else {
        d.textContent = "L'avversario è il mazziere";
        turnoGiocatore = true;
        test = false;
    }

    document.body.appendChild(d);
    d.show();
    setTimeout(() => {
        d.close();
        d.remove();
    }, 3000);
}

function organizzaCarte() {      // ordina visivamente le carte in tavola
    let tab = document.getElementById("campogioco");
    while (tab.firstChild) {
        tab.removeChild(tab.firstChild);    // resetta il piano di gioco
    }

    if (carte_in_tavola.length == 0)         // caso no carte in tavola
    {
        organizzaMani();
        return;
    }

    let righe = Math.floor(carte_in_tavola.length / COLONNE);

    for (let i = 0; i < righe; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < COLONNE; j++) {
            let td = document.createElement("td");      // ogni td prende id della carta che rappresenta
            td.id = carte_in_tavola[i * COLONNE + j];
            td.style.backgroundImage = "url(../img/carte/" + td.id + ".png)";
            td.style.backgroundSize = "cover";
            td.classList.add("pointer");
            td.addEventListener("click", aggiungi);
            tr.appendChild(td);
        }
        tab.appendChild(tr);
    }

    if (carte_in_tavola.length % COLONNE != 0) {
        let tr = document.createElement("tr");
        for (let j = 0; j < carte_in_tavola.length % COLONNE; j++) {
            let td = document.createElement("td");
            td.id = carte_in_tavola[righe * COLONNE + j];
            td.style.backgroundImage = "url(../img/carte/" + td.id + ".png)";
            td.style.backgroundSize = "cover";
            td.classList.add("pointer");
            td.addEventListener("click", aggiungi);
            tr.appendChild(td);
        }
        tab.appendChild(tr);
    }

    organizzaMani();

    document.getElementById("quante").textContent = carte_rimaste.length;

}

function organizzaMani() {      // funzione che mostra le carte in mano
    for (let i = 1; i < 4; i++) {
        if (document.getElementById("CG" + i)) {
            document.getElementById("CG" + i).style.backgroundImage = "url(../img/carte/" + mano_giocatore[i - 1] + ".png)";
            document.getElementById("CG" + i).addEventListener("click", seleziona);
        }
    }
    if (scoperteAvversario) {
        for (let i = 1; i < 4; i++) {
            if (document.getElementById("CB" + i)) {
                document.getElementById("CB" + i).style.backgroundImage = "url(../img/carte/" + mano_avversario[i - 1] + ".png)";
            }
        }
    }
    else {
        for (let i = 1; i < 4; i++) {
            if (document.getElementById("CB" + i)) {
                document.getElementById("CB" + i).style.backgroundImage = "url(../img/carte/dorso.png)";
            }
        }
    }
}

function shuffle(arr) {         // mischia un array a caso
    let rand, temp, i;
    for (i = arr.length - 1; i > 0; i--) {
        rand = Math.floor((i + 1) * Math.random());
        temp = arr[rand];
        arr[rand] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function seleziona() {          // gestisce la selezione di una carta nella tua mano da tirare
    if (!turnoGiocatore)
        return;

    let valore_carta = mano_giocatore[getPosCarta(event.target.id)];
    if (!event.target.classList.contains("selezionato"))     // nuova selezione
    {
        if (document.querySelectorAll(".selezionato").length != 0)   // caso selezione dopo precedente selezione
        {
            presa = [];
            let carteSelezionate = document.querySelectorAll(".selezionato");
            carteSelezionate.forEach(carta => {
                carta.classList.remove("selezionato");
            });
        }
        event.target.classList.add("selezionato");
        presa.push(valore_carta);
    }
    else {
        event.target.classList.remove("selezionato");
        presa = [];        // se deselezioni una carta resetto la presa
        let carteSelezionate = document.querySelectorAll(".selezionato");
        carteSelezionate.forEach(carta => {
            carta.classList.remove("selezionato");
        });
        let carteAggiunte = document.querySelectorAll(".aggiunto");
        carteAggiunte.forEach(carta => {
            carta.classList.remove("aggiunto");
        });
    }

}

function getPosCarta(x) {       // funzione che dato un id di una carta in mano, resituisce la posizione della carta in mano
    switch (x) {
        case "CG1":
            return 0;
            break;
        case "CG2":
            return 1;
            break;
        case "CG3":
            return 2;
            break;
        case "CB1":
            return 0;
            break;
        case "CB2":
            return 1;
            break;
        case "CB3":
            return 2;
            break;
        default:
            return "Errore";
            break;
    }
}

function aggiungi() {           // funzione che gestisce la selezione di carte in tavola
    if (!turnoGiocatore)
        return;

    if (presa.length == 0)
        return;

    let valore_carta = Number(event.target.id);
    if (!event.target.classList.contains("aggiunto"))     // nuova selezione
    {
        event.target.classList.add("aggiunto");
        presa.push(valore_carta);
    }
    else {
        event.target.classList.remove("aggiunto");
        presa = presa.filter(carta => carta !== Number(event.target.id));   // elimino la carta dall'array di presa
    }
}

function tira() {               // listener solo per turno del giocatore

    if (!turnoGiocatore)
        return false;

    valuta_presa();
}

function valuta_presa() {       // funzione che effettua la presa con la combinazione data e restituisce true se riesci a prendere carte

    if (presa.length == 0)   // non hai selezionato carte
        return false;

    bussato = false;        // a ogni presa è di nuovo possibile bussare

    if (presa.length == 1)   // hai selezionato solo la carta in mano e non puoi o ti sei dimenticato di prendere carte
    {
        nonPrendiCarte();
        return false;
    }

    else if (presa.length == 2 && (presa[0] - presa[1]) % 10 == 0)  // caso carte stesso valore
    {                                                              // le carte dello stesso valore hanno un displacement di 10, quindi se la differenza è multiplo di 10 sono uguali
        prendiCarte();
        return true;
    }

    else {
        let somma = 0;

        for (let i = 0; i < presa.length; i++) {
            somma = somma + convertiValore(presa[i]);    // usa il valore della carta indipendentemente dal seme
        }

        if (somma == 15)         // se la somma delle carte nella tua presa è 15, puoi prendere
        {
            prendiCarte();
            return true;
        }

        if ((somma - convertiValore(presa[0])) == convertiValore(presa[0]))      // se vuoi prendere ad esempio 4 e 3 usando il 7
        {
            prendiCarte();
            return true;
        }

        if ((presa[0] - 1) % 10 == 0 && !contieneValore(carte_in_tavola, 1) && (presa.length - 1) == carte_in_tavola.length) {                           // controlla se vuoi tirare un asso, se non ci sono già assi in tavola e se stai prendendo tutte le carte
            prendiCarte();
            return true;
        }

        nonPrendiCarte();
        return false;
    }

}

function prendiCarte() {        // funzione chiamata quando puoi prendere   
    let valore_carta = presa[0];

    if (turnoGiocatore) {
        let indice = mano_giocatore.indexOf(valore_carta);

        mano_giocatore[indice] = -1;
        document.querySelectorAll(".selezionato")[0].remove();

        for (let i = 0; i < presa.length; i++) {
            carte_giocatore.push(presa[i]);
            carte_in_tavola = carte_in_tavola.filter(carta => carta !== presa[i]);
        }

        presa = [];
        organizzaCarte();

        if (carte_in_tavola.length == 0)         // controlla se è scopa
        {
            scope_giocatore++;
            visualizzaScope(1, "green");
        }

        turnoGiocatore = !turnoGiocatore;
        gioca_bot();
    }
    else {
        let indice = mano_avversario.indexOf(valore_carta);

        mano_avversario[indice] = -1;
        document.querySelectorAll(".selezionatoAvversario")[0].remove();

        for (let i = 0; i < presa.length; i++) {
            carte_avversario.push(presa[i]);
            carte_in_tavola = carte_in_tavola.filter(carta => carta !== presa[i]);
        }

        presa = [];
        organizzaCarte();

        if (carte_in_tavola.length == 0 && carte_rimaste.length != 0)         // controlla se è scopa
        {
            scope_avversario++;
            visualizzaScope(1, "red");
        }

        turnoGiocatore = !turnoGiocatore;
    }

    ultima_presa = turnoGiocatore;

    if (mano_finita())
        prossima_mano();
}

function nonPrendiCarte() {     // funzione chiamata quando non puoi prendere   
    let valore_carta = presa[0];
    if (turnoGiocatore) {
        let indice = mano_giocatore.indexOf(valore_carta);

        carte_in_tavola.push(valore_carta);
        mano_giocatore[indice] = -1;
        document.querySelectorAll(".selezionato")[0].remove();
        presa = [];
        organizzaCarte();
        turnoGiocatore = !turnoGiocatore;
        gioca_bot();
    }
    else {
        let indice = mano_avversario.indexOf(valore_carta);

        carte_in_tavola.push(valore_carta);
        mano_avversario[indice] = -1;
        document.querySelectorAll(".selezionatoAvversario")[0].remove();
        presa = [];
        organizzaCarte();
        turnoGiocatore = !turnoGiocatore;
    }
    if (mano_finita())
        prossima_mano();
}

function contieneValore(arr, x) {    // funzione che controlla se in un array c'è un valore per ogni seme es: se array contiene uno tra {1, 11, 21, 31}
    for (let i = 0; i < 4; i++) {
        if (arr.includes(x + 10 * i)) {
            return true;
        }
    }

    return false;
}

function convertiValore(x) {    // funzione che ignora i semi e restituisce solo il valore della carta es: 22 -> 2; 9 -> 9; 30 -> 10
    let ris = x % 10;
    if (ris == 0)
        ris = 10;

    return ris;
}

function gioca_bot() {          // funzione che gestisce il turno dell'avversario

    bussa();

    if (contieneValore(mano_avversario, 1) && !contieneValore(carte_in_tavola, 1) && carte_in_tavola.length != 0)       // se ha un asso e può usarlo per prendere tutto, lo farà
    {
        for (let i = 0; i < mano_avversario.length; i++) {
            if (mano_avversario[i] < 0)
                continue;

            if (convertiValore(mano_avversario[i]) == 1) {
                presa = [].concat(mano_avversario[i]).concat(carte_in_tavola);
                mossaAvversario(i);
                setTimeout(() => {
                    valuta_presa();
                }, 4000);
                return;
            }
        }
    }
    // se il controllo sopra non ha avuto effetto, guarda se può prendere con somma 15 una singola carta
    // (non controllo volutamente tutte le combinazioni per non aumentare esponenzialmente la complessità del programma)

    for (let i = 0; i < mano_avversario.length; i++) {
        if (mano_avversario[i] < 0)
            continue;

        for (let j = 0; j < carte_in_tavola.length; j++) {
            if (convertiValore(mano_avversario[i]) + convertiValore(carte_in_tavola[j]) == 15) {
                presa = [].concat(mano_avversario[i]).concat(carte_in_tavola[j]);
                mossaAvversario(i);
                setTimeout(() => {
                    valuta_presa();
                }, 4000);
                return;
            }
        }
    }

    for (let i = 0; i < mano_avversario.length; i++)   // se nemmeno il caso sopra è possibile prova a prendere una carta con lo stesso valore
    {
        if (mano_avversario[i] < 0)
            continue;

        for (let j = 0; j < carte_in_tavola.length; j++) {
            if (convertiValore(mano_avversario[i]) == convertiValore(carte_in_tavola[j])) {
                presa = [].concat(mano_avversario[i]).concat(carte_in_tavola[j]);
                mossaAvversario(i);
                setTimeout(() => {
                    valuta_presa();
                }, 4000);
                return;
            }
        }
    }

    for (let i = 0; i < mano_avversario.length; i++)       // se non si è verificato nessuno dei casi sopra tira la prima carta disponibile
    {
        if (mano_avversario[i] > 0) {
            presa = [].concat(mano_avversario[i]);
            mossaAvversario(i);
            setTimeout(() => {
                valuta_presa();
            }, 4000);
            return;
        }
    }
}

function mossaAvversario(pos) {    // funzione che permette all'avversario di selezionare visivamente le carte
    document.getElementById("CB" + (pos + 1)).style.backgroundImage = "url(../img/carte/" + mano_avversario[pos] + ".png)";
    document.getElementById("CB" + (pos + 1)).classList.add("selezionatoAvversario");
    setTimeout(() => {
        for (let i = 1; i < presa.length; i++) {
            document.getElementById(presa[i]).classList.add("selezionatoAvversario");
        }
    }, 1500);
}

function mano_finita() {    // funzione che controlla se nessun giocatore ha più carte in mano
    for (let i = 0; i < 3; i++) {
        if (mano_avversario[i] != -1 || mano_giocatore[i] != -1)
            return false;
    }
    scoperteAvversario = false;
    return true;
}

function prossima_mano() {  // funzione che prepara la prossima mano
    if (carte_rimaste.length == 0) {
        fine_round();
        return;
    }

    mano_avversario = [];
    mano_giocatore = [];

    for (let i = 0; i < 3; i++) {
        let x = carte_rimaste.pop();
        let y = carte_rimaste.pop();
        mano_giocatore.push(x);
        mano_avversario.push(y);
    }
    setTimeout(() => {
        resetMani();
        organizzaCarte();

        if (!turnoGiocatore)
            gioca_bot();
    }, 1000);

}

function fine_round() {     // funzione che prepara il prossimo round, ultima_presa è true se il giocatore è stato l'ultimo a prendere
    let lunghezza = carte_in_tavola.length;
    if (ultima_presa) {
        for (let i = 0; i < lunghezza; i++) {

            let x = carte_in_tavola.pop();
            carte_giocatore.push(x);
        }
    }
    else {
        for (let i = 0; i < lunghezza; i++) {
            let x = carte_in_tavola.pop();
            carte_avversario.push(x);
        }
    }
    organizzaCarte();

    for (let i = 0; i < carte_giocatore.length; i++) {
        if (carte_giocatore[i] == valoreMatta)
            carte_giocatore[i] = 37;
    }

    calcolo_punteggio();
    scope_giocatore = 0;
    scope_avversario = 0;

    resetMani();

}

function resetMani() {      // funzione che ricostruisce i td delle mani dei giocatori
    let top = document.getElementById("trB");
    let bot = document.getElementById("trG");

    for (let i = 1; i < 4; i++) {
        let td = document.createElement("td");
        td.classList.add("pointer");
        td.id = "CB" + i;
        top.appendChild(td);
    }

    for (let i = 1; i < 4; i++) {
        let td = document.createElement("td");
        td.classList.add("pointer");
        td.id = "CG" + i;
        bot.appendChild(td);
    }

}

function calcolo_punteggio() {  // funzione che calcola il punteggio fatto a ogni round per entrambi i giocatori    
    mostraPunteggio();

    let x = scope_giocatore;
    let y = scope_avversario;

    setTimeout(() => {
        setteBello();
        setTimeout(() => {
            mattoni();
            setTimeout(() => {
                primiera();
                setTimeout(() => {
                    carte();
                    setTimeout(() => {
                        piccola();
                        setTimeout(() => {
                            grande();
                            setTimeout(() => {
                                scope(x, y);
                                setTimeout(() => {
                                    punteggio(x, y);
                                    setTimeout(() => {
                                        punteggio_attuale(x, y);
                                        controlloVittoria();
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 2000);
    }, 2000);

}

function scope(x, y) {      // funzione che passa le scope fatte al div del punteggio
    let s = document.getElementsByClassName("Scope");
    s[0].textContent = x;
    s[1].textContent = y;
}

function primiera() {   // le prossime 8 funzioni calcolano le componenti del punteggio
    let mattoni = 0;
    let cuori = 0;
    let picche = 0;
    let fiori = 0;

    let s = document.getElementsByClassName("Primiera");

    let tab = document.createElement("table");
    let tab2 = document.createElement("table");

    let tr = document.createElement("tr");
    let tr2 = document.createElement("tr");

    for (let i = 0; i < carte_giocatore.length; i++) {
        if (carte_giocatore[i] < 11 && carte_giocatore[i] % 10 < 8 && carte_giocatore[i] % 10 > picche) {
            picche = carte_giocatore[i] % 10;
        }
        if (carte_giocatore[i] < 21 && carte_giocatore[i] > 10 && carte_giocatore[i] % 10 < 8 && carte_giocatore[i] % 10 > fiori) {
            fiori = carte_giocatore[i] % 10;
        }
        if (carte_giocatore[i] < 31 && carte_giocatore[i] > 20 && carte_giocatore[i] % 10 < 8 && carte_giocatore[i] % 10 > mattoni) {
            mattoni = carte_giocatore[i] % 10;
        }
        if (carte_giocatore[i] > 30 && carte_giocatore[i] % 10 < 8 && carte_giocatore[i] % 10 > cuori) {
            cuori = carte_giocatore[i] % 10;
        }
    }

    for (let i = 0; i < 4; i++) {
        let td = document.createElement("td");
        let carta = document.createElement("img");
        let vuoto = false;

        switch (i) {
            case 0:
                if (picche == 0) {
                    vuoto = true;
                    break;
                }
                carta.src = "../img/carte/" + picche + ".png";

                break;
            case 1:
                if (fiori == 0) {
                    vuoto = true;
                    break;
                }
                carta.src = "../img/carte/" + (fiori + 10) + ".png";
                break;
            case 2:
                if (mattoni == 0) {
                    vuoto = true;
                    break;
                }
                carta.src = "../img/carte/" + (mattoni + 20) + ".png";
                break;
            case 3:
                if (cuori == 0) {
                    vuoto = true;
                    break;
                }
                carta.src = "../img/carte/" + (cuori + 30) + ".png";
                break;
            default:
                break;
        }

        carta.classList.add("carta_punti");

        if (!vuoto) {
            td.appendChild(carta);
            tr.appendChild(td);
        }
    }


    tab.appendChild(tr);
    s[0].appendChild(tab);



    let primiera_giocatore = mattoni + cuori + picche + fiori;

    mattoni = 0;
    cuori = 0;
    picche = 0;
    fiori = 0;

    for (let i = 0; i < carte_avversario.length; i++) {
        if (carte_avversario[i] < 11 && carte_avversario[i] % 10 < 8 && carte_avversario[i] % 10 > picche) {
            picche = carte_avversario[i] % 10;

        }
        if (carte_avversario[i] < 21 && carte_avversario[i] > 10 && carte_avversario[i] % 10 < 8 && carte_avversario[i] % 10 > fiori) {
            fiori = carte_avversario[i] % 10;

        }
        if (carte_avversario[i] < 31 && carte_avversario[i] > 20 && carte_avversario[i] % 10 < 8 && carte_avversario[i] % 10 > mattoni) {
            mattoni = carte_avversario[i] % 10;
        }
        if (carte_avversario[i] > 30 && carte_avversario[i] % 10 < 8 && carte_avversario[i] % 10 > cuori) {
            cuori = carte_avversario[i] % 10;
        }
    }

    for (let i = 0; i < 4; i++) {
        let td = document.createElement("td");
        let carta = document.createElement("img");
        let vuoto = false;

        switch (i) {
            case 0:
                if (picche == 0) {
                    vuoto = true;
                    break;
                }
                carta.src = "../img/carte/" + picche + ".png";

                break;
            case 1:
                if (fiori == 0) {
                    vuoto = true;
                    break;
                }
                carta.src = "../img/carte/" + (fiori + 10) + ".png";
                break;
            case 2:
                if (mattoni == 0) {
                    vuoto = true;
                    break;
                }
                carta.src = "../img/carte/" + (mattoni + 20) + ".png";
                break;
            case 3:
                if (cuori == 0) {
                    vuoto = true;
                    break;
                }
                carta.src = "../img/carte/" + (cuori + 30) + ".png";
                break;
            default:
                break;
        }

        carta.classList.add("carta_punti");

        if (!vuoto) {
            td.appendChild(carta);
            tr2.appendChild(td);
        }
    }

    tab2.appendChild(tr2);
    s[1].appendChild(tab2);

    let primiera_avversario = mattoni + cuori + picche + fiori;

    if (primiera_giocatore > primiera_avversario) {
        scope_giocatore++;
        visualizzaPunti("PT2", "+1", "green");
        return;
    }
    else if (primiera_giocatore < primiera_avversario) {
        scope_avversario++;
        visualizzaPunti("PT2", "+1", "red");
        return;
    }
    visualizzaPunti("PT2", "+0", "gray");
}

function carte() {
    if (carte_giocatore.length > carte_avversario.length) {
        scope_giocatore++;
        visualizzaPunti("PT3", "+1", "green");
    }
    else if (carte_giocatore.length < carte_avversario.length) {
        scope_avversario++;
        visualizzaPunti("PT3", "+1", "red");
    }
    else if (carte_giocatore.length == carte_avversario.length) {
        visualizzaPunti("PT3", "+0", "gray");
    }
    let s = document.getElementsByClassName("Carte");
    s[0].textContent = carte_giocatore.length;
    s[1].textContent = carte_avversario.length;
}

function mattoni() {
    let mattoni_giocatore = 0;
    let s = document.getElementsByClassName("Mattoni");
    let tab = document.createElement("table");
    let tr = document.createElement("tr");
    for (let i = 0; i < carte_giocatore.length; i++) {
        if (carte_giocatore[i] > 20 && carte_giocatore[i] < 31) {
            let td = document.createElement("td");
            let carta = document.createElement("img");
            carta.src = "../img/carte/" + carte_giocatore[i] + ".png";
            carta.classList.add("carta_punti");
            td.appendChild(carta);
            tr.appendChild(td);

            mattoni_giocatore++;
        }
    }
    tab.appendChild(tr);
    s[0].appendChild(tab);


    let tab2 = document.createElement("table");
    let tr2 = document.createElement("tr");
    for (let i = 0; i < carte_avversario.length; i++) {
        if (carte_avversario[i] > 20 && carte_avversario[i] < 31) {
            let td = document.createElement("td");
            let carta = document.createElement("img");
            carta.src = "../img/carte/" + carte_avversario[i] + ".png";
            carta.classList.add("carta_punti");
            td.appendChild(carta);
            tr2.appendChild(td);

        }
    }
    tab2.appendChild(tr2);
    s[1].appendChild(tab2);

    if (mattoni_giocatore > 5) {
        scope_giocatore++;
        visualizzaPunti("PT1", "+1", "green");
        return;
    }
    else if (mattoni_giocatore < 5) {
        scope_avversario++;
        visualizzaPunti("PT1", "+1", "red");
        return;
    }
    visualizzaPunti("PT1", "+0", "gray");
}

function setteBello() {
    let s = document.getElementsByClassName("Sette");
    let tab = document.createElement("table");
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let carta = document.createElement("img");
    carta.src = "../img/carte/27.png";
    carta.classList.add("carta_punti");
    td.appendChild(carta);
    tr.appendChild(td);
    tab.appendChild(tr);

    if (carte_giocatore.includes(27)) {

        s[0].appendChild(tab);
        scope_giocatore++;
        visualizzaPunti("PT0", "+1", "green");
        return;
    }

    s[1].appendChild(tab);
    visualizzaPunti("PT0", "+1", "red");
    scope_avversario++;
}

function piccola() {
    if (carte_giocatore.includes(21) && carte_giocatore.includes(22) && carte_giocatore.includes(23)) {
        let s = document.getElementsByClassName("Piccola");
        let tab = document.createElement("table");
        let tr = document.createElement("tr");

        for (let i = 0; carte_giocatore.includes(21 + i) && i < 7; i++) {
            let td = document.createElement("td");
            let carta = document.createElement("img");
            carta.src = "../img/carte/" + (21 + i) + ".png";
            carta.classList.add("carta_punti");
            td.appendChild(carta);
            tr.appendChild(td);
            scope_giocatore++;
            visualizzaPunti("PT4", "+" + (i + 1), "green");
        }

        tab.appendChild(tr);
        s[0].appendChild(tab);

    }
    else if (carte_avversario.includes(21) && carte_avversario.includes(22) && carte_avversario.includes(23)) {
        let s = document.getElementsByClassName("Piccola");
        let tab = document.createElement("table");
        let tr = document.createElement("tr");

        for (let i = 0; carte_avversario.includes(21 + i) && i < 7; i++) {
            let td = document.createElement("td");
            let carta = document.createElement("img");
            carta.src = "../img/carte/" + (21 + i) + ".png";
            carta.classList.add("carta_punti");
            td.appendChild(carta);
            tr.appendChild(td);
            scope_avversario++;
            visualizzaPunti("PT4", "+" + (i + 1), "red");
        }

        tab.appendChild(tr);
        s[1].appendChild(tab);

    }
    else {
        visualizzaPunti("PT4", "+0", "gray");
    }
}

function grande() {
    if (carte_giocatore.includes(28) && carte_giocatore.includes(29) && carte_giocatore.includes(30)) {
        let s = document.getElementsByClassName("Grande");
        let tab = document.createElement("table");
        let tr = document.createElement("tr");

        for (let i = 28; i < 31; i++) {
            let td = document.createElement("td");
            let carta = document.createElement("img");
            carta.src = "../img/carte/" + i + ".png";
            carta.classList.add("carta_punti");
            td.appendChild(carta);
            tr.appendChild(td);
        }

        scope_giocatore += 5;
        visualizzaPunti("PT5", "+5", "green");
        tab.appendChild(tr);
        s[0].appendChild(tab);

    }
    else if (carte_avversario.includes(28) && carte_avversario.includes(29) && carte_avversario.includes(30)) {
        let s = document.getElementsByClassName("Grande");
        let tab = document.createElement("table");
        let tr = document.createElement("tr");

        for (let i = 28; i < 31; i++) {
            let td = document.createElement("td");
            let carta = document.createElement("img");
            carta.src = "../img/carte/" + i + ".png";
            carta.classList.add("carta_punti");
            td.appendChild(carta);
            tr.appendChild(td);
        }

        scope_avversario += 5;
        visualizzaPunti("PT5", "+5", "red");
        tab.appendChild(tr);
        s[1].appendChild(tab);


    }
    else {
        visualizzaPunti("PT5", "+0", "gray");
    }
}

function punteggio(x, y) {
    let s = document.getElementsByClassName("Punteggio");
    s[0].textContent = scope_giocatore + x;
    s[1].textContent = scope_avversario + y;
}

function punteggio_attuale(x, y) {
    let s = document.getElementsByClassName("Punteggio_attuale");
    punteggioTotale_giocatore += (x + scope_giocatore);
    punteggioTotale_avversario += (y + scope_avversario);
    s[0].textContent = punteggioTotale_giocatore;
    s[1].textContent = punteggioTotale_avversario;

    document.getElementById("procedi").disabled = false;
}

function mostraPunteggio() {    // queste 2 funzioni alternano la visibilità dei div del punteggio e del gioco
    document.getElementById("punti").style.display = "";
    document.getElementById("tavolo").style.display = "none";
    document.getElementById("top").style.display = "none";
    document.getElementById("bot").style.display = "none";
}

function nascondiPunteggio() {
    document.getElementById("punti").style.display = "none";
    document.getElementById("tavolo").style.display = "";
    document.getElementById("top").style.display = "";
    document.getElementById("bot").style.display = "";

    for (let i = 0; i < document.getElementById("puntiG").children.length; i++) {
        while (document.getElementById("puntiG").children[i].firstChild) {
            document.getElementById("puntiG").children[i].firstChild.remove();
        }
        document.getElementById("puntiG").children[i].textContent = "";
    }

    for (let i = 0; i < document.getElementById("puntiB").children.length; i++) {
        while (document.getElementById("puntiB").children[i].firstChild) {
            document.getElementById("puntiB").children[i].firstChild.remove();
        }
        document.getElementById("puntiB").children[i].textContent = "";
    }

}

function resa() {       // funzione per arrendersi
    document.getElementById("img-resa").classList.add("cliccato");
    setTimeout(() => {
        document.getElementById("img-resa").classList.remove("cliccato");
    }, 300);

    setTimeout(() => {
        finePartita("Hai perso!");
    }, 1000);
    perso();
    setTimeout(() => {
        window.location.href = "home.php";
    }, 5000);
    return;
}

function bussa() {
    if (turnoGiocatore) {
        document.getElementById("img-bussa").classList.add("cliccato");
        setTimeout(() => {
            document.getElementById("img-bussa").classList.remove("cliccato");
        }, 300);
    }

    if (turnoGiocatore) {
        if (mano_giocatore.includes(-1))
            return;

        if (!bussato) {
            bussato = true;

            if (mano_giocatore.includes(37))
                matta(mano_giocatore.indexOf(37));

            if (bussataPossibile() != 0) {
                visualizzaScope(bussataPossibile(), "green");
                for (let i = 1; i < 4; i++) {
                    document.getElementById("CG" + i).classList.add("selezioneMazziere");
                }
            }

            scope_giocatore += bussataPossibile();
            organizzaMani();

        }
    }
    else {
        if (mano_avversario.includes(-1))
            return;

        if (!bussato) {
            bussato = true;

            if (bussataPossibile() != 0) {
                visualizzaScope(bussataPossibile(), "red");
                for (let i = 1; i < 4; i++) {
                    document.getElementById("CB" + i).classList.add("selezioneMazziereAvversario");
                }
                scoperteAvversario = true;
                organizzaMani();
            }

            scope_avversario += bussataPossibile();

        }
    }
}

function matta(indice) {    // calcolo se la matta può essere usata per bussare
    if (turnoGiocatore) {
        let vecchioValore = mano_giocatore[indice];
        let nuovoValore = window.prompt("Hai la matta, puoi scegliere quanto farla valere in modo che ti consenta di bussare. Inserisci un numero da 1 a 10: ");
        mano_giocatore[indice] = Number(nuovoValore) + 30;
        if (nuovoValore < 1 || nuovoValore > 10 || bussataPossibile() == 0) {
            alert("Il valore inserito non è corretto o non permette di bussare");
            mano_giocatore[indice] = vecchioValore;
            return;
        }
        valoreMatta = nuovoValore;
    }
}

function bussataPossibile() {
    if (turnoGiocatore) {
        let punti = 0;

        if (mano_giocatore[0] % 10 == mano_giocatore[1] % 10 && mano_giocatore[0] % 10 == mano_giocatore[2] % 10) {
            punti += 10;
        }

        if ((modulo10(mano_giocatore[0]) + modulo10(mano_giocatore[1]) + modulo10(mano_giocatore[2]) < 10)) {
            punti += 3;
        }

        return punti;
    }
    else {
        let punti = 0;

        if (mano_avversario[0] % 10 == mano_avversario[1] % 10 && mano_avversario[0] % 10 == mano_avversario[2] % 10) {
            punti += 10;
        }

        if ((modulo10(mano_avversario[0]) + modulo10(mano_avversario[1]) + modulo10(mano_avversario[2]) < 10)) {
            punti += 3;
        }

        return punti;
    }
}

function modulo10(num) {    // funzione di ausilio per gestire bene il valore del re che deve valere 10 e non 0
    if (num % 10 == 0)
        return 10;
    return num % 10;
}

function puntiTavola() {    // funzione per prendere i punti in tavola alla prima mano se la somma è 15 o 30
    let somma = 0;
    let lunghezza = carte_in_tavola.length;
    let preso = false;

    for (let i = 0; i < lunghezza; i++) {
        if (carte_in_tavola[i] == 37) {
            mattaInTavola(i);
            organizzaCarte();
        }
        somma += modulo10(carte_in_tavola[i]);
    }
    if (mazziere) {
        if (somma == 15) {
            scope_giocatore++;
            visualizzaScope(1, "green");
            preso = true;
        }

        if (somma == 30) {
            scope_giocatore += 2;
            visualizzaScope(2, "green");
            preso = true;
        }
        if (preso) {
            for (let i = lunghezza - 1; i >= 0; i--) {
                document.getElementById(carte_in_tavola[i]).classList.add("selezioneMazziere");
                let x = carte_in_tavola.pop();
                carte_giocatore.push(x);
            }
        }
    }
    else {
        if (somma == 15) {

            scope_avversario++;
            visualizzaScope(1, "red");
            preso = true;
        }
        if (somma == 30) {
            scope_avversario += 2;
            visualizzaScope(2, "red");
            preso = true;
        }

        if (preso) {
            for (let i = lunghezza - 1; i >= 0; i--) {
                document.getElementById(carte_in_tavola[i]).classList.add("selezioneMazziereAvversario");
                let x = carte_in_tavola.pop();
                carte_avversario.push(x);
            }
        }
    }

    setTimeout(() => {
        organizzaCarte();
    }, 3000);


    return preso;
}

function bussataPossibileTavola() {
    let somma = 0;
    let lunghezza = carte_in_tavola.length;

    for (let i = 0; i < lunghezza; i++) {
        somma += modulo10(carte_in_tavola[i]);
    }

    if (somma == 15) {
        return true;
    }

    if (somma == 30) {
        return true;
    }

    return false;
}

function mattaInTavola(indice) {   // calcolo se la matta può essere usata in tavola per bussare
    if (mazziere) {
        let vecchioValore = carte_in_tavola[indice];
        let nuovoValore = window.prompt("La matta è in tavola, puoi scegliere quanto farla valere in modo che ti consenta di avere una somma di 15 o 30 in tavola. Inserisci un numero da 1 a 10: ");
        carte_in_tavola[indice] = Number(nuovoValore) + 30;
        if (nuovoValore < 1 || nuovoValore > 10 || bussataPossibileTavola() == false) {
            alert("Il valore inserito non è corretto o non permette di bussare");
            carte_in_tavola[indice] = vecchioValore;
            return;
        }
        valoreMatta = nuovoValore;
    }
}

function prossimo_round() {     // prepara il prossimo round se nessun giocatore ha ancora vinto
    nascondiPunteggio();
    inizializza();
    document.getElementById("procedi").disabled = true;
}

function controlloVittoria() {
    if (punteggioTotale_giocatore > punteggioTotale_avversario && punteggioTotale_giocatore >= PUNTEGGIO_VITTORIA) {
        document.getElementById("procedi").disabled = true;
        setTimeout(() => {
            finePartita("Hai vinto!");
        }, 5000);
        vinto();
        setTimeout(() => {
            window.location.href = "home.php";
        }, 10000);
    }
    else if (punteggioTotale_giocatore < punteggioTotale_avversario && punteggioTotale_avversario >= PUNTEGGIO_VITTORIA) {
        document.getElementById("procedi").disabled = true;
        setTimeout(() => {
            finePartita("Hai perso!");
        }, 5000);
        perso();
        setTimeout(() => {
            window.location.href = "home.php";
        }, 10000);
    }
}

function finePartita(str) {     // gestisce i div che indicano la vittoria/sconfitta
    let msg = document.createElement("div");
    msg.classList.add("fine");
    if (str == "Hai perso!") {
        msg.classList.add("perso");
    }
    else if (str == "Hai vinto!") {
        msg.classList.add("vinto");
    }
    msg.textContent = str;
    document.body.appendChild(msg);
}

function info() {       // apre manuale
    document.getElementById("img-info").classList.add("cliccato");
    setTimeout(() => {
        document.getElementById("img-info").classList.remove("cliccato");
    }, 300);

    setTimeout(() => {
        window.open("../manuale.html");
    }, 300);
}

function visualizzaPunti(id, punti, colore) {       // gestisce i punti a schermo man mano che si gioca
    let div = document.getElementById(id);
    div.textContent = punti;
    div.style.color = colore;
}

function visualizzaScope(num, col) {        // gestisce i punti a schermo a fine round
    document.getElementById("punti_scope").textContent = "+" + num;
    document.getElementById("punti_scope").style.color = col;
    setTimeout(() => {
        document.getElementById("punti_scope").textContent = "";
    }, 3000);
}