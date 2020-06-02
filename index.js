
const requestURL =
  "https://api.themoviedb.org/3/trending/all/day?api_key=117da97e02273eef680c6d344da7c586";
const movieFindById =
  "https://api.themoviedb.org/3/movie/{movie_id}?api_key=117da97e02273eef680c6d344da7c586&language=en-US";
const tvFindById = 
	"https://api.themoviedb.org/3/tv/{tv_id}?api_key=117da97e02273eef680c6d344da7c586&language=en-US"; 
const searchMovie =
  "https://api.themoviedb.org/3/search/movie?api_key=117da97e02273eef680c6d344da7c586&query={searchText}";
const movieRecomendationID = 
  "https://api.themoviedb.org/3/movie/{movie_id}/recommendations?api_key=117da97e02273eef680c6d344da7c586&language=en-US&page=1";
const tvRecomendationID = 
"https://api.themoviedb.org/3/tv/{tv_id}/recommendations?api_key=117da97e02273eef680c6d344da7c586&language=en-US&page=1";
const topMovie = 
"https://api.themoviedb.org/3/movie/top_rated?api_key=117da97e02273eef680c6d344da7c586&language=en-US&page=1";
const movieVideo =
"https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=117da97e02273eef680c6d344da7c586&language=en-US";

const PopularMovie =
"https://api.themoviedb.org/3/movie/popular?api_key=117da97e02273eef680c6d344da7c586&language=en-US&page=1";

const Genres =
"https://api.themoviedb.org/3/genre/movie/list?api_key=117da97e02273eef680c6d344da7c586&language=en-US";


const sizeImage = "w300";
const posterUrl = "https://image.tmdb.org/t/p/{sizeImage}/{imagePath}";
const posterBack ="https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/{posterPath}"
  
const xhr = new XMLHttpRequest();


function sendGetRequest(method, url) {
  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json().then(error => {
      const e = new Error("Server not responds.");
      e.data = error;
      throw e;
    });
  });
}

window.onload = function(e){
	MainRequest();
}

// Send MAIN request
function MainRequest() {
	LoadingShowHide(true);
	ClearDivData();
	ShowHideMainList(true);
	
	sendGetRequest("GET", requestURL)
	  .then(data => ShowRes(data, posterUrl))
	  .catch(err => ShowError(err));
	  
	sendGetRequest("GET", topMovie)
		.then(data => ShowTopMovies(data, "movie", posterUrl))
		.catch(err => ShowError(err));

	sendGetRequest("GET", PopularMovie)
		.then(data => ShowPopularMovies(data, "movie", posterUrl))
		.catch(err => ShowError(err));

}

// Search Movie
function searchBtnClick() {
	LoadingShowHide(true);
	ClearDivData();
	var searchBtn = document.getElementById("searchInput");
	var searchText = searchBtn.value;
	searchText = searchText.replace(" ", "+");
	var url = searchMovie.replace("{searchText}", searchText);
		sendGetRequest("GET", url)
		.then(data => ShowSearchRes(data, posterUrl))
		.catch(err => ShowError(err));
}

// Back btn
function back(){
	ShowHideMainList(true);
	movieDetails.innerHTML = "";
	movieRecomendations.innerHTML = "";
}

 function clearClick() {
	searchInput.value = "";
 }

// Clear search
function home(){
	LoadingShowHide(true);
	searchInput.value = "";
	MainRequest();
}

// Clear Div Data
function ClearDivData(){
	resultUL.innerHTML = "";
	movieDetails.innerHTML = "";
	movieRecomendations.innerHTML = "";

}
 
// Show Details
function GetMovieDetail(id, type) {
	LoadingShowHide(true);
	switch(type) {
	  case "movie":
		sendGetRequest("GET", movieFindById.replace("{movie_id}", id))
			.then(data => ShowMovieDetail(data, type, posterUrl, posterBack))
			.catch(err => ShowError(err));

		break;
	  case "tv":
		sendGetRequest("GET", tvFindById.replace("{tv_id}", id))
			.then(data => ShowMovieDetail(data, type, posterUrl, posterBack))
			.catch(err => ShowError(err));
		break;
	  default:
		// code block
	}
}

