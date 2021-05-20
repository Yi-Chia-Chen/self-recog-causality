<?php
    header('Content-Type: text/plain');

    $save_directory = $_POST['directory_path'];
    $file_name = $_POST['file_name'];
    $data = $_POST['data'];

    if (!is_dir($save_directory)) {
        mkdir($save_directory, 0777, true);
    }

    $dataFile = fopen($save_directory . '/' . $file_name, 'a');
    fwrite($dataFile, $data);
    fclose($dataFile);
?>
