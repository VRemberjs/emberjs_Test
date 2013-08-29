/****************************
*		 Application		*
*****************************/

window.App = Ember.Application.create({
	ready: function() {
		Em.Logger.info('The App is loaded!!!');
	},
	// LOG_TRANSITIONS_INTERNAL: true,
	LOG_TRANSITIONS: true
});

/****************************
*		 Routing			*
*****************************/

App.Router.map(function() {
	// put your routes here
	this.resource('list', function() {
		this.route('song', { path: '/:song_id' });
	});
	this.resource('grid', function() {
		this.route('song', { path: '/:song_id' });
	});
});

App.LoadingRoute = Ember.Route.extend({});

App.ApplicationRoute = Ember.Route.extend({
	model: function() {
		// this.transitionTo('list');
		return [{
			prop: 'title',
			title: 'Alphabetical'
		},{
			prop: 'genre',
			title: 'By Genres'
		},{
			prop: 'author',
			title: 'By Author'
		},{
			prop: 'album',
			title: 'By Album'
		}];
	},
	events: {
		setMetaInfo: function(data) {
			var  metaData = this.get('controller').getFormatMeta(data);
			this.get('controller').set('meta_info', metaData);
		}
	}
});



App.SongRoute = Ember.Route.extend({
	model: function() {
		// App.Song.find();
		window.KKK = this.get('controller');
	}
});

App.ListRoute = Ember.Route.extend({
	model: function() {
		window.LIST = this;
	}
});

/****************************
*		 Models				*
*****************************/


App.Store = DS.Store.extend({
	revision: 12,
	adapter: 'DS.FixtureAdapter'
});


App.Song = DS.Model.extend({
	title: DS.attr('string'),
	time: DS.attr('number'),
	author: DS.attr('string'),
	genre: DS.attr('string'),
	album: DS.attr('string'),
	icon: DS.attr('string')
});

App.Song.FIXTURES = PlayList;

/* 
App.Song = Ember.Object.extend({
	title: null,
	time: null,
	author: null,
	genre: null,
	album: null,
	icon: null
}); */


/****************************
*		 Controllers		*
*****************************/

App.ApplicationController = Em.Controller.extend({
	meta_info: '',
	sortBy: function(prop) {
		App.SongController.set('sortProperties', [prop]);
	},
	getFormatMeta: function(data) {
		data = data || {};
		return [
			'Title: ' + data.title,
			'Author: ' + data.author,
			'Album: ' + data.album,
			'Genres: ' + data.genre,
			' (Time: ' + data.time + ')'
		].join(' | ');
	},
	play: function() {
		var currSongId = App.Router.router.currentParams.song_id,
			currSong = {};
			
		if ( currSongId ) {
			currSong = $.extend({}, App.SongController.content.get(currSongId));
		}
		this.set('meta_info', this.getFormatMeta(currSong));
	}
});
 
App.ListController = Em.ArrayController.extend({
	
});

App.SongController = Ember.ArrayController.create({
	content: PlayList,
	sortProperties: ['title'],
	sortAscending: true
});

/****************************
*		 Views				*
*****************************/

App.SongListView = Ember.View.extend({
    templateName: 'song-list-view',
	doubleClick: function(e) {	
		this.get('controller').send('setMetaInfo',this.get('content'));
	}
});

App.SongGridView = Ember.View.extend({
    templateName: 'song-grid-view',
	doubleClick: function(e) {
		this.get('controller').send('setMetaInfo',this.get('content'));
	}
});

/****************************
*		 Collections		*
*****************************/

App.SongsListView = Ember.CollectionView.extend({
	tagName: 'tbody',
	itemViewClass: App.SongListView,
	content: App.SongController
});

App.SongsGridView = Ember.CollectionView.extend({
	tagName: 'div',
	itemViewClass: App.SongGridView,
	content: App.SongController
});