function ShowMovieDetail(data, type, url1, url2) {
	url2 =url2.replace("{posterPath}", data.backdrop_path);
	if(data.poster_path != null) {
		url1 = url1.replace("{sizeImage}", sizeImage);
		url1 = url1.replace("{imagePath}", data.poster_path);
	} else
		url1 = 'Default.png';
	ShowHideMainList(false);
	movieDetails.innerHTML = "";
    movieDetails.insertAdjacentHTML(
      "beforeend",
      "<div style= 'background-image: url("+ url2+")' background-position: right -200px top; background-size: cover;><div class='movieDetail mb-5')>"+
	  "<div><img src='"+ url1 +"'></img>"+
			
			"<div class=img_info><span>Popularity: "+data.popularity+"</span>&nbsp;"+
			"<span>Vote average: "+data.vote_average+"</span>&nbsp;"+
			"<span>Vote count: "+data.vote_count+"</span></div>"+

		"</div>"+
		"<div class=Info>" +
			"<div><h2> "+(type == "movie" ? data.title : data.name) +". </h2></div></br>"+
			"<div><h3>Overview:</h3>"+data.overview+"</div></br>"+
			"<div>Release date: "+(type == "movie" ? data.release_date : data.first_air_date)+"</div>"+
		"</div>"+
	  "</div></div>"
	);

	window.scrollTo(0, 0);
	
	if(type == "movie") {
	sendGetRequest("GET", movieRecomendationID.replace("{movie_id}", data.id))
		.then(data => ShowRecomendation(data, type, posterUrl))
		.catch(err => ShowError(err));
	} 
	else
	{
		sendGetRequest("GET", tvRecomendationID.replace("{tv_id}", data.id))
		.then(data => ShowRecomendation(data, type, posterUrl))
		.catch(err => ShowError(err));
	}

	sendGetRequest("GET", movieVideo.replace("{movie_id}", data.id))
	.then(data => ShowVideo(data, movieVideo))
	.catch(err => ShowError(err));

	LoadingShowHide(false);
}


//parameters youtube
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function ShowVideo(data, movieVideo){
	console.log(data);
	Nameplayer.innerHTML = null;

	var results = data["results"];
		
	results.forEach(function(result){
		Nameplayer.innerHTML =`<h3 class="m-3 text-center">${result.name}</h3>`;

		if(typeof(player) != "undefined") { 
			player.loadVideoById({
				videoId: result.key,
                startSeconds: 0,
                suggestedQuality: 'default'
			});
			player.pauseVideo();
		} 
		else 
		{
			player = new YT.Player('playerMovie', {
				height: '480',
				width: '760',
				videoId: result.key,
				events: {
				  'onStateChange': onPlayerStateChange
				}
			});
		}
	});
}  
  
var done = false;
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
	  setTimeout(stopVideo, 6000);
	  done = true;
	}
}
  
function stopVideo() {
	player.stopVideo();
}

function ShowRecomendation(data, type, url) {
	//console.log(data);
	url = url.replace("{sizeImage}", sizeImage);
	var results = data["results"];
	if(typeof(results) === "undefined")
		movieRecomendations.innerHTML = "<div><h3>"+type == "movie" ? "Movie" : "Serial" +" havn't recomendations: </h3></div>";
	else {
		movieRecomendations.innerHTML = "<div class='Title'><h1>Recomendations: </h1><div>";
		results.forEach(function(result){
			movieRecomendations.insertAdjacentHTML(
				"beforeend",
				"<div class='movie col-md-3 col-ms-3 text-center' onclick='GetMovieDetail(" +
				result.id + ', "' + type + '"' +
				");'><img src='"+ url.replace("{imagePath}", result.poster_path) +"'></img><div class='card-body'><a class='movie-detail-link' id='" +
				result.id +
				"'> " +
				(type == "movie" ? result.title : result.name) +
				"</a> ( " +
				(type == "movie" ? result.release_date : result.first_air_date) +
				")</div> </div>"
			);
		});
	}
}

