<?php
require "Constants.php";

// POSTデータから取得するテーブルを取得
$table = $_POST["table"];

// mysqlへ接続
$mysqli = new mysqli(HOST_NAME, USER_NAME, PASSWORD, DB_NAME);

// 接続状況をチェック
if ($mysqli->connect_error) {
    echo $mysqli->connect_error;
    exit();
} else {
    $mysqli->set_charset("utf8");
}

// sql文
$query = "select sum(win) as win, sum(lose) as lose, sum(tie) as tie from " . $table . ";";

// sql実行
if ($data = $mysqli->query($query)) {
    // 連想配列を取得
    while ($row = $data->fetch_assoc()) {
        $rtn = ["win" => $row["win"], "lose" => $row["lose"], "tie" => $row["tie"]];
        echo json_encode($rtn);
    }
    // 結果セットを閉じる
    $data->close();
}

// 切断
$mysqli->close();
?>