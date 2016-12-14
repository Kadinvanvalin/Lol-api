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
			label:"my first dataset",
			labels: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
			datasets: [{
				label:"CS Δ per min",
				  fill: false,
              backgroundColor: "#027292",
            borderColor: "#a3cdf7",
				data: state.CsData,
				
			}]
		},
		options: {

			
			scales: {
				yAxes:  [{
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
		$('#spinnerContainer').spin(false);
		state.CsData.push(data.participants[i].timeline.creepsPerMinDeltas.zeroToTen);
	}
// compairs the inputed summoner name with the participants by looping over all the participants, invoking findcd function if it matches
	function findParticipantID(data){
		for(var j=0; j <10 ; j++){
			
			if(data.participantIdentities[j].player.summonerId === state.summonerID){
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
			
			var Obj = Object.keys(data)[0];
			
			state.summonerID= data[Obj].id;
			setTimeout(GetMatches, 100,data[Obj].id);
		});
		promised.fail(function(data){
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
			
			
			
			for(var i = 0; i <5; i++){
				state.matchID.push(data.matches[i].matchId);
			}
			for(var j = 0; j <5; j++){
				matchStats(state.matchID[j]);
			}
		});

			promised.fail(function(data){
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
			state.matchData.push(data);
			

			if(state.matchData.length === 5){sortMatchData();}
		});
		promised.fail(function(data){
			setTimeout(matchStats, 10000, matchID)});

	}
	
// submits summoner name 
	$("#submit").click(function(event){
		
	$('#spinnerContainer').spin(opts)

		state.apiKey = $("#js-api").val(); 
		
		var q = $('#query').val();
		test();
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

 var opts = {
      lines: 13, // The number of lines to draw
      length: 40, // The length of each line
      width: 15, // The line thickness
      radius: 10, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      color: '#000', // #rgb or #rrggbb
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '50%', // Top position relative to parent in px
      left: '50%' // Left position relative to parent in px
    };
    
});