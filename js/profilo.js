function generaListener() {

    const QUANTITA_IMMAGINI = 3;

    for (let i = 0; i <= QUANTITA_IMMAGINI; i++) {
        document.getElementById("img" + i).addEventListener("click", function () {
            const id_img = i;

            const data = {      // creo oggetto
                id: id_img
            };

            fetch('cambia_propic.php', {   // uso fetch per inviare i dati al server
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // indico che sto inviando json
                },
                body: JSON.stringify(data) // converto l'oggetto
            })
                .then(risposta => {
                    return risposta.json().catch(error => {      // verifico se la risposta è json
                        throw new Error("Risposta non jsom");
                    })
                });

            location.reload(true);

        })

    }

}