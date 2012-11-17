<?php

require 'definitions.php';

echo '<head>
        <title>'.$pageTitleMaster.'</title>
         
    	<script src="http://code.jquery.com/jquery-latest.min.js"></script>
	<script src="http://ajax.microsoft.com/ajax/jquery.templates/beta1/jquery.tmpl.min.js"></script>
	<script type="text/javascript" src="http://'.$serverAddress.'/socket.io/socket.io.js"></script>
	<script type="text/javascript" src="js/setup.js"></script>
	<script type="text/javascript" src="js/socket_io_client.js"></script>
	<script type="text/javascript" src="js/function.js"></script>

        <link href="css/base-reset.css" rel="stylesheet" />
        <link href="css/general.css" rel="stylesheet" />
	</head>
';

?>