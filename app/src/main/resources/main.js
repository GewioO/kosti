var event = require("/lib/xp/event");
var content = require("/lib/xp/content");

var libLocation = "site/lib/";
var norseUtils = require(libLocation + "norseUtils");
var votesLib = require(libLocation + "votesLib");
var contextLib = require(libLocation + "contextLib");

// catch events
event.listener({
  type: "node.created",
  localOnly: false,
  callback: function(e) {
    if (e.data && e.data.nodes) {
      var nodes = parseNodes(e.data.nodes);
      for (var i = 0; i < nodes.length; i++) {
        var node = content.get({ key: nodes[0].id });
        if (node && node.type && node.type == app.name + ":article") {
          contextLib.runAsAdmin(function() {
            votesLib.createBlankVote(node._id, "article");
          });
        } else if (node && node.type && node.type == app.name + ":hashtag") {
          contextLib.runAsAdmin(function() {
            votesLib.createBlankVote(node._id, "hashtag");
          });
        }
      }
    }
    return true;
  }
});

// catch events
event.listener({
  type: "node.pushed",
  localOnly: false,
  callback: function(e) {
    if (e.data && e.data.nodes) {
      var nodes = parseNodes(e.data.nodes);
      for (var i = 0; i < nodes.length; i++) {
        var node = content.get({ key: nodes[0].id });
        if (node && node.type && node.type == app.name + ":article") {
          var vote = votesLib.getNode(node._id);
          if (!vote) {
            votesLib.createBlankVote(node._id, "article");
          }
          votesLib.setVoteDate(vote._id, node.publish.from);
        }
      }
    }
    return true;
  }
});

function parseNodes(nodes) {
  if (typeof nodes != "string") {
    return nodes;
  }
  var regexp = new RegExp("{([^}]+)}", "g");
  var nodes = nodes.match(regexp);
  var nodesArray = [];

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i].replace("{", "").replace("}", "");
    var attributes = node.split(",");
    var obj = {};
    for (var j = 0; j < attributes.length; j++) {
      var attr = attributes[j].trim().split("=");
      obj["" + attr[0]] = attr[1];
    }
    nodesArray.push(obj);
  }

  return nodesArray;
}
