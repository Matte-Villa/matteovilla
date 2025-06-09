<?php
session_start();
require_once "database.php";

$errore = "";
$esistente = false;

// Se la connessione fallisce, reindirizza
if (!$conn) {
    header("Location: database.php");
    exit;
}

// Gestione del form
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["submit"])) {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);

    if (empty($username) || empty($password)) {
        $errore = "Username o password mancanti!";
    } else {
        $sql1 = "SELECT utente FROM utenti WHERE utente = ?";
        if ($stmt = $conn->prepare($sql1)) {
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $errore = "Questo utente è già registrato. Sei tu?";
                $esistente = true;
            } else {
                $sql2 = "INSERT INTO utenti (utente, password) VALUES (?, ?)";
                if ($stmt2 = $conn->prepare($sql2)) {
                    $hash = password_hash($password, PASSWORD_BCRYPT);
                    $stmt2->bind_param("ss", $username, $hash);
                    if ($stmt2->execute()) {
                        $_SESSION["username"] = $username;
                        header("Location: home.php");
                        exit;
                    }
                    $stmt2->close();
                }
            }

            $stmt->close();
            mysqli_close($conn);
        }
    }
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="../css/account.css">
    <script src='../js/account.js'></script>
    <title>Cirulla - Crea account</title>
</head>
<body>
    <h1>Crea un nuovo account di Cirulla</h1>
    <div class="login">
        <form action="register.php" method="post">
            <label>Username: </label>
            <input class="barra" type="text" name="username" required>
            <br>
            <label>Password: </label>
            <input class="barra" type="password" name="password" required>
            <br>
            <input class="bottone" type="submit" name="submit" value="Crea account">
            <br>
        </form>
    </div>
    <div id="box-msg">
        <h2 id="msg"></h2>
        <a id="link1" href="login.php"></a>
    </div>

    <?php if (!empty($errore)): ?>
        <script> messaggio("<?= $errore ?>"); </script>
        <?php if ($esistente): ?>
            <script> accountEsistente(); </script>
        <?php endif; ?>
    <?php endif; ?>
</body>
</html>