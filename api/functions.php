<?php

function comma_format($size)
{
	$size = (string)$size;
	if (strpos($size, ".")!== false) {
		$chars = explode(".", $size);
		return number_format($chars[0]).".".$chars[1];
	}
	else{
		return number_format($size);
	}
}

function fileExtension($filename){
	$chars =explode(".", $filename);
	return strtolower($chars[count($chars)-1]);
}

function deleteDirectory($dir) {
    if (!is_dir($dir)) {
        return false;
    }

    $files = array_diff(scandir($dir), array('.', '..'));

    foreach ($files as $file) {
        $path = $dir . '/' . $file;

        if (is_dir($path)) {
            deleteDirectory($path);
        } else {
            unlink($path);
        }
    }

    return rmdir($dir);
}

function read_all_dir($dir)
{
	global $files;

	if (is_dir($dir)) {
	    if ($dh = opendir($dir)) {
	    	while (($file = readdir($dh)) !== false) {
	        	if (!in_array($file, [".", ".."])) {
		        	if (filetype($dir.$file) == "dir") {
		        		read_all_dir($dir.$file."/");
		        	}
		        	else{
		        		array_push($files, $dir.$file);
		        	}
		        }
		    }
		}
		else{
			echo "cant open";
		}
	}
	else{
		echo "is not dir";
	}
}
?>