<?php
    $directory_path = $_POST['directory_path'];
    $file_name = $_POST['file_name'];
    $file_path = $directory_path . '/' . $file_name;

    if (is_file($file_path)) {
        $handle = fopen($file_path, 'r');
        $subj_num = fgets($handle) + 1;
        fclose($handle);
    } else {
        $subj_num = 1;
    }
    echo $subj_num;

    $handle = fopen($file_path, 'w');
    fwrite($handle, $subj_num);
    fclose($handle);
    chmod($file_path, 0777);
?>
