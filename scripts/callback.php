<?php

$payload = json_decode(file_get_contents('php://input'));
header('content-type: application/json');

switch ($payload->action){
    case 'ping':
        echo json_encode(['pong' => true]);
    break;
    case 'decompress':
        $zip = new ZipArchive;
        $res = $zip->open($payload->file);
        if ($res === true) {
            $zip->extractTo(dirname($payload->file));
            $zip->close();
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'decompress_failed']);
        }
        unlink($payload->file);
    break;
    case 'self-destruct':
        unlink(__FILE__);
        exit;
    break;
}
