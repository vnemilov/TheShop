<!DOCTYPE html>
<html>
<head>
<!-- JS (load angular, ui-router, and our custom js file) -->

<script src="bower_components/jquery/dist/jquery.min.js"></script>
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<script src="bower_components/jquery-ui/jquery-ui.min.js"></script>
<script src="node_modules/lokijs/src/lokijs.js"></script>
<script src="jquerySyncToMySqlAdapter.js"></script>
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-translate/angular-translate.js"></script>
<script src="bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js"></script>

<script
	src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
	<script src="bower_components/angular-animate/angular-animate.js"></script>
	<script src="bower_components/AngularJS-Toaster/toaster.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="bower_components/ngSweetAlert/SweetAlert.js"></script>
<script src="bower_components/sweetalert/dist/sweetalert.min.js"></script>
<link rel="stylesheet" href="bower_components/sweetalert/dist/sweetalert.css">


<!-- CSS (load bootstrap) -->
<!-- include the core styles -->
<!-- include a theme, can be included into the core instead of 2 separate files -->

<link rel="stylesheet"
	href="bower_components/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="resources/css/style.css">
<!--     <link rel="stylesheet" href="resources/css/sismple-sidebar.css"> -->

</head>

<!-- apply our angular app to our site -->
<body ng-app="routerApp">
<!-- <script>	 window.onbeforeunload = function() {
    return "You're leaving the site.";
};</script> -->

	<div class="container-fluid">
		<div ui-view></div>
	</div>



</body>
<toaster-container toaster-options="{'time-out': 500}"></toaster-container>
<script src="app.js"></script>
<script src="data.js"></script>
<script src="directives.js"></script>
</html>
