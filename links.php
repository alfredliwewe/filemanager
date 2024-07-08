<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/png" href="icon.png">
<link rel="stylesheet" type="text/css" href="../resources/w3css/w3.css">
<link rel="stylesheet" type="text/css" href="../resources/w3css/tailwind.css">
<link rel="stylesheet" type="text/css" href="../resources/vendor/bootstrap/css/bootstrap.min.css">
<script type="text/javascript" src="../resources/vendor/jquery/jquery.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" type="text/css" href="../custom.css">
<script type="text/javascript" src="../dataTable.js"></script>

<!--<script type="text/javascript" src="exportTable.js"></script>-->
<script type="text/javascript" src="../resources/react.js"></script>
<script type="text/javascript" src="../resources/react-dom.js"></script>
<script type="text/javascript" src="../resources/babel.js"></script>
<script type="text/javascript" src="../resources/prop-types.js"></script>

<script type="text/javascript" src="../resources/react-is.js"></script>

<script type="text/javascript" src="../resources/material-ui.js"></script>


<!--====== Default CSS ======-->
<link rel="stylesheet" href="../resources/w3css/default.css">

<!--====== Style CSS ======-->
<link rel="stylesheet" href="../assets/css/style.css">
<link rel="stylesheet" type="text/css" href="../toastify/src/toastify.css">
<script type="text/javascript" src="../toastify/src/toastify.js"></script>
<style type="text/css">
	@font-face{
		font-family: sourceSans;
		src:url('../fonts/Source_Sans_Pro/SourceSansPro-Bold.ttf');
	}
	.bcenter{
        display: inline-flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
    }
    body{
        --purple:#36344D
    }
</style>
<script type="text/javascript">
	function _(id) {
        return document.getElementById(id);
    }

    function Toast(text) {
        Toastify({
            text: text,
            gravity: "top",
            position: 'center',
            backgroundColor:"#dc3545",
            background:"#dc3545"
        }).showToast();
    }
</script>