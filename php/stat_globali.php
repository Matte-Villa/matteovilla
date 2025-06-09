<?php               // recupera valori sql per tutti gli utenti al fine di creare la classifica

require_once "autorizzazione.php";

$sql = "SELECT imgprofilo, utente, vittorie, sconfitte, serie
        FROM utenti";
$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode(["error" => "Errore nella query"]);
    exit;
}

$records = array();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $records[] = $row;
    }
    echo json_encode($records);
} else {
    echo json_encode(["message" => "Tabella vuota"]);
}
