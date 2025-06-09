<?php

require_once "autorizzazione.php";

$username = $_SESSION["username"];

$sql1 = "SELECT imgprofilo
         FROM utenti
         WHERE utente = '$username'";       // recupera valori sql per un singolo utente

$sql2 = "SELECT vittorie
         FROM utenti
         WHERE utente = '$username'";

$sql3 = "SELECT sconfitte
         FROM utenti
         WHERE utente = '$username'";

$sql4 = "SELECT serie
         FROM utenti
         WHERE utente = '$username'";


$query1 = mysqli_query($conn, $sql1);

$imgprofilo = mysqli_fetch_assoc($query1)["imgprofilo"];

$query2 = mysqli_query($conn, $sql2);

$vittorie = mysqli_fetch_assoc($query2)["vittorie"];

$_SESSION["vittorie"] = $vittorie;

$query3 = mysqli_query($conn, $sql3);

$sconfitte = mysqli_fetch_assoc($query3)["sconfitte"];

$_SESSION["sconfitte"] = $sconfitte;

$query4 = mysqli_query($conn, $sql4);

$serie = mysqli_fetch_assoc($query4)["serie"];

$_SESSION["serie"] = $serie;
