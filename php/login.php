<?php
session_start();

require_once "database.php";     // recupera le credenziali e controlla se la connessione al server funziona

if (!$conn) {
    header("Location: database.php");      // reindirizza a msg di errore
}

?>

<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="../css/account.css">
    <script src='../js/account.js'></script>
    <title>Cirulla - Login</title>
</head>

<body>
    <h1>Accedi al tuo account di Cirulla</h1>
    <div class="login">
        <form action="login.php" method="post">
            <label>Username: </label>
            <input class="barra" type="text" name="username">
            <br>
            <label>Password: </label>
            <input class="barra" type="password" name="password">
            <br>
            <input class="bottone" type="submit" name="submit" value="Accedi">
            <br>
        </form>
    </div>
    <div id="box-msg">
        <h2 id="msg"></h2> <!-- questo h2 viene modificato da js, è normale che sia inizialmente vuoto -->
        <a id="link1" href="register.php"></a>
    </div>
</body>

</html>

<?php

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["submit"])) {
    $username = $_POST["username"];
    $password = $_POST["password"];

    if (empty($username) || empty($password)) {

        echo "<script> messaggio(\"Username o password mancanti!\"); </script>";
    } else {
        $sql1 = "SELECT password FROM utenti WHERE utente = ?";
        if ($stmt = $conn->prepare($sql1)) {
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows == 0) {
                echo "<script> messaggio(\"Non sei ancora registrato, \"); </script>";
                echo "<script> accountNonEsiste(); </script>";
            } else {
                $row = $result->fetch_assoc();
                $hashed_password = $row["password"];

                if (password_verify($password, $hashed_password)) {
                    session_start();
                    $_SESSION["username"] = $username;
                    header("Location: home.php");
                } else {
                    echo "<script>  messaggio(\"Password errata!\"); </script>";
                }
                $stmt->close();
            }
        }
    }
}
mysqli_close($conn);
?>