<?php
require 'functions.php';

if (isset($_GET['openDir'])) {
	
	$dir = base64_decode($_GET['openDir']);
	//$_SESSION['dir'] = $dir;

	// Open a known directory, and proceed to read its contents
	//header('Content-Type: application/json; charset=utf-8');
	if (is_dir($dir)) {
	    if ($dh = opendir($dir)) {
	    	$list = [];
	    	$files = [];
	    	$file_store = [];
	    	$folder_store = [];
	        while (($file = readdir($dh)) !== false) {
	        	if (!in_array($file, [".", ".."])) {
		        	if (filetype($dir.$file) == "dir") {
		        		$row['name'] = $file;
		        		$row['filesize'] = "";
		        		$stat = stat($dir.$file);
		        		$row['date'] = date('Y-m-d H:i:s', $stat['mtime']);
		        		$row['permissions'] = is_writable($dir.$file) ? "drwxr-xr-x":"rr-r";
		        		$folder_store[$file] = $row;

		        		array_push($list, $file);
		        	}
		        	else{
		        		$row['name'] = $file;
		        		$row['filesize'] = comma_format(round(filesize($dir.$file) / 1024, 2));
		        		$stat = stat($dir.$file);
		        		$row['date'] = date('Y-m-d H:i:s', $stat['mtime']);
		        		$row['permissions'] = is_writable($dir.$file) ? "rw-r-r":"r-r";
		        		$row['extension'] = fileExtension($file);
		        		$file_store[$file] = $row;
		        		array_push($files, $file);
		        	}
		        }
	        }
	        closedir($dh);
	        sort($list);
	        sort($files);

	        $files2 = [];
	        foreach($files as $file){
	        	array_push($files2, $file_store[$file]);
	        }

	        $folder2 = [];
	        foreach($list as $file){
	        	array_push($folder2, $folder_store[$file]);
	        }

	        echo json_encode(['folders' => $folder2, 'files' => $files2, 'status' => true]);
	    }
	    else{
	    	echo json_encode(['status' => false, 'message' => "Failed to open directory"]);
	    }
	}
	else{
    	echo json_encode(['status' => false, 'message' => "$dir is not a directory"]);
    }
}

