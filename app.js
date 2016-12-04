$(document).ready(function(){

	var State = function(){
		this.matchData = [0,0,0,0,0];
		this.summonerID=0;
		this.matchID = [0,0,0,0,0];
		this.apiKey = "RGAPI-a5dc20b2-b1ef-4912-8da7-6376378a341d"; 
		this.params = {api_key:this.apiKey};
		this.CsData =[0,0,0,0,0];
	};
	var state = new State();
	

	var ctx = document.getElementById("myChart");
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
			datasets: [{
				label: '# of Votes',
				fill: true,
				data: state.CsData,
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255,99,132,1)',
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
		}
	});





	
	function findCsVal(data, i){
		state.CsData.push(data.participants[i].timeline.creepsPerMinDeltas.zeroToTen);
		console.log(data.participants[i].timeline.creepsPerMinDeltas.zeroToTen);
	}
	function findParticipantID(data){
		for(var i=0; i <10; i++){
			//participantIdentities.participantId[i]
			if(data.participantIdentities[i].player.summonerName === $('#query').val()){
				
				console.log(data.participantIdentities[i]);
				
				findCsVal(data, i);
			}
			//error handling
		}


		

	}

	function test(){
		function getSummonerId (){
			var q = $('#query').val();
			var URL = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + q;
			return $.getJSON(URL, {
				api_key:state.apiKey,

			});
		}
		var promised = getSummonerId();
		promised.done(function(data){
			state.summonerID=data[$('#query').val()].id;
			setTimeout(GetMatches, 100,data[$('#query').val()].id);
			console.log("works");
			console.log(state.summoner);
		});
		promised.fail(function(data){
			console.log("failed trying again");
			setTimeout(test, 10000 )});

	}

	function GetMatches(summonerID){
		var URL = "https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + summonerID + "/";
		$.getJSON(URL,
		{

			api_key:state.apiKey,


		},

		function(data)
		{
			for(var i = 0; i <5; i++){
				state.matchID.push(data.matches[i].matchId);
			}
			
			console.log(data);
			for(var j = 0; j <5; j++){
				matchStats(state.matchID[j]);
			}

			
		});
	}
	function matchStats(matchID){
		
		
		function matchStatsIn (matchID){
			var URL = "https://na.api.pvp.net/api/lol/na/v2.2/match/" + matchID + "/";
			return $.getJSON(URL, {
				api_key:state.apiKey,

			});
		}
		var promised = matchStatsIn(matchID);
		promised.done(function(data){
			findParticipantID(data);
			state.matchData.push(data);
			state.matchID.splice(0,1);
			console.log("works");
		});
		promised.fail(function(data){
			console.log("failed to get match data. . . trying again")
			console.log(state);
			setTimeout(matchStats, 10000, matchID)});

	}
	

	$("#submit").click(function(event){
		test();
		console.log(state);

	});
	console.log(state.ID);
});
