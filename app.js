var routerApp = angular.module('routerApp', [ 'ui.router',
		'pascalprecht.translate', 'oitozero.ngSweetAlert' ]);

routerApp.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home');

	$stateProvider

	// STATES
	.state('home', {
		url : '/home',
		templateUrl : 'views/home.html',
		controller: 'MainCtrl'
	})

	.state('shop', {
		url : '/shop',
		templateUrl : 'views/shop.html',
		controller : 'ShopCtrl'
	}).state('laptop', {
		url : '/laptop/:name',
		templateUrl : 'views/laptops.html',
		controller : 'LaptopCtrl'
	}).state('cart', {
		url : '/cart',
		templateUrl : 'views/cart.html',
		controller : 'CartCtrl'
	})
});
// Translate provider to load json files according to the chosen language
routerApp.config([ '$translateProvider', function($translateProvider) {
	$translateProvider.preferredLanguage('enUS'); // set the preferred
	// language to enUS

	// Loading json files
	$translateProvider.useStaticFilesLoader({
		prefix : 'languages/',
		suffix : '.json'
	});
	$translateProvider.useSanitizeValueStrategy('escape');
} ]);

//MAIN CONTROLLER
routerApp.controller('MainCtrl', function($scope, CommonProp, $translate, $filter){
	var vm = this;
	vm.total = CommonProp.getTotal();
	vm.items = CommonProp.getItems();
	vm.language = CommonProp.getLocale();
	
	vm.cart = 'cart';
	$scope.db = new loki(vm.cart, {
		autoload : false,
		persistenceMethod : 'adapter',
		adapter : new jquerySyncAdapter({
			ajaxLib : $
		})
	});
	$scope.db.loadDatabase({}, function() {
		console.log($scope.db.listCollections());
		if ($scope.db.getCollection('orders') === null) {
			var orders = $scope.db.addCollection('orders');
			console.log(null != orders.data);
			console.log(orders.data.length);
			orders.insert({
				items : CommonProp.getItems(),
				total : CommonProp.getTotal()
			});
			console.log(orders.data);
			$scope.db.saveDatabase();
		}else{
			var orders = $scope.db.getCollection('orders');
			CommonProp.setItems(orders.data[0].items);
			CommonProp.setTotal(orders.data[0].total);
			vm.total = CommonProp.getTotal();
			$scope.db.saveDatabase();
		}
		var users2 = $scope.db.getCollection('orders');
		console.log(users2.data);

	});
});


