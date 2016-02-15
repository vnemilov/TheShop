var routerApp = angular.module('routerApp', [ 'ui.router',
		'pascalprecht.translate', 'oitozero.ngSweetAlert' ]);

routerApp.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home');

	$stateProvider

	// STATES
	.state('home', {
		url : '/home',
		templateUrl : 'views/home.html',
	})

	.state('shop', {
		url : '/shop',
		templateUrl : 'views/shop.html',
		controller : 'ShopCtrl'
	})
	.state('laptop', {
		url : '/laptop/:name',
		templateUrl : 'views/laptops.html',
		controller : 'LaptopCtrl'
	})
	.state('cart', {
		url : '/cart',
		templateUrl : 'views/cart.html',
		controller : 'CartCtrl'
	})
});
// Translate provider to load json files according to the chosen language
routerApp.config([ '$translateProvider', function($translateProvider) {
	$translateProvider.preferredLanguage('enUS'); //set the preferred language to enUS

	//Loading json files
	$translateProvider.useStaticFilesLoader({
		prefix : '/languages/',
		suffix : '.json'
	});
	$translateProvider.useSanitizeValueStrategy('escape');
} ]);

//CART CONTROLLER
routerApp.controller('CartCtrl', function($scope, CommonProp, $translate,
		$filter) {
	$scope.total = CommonProp.getTotal();
	$scope.items = CommonProp.getItems();

	//Sweet alert used to create a modal window for deletion
	$scope.removeItem = function(laptop) {
		var removeItemSwal = $filter('translate')('DELETE_THIS_ITEM');
		var yesSwal = $filter('translate')('YES');
		var noSwal = $filter('translate')('NO');
		var deletedSwal = $filter('translate')("DELETED");
		var goodBuyMoreSwal = $filter('translate')("GOOD_BUY_MORE");
		swal({
			title : removeItemSwal,
			showCancelButton : true,
			confirmButtonColor : "#DD6B55",
			confirmButtonText : yesSwal,
			cancelButtonText : noSwal,
			closeOnConfirm : false,
			closeOnCancel : false
		}, function(isConfirm) {
			if (isConfirm) {
				swal({
					showConfirmButton : false,
					title : deletedSwal,
					text : " " + laptop + " ",
					type : "success",
					timer : 1500
				}), CommonProp.removeItem(laptop);
				$scope.total = CommonProp.getTotal();
				$scope.$digest();
			} else {
				swal({
					showConfirmButton : false,
					title : goodBuyMoreSwal,
					text : " " + laptop + " ",
					type : "success",
					timer : 850
				});
			}
		});
	};
	$scope.buy = function(laptop) {
		CommonProp.addMore(laptop);
		CommonProp.setTotal(laptop);
		$scope.total = CommonProp.getTotal();
	};
});

