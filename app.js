$(document).ready(function(){

	var state ={
		thumbnails:[],
		ID: 0,
		title:[]
	}

	var URL2 = "https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + state.ID + "/";
	var renderList = function(state, element) {

		var itemsHTML = state.thumbnails.map(function(item, index) {

			return "<li><a href='https://www.youtube.com/watch?v="+state.videoID[index] +"' ><img class ='thumbnail' src='"+ item + "' alt =some content ></a><span class='title'>"+ state.title[index]+"</span></li>";
		});
		element.html(itemsHTML);
	};




	$("#submit").click(function(event){
		var q = $('#query').val();
		var URL = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + q;
		$.getJSON(URL,
		{

			api_key:'',


		},






		function(data)
		{
			state.ID = data.gripfael.id;
		}
		);

		console.log(state);

		$.getJSON(URL2,
		{

			api_key:'',


		},

		function(data)
		{

			console.log(state.ID);
			console.log(data);
		});
	}
	);

	console.log(state.ID);
});
