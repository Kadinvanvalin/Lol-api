$(document).ready(function(){

	var State = function(){
		this.matchData = [];
		this.summonerID=0;
		this.matchID = [];
		this.apiKey = ""; 
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
				  fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
				data: state.CsData,
				
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
// sort match data array by match id #
function sortMatchData(){
	
state.matchData.sort(function (a, b) {
  if (a.matchId > b.matchId) {
    return 1;
  }
  if (a.matchId < b.matchId) {
    return -1;
  }
  // a must be equal to b
  return 0;
});
for(var i= 0; i<6; i++){
	findParticipantID(state.matchData[i]);
}
 
}


	//pushs Cs data stored in state to an arry in state
	function findCsVal(data, i){
		state.CsData.push(data.participants[i].timeline.creepsPerMinDeltas.zeroToTen);
		console.log(data.participants[i].timeline.creepsPerMinDeltas.zeroToTen);
	}
// compairs the inputed summoner name with the participants by looping over all the participants, invoking findcd function if it matches
	function findParticipantID(data){
		for(var j=0; j <10 ; j++){
			console.log(data);
			if(data.participantIdentities[j].player.summonerId === state.summonerID){
				
				console.log(data.participantIdentities[j]);
				
				findCsVal(data, j);

			}
			myChart.update();
		}


		

	}
//finds the summoner id # by name. fail method recalls api call after delay
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
			$("#status").html("Ok! found your summoner name, asking riot for match data")
			console.log("works");
			console.log(state.summoner);
		});
		promised.fail(function(data){
			$("#status").html("couldn't find your summoner name, will retry in 10 seconds");
			console.log("failed trying again");
			setTimeout(test, 10000 )});

	}
// this gets an array of matches that the summoner has played, pushes 5 match IDs to state then invokes matchstats function 5 times with the
//pushed data
	function GetMatches(summonerID){
		function GetMatchPromise(summonerID){
		var URL = "https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + summonerID + "/";
			return $.getJSON(URL, {
				api_key:state.apiKey,

			});
		}

		var promised = GetMatchPromise(summonerID);

		promised.done(function(data){
			$("#status").html("found match data, pushing results to state, then we will ask riot for match stats!");
			for(var i = 0; i <5; i++){
				state.matchID.push(data.matches[i].matchId);
			}
			
			console.log(data);
			for(var j = 0; j <5; j++){
				matchStats(state.matchID[j]);
			}
		});

			promised.fail(function(data){
			$("#status").html("failed to get match list. . . trying again in ten seconds");
			console.log("failed to get match list. . . trying again")
			console.log(state);
			setTimeout(GetMatches, 10000, summonerID)});
		


	}
	//gets json match stats, invokes findPar function when done, recalls api if fail
	function matchStats(matchID){
		
		
		function matchStatsIn (matchID){
			var URL = "https://na.api.pvp.net/api/lol/na/v2.2/match/" + matchID + "/";
			return $.getJSON(URL, {
				api_key:state.apiKey,

			});
		}
		var promised = matchStatsIn(matchID);
		promised.done(function(data){
			$("#status").html("found match data!");
			state.matchData.push(data);
			if(state.matchData.length === 5){sortMatchData();}
		});
		promised.fail(function(data){
			$("#status").html("huh, riot didnt send the match data we asked for, we will wait 10 seconds then ask them for it again");
			console.log("failed to get match data. . . trying again")
			console.log(state);
			setTimeout(matchStats, 10000, matchID)});

	}
	
// submits summoner name 
	$("#submit").click(function(event){
		
		state.apiKey = $("#js-api").val(); 
		
		var q = $('#query').val();
		test();
		console.log(state);

	});
	console.log(state.ID);
});



//adding model
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}