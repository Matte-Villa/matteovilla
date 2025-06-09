<?php

require_once "infoutente.php";

?>

<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="../css/home.css">
    <link rel="stylesheet" type="text/css" href="../css/profilo.css">
    <script src='../js/profilo.js'></script>
    <title>Cirulla - Home</title>
</head>

<body onload=generaListener()>
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

    <div id="profilo" class="mostra">
        <div id="top">
            <div id="box-propic">
                <img id="propic2" alt="Immagine del profilo" src="../img/profilo/<?php echo "$imgprofilo" ?>.png" width="100">
            </div>
            <div id="stats">
                <div id="user" class="stat">Utente: <strong><?php echo "$username" ?></strong></div>
                <div id="vittorie" class="stat">Vittorie: <strong><?php echo "$vittorie" ?></strong></div>
                <div id="sconfitte" class="stat">Sconfitte: <strong><?php echo "$sconfitte" ?></strong></div>
                <div id="serie" class="stat">Serie di vittorie: <strong><?php echo "$serie" ?></strong></div>
            </div>
        </div>
        <div id="mid">
            Cambia immagine del profilo
        </div>
        <div id="bot">
            <img id="img0" alt="Immagine profilo 1" class="pointer" src="../img/profilo/0.png" width="100" height="100">
            <img id="img1" alt="Immagine profilo 2" class="pointer" src="../img/profilo/1.png" width="100" height="100">
            <img id="img2" alt="Immagine profilo 3" class="pointer" src="../img/profilo/2.png" width="100" height="100">
            <img id="img3" alt="Immagine profilo 4" class="pointer" src="../img/profilo/3.png" width="100" height="100">
        </div>
    </div>
</body>

</html>