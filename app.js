var routerApp = angular.module('routerApp', [ 'ui.router',
		'oitozero.ngSweetAlert' ]);

routerApp.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home');

	$stateProvider

	// HOME STATES AND NESTED VIEWS ========================================
	.state('home', {
		url : '/home',
		templateUrl : 'views/home.html',
	})

	.state('shop', {
		url : '/shop',
		templateUrl : 'views/shop.html',
		controller : 'AllLaptopsCtrl'
	})

	// nested list with custom controller
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

routerApp.controller('CartCtrl', function($scope, CommonProp) {
	$scope.total = CommonProp.getTotal();
	$scope.items = CommonProp.getItems();

	$scope.removeItem = function(laptop) {

		swal({
			title : "Remove this item?",
			showCancelButton : true,
			confirmButtonColor : "#DD6B55",
			confirmButtonText : "Yes!",
			cancelButtonText : "No!",
			closeOnConfirm : false,
			closeOnCancel : false
		}, function(isConfirm) {
			if (isConfirm) {
				swal({
					showConfirmButton : false,
					title : "Deleted!",
					text : " " + laptop + " ",
					type : "success",
					timer : 1500
				}), CommonProp.removeItem(laptop);
				$scope.total = CommonProp.getTotal();
				$scope.$digest();
			} else {
				swal({
					showConfirmButton : false,
					title : "Good, keep buying more!",
					text : " " + laptop + " ",
					type : "success",
					timer : 850
				});
			}
		});
	};

	$scope.buyMore = function(laptop) {
		CommonProp.addMore(laptop);
		CommonProp.setTotal(laptop);
		$scope.total = CommonProp.getTotal();
	};
});

routerApp.controller('AllLaptopsCtrl', function($scope, $http, CommonProp,
		$timeout) {

	$scope.useBrands = {};
	$scope.useRams = {};
	$scope.useHDDs = {};
	$scope.useVideos = {};
	$scope.useProcessors = {};
	$scope.total = CommonProp.getTotal();
	
	$scope.setLocale = function(newLocal) {
		CommonProp.setLocale(newLocal);
		document.getElementById('cartLink').click();
		document.getElementById('shopLink').click();
	};
	
	$scope.local = CommonProp.getLocale();
	// TO DO: add laptopsBG
	
	if ($scope.local == 'en') {
		$http.get('laptops/laptops.json').success(function(data) {
			$scope.laptops = data;
		});
	}else{
		$http.get('laptops/laptops-bg_BG.json').success(function(data) {
			$scope.laptops = data;
		});
	};
if($scope.local == 'en'){
	$scope.orderOptions = [ {
		label : 'Price (low to high)',
		value : 'price'
	}, {
		label : 'Price (high to low)',
		value : '-price'
	}, {
		label : 'Brand (A to Z)',
		value : 'model'
	}, {
		label : 'Brand (Z to A)',
		value : '-model'
	} ];
}else{
	$scope.orderOptions = [ {
		label : 'Цена (ниска --> висока)',
		value : 'price'
	}, {
		label : 'Цена (висока --> ниска)',
		value : '-price'
	}, {
		label : 'Марка (A до Я)',
		value : 'model'
	}, {
		label : 'Brand (Я до А)',
		value : '-model'
	} ];
}
	// Watch the laptops that are selected
	$scope.$watch(function() {
		return {
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

	$scope.$watch('filtered', function(newValue) {
		if (angular.isArray(newValue)) {
			console.log(newValue.length);
		}
	}, true);

	$scope.buy = function(laptop) {
		CommonProp.addItem(laptop);
		CommonProp.setTotal(laptop);
		$scope.total = CommonProp.getTotal();
	}
});

routerApp.controller('LaptopCtrl', function($scope, $stateParams, $http,
		CommonProp) {
	var name = $stateParams.name;
	$scope.total = CommonProp.getTotal();
	$http.get('laptops/' + name + '.json').success(function(data) {
		$scope.laptop = data;
	});
	$scope.buyThis = function(laptop) {
		CommonProp.addItem(laptop);
		CommonProp.setTotal(laptop);
		$scope.total = CommonProp.getTotal();
	}
});

routerApp.service('CommonProp',
		function() {
			var Items = [];
			var Total = 0;
			var local = 'en';

			return {
				getLocale : function() {
					return local;
				},
				setLocale : function(newLocal){
					local = newLocal;
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

routerApp.filter('groupBy', function() {
	return function(collection, key) {
		if (collection === null)
			return;
		return uniqueItems(collection, key);
	};
});
