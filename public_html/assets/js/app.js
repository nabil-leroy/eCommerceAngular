$(document).foundation()
var ecommerceApp = angular.module('ecommerceApp', []);
ecommerceApp.service('productService', function () {
  var cartItems = [];
  var addProduct = function (obj, dogReference, gender) {
    var index = 0;
    var isFound = false;
    (obj).forEach(function (element) {
      if (element.dogReference !== dogReference && !isFound) {
        index++;
      } else {
        isFound = true;
      }
    });
    isFound = false;
    var cartIndex = 0;
    cartItems.forEach(function (element) {
      if ((element.dogReference !== dogReference || element.gender !== gender) && !isFound) {
        cartIndex++;
      } else {
        isFound = true;
      }
    });
    if (isFound === true) {
      cartItems[cartIndex].quantity++;
    } else {
      if (gender === "male") {
        var price = obj[index].priceMale;
      } else {
        var price = obj[index].priceFemale;
      }
      cartItems.push({
        "dogReference": obj[index].dogReference,
        "dogName": obj[index].dogName,
        "quantity": 1,
        "gender": gender,
        "price": price
      });
    }
  };
  var getProducts = function () {
    return cartItems;
  };
  var getTotal = function () {
    var total = 0;
    for (var i = 0; i < cartItems.length; i++) {
      total += (cartItems[i].price * cartItems[i].quantity);
    }
    return total;
  };
  return {
    addProduct: addProduct,
    getProducts: getProducts,
    getTotal: getTotal
  };
});
ecommerceApp.controller('contentCtrl', ['$scope', '$http', 'productService', function ($scope, $ĥttp, productService) {
  $scope.cartItems = [];
  $ĥttp.get('assets/js/items.json').then(function (response) {
    $scope.items = response.data;
  });
  $scope.catfilter = function (category) {
    $scope.search = {
      'category': category
    };
  };
  $scope.addCart = function (dogReference, gender) {
    productService.addProduct($scope.items, dogReference, gender);
  };
  $scope.sorts = [
    { value: '', label: 'Aucun'},
    {value: 'dogName', label: 'A-Z'},
    {value: '-dogName', label: 'Z-A'},
    {value: 'priceFemale', label: 'Prix croissant'},
    {value: '-priceFemale', label: 'Pix décroissant'}
  ];
  $scope.sortList = $scope.sorts[0];
}]);
ecommerceApp.controller('CartCtrl', ['$scope', 'productService', function ($scope, productService) {
  $scope.cartDogs = productService.getProducts();
  $scope.getTotal = function () {
    return productService.getTotal();
  };
}]);
