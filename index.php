<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Filemanager</title>
	<?php require 'links.php';?>
	<style type="text/css">
		.pointer{
			cursor: pointer;
		}
		th,td{
			border-left: none;
			border-right: none;
		}
		body{
			font-size: .91rem;
		}
		tr:hover,.selected{
			background: #e2d8f3;
		}
	</style>
</head>
<body>
<div id="root"></div>
</body>
<?php 
$files = [
	'jsx/index.jsx'
];

foreach ($files as $file) {
	echo "<script type='text/babel'>".file_get_contents($file)."</script>";
}
?>
<script>
	document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 's') {
    // Prevent the Save dialog to open
    e.preventDefault();
    // Place your code here
    alert('CTRL + S');
  }
});
</script>

</html>