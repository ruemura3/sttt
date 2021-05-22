var isPlayerTurn; // プレイヤーのターンであるフラグ
var isPlayerCircle; // プレイヤーがマルであるフラグ
var board = ["", "", "", "", "", "", "", "", ""]; // ボード状況
let player = "p"; // プレイヤーを表す文字列
let ai = "a"; // AIを表す文字列
let tie = "tie" // 引き分けを表す文字列
let getUrl = "https://ruemura3.com/sttt/getBattleRecord.php"; // 戦績取得APIのURL
let updateUrl = "https://ruemura3.com/sttt/updateBattleRecord.php"; // 戦績更新APIのURL
// 戦績を管理するテーブル名
let table = "stupid_records"; // アホ
// let table = "strongest_records"; // 最強

// ページ読み込みが終わったあとに走る処理
window.onload = function() {
    // 戦績表示
    displayBattleRecord();

    // 画面初期化
    initDisplay();

    // スタート画面を表示
    displayFirst();

    // スタートボタン押下時処理
    $("#startButton").on("click", function() {
        displaySecond();
        decideFirstSecond();
    });

    // OKボタン押下時処理
    $("#okButton").on("click", function() {
        displayThird();
        if (isPlayerTurn) {
            updateTurnMessage();
        } else {
            aisAct();
        };
    });

    // マス0押下時処理
    $("#square0").on("click", function() {
        act(0);
    });

    // マス1押下時処理
    $("#square1").on("click", function() {
        act(1);
    });

    // マス2押下時処理
    $("#square2").on("click", function() {
        act(2);
    });

    // マス3押下時処理
    $("#square3").on("click", function() {
        act(3);
    });

    // マス4押下時処理
    $("#square4").on("click", function() {
        act(4);
    });

    // マス5押下時処理
    $("#square5").on("click", function() {
        act(5);
    });

    // マス6押下時処理
    $("#square6").on("click", function() {
        act(6);
    });

    // マス7押下時処理
    $("#square7").on("click", function() {
        act(7);
    });

    // マス8押下時処理
    $("#square8").on("click", function() {
        act(8);
    });
};

// 画面初期化
function initDisplay() {
    $("#firstBoard").hide();
    $("#secondBoard").hide();
    $("#thirdBoard").hide();
};

// スタート画面を表示
function displayFirst() {
    $('#firstBoard').fadeIn("slow");
    $('#secondBoard').hide();
    $('#thirdBoard').hide();
};

// 先行後攻画面を表示
function displaySecond() {
    $('#firstBoard').hide();
    $('#secondBoard').fadeIn("slow");
    $('#thirdBoard').hide();
};

// ゲーム画面表示
function displayThird() {
    $('#firstBoard').hide();
    $('#secondBoard').hide();
    $('#thirdBoard').fadeIn("slow");
    $("#restart").css("visibility", "hidden");
};

// 戦績表示
function displayBattleRecord() {
    // ajaxでバックエンドと通信して戦績取得
    $.ajax({
        url: getUrl,
        type: "post",
        dataType: "text",
        data:{"table": table}
    }).done(function (response) {
        var rtn = JSON.parse(response);
        $('#win').html(rtn.win);
        $('#lose').html(rtn.lose);
        $('#tie').html(rtn.tie);
    }).fail(function (xhr,textStatus,errorThrown) {
        $("#record").html("取得に失敗しました");
    });
};

// 戦績更新
function updateBattleRecord(winner) {
    // ajaxでバックエンドと通信して戦績更新
    $.ajax({
        url: updateUrl,
        type: "post",
        dataType: "text",
        data:{"table": table, "winner": winner}
    }).done(function (response) {
        displayBattleRecord();
    }).fail(function (xhr,textStatus,errorThrown) {
        alert("戦績の更新に失敗しました");
    });
};