function ShowTopMovies(data, type, url) {
	url = url.replace("{sizeImage}", sizeImage);
	var results = data["results"];
	if(typeof(results) === "undefined")
		movieTop.innerHTML = "<div><h3>"+type == "movie" ? "Movie" : "Serial" +" havn't top: </h3></div>";
	else {
		movieTop.innerHTML = "<div class='Title m-3'><h1>Top Movie: </h1><div>";
		results.forEach(function(result){
			movieTop.insertAdjacentHTML(
				"beforeend",
				"<div class='movie col-md-2 col-ms-2 text-center' onclick='GetMovieDetail(" +
				result.id + ', "' + type + '"' +
				");'><img src='"+ url.replace("{imagePath}", result.poster_path) +"'></img><div class='card-body'><a class='movie-detail-link' id='" +
				result.id +
				"'> " +
				(type == "movie" ? result.title : result.name) +
				"</a> ( " +
				(type == "movie" ? result.release_date : result.first_air_date) +
				")</div> </div>"
			);
		});
	}
}





//Popular Movie

function ShowPopularMovies(data, type, url) {
	//console.log(data);
	url = url.replace("{sizeImage}", sizeImage);
	var results = data["results"];
	if(typeof(results) === "undefined")
		moviePopular.innerHTML = "<div><h3>"+type == "movie" ? "Movie" : "Serial" +" havn't top: </h3></div>";
	else {
		moviePopular.innerHTML = "<div class='Title m-3'><h1>Popular Movie: </h1><div>";
		results.forEach(function(result){
			moviePopular.insertAdjacentHTML(
				"beforeend",
				"<div class='movie col-md-2 col-ms-2 text-center' onclick='GetMovieDetail(" +
				result.id + ', "' + type + '"' +
				");'><img src='"+ url.replace("{imagePath}", result.poster_path) +"'></img><div class='card-body'><a class='movie-detail-link' id='" +
				result.id +
				"'> " +
				(type == "movie" ? result.title : result.name) +
				"</a> ( " +
				(type == "movie" ? result.release_date : result.first_air_date) +
				")</div> </div>"
			);
		});
	}
}

// Show Result
function ShowRes(data, url) {
	url = url.replace("{sizeImage}", sizeImage);
	var results = data["results"];
	if(results) {
		ClearDivData();
		resultUL.innerHTML = "<div class='Title m-3'><h1>Trends: </h1><div>";
	results.forEach(function(result) {
		resultUL.insertAdjacentHTML(
		"beforeend",
		"<div class='movie col-md-2 col-ms-2 text-center' onclick='GetMovieDetail(" +
		result.id + ', "' + result.media_type + '"' +
		");'><img src='"+ url.replace("{imagePath}", result.poster_path) +"'></img><div class='card-body'><a class='movie-detail-link' id='" +
		result.id +
		"'>" +
		(result.media_type == "movie" ? result.title : result.name) +
		"</a> ( " +
		(result.media_type == "movie" ? result.release_date : result.first_air_date) +
		")</div></div>"
		);
	 });
	}
	LoadingShowHide(false);
  }

  



  function ShowSearchRes(data, url) {
	url = url.replace("{sizeImage}", sizeImage);
	var results = data["results"];
	if(results) {
		ClearDivData();
  
		ShowHideMainList(true);
	results.forEach(function(result) {
		var poster = result.poster_path != null ? url.replace("{imagePath}", result.poster_path) : 'Default.png' ;
		resultUL.insertAdjacentHTML(
		"beforeend",
		"<div class='movie col-md-2 col-ms-2 text-center ' onclick='GetMovieDetail(" +
		result.id + ', "movie"' +
		");'><div><img src='"+ poster +
		"' alt='Not Found'></img></div><a class='movie-detail-link' id='" +
		result.id +
		"'>" +
		result.title +
		"</a> : " +
		result.release_date +
		"</div>"
		);
	 });
	}
	LoadingShowHide(false);
  }
  
function ShowError(error) {
  console.log(error);
  document.getElementById("contentTitle").innerText = error;
  ClearDivData();
  LoadingShowHide(false);
}

// Main list
function ShowHideMainList(statuss){
	if(statuss) {
		resultUL.style.display = "flex";
		backBtn.style.display = "none";
	} else{
		resultUL.style.display = "none";
		backBtn.style.display = "flex";
	}
}

// Loading
function LoadingShowHide(statusLoading){
	var loading = document.getElementById("loadingGif");
	if(statusLoading)
		loading.style.display = "flex";
	else 
	{
		setTimeout(function () {
			loading.style.display = "none";
		}, 300);
	}
}

