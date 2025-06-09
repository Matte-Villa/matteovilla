<?php
session_start();

require_once "database.php";

if (!$conn) {
    header("Location: database.php");      // reindirizza a msg di errore
}

if ($_SESSION["username"] == NULL) {
    header("Location: login.php");         // se non sei loggato ma in qualche modo sei qui torna indietro
}
