<?php
// Cho phép frontend truy cập
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// API gốc
$url = "https://paradisehrm.com/vietinsoft/api/hpa/Paradise";

// Nhận body từ frontend
$input = file_get_contents("php://input");

// Gửi request tới API gốc
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);

$response = curl_exec($ch);
curl_close($ch);

// Trả response về frontend
echo $response;
