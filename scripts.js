var isPlayerTurn; // プレイヤーのターンであるフラグ
var isPlayerCircle; // プレイヤーがマルであるフラグ
let player = "p"; // プレイヤーを表す文字列
let ai = "a"; // AIを表す文字列
let empty = "";
var board = [empty,empty,empty,empty,empty,empty,empty,empty,empty]; // ボード状況
let tie = "tie" // 引き分けを表す文字列
let urlRoot = "" // APIのルートURL（GitHubには載せない）
let getUrl = urlRoot + "getBattleRecord.php"; // 戦績取得APIのURL
let updateUrl = urlRoot + "updateBattleRecord.php"; // 戦績更新APIのURL

// AIのモード
// let mode = "stupid"; // アホ
let mode = "strongest"; // 最強

// ページ読み込みが終わったあとに走る処理
window.onload = function() {
    init();
};

function init() {
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
            // AIの行動
            setTimeout(aisAct, 300);
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
    var message;
    if (mode == "stupid") {
        message = "アホAIの戦績"
    };
    if (mode == "strongest") {
        message = "最強AIの戦績"
    };
    $("#recordMode").html(message)

    // ajaxでバックエンドと通信して戦績取得
    $.ajax({
        url: getUrl,
        type: "post",
        dataType: "text",
        data:{"table": mode + "_records"}
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
        data:{"table": mode + "_records", "winner": winner}
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
        var message;
        if (mode == "stupid") {
            message = "アホAIの番です"
        };
        if (mode == "strongest") {
            message = "最強AIの番です"
        };
        $("#gameMessage").html(message);
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
    if (board[square] != empty) {
        return;
    };

    // プレイヤーの行動
    playersAct(square);

    // 勝敗判定
    if (judge()) {
        return
    }

    // AIの行動
    setTimeout(aisAct, 300);
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

    // 勝敗判定
    judge();
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
        if (elem == player) {
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
        if (elem == ai) {
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
    if (winner == empty) {
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
    if (board[0] != empty && board[0] == board[1] && board[0] == board[2]) {
        showResultBoard(board[0], 0, 1, 2);
        return board[0];
    };
    // 横中
    if (board[3] != empty && board[3] == board[4] && board[3] == board[5]) {
        showResultBoard(board[3], 3, 4, 5);
        return board[3];
    };
    // 横下
    if (board[6] != empty && board[6] == board[7] && board[6] == board[8]) {
        showResultBoard(board[6], 6, 7, 8);
        return board[6];
    };
    // 縦左
    if (board[0] != empty && board[0] == board[3] && board[0] == board[6]) {
        showResultBoard(board[0], 0, 3, 6);
        return board[0];
    };
    // 縦中
    if (board[1] != empty && board[1] == board[4] && board[1] == board[7]) {
        showResultBoard(board[1], 1, 4, 7);
        return board[1];
    };
    // 縦右
    if (board[2] != empty && board[2] == board[5] && board[2] == board[8]) {
        showResultBoard(board[2], 2, 5, 8);
        return board[2];
    };
    // 斜め
    if (board[0] != empty && board[0] == board[4] && board[0] == board[8]) {
        showResultBoard(board[0], 0, 4, 8);
        return board[0];
    };
    // 斜め
    if (board[2] != empty && board[2] == board[4] && board[2] == board[6]) {
        showResultBoard(board[2], 2, 4, 6);
        return board[2];
    };
    // 引き分け
    if (myFindIndex(empty).length == 0) {
        return tie;
    }
    // 勝負がついていない
    return empty;
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
    $("#square0").off("click");
    $("#square1").off("click");
    $("#square2").off("click");
    $("#square3").off("click");
    $("#square4").off("click");
    $("#square5").off("click");
    $("#square6").off("click");
    $("#square7").off("click");
    $("#square8").off("click");
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
    if (mode == "stupid") {
        return getRandom();
    };

    // 最強のAI（プログラムの構成として改善の余地ありまくり）
    if (mode == "strongest") {
        var rtn;

        // AIが1手目の場合
        if (myFindIndex(empty).length == 9) {
            // 角か真ん中のどこかを取る
            rtn = getRandomFrom([0, 2, 4, 6, 8]);
            return rtn;
        };

        // AIが2手目の場合
        if (myFindIndex(empty).length == 8) {
            let playerIndex = myFindIndex(player)[0];
            // 角を取られていたら真ん中を取る
            if (playerIndex == 0 || playerIndex == 2 || playerIndex == 6 || playerIndex == 8) {
                return 4;
            }
            // 真ん中を取られていたら角のどこかを取る
            else if (playerIndex == [4]) {
                rtn = getRandomFrom([0, 2, 6, 8]);
                return rtn;
            }
            // 壁を取られていたら真ん中を取る
            else {
                return 4;
            };
        };

        // AIが3手目の場合
        if (myFindIndex(empty).length == 7) {
            let aiIndex = myFindIndex(ai)[0];
            let playerIndex = myFindIndex(player)[0];
            // 1手目に真ん中を取った場合
            if (aiIndex == 4) {
                // プレイヤーが壁を取ったら反対の壁以外のどこかを取る
                if (playerIndex == 1) {
                    rtn = getRandomFrom([0, 2, 3, 5, 6, 8]);
                    return rtn;
                };
                if (playerIndex == 3) {
                    rtn = getRandomFrom([0, 1, 2, 6, 7, 8]);
                    return rtn;
                };
                if (playerIndex == 5) {
                    rtn = getRandomFrom([0, 1, 2, 6, 7, 8]);
                    return rtn;
                };
                if (playerIndex == 7) {
                    rtn = getRandomFrom([0, 2, 3, 5, 6, 8]);
                    return rtn;
                };
                // プレイヤーが角を取ったら反対の角以外のどこかを取る
                if (playerIndex == 0) {
                    rtn = getRandomFrom([1, 2, 3, 5, 6, 7]);
                    return rtn;
                };
                if (playerIndex == 2) {
                    rtn = getRandomFrom([0, 1, 3, 5, 7, 8]);
                    return rtn;
                };
                if (playerIndex == 6) {
                    rtn = getRandomFrom([0, 1, 3, 5, 7, 8]);
                    return rtn;
                };
                if (playerIndex == 8) {
                    rtn = getRandomFrom([1, 2, 3, 5, 6, 7]);
                    return rtn;
                };
            }
            // 1手目に角を取った場合
            else if (aiIndex == 0) {
                // 隣の角とその隣接した壁のどちらかを取られたときは反対の角を取る
                if (playerIndex == 1 || playerIndex == 2 || playerIndex == 5) {
                    return 6;
                };
                if (playerIndex == 3 || playerIndex == 6 || playerIndex == 7) {
                    return 2;
                };
                // 反対の角を取られたときはその他の角のどちらかを取る
                if (playerIndex == 8) {
                    rtn = getRandomFrom([2, 6]);
                    return rtn;
                };
                // 真ん中を取られたときはリーチができる場所に置く
                if (playerIndex == 4) {
                    rtn = getRandomFrom([1, 2, 3, 6]);
                    return rtn;
                };
            } else if (aiIndex == 2) {
                if (playerIndex == 0 || playerIndex == 1 || playerIndex == 3) {
                    return 8;
                };
                if (playerIndex == 5 || playerIndex == 7 || playerIndex == 8) {
                    return 0;
                };
                if (playerIndex == 6) {
                    rtn = getRandomFrom([0, 8]);
                    return rtn;
                };
                if (playerIndex == 4) {
                    rtn = getRandomFrom([0, 1, 5, 8]);
                    return rtn;
                };
            } else if (aiIndex == 6) {
                if (playerIndex == 0 || playerIndex == 1 || playerIndex == 3) {
                    return 8;
                };
                if (playerIndex == 5 || playerIndex == 7 || playerIndex == 8) {
                    return 0;
                };
                if (playerIndex == 2) {
                    rtn = getRandomFrom([0, 8]);
                    return rtn;
                };
                if (playerIndex == 4) {
                    rtn = getRandomFrom([0, 3, 7, 8]);
                    return rtn;
                };
            } else if (aiIndex == 8) {
                if (playerIndex == 1 || playerIndex == 2 || playerIndex == 5) {
                    return 6;
                };
                if (playerIndex == 3 || playerIndex == 6 || playerIndex == 7) {
                    return 2;
                };
                if (playerIndex == 0) {
                    rtn = getRandomFrom([2, 6]);
                    return rtn;
                };
                if (playerIndex == 4) {
                    rtn = getRandomFrom([2, 5, 6, 7]);
                    return rtn;
                };
            };
        };

        // AIにリーチがある場合
        var reaches = findReaches(board, ai);
        if (reaches.length != 0) {
            rtn = getRandomFrom(reaches);
            return rtn;
        };
        // プレイヤーにリーチがある場合
        var reaches = findReaches(board, player);
        if (reaches.length != 0) {
            rtn = getRandomFrom(reaches);
            return rtn;
        };
        // AIがダブルリーチにできる所があれば取る
        var doubleReaches = findDoubleReaches(ai);
        if (doubleReaches.length != 0) {
            rtn = getRandomFrom(doubleReaches);
            return rtn;
        };
        // プレイヤーがダブルリーチにできる所があれば取る
        var doubleReaches = findDoubleReaches(player);
        if (doubleReaches.length != 0) {
            rtn = getRandomFrom(doubleReaches);
            return rtn;
        };
        // それ以外の場合はリーチにできる場所にランダムに置く
        var places = findCanReaches();
        if (places.length != 0) {
            rtn = getRandomFrom(places);
            return rtn;
        };
        // 空いているマスをランダムに返す
        rtn = getRandom();
        return rtn;
    };
};

// リーチを見つける
function findReaches(board, player) {
    var rtn = [];
    // 横上
    if (board[0] == player && board[1] == player && board[2] == empty) {
        rtn.push(2);
    };
    if (board[0] == player && board[1] == empty && board[2] == player) {
        rtn.push(1);
    };
    if (board[0] == empty && board[1] == player && board[2] == player) {
        rtn.push(0);
    };
    // 横中
    if (board[3] == player && board[4] == player && board[5] == empty) {
        rtn.push(5);
    };
    if (board[3] == player && board[4] == empty && board[5] == player) {
        rtn.push(4);
    };
    if (board[3] == empty && board[4] == player && board[5] == player) {
        rtn.push(3);
    };
    // 横下
    if (board[6] == player && board[7] == player && board[8] == empty) {
        rtn.push(8);
    };
    if (board[6] == player && board[7] == empty && board[8] == player) {
        rtn.push(7);
    };
    if (board[6] == empty && board[7] == player && board[8] == player) {
        rtn.push(6);
    };
    // 縦左
    if (board[0] == player && board[3] == player && board[6] == empty) {
        rtn.push(6);
    };
    if (board[0] == player && board[3] == empty && board[6] == player) {
        rtn.push(3);
    };
    if (board[0] == empty && board[3] == player && board[6] == player) {
        rtn.push(0);
    };
    // 縦中
    if (board[1] == player && board[4] == player && board[7] == empty) {
        rtn.push(7);
    };
    if (board[1] == player && board[4] == empty && board[7] == player) {
        rtn.push(4);
    };
    if (board[1] == empty && board[4] == player && board[7] == player) {
        rtn.push(1);
    };
    // 縦右
    if (board[2] == player && board[5] == player && board[8] == empty) {
        rtn.push(8);
    };
    if (board[2] == player && board[5] == empty && board[8] == player) {
        rtn.push(5);
    };
    if (board[2] == empty && board[5] == player && board[8] == player) {
        rtn.push(2);
    };
    // 斜め
    if (board[0] == player && board[4] == player && board[8] == empty) {
        rtn.push(8);
    };
    if (board[0] == player && board[4] == empty && board[8] == player) {
        rtn.push(4);
    };
    if (board[0] == empty && board[4] == player && board[8] == player) {
        rtn.push(0);
    };
    // 斜め
    if (board[2] == player && board[4] == player && board[6] == empty) {
        rtn.push(6);
    };
    if (board[2] == player && board[4] == empty && board[6] == player) {
        rtn.push(4);
    };
    if (board[2] == empty && board[4] == player && board[6] == player) {
        rtn.push(2);
    };
    return rtn;
};

// リーチできる場所を返す
function findCanReaches() {
    var rtn = [];
    let players = myFindIndex(player);
    let ais = myFindIndex(ai);
    // 横上
    if (!players.includes(0) && !players.includes(1) && !players.includes(2)) {
        if (ais.includes(0) || ais.includes(1) || ais.includes(2)) {
            if (!ais.includes(0)) {
                rtn.push(0);
            };
            if (!ais.includes(1)) {
                rtn.push(1);
            };
            if (!ais.includes(2)) {
                rtn.push(2);
            };
        };
    };
    // 横中
    if (!players.includes(3) && !players.includes(4) && !players.includes(5)) {
        if (ais.includes(3) || ais.includes(4) || ais.includes(5)) {
            if (!ais.includes(3)) {
                rtn.push(3);
            };
            if (!ais.includes(4)) {
                rtn.push(4);
            };
            if (!ais.includes(5)) {
                rtn.push(5);
            };
        };
    };
    // 横下
    if (!players.includes(6) && !players.includes(7) && !players.includes(8)) {
        if (ais.includes(6) || ais.includes(7) || ais.includes(8)) {
            if (!ais.includes(6)) {
                rtn.push(6);
            };
            if (!ais.includes(7)) {
                rtn.push(7);
            };
            if (!ais.includes(8)) {
                rtn.push(8);
            };
        };
    };
    // 縦左
    if (!players.includes(0) && !players.includes(3) && !players.includes(6)) {
        if (ais.includes(0) || ais.includes(3) || ais.includes(6)) {
            if (!ais.includes(0)) {
                rtn.push(0);
            };
            if (!ais.includes(3)) {
                rtn.push(3);
            };
            if (!ais.includes(6)) {
                rtn.push(6);
            };
        };
    };
    // 縦中
    if (!players.includes(1) && !players.includes(4) && !players.includes(7)) {
        if (ais.includes(1) || ais.includes(4) || ais.includes(7)) {
            if (!ais.includes(1)) {
                rtn.push(1);
            };
            if (!ais.includes(4)) {
                rtn.push(4);
            };
            if (!ais.includes(7)) {
                rtn.push(7);
            };
        };
    };
    // 縦右
    if (!players.includes(2) && !players.includes(5) && !players.includes(8)) {
        if (ais.includes(2) || ais.includes(5) || ais.includes(8)) {
            if (!ais.includes(2)) {
                rtn.push(2);
            };
            if (!ais.includes(5)) {
                rtn.push(5);
            };
            if (!ais.includes(8)) {
                rtn.push(8);
            };
        };
    };
    // 斜め
    if (!players.includes(0) && !players.includes(4) && !players.includes(8)) {
        if (ais.includes(0) || ais.includes(4) || ais.includes(8)) {
            if (!ais.includes(0)) {
                rtn.push(0);
            };
            if (!ais.includes(4)) {
                rtn.push(4);
            };
            if (!ais.includes(8)) {
                rtn.push(8);
            };
        };
    };
    // 斜め
    if (!players.includes(2) && !players.includes(4) && !players.includes(6)) {
        if (ais.includes(2) || ais.includes(4) || ais.includes(6)) {
            if (!ais.includes(2)) {
                rtn.push(2);
            };
            if (!ais.includes(4)) {
                rtn.push(4);
            };
            if (!ais.includes(6)) {
                rtn.push(6);
            };
        };
    };
    return rtn;
};

// ダブルリーチにできる場所を探す
function findDoubleReaches(player) {
    var rtn = [];
    let empties = myFindIndex(empty);
    for (i in empties) {
        var tmpBoard = board.slice(0, board.length);
        tmpBoard[empties[i]] = player
        var reaches = findReaches(tmpBoard, ai);
        if (reaches.length >= 2) {
            rtn.push(empties[i]);
        };
    };
    return rtn;
};

// 空いてるマスからランダムなマスを返す
function getRandom() {
    console.log("RandomPicked");
    var array = myFindIndex(empty);
    rtn = array[Math.floor(Math.random() * array.length)];
    return rtn;
};

// 指定されたマスからランダムなマスを返す
function getRandomFrom(array) {
    rtn = array[Math.floor(Math.random() * array.length)];
    return rtn;
};