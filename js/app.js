App = Ember.Application.create();

App.Router.map(function() {
    this.resource("application");
    this.resource("index",{ path: '/' });
    this.resource("about",{ path: '/about'});
});

App.IndexRoute = Ember.Route.extend({
    model: function(){
        return App.RedditLink.findAll('aww');
    }
});

App.IndexController = Ember.ObjectController.extend({
    subredditHeader: 'aww',
    loadList: function() {
        // try subreddit with these names: cute, aww
        var value = this.get('subreddit');
        if(value){
            this.set('subredditHeader', value);
            this.set('model', App.RedditLink.findAll(value));
            this.set('subreddit', '');
        }
    }
});

App.RedditLink = Ember.Object.extend({

    thumbnailUrl: function(){
        var thumbnail = this.get('thumbnail');
        return (thumbnail === 'default') ? null: thumbnail;
    }.property('thumbnail')

});

App.RedditLink.reopenClass({
    findAll: function(subreddit){
        var links =[];
        $.getJSON('http://www.reddit.com/r/'+ subreddit + '/.json?jsonp=?').then(function(response){
            response.data.children.forEach(function(child){
               links.pushObject(App.RedditLink.create(child.data));
            });
        });
        return links;
    }
});
