<?php

require_once "autorizzazione.php";

$username = $_SESSION["username"];
        
$data = json_decode(file_get_contents("php://input"));

if (isset($data -> id)) {       // cambia il valore sql dell'immagine di profilo associata a un accoutn
    $id_img = $data -> id; 
    $sql = "UPDATE utenti SET imgprofilo = '$id_img' WHERE utente = '$username'";
    mysqli_query($conn, $sql);
    }
        
echo json_encode(["success" => true]);
?>