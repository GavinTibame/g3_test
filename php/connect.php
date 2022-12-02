<?php

/* Database credentials. Assuming you are running MySQL
server with default setting (user 'root' with no password) */
/*define() 函數定義一個常量。
在設定以後，常量的值無法更改
常量名不需要開頭的美元符號 ($)
作用域不影響對常量的訪問
常量值只能是字符串或數字*/
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '1qaz2wsX');
define('DB_NAME', 'example');

/* Attempt to connect to MySQL database */
$link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
// 輸入中文也OK的編碼
mysqli_query($link, 'SET NAMES utf8');

// Check connection
if ($link === false) {
  die("ERROR: Could not connect. " . mysqli_connect_error());
} else {

  $sql = "SELECT *  FROM `emp`  WHERE `EMPNO`=7369";

  $result = mysqli_query($link, $sql);

  // 如果有資料
  if ($result) {
    // mysqli_num_rows方法可以回傳我們結果總共有幾筆資料
    if (mysqli_num_rows($result) > 0) {
      // 取得大於0代表有資料
      // while迴圈會根據資料數量，決定跑的次數
      // mysqli_fetch_assoc方法可取得一筆值
      while ($row = mysqli_fetch_assoc($result)) {
        // 每跑一次迴圈就抓一筆值，最後放進data陣列中
        $datas[] = $row;
      }
    }
    // 釋放資料庫查到的記憶體
    mysqli_free_result($result);
  } else {
    echo "{$sql} 語法執行失敗，錯誤訊息: " . mysqli_error($link);
  }
  // 處理完後印出資料
  if (!empty($result)) {
    // 如果結果不為空，就利用print_r方法印出資料
    print_r($datas);
  } else {
    // 為空表示沒資料
    echo "查無資料";
  }
}
