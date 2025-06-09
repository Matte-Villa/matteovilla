<?php
session_start();

require_once "database.php";     // recupera le credenziali e controlla se la connessione al server funziona

if (!$conn) {
    header("Location: database.php");      // reindirizza a msg di errore
}

$sql1 = "UPDATE utenti
         SET vittorie = " . ($_SESSION["vittorie"] + 1) . ", 
             serie = " . ($_SESSION["serie"] + 1) . "
         WHERE utente = '" . $_SESSION["username"] . "'";   // concatenazione con .

$query1 = mysqli_query($conn, $sql1);

echo json_encode(["success" => true]);
