<?php

require_once "infoutente.php";

?>

<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="../css/home.css">
    <title>Cirulla - Home</title>
    <script src='../js/home.js'></script>
</head>

<body>
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
                <img id="propic" alt="Immagine del profilo" src="../img/profilo/1.png">
                <div class="user"><?php echo "$username" ?>
                    <p class="w">Vittorie: <?php echo "$vittorie" ?></p>
                    <p class="l">Sconfitte: <?php echo "$sconfitte" ?></p>
                    <p class="ws">Serie di vittorie: <?php echo "$serie" ?></p>
                </div>
            </div>
        </a>
        <a href="home.php"><img src="../img/icone/home.png" alt="Home"></a>
    </nav>

    <div id="gioca" class="mostra">
        <button class="gioca" onclick=gioca()>Gioca</button>
    </div>
</body>

</html>