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
                showSearchResult(data);
            }
          });
        } else {
            //if response not ok have to show error in modal
        }
      });
}

function showSearchResult(data){
    //console.log(data);
    // var totalChild = document.body.children.length;
    // console.log("before creating : " + document.body.children.length);
    //
    
    
    //removeSearchAndPagination();

    totalMovies=data["totalResults"];
    //calculateTotalPages(totalMovies);
    

    var sectionMovieResult=document.createElement("section");
    sectionMovieResult.setAttribute("id","section-movie-result")
    sectionMovieResult.className= "hero display-result center-please";
    
    //console.log(sectionMovieResult.getAttribute('id'));
    var searchMovieDivContainer=document.createElement ("div");
    searchMovieDivContainer.className= "container is-fluid";
    var searchMovieDivContainerColumn = document.createElement("div");
    searchMovieDivContainerColumn.className = "columns is-multiline is-centered";
        
    for (var i=0; i< data["Search"].length; i++)
    {
        // -------------------- GET VALUES --------------------
        var poster = (data['Search'][i]['Poster']);
        var movieTitle =(data['Search'][i]['Title']);
        if (poster==="N/A")
        {
            poster="./assets/images/image-not-available.jpg";
        }
    
        //omdbGetSingleMovieDetails(data['Search'][i]['imdbID']);



        // ------------------- GENERATE RESULT AND SHOW -------------------
        var divOutBox = document.createElement("div");
        divOutBox.className="column is-3-fullhd  is-3-desktop is-6-tablet is-12-mobile";
        var divInsideBox = document.createElement("div");
        divInsideBox.className="notification is-primary has-text-centered";

        var imgMovieImage = document.createElement("img");
        imgMovieImage.setAttribute("src",poster);
        imgMovieImage.className="cursor";

        var h3MovieTitle = document.createElement("h3");
        h3MovieTitle.className = "title is-6 cursor";
        h3MovieTitle.textContent = movieTitle;
        

        divInsideBox.appendChild(imgMovieImage);
        divInsideBox.appendChild(h3MovieTitle);
        divOutBox.appendChild(divInsideBox);

        searchMovieDivContainerColumn.appendChild(divOutBox);
    }
    searchMovieDivContainer.appendChild(searchMovieDivContainerColumn);
    sectionMovieResult.appendChild(searchMovieDivContainer);
    document.body.appendChild(sectionMovieResult);

    //console.log("after creating : " + document.body.children.length);
}