elseif (isset($_POST['dir'], $_POST['new_file'])) {
	$dir = base64_decode($_POST['dir']);
	if (is_writable($dir)) {
		file_put_contents($dir.$_POST['new_file'], '');
		echo json_encode(['status' => true, 'message' => "Success"]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Directory is write protected"]);
	}
}

elseif (isset($_POST['dir'], $_POST['new_folder'])) {
	$dir = base64_decode($_POST['dir']);
	if (is_writable($dir)) {
		mkdir($dir.$_POST['new_folder']);
		echo json_encode(['status' => true, 'message' => "Success"]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Directory is write protected"]);
	}
}

elseif (isset($_GET['openFile'], $_GET['dir'])) {
	$dir = base64_decode($_GET['dir']);
	$filename = $_GET['openFile'];

	echo file_get_contents($dir.$filename);
}

elseif (isset($_POST['saveFile'], $_POST['dir'], $_POST['data'])) {
	$dir = base64_decode($_POST['dir']);
	$filename = $_POST['saveFile'];

	file_put_contents($dir.$filename,$_POST['data']);
	echo "Saved!";
}

elseif (isset($_POST['dir'], $_FILES['upload_file'])) {
	$filename = $_FILES['upload_file']['name'];
	$dir = base64_decode($_POST['dir']);

	if (is_writable($dir)) {
		if (move_uploaded_file($_FILES['upload_file']['tmp_name'], $dir.$filename)) {
			echo json_encode(['status' => true, 'message' => "Success"]);
		}
		else{
			echo json_encode(['status' => false, 'message' => "Failed to upload"]);
		}
	}
	else{
		echo json_encode(['status' => false, 'message' => "Directory is write protected"]);
	}
}

elseif (isset($_POST['dir'], $_POST['files'], $_POST['folders'], $_POST['zipName'])) {
	$dir = base64_decode($_POST['dir']);
	$files_array = json_decode($_POST['files'], true);
	$folders = json_decode($_POST['folders'], true);

	$filename = $_POST['zipName'];

	$files = [];

	foreach ($files_array as $row) {
		array_push($files, $dir.$row['name']);
	}

	foreach ($folders as $row) {
		read_all_dir($dir.$row['name']."/");
	}

	// Create a new ZipArchive object
	$zip = new ZipArchive();

	// Open the zip file for writing
	if ($zip->open($dir.$filename.".zip", ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
	    // Add each file and folder to the zip archive
	    foreach ($files as $file) {
	        $relative_path = str_replace($dir, "", $file);
			//echo "$file - ($relative_path)<br>";
			$zip->addFile($file, $relative_path);
	    }

	    // Close the zip archive
	    $zip->close();

	    echo json_encode(['status' => true, 'message' => "Files compressed successfully!"]);
	} else {
	    echo json_encode(['status' => false, 'message' => "Failed to create zip archive!"]);
	}
}

elseif (isset($_POST['deleteFiles'], $_POST['files'], $_POST['folders'], $_POST['dir'])) {
	$dir = base64_decode($_POST['dir']);
	$files = json_decode($_POST['files'], true);
	$folders = json_decode($_POST['folders'], true);

	$new_files = [];

	foreach ($files as $row) {
		unlink($dir.$row['name']);
	}

	foreach ($folders as $row) {
		deleteDirectory($dir.$row['name']);
	}

	echo json_encode(['status' => true, 'message' => "Files deleted successfully!"]);
}

elseif (isset($_POST['dir'], $_POST['zipFile'], $_POST['extract_dir'])) {
	$dir = base64_decode($_POST['dir']);

	$zip = new ZipArchive;
	if ($zip->open($dir.$_POST['zipFile']) === TRUE) {
	    $zip->extractTo($dir.$_POST['extract_dir']);
	    $zip->close();
	    echo json_encode(['status' => true, 'message' => "Files extracted successfully!"]);
	} else {
	    echo json_encode(['status' => false, 'message' => "Failed to extract zip archive!"]);
	}
}

elseif (isset($_POST['dir'], $_POST['upload_folder'])) {
	$dir = base64_decode($_POST['dir']);
	//file_put_contents($dir."/data.json", json_encode($_FILES,JSON_PRETTY_PRINT));

	$errors = [];
	$uploadedCount = 0;
	foreach ($_FILES['uploaded_files']['name'] as $index => $fileName) {
		// Get the relative path from the `tmp_name` field.
		// The `tmp_name` is an array where the key corresponds to the `name` index.
		$filename = $_FILES['uploaded_files']['name'][$index];
		$relativeFilePath = $_FILES['uploaded_files']['full_path'][$index];
		$tmpName = $_FILES['uploaded_files']['tmp_name'][$index];
		$error = $_FILES['uploaded_files']['error'][$index];
	
		// Check for upload errors.
		if ($error !== UPLOAD_ERR_OK) {
			$errors[] = "Error uploading file '{$relativeFilePath}': Code {$error}";
			continue;
		}
	
		// Construct the full destination path.
		$destinationPath = $dir . $relativeFilePath;
		
		// Get the directory part of the destination path.
		$destinationDir = dirname($destinationPath);
	
		// Create the directory structure if it doesn't exist.
		// `recursive` parameter set to true allows creating nested directories.
		if (!is_dir($destinationDir)) {
			if (!mkdir($destinationDir, 0777, true)) {
				$errors[] = "Failed to create directory for '{$relativeFilePath}'.";
				continue;
			}
		}
	
		// Move the uploaded file from the temporary location to the final destination.
		if (move_uploaded_file($tmpName, $destinationPath)) {
			//$uploadedCount++;
		} else {
			$errors[] = "Failed to move uploaded file '{$relativeFilePath}'.";
		}
	}

	echo json_encode(['status' => count($errors) == 0 ? true : false, 'message' => count($errors) == 0 ? "Files uploaded successfully!" : implode("\n", $errors)]);
}

elseif(isset($_POST['dir'], $_POST['old_file'], $_POST['rename_file'])){
	rename(
		base64_decode($_POST['dir']).$_POST['old_file'],
		base64_decode($_POST['dir']).$_POST['rename_file']
	);
	//unlink($_POST['dir'].$_POST['old_file']);

	echo json_encode(['status' => true, 'message' => "File renamed successfully!"]);
}

elseif(isset($_POST['dir'], $_POST['old_folder'], $_POST['rename_folder'])){
	copy(
		base64_decode($_POST['dir']).$_POST['old_folder'],
		base64_decode($_POST['dir']).$_POST['rename_folder']
	);
	deleteDirectory(base64_decode($_POST['dir']).$_POST['old_folder']);

	echo json_encode(['status' => true, 'message' => "File renamed successfully!"]);
}
