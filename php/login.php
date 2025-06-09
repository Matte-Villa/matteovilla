<?php
session_start();
require_once "database.php";

$errore = "";
$accountInesistente = false;

// Se la connessione fallisce, reindirizza
if (!$conn) {
    header("Location: database.php");
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["submit"])) {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);

    if (empty($username) || empty($password)) {
        $errore = "Username o password mancanti!";
    } else {
        $sql1 = "SELECT password FROM utenti WHERE utente = ?";
        if ($stmt = $conn->prepare($sql1)) {
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows == 0) {
                $errore = "Non sei ancora registrato.";
                $accountInesistente = true;
            } else {
                $row = $result->fetch_assoc();
                $hashed_password = $row["password"];

                if (password_verify($password, $hashed_password)) {
                    $_SESSION["username"] = $username;
                    header("Location: home.php");
                    exit;
                } else {
                    $errore = "Password errata!";
                }
            }

            $stmt->close();
        }
    }
}

mysqli_close($conn);
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
            <input class="barra" type="text" name="username" required>
            <br>
            <label>Password: </label>
            <input class="barra" type="password" name="password" required>
            <br>
            <input class="bottone" type="submit" name="submit" value="Accedi">
            <br>
        </form>
    </div>
    <div id="box-msg">
        <h2 id="msg"></h2>
        <a id="link1" href="register.php"></a>
    </div>

    <?php if (!empty($errore)): ?>
        <script> messaggio("<?= $errore ?>"); </script>
        <?php if ($accountInesistente): ?>
            <script> accountNonEsiste(); </script>
        <?php endif; ?>
    <?php endif; ?>
</body>
</html>