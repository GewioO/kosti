var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var norseUtils = require('norseUtils');
var votesLib = require('votesLib');
var blogLib = require('blogLib');
var userLib = require('userLib');
var helpers = require('helpers');

exports.get = handleReq;
exports.post = handleReq;

function handleReq(req) {
    var me = this;

    function renderView() {
        var view = resolve('user.html');
        var model = createModel();
        var body = thymeleaf.render(view, model);
        var fileName = portal.assetUrl({path:'js/userpage.js'});
        return {
          body: body,
          contentType: 'text/html',
          pageContributions: {
            bodyEnd: [
                "<script src='"+fileName+"'></script>"
            ]
          }
        };
    }

    function createModel() {

        var up = req.params;
        var content = portal.getContent();
        content.image = norseUtils.getImage( content.data.userImage, 'block(140,140)', 1 );
        var currUser = userLib.getCurrentUser();
        var userSystemObj = userLib.getSystemUser(content.data.email);
        content.votes = votesLib.countUserUpvotes(userSystemObj.key);
        var date = new Date(content.publish.from.replace('Z', ''));
        content.date = date.getDate() + ' ' + norseUtils.getMonthName(date) + ' ' + date.getFullYear();
        var response = [];
        var site = portal.getSiteConfig();

        var bookmarks = blogLib.getUserBookmarks( content.data.bookmarks );
        var articles = contentLib.query({
            start: 0,
            count: 999999,
            query: "data.author = '" + content._id + "'"
        }).hits;
        if( articles && articles.length > 0 ){
            content.articles = blogLib.beautifyArticleArray(articles);
        }
        if( bookmarks && bookmarks.length > 0 ){
            content.bookmarks = blogLib.beautifyArticleArray(bookmarks);
        }
        var active = {
            bookmarks: '',
            articles: '',
            comments: '',
            notifications: ''
        }
        if( up.action == 'bookmarks' ){
            active.bookmarks = 'active';
            var articlesView = blogLib.getArticlesView(bookmarks);
        } else {
            active.articles = 'active';
            var articlesView = blogLib.getArticlesView(articles);
        }

        var model = {
            content: content,
            currUser: currUser.key == userSystemObj.key,
            app: app,
            active: active,
            social: site.social,
            articlesView: articlesView,
            pageComponents: helpers.getPageComponents(req)
        };

        return model;


    }

    return renderView();
}