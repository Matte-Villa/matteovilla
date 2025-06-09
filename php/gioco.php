<?php

require_once "autorizzazione.php";

?>


<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="../css/gioco.css">
    <title>Gioca a Cirulla</title>
    <script src="../js/gioco.js"></script>
</head>

<body onload=inizializza()>
    <div id="nascondi">
        Ingrandisci la finestra per un'esperienza ottimale
    </div>
    <div id="top" class="mostra">
        <table class="mano" id="mano-top">
            <tr id="trB">
                <td id="CB1"></td>
                <td id="CB2"></td>
                <td id="CB3"></td>
            </tr> <!-- CB1, Carta 1 del Bot -->
        </table>
    </div>
    <div id="box-tavolo" class="mostra">
        <div id="tavolo">
            <div id="mazzo">
                <img src="../img/carte/mazzo.png" alt="mazzo" width="173" height="180">
                <div id="quante">
                </div>
            </div>

            <div id="punti_scope">

            </div>

            <div id="tabellone">
                <table id="campogioco">
                </table>
            </div>

            <div class="pointer" id="box-bussata">
                <img class="icona" id="img-bussa" src="../img/icone/bussa.png" alt="Arrenditi" width="100" height="100">
            </div>

            <div class="pointer" id="resa">
                <img class="icona" id="img-resa" src="../img/icone/resa.png" alt="Arrenditi" width="75" height="75">
            </div>

            <div class="pointer" id="info">
                <img class="icona" id="img-info" src="../img/icone/info.png" alt="Regole" width="75" height="75">
            </div>

            <div class="pointer" id="prendi">
                <img class="icona" id="img-prendi" src="../img/icone/prendi.png" alt="Prendi" width="200" height="200">
            </div>

        </div>
        <div id="punti" style="display: none">
            <div id="punti_sx" class="colonna_desc">
                <div></div>
                <div id="PT0"></div>
                <div id="PT1"></div>
                <div id="PT2"></div>
                <div id="PT3"></div>
                <div id="PT4"></div>
                <div id="PT5"></div>
                <div id="PT6"></div>
                <div id="PT7"></div>
                <div id="PT8"></div>
            </div>
            <div id="desc_punti" class="colonna_desc">
                <div></div>
                <div>Sette Bello</div>
                <div>Mattoni</div>
                <div>Primiera</div>
                <div>Carte</div>
                <div>Piccola</div>
                <div>Grande</div>
                <div>Scope</div>
                <div>Punteggio</div>
                <div>Punteggio attuale</div>
            </div>
            <div id="puntiG" class="colonna_punti">
                <div class="profilo"><img class="propic" alt="Immagine del profilo" src="../img/profilo/2.png" width="50"><?php echo $_SESSION["username"] ?></div>
                <div class="Sette"></div>
                <div class="Mattoni"></div>
                <div class="Primiera"></div>
                <div class="Carte"></div>
                <div class="Piccola"></div>
                <div class="Grande"></div>
                <div class="Scope"></div>
                <div class="Punteggio"></div>
                <div class="Punteggio_attuale"></div>
            </div>
            <div id="puntiB" class="colonna_punti">
                <div class="profilo"><img class="propic" alt="Immagine del profilo avversario"  src="../img/profilo/bot.png" width="50">Bot</div>
                <div class="Sette"></div>
                <div class="Mattoni"></div>
                <div class="Primiera"></div>
                <div class="Carte"></div>
                <div class="Piccola"></div>
                <div class="Grande"></div>
                <div class="Scope"></div>
                <div class="Punteggio"></div>
                <div class="Punteggio_attuale"></div>
            </div>
            <button id="procedi" onclick=prossimo_round() disabled>Prossimo round</button>
        </div>
    </div>
    <div id="bot" class="mostra">
        <table class="mano" id="mano-bot">
            <tr id="trG">
                <td id="CG1" class="pointer"></td>
                <td id="CG2" class="pointer"></td>
                <td id="CG3" class="pointer"></td>
            </tr> <!-- CG1, Carta 1 del Giocatore -->
        </table>
    </div>
    <div id="risultato" hidden>
    </div>
</body>

</html>