<?php

require_once "infoutente.php";

?>

<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="../css/home.css">
    <link rel="stylesheet" type="text/css" href="../css/classifica.css">
    <script src='../js/classifica.js'></script>
    <title>Cirulla - Home</title>
</head>

<body onload=recuperaDati()>
    <div id="nascondi">
        Ingrandisci la finestra per un'esperienza ottimale
    </div>
    <nav class="menu mostra" id="nav">
        <img src="../img/icone/logo.png" alt="Cirulla">
        <a href="../manuale.html" target="_blank"><img src="../img/icone/info.png" alt="Informazioni"></a>
        <a href="logout.php"><img src="../img/icone/logout.png" alt="Esci"></a>
        <a href="classifica.php"><img src="../img/icone/classifica.png" alt="Classifica"></a>
        <a class="profilo" href="profilo.php">
            <img src="../img/icone/profilo.png" alt="Profilo">
            <div class="infobox">
                <img id="propic" alt="Immagine del profilo" src="../img/profilo/<?php echo "$imgprofilo" ?>.png">
                <div class="user"><?php echo "$username" ?>
                    <p class="w">Vittorie: <?php echo "$vittorie" ?></p>
                    <p class="l">Sconfitte: <?php echo "$sconfitte" ?></p>
                    <p class="ws">Serie di vittorie: <?php echo "$serie" ?></p>
                </div>
            </div>
        </a>
        <a href="home.php"><img src="../img/icone/home.png" alt="Home"></a>

    </nav>

    <div id="contenitore" class="mostra">
        <div id="ordina">
            <div>Ordina per:</div>
            <button onclick=ordina(0)>Vittorie</button>
            <button onclick=ordina(1)>Serie di Vittorie</button>
            <button onclick=ordina(2)>Rapporto Vittorie/Sconfitte</button>
        </div>

        <div id="classifica" class="mostra">
            <table id="tab">
                <thead>
                    <tr>
                        <td>Posizione</td>
                        <td>Utente</td>
                        <td>Vittorie</td>
                        <td>Sconfitte</td>
                        <td>V/S</td>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</body>

</html>