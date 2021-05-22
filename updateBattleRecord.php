<?php
require "Constants.php";

//POSTデータから更新するテーブルと勝者を取得
$table = $_POST["table"];
$winner = $_POST["winner"];

// mysqlへ接続
$mysqli = new mysqli(HOST_NAME, USER_NAME, PASSWORD, DB_NAME);

// 接続状況をチェック
if ($mysqli->connect_error) {
    echo $mysqli->connect_error;
    exit();
} else {
    $mysqli->set_charset("utf8");
}

// AIが負の場合
if ($winner == "p") {
    // sql文
    $query = "insert into " . $table . "(win, lose, tie) values(0, 1, 0);";
}
// AIが勝ちの場合
if ($winner == "a") {
    // sql文
    $query = "insert into " . $table . "(win, lose, tie) values(1, 0, 0);";
}
// 引き分けの場合
if ($winner == "tie") {
    // sql文
    $query = "insert into " . $table . "(win, lose, tie) values(0, 0, 1);";
}

// sql実行
$mysqli->query($query);

// 切断
$mysqli->close();
?>