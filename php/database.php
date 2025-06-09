<?php

$db_server = getenv("DB_HOST");
$db_user = getenv("DB_USER");
$db_pass = getenv("DB_PASS");
$db_name   = getenv("DB_NAME");

try {
    $conn = @mysqli_connect(
        $db_server,        // ho usato @ per eliminare un warning php
        $db_user,
        $db_pass,
        $db_name
    );

    if (!$conn) {
        throw new Exception("Errore nella connessione al database! <br>");
    }
} catch (Exception $e) {
    echo $e->getMessage();     // funzione che prende il msg personalizzato sopra
}
