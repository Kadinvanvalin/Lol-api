$(document).ready(function(){

	var State = function(){
		this.matchData = [];
		this.summonerID=0;
		this.matchID = [];
		this.apiKey = "RGAPI-a5dc20b2-b1ef-4912-8da7-6376378a341d"; 
		this.params = {api_key:this.apiKey};
		this.CsData =[];
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
			if(data.participantIdentities[i].player.summonerName === "gripfael"){
				
				console.log(data.participantIdentities[i]);
				
				findCsVal(data, i);
			}
			//error handling
		}


		

	}




	$("#submit").click(function(event){
		var q = $('#query').val();
		var URL = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + q;
		console.log(state.params);
		$.getJSON(URL,state.params,

		function(data)
		{
			state.summonerID=data.gripfael.id
			setTimeout(GetMatches, 1000,data.gripfael.id);
			console.log(data);
		}
		);

		console.log(state);


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
			for(var i = 0; i <5; i++){

					setTimeout(matchStats, 10000,state.matchID[i] )
				}

			
		});
	}

	function matchStats(matchID){
	var URL = "https://na.api.pvp.net/api/lol/na/v2.2/match/" + matchID + "/";
		$.getJSON(URL,
		{

			api_key:state.apiKey,


		},

		function(data)
		{

			// for(var i = 0; i <5; i++){

			// 		console.log(findParticipantID(data));
			// 	}
			findParticipantID(data);
			state.matchData.push(data);
			console.log(data);
			
		});
	}
	
});
	console.log(state.ID);
});
