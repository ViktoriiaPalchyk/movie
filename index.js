//import "styles.css";

//const requestURLLatest = 'https://api.themoviedb.org/3/movie/latest?api_key=117da97e02273eef680c6d344da7c586&language=en-US'
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

const sizeImage = "w300";
const posterUrl = "https://image.tmdb.org/t/p/{sizeImage}/{imagePath}";
  
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
}

// Search Movie
function searchBtnClick() {
	LoadingShowHide(true);
	ClearDivData();
	var searchBtn = document.getElementById("searchInput");
	var searchText = searchBtn.value;
	searchText = searchText.replace(" ", "+");
	var url = searchMovie.replace("{searchText}", searchText);
	//alert(url);
	//if(typeof(searchBtn) !== 'undefined') {
		sendGetRequest("GET", url)
		.then(data => ShowSearchRes(data, posterUrl))
		.catch(err => ShowError(err));
	//}
}

// Back btn
function back(){
	ShowHideMainList(true);
	movieDetails.innerHTML = "";
	movieRecomendations.innerHTML = "";
}

 function clearClick() {
	//alert(1);
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
	//var res = data.split("|");
	//alert(type);
	LoadingShowHide(true);
	//alert(movieFindById.replace("{movie_id}", id));
	switch(type) {
	  case "movie":
		sendGetRequest("GET", movieFindById.replace("{movie_id}", id))
			.then(data => ShowMovieDetail(data, type, posterUrl))
			.catch(err => ShowError(err));
		break;
	  case "tv":
		sendGetRequest("GET", tvFindById.replace("{tv_id}", id))
			.then(data => ShowMovieDetail(data, type, posterUrl))
			.catch(err => ShowError(err));
		break;
	  default:
		// code block
	}
}

function ShowMovieDetail(data, type, url) {
	if(data.poster_path != null) {
		url = url.replace("{sizeImage}", sizeImage);
		url = url.replace("{imagePath}", data.poster_path);
	} else
		url = 'Default.png';
	ShowHideMainList(false);
	movieDetails.innerHTML = "";
    movieDetails.insertAdjacentHTML(
      "beforeend",
      "<div class=movieDetail>"+
	  "<div><img src='"+ url +"'></img>"+
			
			"<div class=img_info><span>Popularity: "+data.popularity+"</span>&nbsp;"+
			"<span>Vote average: "+data.vote_average+"</span>&nbsp;"+
			"<span>Vote count: "+data.vote_count+"</span></div>"+

		"</div>"+
		"<div class=Info>" +
			"<div><h2> "+(type == "movie" ? data.title : data.name) +". </h2><h4>("+(type == "movie" ? data.original_title : data.original_name)+")</h4></div></br>"+
			"<div><h3>Overview:</h3>"+data.overview+"</div></br>"+
			"<div>Release date: "+(type == "movie" ? data.release_date : data.first_air_date)+"</div>"+
		"</div>"+
	  "</div>"
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

	LoadingShowHide(false);
}

function ShowRecomendation(data, type, url) {
	console.log(data);
	url = url.replace("{sizeImage}", sizeImage);
	var results = data["results"];
	//alert(results);
	if(typeof(results) === "undefined")
		movieRecomendations.innerHTML = "<div><h3>"+type == "movie" ? "Movie" : "Serial" +" havn't recomendations: </h3></div>";
	else {
		movieRecomendations.innerHTML = "<div class='Title'><h2>Recomendations: </h2><div>";
		//movieRecomendations.insertAdjacentHTML("beforeend", "<div class='containerReg'>");
		results.forEach(function(result){
			//alert(result);
			movieRecomendations.insertAdjacentHTML(
				"beforeend",
				"<div class='movie' onclick='GetMovieDetail(" +
				result.id + ', "' + type + '"' +
				");'><img src='"+ url.replace("{imagePath}", result.poster_path) +"'></img><a class='movie-detail-link' id='" +
				result.id +
				"'> " +
				(type == "movie" ? result.title : result.name) +
				"</a> ( " +
				(type == "movie" ? result.release_date : result.first_air_date) +
				") </div>"
			);
		});
		//movieRecomendations.insertAdjacentHTML("afterend","</div>");
	}
}

// Show Result
function ShowRes(data, url) {
	url = url.replace("{sizeImage}", sizeImage);
	var results = data["results"];
	//alert(results);
	if(results) {
		ClearDivData();
		resultUL.innerHTML = "<div class='Title'><h2>Trends: </h2><div>";
	results.forEach(function(result) {
		//alert(result.media_type);
		resultUL.insertAdjacentHTML(
		"beforeend",
		"<div class='movie' onclick='GetMovieDetail(" +
		result.id + ', "' + result.media_type + '"' +
		");'><img src='"+ url.replace("{imagePath}", result.poster_path) +"'></img><a class='movie-detail-link' id='" +
		result.id +
		"'>" +
		(result.media_type == "movie" ? result.title : result.name) +
		"</a> ( " +
		(result.media_type == "movie" ? result.release_date : result.first_air_date) +
		")</div>"
		);
	 });
	}
	LoadingShowHide(false);
  }

  function ShowSearchRes(data, url) {
	url = url.replace("{sizeImage}", sizeImage);
	var results = data["results"];
	//alert(results);
	if(results) {
		ClearDivData();
  
		ShowHideMainList(true);
	results.forEach(function(result) {
		//alert(result.media_type);
		//alert(result.poster_path);
		var poster = result.poster_path != null ? url.replace("{imagePath}", result.poster_path) : 'Default.png' ;
		//alert(poster);
		resultUL.insertAdjacentHTML(
		"beforeend",
		"<div class='movie' onclick='GetMovieDetail(" +
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

