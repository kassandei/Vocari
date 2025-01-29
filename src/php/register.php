<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "web_chat_app";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$username = $_POST['username'];
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);
$color = $_POST['color'];

$sql = "INSERT INTO users (username, password, color) VALUES ('$username', '$password', '$color')";

if ($conn->query($sql) === TRUE) {
    echo "Registration successful";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>