// 先攻後攻決め
function decideFirstSecond() {
    $("#okButton").css("visibility", "hidden");
    if (isPlayerCircle) {
        isPlayerTurn = false;
        isPlayerCircle = false;
        $("#firstSecond").css("color", "blue");
        $("#firstSecond").html("後攻 ×");
    } else {
        isPlayerTurn = true;
        isPlayerCircle = true;
        $("#firstSecond").css("color", "red");
        $("#firstSecond").html("先攻 ○");
    }
    if (Math.random() >= 0.5) {
        isPlayerTurn = true;
        isPlayerCircle = true;
        $("#firstSecond").css("color", "red");
        $("#firstSecond").html("先攻 ○");
    } else {
        isPlayerTurn = false;
        isPlayerCircle = false;
        $("#firstSecond").css("color", "blue");
        $("#firstSecond").html("後攻 ×");
    };
    $("#okButton").css("visibility", "visible");
};

// どちらの番か表示を更新する
function updateTurnMessage() {
    if (isPlayerTurn) {
        $("#gameMessage").html("あなたの番です");
        $("#gameMessage").css("color", "black");
    } else {
        $("#gameMessage").html("最強AIの番です");
        $("#gameMessage").css("color", "black");
    };
};

// 行動する
function act(square) {
    // プレイヤーのターンではない場合はreturn
    if (!isPlayerTurn) {
        return;
    };

    // すでにチェックが付いているマスの場合はそのままreturn
    if (board[square] != "") {
        return;
    };

    // プレイヤーの行動
    playersAct(square);

    // 勝敗判定
    if (judge()) {
        return
    }
    
    // AIの行動
    aisAct();

    // 勝敗判定
    if (judge()) {
        return
    }
};

// プレイヤーの行動
function playersAct(square) {
    // 内部ボードを更新する
    updateInternalBoard(true, square);

    // ボードを更新する
    updateBoard();

    // プレイヤーターンフラグをfalseにする
    isPlayerTurn = false;

    // ゲームメッセージを更新する
    updateTurnMessage();
};

// AIの行動
function aisAct() {
    // マークを付ける場所を見つける
    const square = findOptimalSolution()

    // 内部ボードを更新する
    updateInternalBoard(false, square);

    // ボードを更新する
    updateBoard();

    // プレイヤーターンフラグをtrueにする
    isPlayerTurn = true;

    // ゲームメッセージを更新する
    updateTurnMessage();
};

// 内部ボードを更新する
function updateInternalBoard(isPlayer, square) {
    if (isPlayer) {
        board[square] = player
    } else {
        board[square] = ai
    }
}

// ボードを更新する
function updateBoard() {
    // 全てのマスに対して
    board.forEach((elem, index) => {
        // 「p：プレイヤー」の場合
        if (elem == "p") {
            var id = "#square" + index;
            if (isPlayerCircle) {
                $(id).html("○");
                $(id).css("color", "red");
            } else {
                $(id).html("×");
                $(id).css("color", "blue");
            };
        };
        // 「a：AI」の場合
        if (elem == "a") {
            var id = "#square" + index;
            if (!isPlayerCircle) {
                $(id).html("○");
                $(id).css("color", "red");
            } else {
                $(id).html("×");
                $(id).css("color", "blue");
            };
        };
    });
};

// 引数と一致する文字の全てのインデックスをボード配列から返す
function myFindIndex(value) {
    // valueと一致する要素を含むインデックス全て
    const rtn = board.reduce(function(stock, current, index) {
        if (current === value) {
            stock.push(index);
        };
        return stock;
    }, []);
    return rtn;
};

// 決着がついたかを判断し、ついた場合は結果表示と戦績反映
function judge() {
    // 勝者を取得
    let winner = judgeWinOrLoseOrTie();

    // 勝者がいない場合はreturn
    if (winner == "") {
        return false;
    };

    // 終了処理
    finishGame();

    // 戦績反映
    updateBattleRecord(winner);

    // 結果表示
    showResult(winner);

    return true;
};

