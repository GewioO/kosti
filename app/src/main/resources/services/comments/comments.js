var thymeleaf = require("/lib/thymeleaf");

var libLocation = "../../site/lib/";
var contextLib = require(libLocation + "contextLib");
var commentsLib = require(libLocation + "commentsLib");
var norseUtils = require(libLocation + "norseUtils");
var notificationLib = require(libLocation + "notificationLib");

exports.post = function(req) {
  var params = req.params;
  var result = {};
  switch (params.action) {
    case "addComment":
      notificationLib.addNotification(params.parent, "comment");
      result = commentsLib.addComment(
        params.parent,
        params.body,
        params.articleId
      );
      return {
        body: thymeleaf.render(
          resolve("../../site/pages/components/comments/commentItem.html"),
          { comment: result }
        ),
        contentType: "text/html"
      };
      break;
    case "vote":
      notificationLib.addNotification(params.id, "like");
      result = commentsLib.voteForComment(params.id, params.user);
      break;
    case "remove":
      result = commentsLib.removeComment(params.id, params.reason);
      break;
    case "report":
      result = commentsLib.reportComment(params.id, params.reason);
  }
  return {
    body: result,
    contentType: "application/json"
  };
};
