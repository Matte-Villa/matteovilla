// funzioni che aggiungono link e messaggi alle pagine di accesso

function messaggio(stringa) {       
    document.getElementById("link1").textContent = "";
    document.getElementById("msg").textContent = stringa;
}

function accountEsistente() {
    document.getElementById("link1").textContent = "Accedi ora!";
}

function accountNonEsiste() {
    document.getElementById("link1").textContent = "Registrati ora!";
}