// SHOP CONTROLLER
routerApp.controller('ShopCtrl', function($scope, $http, CommonProp,
		$translate, $timeout, $filter) {
	$scope.language = CommonProp.getLocale();
	$scope.useBrands = {};
	$scope.useRams = {};
	$scope.useHDDs = {};
	$scope.useVideos = {};
	$scope.useProcessors = {};
	$scope.total = CommonProp.getTotal();
	$http.get('laptops/laptops.json').success(function(data) {
		$scope.laptops = data;
	});
	//Filter to order items
	$scope.orderOptions = [ {
		label : 'PRICE_LOW_TO_HIGH',
		value : 'price'
	}, {
		label : 'PRICE_HIGH_TO_LOW',
		value : '-price'
	}, {
		label : 'BRAND_A_TO_Z',
		value : 'model'
	}, {
		label : 'BRAND_Z_TO_A',
		value : '-model'
	} ];
//	$scope.$watch('total', function(newValue) {
//		CommonProp.setTotal(newValue);
//		$scope.total = CommonProp.getTotal();
//	});
	
	
	// Watch the laptops that are selected
	$scope.$watch(function() {
		return {
			language : $scope.language,
			laptops : $scope.laptops,
			useBrands : $scope.useBrands,
			useRams : $scope.useRams,
			useHDDs : $scope.useHDDs,
			useVideos : $scope.useVideos,
			useProcessors : $scope.useProcessors
		}
	}, function(value) {
		var selected;

		$scope.count = function(prop, value) {
			return function(el) {
				return el[prop] == value;
			};
		};
		$scope.brandsGroup = uniqueItems($scope.laptops, 'brand');
		var filterAfterBrands = [];
		selected = false;
		for ( var j in $scope.laptops) {
			var p = $scope.laptops[j];
			for ( var i in $scope.useBrands) {
				if ($scope.useBrands[i]) {
					selected = true;
					if (i == p.brand) {
						filterAfterBrands.push(p);
						break;
					}
				}
			}
		}
		if (!selected) {
			filterAfterBrands = $scope.laptops;
		}
		$scope.ramsGroup = uniqueItems($scope.laptops, 'ram');
		var filterAfterRams = [];
		selected = false;
		for ( var j in filterAfterBrands) {
			var p = filterAfterBrands[j];
			for ( var i in $scope.useRams) {
				if ($scope.useRams[i]) {
					selected = true;
					if (i == p.ram) {
						filterAfterRams.push(p);
						break;
					}
				}
			}
		}
		if (!selected) {
			filterAfterRams = filterAfterBrands;
		}
		$scope.hddsGroup = uniqueItems($scope.laptops, 'hdd');
		var filterAfterHDDs = [];
		selected = false;
		for ( var j in filterAfterRams) {
			var p = filterAfterRams[j];
			for ( var i in $scope.useHDDs) {
				if ($scope.useHDDs[i]) {
					selected = true;
					if (i == p.hdd) {
						filterAfterHDDs.push(p);
						break;
					}
				}
			}
		}
		if (!selected) {
			filterAfterHDDs = filterAfterRams;
		}

		$scope.videosGroup = uniqueItems($scope.laptops, 'video');
		var filterAfterVideos = [];
		selected = false;
		for ( var j in filterAfterHDDs) {
			var p = filterAfterHDDs[j];
			for ( var i in $scope.useVideos) {
				if ($scope.useVideos[i]) {
					selected = true;
					if (i == p.video) {
						filterAfterVideos.push(p);
						break;
					}
				}
			}
		}
		if (!selected) {
			filterAfterVideos = filterAfterHDDs;
		}
		$scope.processorsGroup = uniqueItems($scope.laptops, 'processor');
		var filterAfterProcessors = [];
		selected = false;
		for ( var j in filterAfterVideos) {
			var p = filterAfterVideos[j];
			for ( var i in $scope.useProcessors) {
				if ($scope.useProcessors[i]) {
					selected = true;
					if (i == p.processor) {
						filterAfterProcessors.push(p);
						break;
					}
				}
			}
		}
		if (!selected) {
			filterAfterProcessors = filterAfterVideos;
		}
		var delay = function() {
			$scope.filteredLaptops = filterAfterProcessors;
		}

		$timeout(delay, 200);
	}, true);

//	$scope.$watch('filtered', function(newValue) {
//		if (angular.isArray(newValue)) {
//			console.log(newValue.length);
//		}
//	}, true);

	$scope.buy = function(laptop) {
		CommonProp.addItem(laptop);
		CommonProp.setTotal(laptop);
		$scope.total = CommonProp.getTotal();
	};
	$scope.language = CommonProp.getLocale();
	$scope.localCurrency = CommonProp.getLocalCurrency();

	//Changing the language for the app
	$scope.changeLanguage = function(langKey) {
		if (langKey == "bgBG") {
			CommonProp.setLocale('bulgarian');
			CommonProp.setLocalCurrency(1.95);
			$scope.language = 'bulgarian';
			$translate.use(langKey);
			$scope.localCurrency = CommonProp.getLocalCurrency();
		} else {
			CommonProp.setLocale('english');
			CommonProp.setLocalCurrency(1);
			$scope.language = 'english';
			$translate.use(langKey);
			$scope.localCurrency = CommonProp.getLocalCurrency();

		}
	};

	// $scope.$watch('total', function(newValue){
	// $scope.total = newValue;
	// });

});

//LAPTOP CONTROLLER
routerApp.controller('LaptopCtrl', function($scope, $stateParams, $http,
		CommonProp) {
	$scope.total = CommonProp.getTotal();
	
	//Load the json file for the laptop
	var name = $stateParams.name;
	$http.get('laptops/' + name + '.json').success(function(data) {
		$scope.laptop = data;
	});
	$scope.language = CommonProp.getLocale();
	if ($scope.language == 'bulgarian') {
		$scope.localCurrency = 1.95;
	} else {
		$scope.localCurrency = 1;
	}
	$scope.buy = function(laptop) {
		CommonProp.addItem(laptop);
		CommonProp.setTotal(laptop);
		$scope.total = CommonProp.getTotal();
	}
});

