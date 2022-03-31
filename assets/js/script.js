// --------------------   VARIABLES DECLARED  -----------------------
var btnSearch = document.querySelector("#btn-search");
var sectionSearch = document.querySelector("#section-search");
var textboxSearch = document.querySelector("#textbox-search");


var omdbApiKey="ef78856e";
var omdbUrl ="https://www.omdbapi.com/?apikey=" + omdbApiKey + "&type=movie&s=";
var omdbSingleSearchUrl = "https://www.omdbapi.com/?apikey=" + omdbApiKey + "&i="

var pageNumber;
var totalPages;
var totalMovies;

btnSearch.addEventListener("click",searchMovie);
textboxSearch.addEventListener("keyup", toggleSearchButton);


function toggleSearchButton(){
    var totalChild = document.body.children.length;
    textboxSearch.value.length>0 ? btnSearch.disabled=false :btnSearch.disabled=true;
}

btnSearch.disabled = true;

function searchMovie(event){
    event.preventDefault();
    omdbSearchTitle(textboxSearch.value,1);
    
    sectionSearch.setAttribute("class","hero");
}

function omdbSearchTitle(movieTitle,page){
    
    fetch(omdbUrl + movieTitle + "&page=" + page).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            if (data["Response"]==="False"){
                console.log("Not Found");
                //CHANGE console log to MODAL display
            }
            else{
                localStorage.setItem("currentPage",page);
                //showSearchResult(data);
            }
          });
        } else {
            //if response not ok have to show error in modal
        }
      });
}