// CART CONTROLLER
routerApp.controller('CartCtrl', function($scope, CommonProp, $translate,
		$filter) {
	var vm = this;
	vm.total = CommonProp.getTotal();
	vm.items = CommonProp.getItems();
	vm.language = CommonProp.getLocale();
	vm.localCurrency = CommonProp.getLocalCurrency();
	// Sweet alert used to create a modal window for deletion
	vm.removeItem = function(laptop) {
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
				vm.total = CommonProp.getTotal();
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
	vm.buy = function(laptop) {
		CommonProp.addMore(laptop);
		CommonProp.setTotal(laptop);
		vm.total = CommonProp.getTotal();
	};
	vm.language = CommonProp.getLocale();
	vm.localCurrency = CommonProp.getLocalCurrency();

	// Changing the language for the app
	vm.changeLanguage = function(langKey) {
		if (langKey == "bgBG") {
			CommonProp.setLocale('bulgarian');
			CommonProp.setLocalCurrency(1.95);
			vm.language = 'bulgarian';
			$translate.use(langKey);
			vm.localCurrency = CommonProp.getLocalCurrency();
		} else {
			CommonProp.setLocale('english');
			CommonProp.setLocalCurrency(1);
			vm.language = 'english';
			$translate.use(langKey);
			vm.localCurrency = CommonProp.getLocalCurrency();

		}
	};
});

// SHOP CONTROLLER
routerApp.controller('ShopCtrl', function($scope, $http, CommonProp,
		$translate, $timeout, $filter) {

	var vm = this;
//	vm.cart = 'cart';
//	var db = new loki(vm.cart, {
//		autoload : false,
//		persistenceMethod : 'adapter',
//		adapter : new jquerySyncAdapter({
//			ajaxLib : $
//		})
//	});
//	db.loadDatabase({}, function() {
//		console.log(db.listCollections());
//		if (db.getCollection('orders') === null) {
//			var orders = db.addCollection('orders');
//			console.log(null != orders.data);
//			console.log(orders.data.length);
//			orders.insert({
//				items : CommonProp.getItems(),
//				total : CommonProp.getTotal()
//			});
//			console.log(orders.data);
//			db.saveDatabase();
//		}else{
//			var orders = db.getCollection('orders');
//			CommonProp.setItems(orders.data[0].items);
//			CommonProp.setTotal(orders.data[0].total);
//			vm.total = CommonProp.getTotal();
//			db.saveDatabase();
//		}
//		var users2 = db.getCollection('orders');
//		console.log(users2.data);
//
//	});
	vm.language = CommonProp.getLocale();
	vm.useBrands = [];
	vm.useRams = [];
	vm.useHDDs = [];
	vm.useVideos = [];
	vm.laptops = [];
	vm.useProcessors = [];
	vm.total = CommonProp.getTotal();
	$http.get('laptops/laptops.json').success(function(data) {
		vm.laptops = data;
	});
	// Filter to order items
	vm.orderOptions = [ {
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
	// $scope.$watch('total', function(newValue) {
	// CommonProp.setTotal(newValue);
	// $scope.total = CommonProp.getTotal();
	// });

	// Watch the laptops that are selected
	$scope.$watch(angular.bind(this, function() {
		return {
			laptops : vm.laptops,
			useBrands : vm.useBrands,
			useRams : vm.useRams,
			useHDDs : vm.useHDDs,
			useVideos : vm.useVideos,
			useProcessors : vm.useProcessors
		}
	}), function(value) {
		var selected;

		vm.count = function(prop, value) {
			return function(el) {
				return el[prop] == value;
			};
		};
		vm.brandsGroup = uniqueItems(vm.laptops, 'brand');
		var filterAfterBrands = [];
		selected = false;
		for ( var j in vm.laptops) {
			var p = vm.laptops[j];
			for ( var i in vm.useBrands) {
				if (vm.useBrands[i]) {
					selected = true;
					if (i == p.brand) {
						filterAfterBrands.push(p);
						break;
					}
				}
			}
		}
		if (!selected) {
			filterAfterBrands = vm.laptops;
		}
		vm.ramsGroup = uniqueItems(vm.laptops, 'ram');
		var filterAfterRams = [];
		selected = false;
		for ( var j in filterAfterBrands) {
			var p = filterAfterBrands[j];
			for ( var i in vm.useRams) {
				if (vm.useRams[i]) {
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
		vm.hddsGroup = uniqueItems(vm.laptops, 'hdd');
		var filterAfterHDDs = [];
		selected = false;
		for ( var j in filterAfterRams) {
			var p = filterAfterRams[j];
			for ( var i in vm.useHDDs) {
				if (vm.useHDDs[i]) {
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

		vm.videosGroup = uniqueItems(vm.laptops, 'video');
		var filterAfterVideos = [];
		selected = false;
		for ( var j in filterAfterHDDs) {
			var p = filterAfterHDDs[j];
			for ( var i in vm.useVideos) {
				if (vm.useVideos[i]) {
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
		vm.processorsGroup = uniqueItems(vm.laptops, 'processor');
		var filterAfterProcessors = [];
		selected = false;
		for ( var j in filterAfterVideos) {
			var p = filterAfterVideos[j];
			for ( var i in vm.useProcessors) {
				if (vm.useProcessors[i]) {
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
			vm.filteredLaptops = filterAfterProcessors;
		}

		$timeout(delay, 200);
	}, true);

	// $scope.$watch('filtered', function(newValue) {
	// if (angular.isArray(newValue)) {
	// console.log(newValue.length);
	// }
	// }, true);
	console.log($scope.db.listCollections());

	// db.loadDatabase({}, function () {
	// var orders = db.getCollection('orders');
	// });
	vm.buy = function(laptop) {
		var orders = $scope.db.getCollection('orders');
		console.log(orders.data[0].items);
		CommonProp.addItem(laptop);
		CommonProp.setTotal();
		vm.total = CommonProp.getTotal();
//		CommonProp.setItems(orders.data[0].items);
//		CommonProp.setTotal(orders.data[0].total);
		console.log(orders.data != null);
//		orders.insert({
//			items : laptop.id
//		});
		orders.data[0].items = CommonProp.getItems();
		orders.data[0].total = vm.total;
		console.log(orders);
		console.log(orders.items);
		console.log(orders.total);
		$scope.db.saveDatabase(function() {
			console.log('asd');
		});
		console.log(orders);
		console.log(orders.data.length);
	};
	vm.language = CommonProp.getLocale();
	vm.localCurrency = CommonProp.getLocalCurrency();

	// Changing the language for the app
	vm.changeLanguage = function(langKey) {
		if (langKey == "bgBG") {
			CommonProp.setLocale('bulgarian');
			CommonProp.setLocalCurrency(1.95);
			vm.language = 'bulgarian';
			$translate.use(langKey);
			vm.localCurrency = CommonProp.getLocalCurrency();
		} else {
			CommonProp.setLocale('english');
			CommonProp.setLocalCurrency(1);
			vm.language = 'english';
			$translate.use(langKey);
			vm.localCurrency = CommonProp.getLocalCurrency();

		}
	};

	// $scope.$watch('total', function(newValue){
	// $scope.total = newValue;
	// });

});

// LAPTOP CONTROLLER
routerApp.controller('LaptopCtrl', function($stateParams, $http, CommonProp) {
	var vm = this;
	vm.laptop = {};
	vm.total = CommonProp.getTotal();
	vm.justMessage = 'heheheheh';

	// Load the json file for the laptop
	vm.name = $stateParams.name;
	$http.get('laptops/' + vm.name + '.json').success(function(data) {
		vm.laptop = data;
	});
	vm.language = CommonProp.getLocale();
	if (vm.language == 'bulgarian') {
		vm.localCurrency = 1.95;
	} else {
		vm.localCurrency = 1;
	}
	vm.buy = function(laptop) {
		CommonProp.addItem(laptop);
		CommonProp.setTotal();
		vm.total = CommonProp.getTotal();
	}
	vm.language = CommonProp.getLocale();
	vm.localCurrency = CommonProp.getLocalCurrency();

	// Changing the language for the app
	vm.changeLanguage = function(langKey) {
		if (langKey == "bgBG") {
			CommonProp.setLocale('bulgarian');
			CommonProp.setLocalCurrency(1.95);
			vm.language = 'bulgarian';
			$translate.use(langKey);
			vm.localCurrency = CommonProp.getLocalCurrency();
		} else {
			CommonProp.setLocale('english');
			CommonProp.setLocalCurrency(1);
			vm.language = 'english';
			$translate.use(langKey);
			vm.localCurrency = CommonProp.getLocalCurrency();

		}
	};
});

// Common properties service
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
				getLocalCurrency : function() {
					return localCurrency;
				},
				setLocalCurrency : function(newLocalCurrency) {
					localCurrency = newLocalCurrency;
				},
				getItems : function() {
					return Items;
				},
				setItems : function(items) {
					Items = items;
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

// routerApp.filter('groupBy', function() {
// return function(collection, key) {
// if (collection === null)
// return;
// return uniqueItems(collection, key);
// };
// });
// routerApp
// .directive(
// 'languageDirective',
// function($compile, CommonProp) {
//
// return {
// restrict : 'EA',
// controller : 'AllLaptopsCtrl',
// link : linkFn,
// scope : {
// total : '=',
// lala : '@',
// laptop : '=',
// language : '@'
// }
// };
//
// function linkFn(scope, element, attrs) {
// scope.$watch('language', function(n, o) {
// if (!n)
// return;
// element.empty().append(
// $compile(getTemplate())(scope));
// });
// element.bind('click', function() {
// scope.buy = function(laptop) {
// CommonProp.addItem(laptop);
// CommonProp.setTotal(laptop);
// scope.total = CommonProp.getTotal();
// scope.$apply();
// $scope.$watch('total', function(newValue) {
// $scope.total = newValue;
// });
//
// }
// $scope.$watch('total', function(newValue) {
// $parentScope.total = newValue;
// });
//
// });
// function getTemplate() {
// if (scope.language === 'english')
// return '<button class="btn btn-success" ng-click="buy(laptop)">{{"BUY_FOR" |
// translate}} ${{laptop.price * localCurrency}}</button>'
// else
// return '<button class="btn btn-success" ng-click="buy(laptop)">{{"BUY_FOR" |
// translate}} {{laptop.price * localCurrency}}лв.</button>'
// }
// }
// });
// routerApp.directive('hymn', function() {
// return {
// restrict : 'E',
// scope : {
// total : '=',
// lala : '@',
// laptop : '=',
// language : '@'
// },
// link : function(scope, element, attrs) {
// scope.contentUrl = attrs.language + '.html';
// attrs.$observe("language", function(v) {
// console.log(v);
// scope.contentUrl = v + '.html';
// scope.buy = function(laptop) {
// CommonProp.addItem(laptop);
// CommonProp.setTotal(laptop);
// scope.total = CommonProp.getTotal();
// };
// });
// template: '<div ng-include="contentUrl"></div>'
// }
// }
// });