//Common properties service
routerApp.service('CommonProp',
		function() {
			var Items = [];
			var Total = 0;
			var local = 'english';
			var localCurrency = 1;

			return {
				getLocale : function() {
					return local;
				},
				setLocale : function(newLocal) {
					local = newLocal;
				},
				getLocalCurrency: function(){
					return localCurrency;
				},
				setLocalCurrency: function(newLocalCurrency){
					localCurrency = newLocalCurrency;
				},
				getItems : function() {
					return Items;
				},
				addMore : function(item) {
					var arr = [];
					$("input").each(function() {
						arr.push($(this.id).selector);
					});
					for (var i = 0; i < Items.length; i++) {
						if (Items[i].id == item.id && item.id == arr[i]) {

							Items[i].count = parseInt(document
									.getElementById(arr[i]).value);
							break;
						}
					}
				},
				removeItem : function(item) {
					var newItem = item.toString();
					for (var i = 0; i < Items.length; i += 1) {
						if (Items[i].id == newItem) {
							Items.splice(i, 1);
						}
					}
					Total = 0;
					for (var i = 0; i < Items.length; i += 1) {
						Total += Items[i].price * Items[i].count;
					}
				},
				addItem : function(item) {
					if (Items.length != 0) {
						var flag = false;
						for (var i = 0; i < Items.length; i++) {
							if (Items[i].id == item.id) {
								Items[i].count += 1;
								flag = true;
								break;
							}
						}
						if (!flag) {
							Items.push({
								'id' : item.id,
								'count' : 1,
								'price' : item.price,
								'model' : item.model
							});
						}
					} else {
						Items.push({
							'id' : item.id,
							'count' : 1,
							'price' : item.price,
							'model' : item.model
						});
					}
				},
				getTotal : function() {
					return Total;
				},
				setTotal : function() {
					Total = 0;
					for (var i = 0; i < Items.length; i += 1) {
						Total += Items[i].price * Items[i].count;
					}
				}
			};
		});

var uniqueItems = function(data, key) {
	var result = [];
	if (data != undefined) {

		for (var i = 0; i < data.length; i++) {
			var value = data[i][key];

			if (result.indexOf(value) == -1) {
				result.push(value);
			}
		}
	}
	return result;
}

//routerApp.filter('groupBy', function() {
//	return function(collection, key) {
//		if (collection === null)
//			return;
//		return uniqueItems(collection, key);
//	};
//});
//routerApp
//		.directive(
//				'languageDirective',
//				function($compile, CommonProp) {
//
//					return {
//						restrict : 'EA',
//						controller : 'AllLaptopsCtrl',
//						link : linkFn,
//						scope : {
//							total : '=',
//							lala : '@',
//							laptop : '=',
//							language : '@'
//						}
//					};
//
//					function linkFn(scope, element, attrs) {
//						scope.$watch('language', function(n, o) {
//							if (!n)
//								return;
//							element.empty().append(
//									$compile(getTemplate())(scope));
//						});
//						element.bind('click', function() {
//							scope.buy = function(laptop) {
//								CommonProp.addItem(laptop);
//								CommonProp.setTotal(laptop);
//								scope.total = CommonProp.getTotal();
//								scope.$apply();
//								$scope.$watch('total', function(newValue) {
//									$scope.total = newValue;
//								});
//
//							}
//							$scope.$watch('total', function(newValue) {
//								$parentScope.total = newValue;
//							});
//
//						});
//						function getTemplate() {
//							if (scope.language === 'english')
//								return '<button class="btn btn-success" ng-click="buy(laptop)">{{"BUY_FOR" | translate}} ${{laptop.price * localCurrency}}</button>'
//							else
//								return '<button class="btn btn-success" ng-click="buy(laptop)">{{"BUY_FOR" | translate}} {{laptop.price * localCurrency}}лв.</button>'
//						}
//					}
//				});
//routerApp.directive('hymn', function() {
//	return {
//		restrict : 'E',
//		scope : {
//			total : '=',
//			lala : '@',
//			laptop : '=',
//			language : '@'
//		},
//		link : function(scope, element, attrs) {
//			scope.contentUrl = attrs.language + '.html';
//			attrs.$observe("language", function(v) {
//				console.log(v);
//				scope.contentUrl = v + '.html';
//				scope.buy = function(laptop) {
//					CommonProp.addItem(laptop);
//					CommonProp.setTotal(laptop);
//					scope.total = CommonProp.getTotal();
//				};
//			});
//			template: '<div ng-include="contentUrl"></div>'
//		}
//	}
//});