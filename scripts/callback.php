<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$payload = json_decode(file_get_contents('php://input'));
header('content-type: application/json');

$response = [
    'message' => null,
    'error' => null
];

switch ($payload->action){
    case 'ping':
        $response['pong'] = true;
    break;
    case 'decompress':
        $zip = new ZipArchive;
        $res = $zip->open($payload->file);
        if ($res === true) {
            $zip->extractTo(dirname($payload->file));
            $zip->close();
            $response['message'] = 'Decompressed ' . $payload->file;
        } else {
            $response['error'] = 'Decompression of ' . $payload->file . ' failed';
        }
        unlink($payload->file);
    break;
    case 'self-destruct':
        unlink(__FILE__);
        exit;
    break;
}

echo json_encode($response, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);