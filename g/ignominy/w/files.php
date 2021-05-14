const resources = {documents: 
    <?php
        include_once '../../../phpf/file_read.php';
        $files = array();
        $items = 0;
        foreach (glob('data/*.html') as $filename) {
            $p = pathinfo($filename);
            $files[$items]['path'] = $p['filename'];
            $files[$items]['name'] = get_file_title($p['filename']);
            $files[$items]['preview'] = get_file_summary($filename); 
            $items++;
        }
        echo json_encode($files);
    ?>,
stories:
    <?php
        $files = array();
        $items = 0;
        foreach (glob('pieces/*.txt') as $filename) {
            $p = pathinfo($filename);
            $files[$items]['path'] = $p['filename'];
            $files[$items]['name'] = get_file_title($p['filename']);
            $files[$items]['preview'] = get_file_synopsis($filename); 
            $items++;
        }
        echo json_encode($files);
    ?>,
other_files: 
    <?php
    $files = array();
    $items = 0;
        foreach (glob('other/*') as $filename) {
            $p = pathinfo($filename);
            if (!isset($p['extension']) || !preg_match('/(pdf)|(png)/', $p['extension'])) continue;
            $files[$items]['path'] = $p['filename'];
            $files[$items]['name'] = get_file_title($p['filename']);
            $files[$items]['type'] = $p['extension'];
            $files[$items]['size'] = filesize($filename);
            $items++;
        }
        echo json_encode($files);
    ?>};