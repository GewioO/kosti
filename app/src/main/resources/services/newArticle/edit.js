var thymeleaf = require("/lib/thymeleaf");
var authLib = require("/lib/xp/auth");
var portal = require("/lib/xp/portal");
var contentLib = require("/lib/xp/content");
var i18nLib = require("/lib/xp/i18n");

var libLocation = "../../site/lib/";
var norseUtils = require(libLocation + "norseUtils");
var helpers = require(libLocation + "helpers");
var userLib = require(libLocation + "userLib");
var kostiUtils = require(libLocation + "kostiUtils");
var spellLib = require(libLocation + "spellsLib");
var articlesLib = require(libLocation + "articlesLib");
var blogLib = require(libLocation + "blogLib");

exports.get = handleGet;

function handleGet(req) {
  var me = this;

  function renderView() {
    var user = userLib.getCurrentUser();
    if (!user) {
      return helpers.getLoginRequest();
    }
    var view = resolve("articleSubmit.html");
    return {
      body: thymeleaf.render(view, createModel()),
      contentType: "text/html",
    };
  }

  function createModel() {
    var user = userLib.getCurrentUser();
    var articleStatus = articlesLib.checkArticleStatus(req.params.id);

    return {
      access:
        articleStatus.exists && (articleStatus.author || user.roles.moderator),
      published: articleStatus.exists && articleStatus.published,
      pageComponents: helpers.getPageComponents(
        req,
        null,
        null,
        "Новая статья"
      ),
    };
  }

  return renderView();
}