// 勝敗を判定する
function judgeWinOrLoseOrTie() {
    // 横上
    if (board[0] != "" && board[0] == board[1] && board[0] == board[2]) {
        showResultBoard(board[0], 0, 1, 2);
        return board[0];
    };
    // 横中
    if (board[3] != "" && board[3] == board[4] && board[3] == board[5]) {
        showResultBoard(board[3], 3, 4, 5);
        return board[3];
    };
    // 横下
    if (board[6] != "" && board[6] == board[7] && board[6] == board[8]) {
        showResultBoard(board[6], 6, 7, 8);
        return board[6];
    };
    // 縦左
    if (board[0] != "" && board[0] == board[3] && board[0] == board[6]) {
        showResultBoard(board[0], 0, 3, 6);
        return board[0];
    };
    // 縦中
    if (board[1] != "" && board[1] == board[4] && board[1] == board[7]) {
        showResultBoard(board[1], 1, 4, 7);
        return board[1];
    };
    // 縦右
    if (board[2] != "" && board[2] == board[5] && board[2] == board[8]) {
        showResultBoard(board[2], 2, 5, 8);
        return board[2];
    };
    // 斜め
    if (board[0] != "" && board[0] == board[4] && board[0] == board[8]) {
        showResultBoard(board[0], 0, 4, 8);
        return board[0];
    };
    // 斜め
    if (board[2] != "" && board[2] == board[4] && board[2] == board[6]) {
        showResultBoard(board[2], 2, 4, 6);
        return board[2];
    };
    // 引き分け
    if (myFindIndex("").length == 0) {
        return tie;
    }
    // 勝負がついていない
    return "";
};

// 3つ揃ったマスをハイライト
function showResultBoard(winner, square1, square2, square3) {
    if (winner == player) {
        if(isPlayerCircle) {
            $("#square" + square1).css("background-color", "#ffe5e5");
            $("#square" + square2).css("background-color", "#ffe5e5");
            $("#square" + square3).css("background-color", "#ffe5e5");
        } else {
            $("#square" + square1).css("background-color", "#e5e5ff");
            $("#square" + square2).css("background-color", "#e5e5ff");
            $("#square" + square3).css("background-color", "#e5e5ff");
        }
    } else {
        if(!isPlayerCircle) {
            $("#square" + square1).css("background-color", "#ffe5e5");
            $("#square" + square2).css("background-color", "#ffe5e5");
            $("#square" + square3).css("background-color", "#ffe5e5");
        } else {
            $("#square" + square1).css("background-color", "#e5e5ff");
            $("#square" + square2).css("background-color", "#e5e5ff");
            $("#square" + square3).css("background-color", "#e5e5ff");
        }
    }
}

// ゲーム終了処理
function finishGame() {
    // マス0押下時処理
    $("#square0").on("click", function() {
        return;
    });
    // マス1押下時処理
    $("#square1").on("click", function() {
        return;
    });
    // マス2押下時処理
    $("#square2").on("click", function() {
        return;
    });
    // マス3押下時処理
    $("#square3").on("click", function() {
        return;
    });
    // マス4押下時処理
    $("#square4").on("click", function() {
        return;
    });
    // マス5押下時処理
    $("#square5").on("click", function() {
        return;
    });
    // マス6押下時処理
    $("#square6").on("click", function() {
        return;
    });
    // マス7押下時処理
    $("#square7").on("click", function() {
        return;
    });
    // マス8押下時処理
    $("#square8").on("click", function() {
        return;
    });
};

// 結果表示
function showResult(winner) {
    if (winner == player) {
        $("#gameMessage").html("YOU WIN!!");
        $("#gameMessage").css("color", "red");
    };
    if (winner == ai) {
        $("#gameMessage").html("YOU LOSE...");
        $("#gameMessage").css("color", "blue");
    };
    if (winner == tie) {
        $("#gameMessage").html("DRAW");
        $("#gameMessage").css("color", "green");
    };
    $("#restart").css("visibility", "visible");
};

// 指定ミリ秒だけ処理を止める
function sleep(waitMsec) {
    var startMsec = new Date();
   
    // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
    while (new Date() - startMsec < waitMsec);
};

// 最適解を見つける
function findOptimalSolution() {
    // アホのAI
    if (table == "stupid_records") {
        var rtn;
        var array = myFindIndex("");
        rtn = array[Math.floor(Math.random() * array.length)];
        return rtn;
    }
};
