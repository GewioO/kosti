var portal = require("/lib/xp/portal");
var contentLib = require("/lib/xp/content");
var thymeleaf = require("/lib/thymeleaf");
var nodeLib = require("/lib/xp/node");

var libLocation = "../../site/lib/";
var contextLib = require(libLocation + "contextLib");
var helpers = require(libLocation + "helpers");
var cartLib = require(libLocation + "cartLib");
var sharedLib = require(libLocation + "sharedLib");
var norseUtils = require(libLocation + "norseUtils");
var storeLib = require(libLocation + "storeLib");

exports.post = function(req) {
  var params = req.params;
  var result = false;
  var view = resolve("cart.html");
  switch (params.action) {
    case "modify":
      contextLib.runAsAdmin(function() {
        result = cartLib.modify(
          params.cartId,
          params.itemId,
          params.amount,
          params.size,
          params.force
        );
      });
      break;
    case "setOrder":
      contextLib.runAsAdmin(function() {
        result = cartLib.setOrder(params.cartId, params.orderId);
      });
      break;
    default:
      result = cartLib.getCart(req.cookies.cartId);
      break;
  }
  return {
    body: result,
    contentType: "application/json"
  };
};
exports.get = function(req) {
  var params = req.params;
  var result = false;
  var view = resolve("cart.html");
  var site = portal.getSiteConfig();
  var shopUrl = portal.pageUrl({
    id: site.shopLocation
  });
  var cart = cartLib.getCart(req.cookies.cartId);
  for (var i = 0; i < cart.items.length; i++) {
    cart.items[i].priceBlock = storeLib.getPriceBlock(cart.items[i]._id);
  }
  return {
    body: thymeleaf.render(view, {
      cart: cart,
      pageComponents: helpers.getPageComponents(req, null, null, "Корзина"),
      shopUrl: shopUrl,
      checkoutUrl: sharedLib.generateNiceServiceUrl("checkout")
    }),
    contentType: "text/html"
  };
};
