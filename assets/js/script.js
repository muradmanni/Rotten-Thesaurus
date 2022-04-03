// --------------------   VARIABLES DECLARED  -----------------------
var triggerWarnings1 = ["A dog dies.", "A cat dies.", "Animal abuse.", "Contains bugs.", "Contains dog fighting.", "An animal dies.", "Contains depictions of dead animals.", "A horse dies.", "Contains snakes.", "Contains spiders.", "A dragon dies.", "Has someone being stalked.", "Contains gaslighting.", "Contains domestic violence.", "Contains child abuse.", "Contains substance addiction.", "Contains drug use.", "Contains alcohol abuse.", "Contains shaving and/or cutting.", "Contains tooth damage.", "Contains genital trauma and/or mutilation.", "Contains cannibalism", "A person is burnt alive.", "Contains depictions of amputation.", "Someone's head gets squashed.", "Someone is buried alive.", "Contains finger and/or toe mutilation.", "Someone is hanged.", "Contains eye mutilation.", "Someone struggles to breathe.", "Someone has a seizure.", "Contains depictions of torture.", "Contains bone fractures.", "Someone falls to their death.", "A child dies.", "Contains adultery.", "Someone is kidnapped.", "A child's sentimental toy is destroyed.", "A parent dies.", "Contains jumpscares.", "Contains clowns.", "Contains ghosts.", "Contains shower scenes.", "Someone is possessed.", "Someone vomits.", "Contains aural depictions of gore.", "Contains farting and/or spitting.", "Someone urinates and/or excrete oneself.", "Contains glorification of unlawful acts by police.", "Someone has cancer.", "Contains depictions of electro-therapy.", "Contains depictions of mental institutions.", "Contains syringe use.", "Contains hospital scenes.", "Contains misophonia.", "Contains depictions of self-harm.", "Contains anxiety attacks.", "A mentally ill person becomes violent.", "Contains depictions of suicide.", "Contains depictions of body dysmorphia.", "Containst claustrophobic scenes.", "Contains autism-specific abuse.", "Someone has an eating disorder.", "Someone says, \"I\'ll kill myself.", "Contains scenes of babies crying.", "Contains shakey camera footage.", "Contains flashing lights and/or images.", "A pregnant woman dies.", "Contains depictions of abortion.", "Contains depictions of miscarriage.", "Contains depictions of childbirth.", "Contains ableist language and/or behaviour.", "A black person dies first.", "An LGBT person dies.", "Contains depictions of antisemitism.", "Contains homophobic slurs", "Contains hate speech.", "Contains \"Man in a dress\" jokes.", "Someone is misgendered.", "Contains fat jokes."]; // contains trigger warning categories, array length = 80
// issue occurs if there are more than 2500 characters in a single line.

var triggerWarnings2 = ["Contains racial slurs", "Contains depictions of sexual assault.", "Contains sexual content.", "Contains scenes depicting incest.", "Contains a sad ending.", "A fictional character like Santa Claus is spoiled.", "Contains a car crash scene.", "Contains a plane crash scene.", "Someone gets hit by a vehicle.", "Contains depictions of blood and/or gore.", "Contains depictions of nuclear explosions.", "Someone drowns.", "Contains gun violence."]; // contains the rest of the trigger warning categories, array length = 13

var triggerWarningsConcat = triggerWarnings1.concat(triggerWarnings2); // joins the arrays together.

var includesList = ["The", "a", "I", "An", "You", "Of", "and", "in", "to", "We", "On", "Me", "Be", "Go", "No", "Is", "1", "Two", "2", "II", "One", "It", "It's", "for", "Her", "When", "They", "My", "Three", "3", "III", "Who", "With", "Up", "Your", "Not", "at", "His", "That", "Was", "All", "This", "by", "First", "Back", "Only", "Get"]; // Commonly used words in movie titles

var btnSearch = document.querySelector("#btn-search");
var sectionSearch = document.querySelector("#section-search");
var textboxSearch = document.querySelector("#textbox-search");
var movieSearchHistory = [];
var movieSearchHistoryLength;
var bd = $('body');

//------------ API key (murad) to access OMBD API
var omdbApiKey="ef78856e";
var omdbUrl ="https://www.omdbapi.com/?apikey=" + omdbApiKey + "&type=movie&s=";
var omdbSingleSearchUrl = "https://www.omdbapi.com/?apikey=" + omdbApiKey + "&i="

var modal = document.querySelector("#modal");
var modalErrorMessageSpan = document.querySelector("#error-message");
var modalCloseButton = document.querySelector("#btn-modal-close");
// ------------------------- Variables used to perform and maintain pagination -------------------------
var pageNumber;
var totalPages;
var totalMovies;

var randomWordGenerator = "?random=true"; // parameter for generating random words
var enteredInput = "test"; // form-input.value is supposed to be entered here, not a string.

btnSearch.addEventListener("click",searchMovie);
textboxSearch.addEventListener("keyup", toggleSearchButton);
document.addEventListener("click",checkPaginationClick);
modalCloseButton.addEventListener("click",closeModalDialog);

function toggleSearchButton(){
    //var totalChild = document.body.children.length;
    if (textboxSearch.value.length>0)
    {
        btnSearch.disabled=false
    }
    else{
        btnSearch.disabled=true;
        removeSearchAndPagination();
        sectionSearch.setAttribute("class","hero is-fullheight");
    }
}

function searchMovie(event){
    event.preventDefault();
    omdbSearchTitle(textboxSearch.value,1);
}

function omdbSearchTitle(movieTitle,page){
    
    fetch(omdbUrl + movieTitle + "&page=" + page).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            if (data["Response"]==="False"){
                console.log("Not Found");
                //CHANGE console log to MODAL display
                modal.className="modal is-active";
                modalErrorMessageSpan.textContent= movieTitle + " not found on IMDB, please check the movie title and search again.";
            }
            else{
                sectionSearch.setAttribute("class","hero");
                if (!movieSearchHistory.includes(movieTitle.toLowerCase()))
                {
                    movieSearchHistory.push(movieTitle.toLowerCase());
                }
                localStorage.setItem("searchHistory", JSON.stringify(movieSearchHistory));
                localStorage.setItem("currentPage",page);
                showSearchResult(data);
            }
          });
        } else {
            //if response not ok have to show error in modal
        }
      });
}


function omdbGetSingleMovieDetails(omdbid){
    fetch(omdbSingleSearchUrl+ omdbid).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            if (data["Response"]==="False"){
                console.log("Not Found");
                //CHANGE console log to MODAL display
            }
            else{
                console.log(data);
                localStorage.setItem(omdbid,JSON.stringify(data));
                return data;
            }
          });
        } else {
            //if response not ok have to show error in modal
        }
      });
}

function removeSearchAndPagination(){
    var sectionMovieResultPre = document.querySelector("#section-movie-result");
    const t = document.body.getElementsByClassName("display-result");
    if (sectionMovieResultPre !== null)
    {   
        document.body.removeChild(sectionMovieResultPre);
        

        var sectionPagination = document.querySelector("#section-pagination");
        if (sectionPagination!==null)
        {
            // alert("i am in");
            document.body.removeChild(sectionPagination);

        }
    }
    document.body.setAttribute("min-height","100%")
}

function showSearchResult(data){
    
    removeSearchAndPagination();

    totalMovies=data["totalResults"];
    calculateTotalPages(totalMovies);
    
    // vanila js
    // var sectionMovieResult=document.createElement("section");
    // sectionMovieResult.setAttribute("id","section-movie-result")
    // sectionMovieResult.className= "hero display-result center-please";
    
    // //jquert
    var sectionMovieResult = $("<section>");
    sectionMovieResult.attr("id","section-movie-result")
    sectionMovieResult.addClass("hero display-result center-please");

    //console.log(sectionMovieResult.getAttribute('id'));
    // var searchMovieDivContainer=document.createElement ("div");
    // searchMovieDivContainer.className= "container is-fluid";
    // var searchMovieDivContainerColumn = document.createElement("div");
    // searchMovieDivContainerColumn.className = "columns is-multiline is-centered";

    var searchMovieDivContainer= $("<div>");
    searchMovieDivContainer.addClass("container is-fluid");
    var searchMovieDivContainerColumn = $("<div>");
    searchMovieDivContainerColumn.addClass("columns is-multiline is-centered");
    
    for (var i=0; i< data["Search"].length; i++)
    {
        // -------------------- GET VALUES --------------------
        var poster = (data['Search'][i]['Poster']);
        var movieTitle =(data['Search'][i]['Title']);
        var imdbID =(data['Search'][i]['imdbID']);
        if (poster==="N/A")
        {
            poster="./assets/images/image-not-available.jpg";
        }
    
        //--------------------   REQUESTIN TO FETCH and STORING ALL INDIVIDUAL RESULT IN LOCALSTORAGE -----------
        var individualMovieDetails = omdbGetSingleMovieDetails(imdbID);
        
        //-------------------------------------------------------------------------------------------------------

        // ------------------- GENERATE RESULT AND SHOW -------------------
        // var divOutBox = document.createElement("div");
        // divOutBox.className="column is-3-fullhd  is-3-desktop is-6-tablet is-12-mobile";
        // var divInsideBox = document.createElement("div");
        // divInsideBox.className="notification is-primary has-text-centered";

        var divOutBox = $("<div>");
        divOutBox.addClass("column is-3-fullhd  is-3-desktop is-6-tablet is-12-mobile");
        var divInsideBox = $("<div>");
        divInsideBox.addClass("notification is-primary has-text-centered");

        // var imgMovieImage = document.createElement("img");
        // imgMovieImage.setAttribute("id","img-movie");
        // imgMovieImage.setAttribute("data-id",imdbID);
        // imgMovieImage.setAttribute("src",poster);
        // imgMovieImage.className="cursor";

        var imgMovieImage = $("<img>");
        // imgMovieImage.attr("id","img-movie");
        imgMovieImage.attr("data-id",imdbID);
        imgMovieImage.attr("src",poster);
        imgMovieImage.addClass("cursor img-movie");

        // var h3MovieTitle = document.createElement("h3");
        // h3MovieTitle.className = "title is-6 curs-or";
        // h3MovieTitle.setAttribute("id","img-movie");
        // h3MovieTitle.setAttribute("data-id",imdbID);
        // h3MovieTitle.textContent = movieTitle;

        var h3MovieTitle =$("<h3>");
        h3MovieTitle.addClass("title is-6 cursor img-movie");
        // h3MovieTitle.attr("id","img-movie");
        h3MovieTitle.attr("data-id",imdbID);
        h3MovieTitle.text(movieTitle);
        

        // divInsideBox.appendChild(imgMovieImage);
        // divInsideBox.appendChild(h3MovieTitle);
        // divOutBox.appendChild(divInsideBox);

        // searchMovieDivContainerColumn.appendChild(divOutBox);

        divInsideBox.append(imgMovieImage);
        divInsideBox.append(h3MovieTitle);
        divOutBox.append(divInsideBox);

        searchMovieDivContainerColumn.append(divOutBox);
    }
    // searchMovieDivContainer.appendChild(searchMovieDivContainerColumn);
    // sectionMovieResult.append(searchMovieDivContainer);
    // document.body.appendChild(sectionMovieResult);

    searchMovieDivContainer.append(searchMovieDivContainerColumn);
    sectionMovieResult.append(searchMovieDivContainer);
    bd.append(sectionMovieResult);

    // var movieResultClick= document.querySelector("#img-movie"); 
    sectionMovieResult.on("click",".img-movie", getMoreDetails);
    //console.log("after creating : " + document.body.children.length);
}

function calculateTotalPages(totalMovies){
    totalPages = Math.floor(totalMovies / 10);
    

    if (totalMovies%10>0)
    {
        totalPages++;
    }
    
    if (totalPages>1)
    {
        generatePagination();
    }
    console.log("Total Movies " + totalMovies + "     totalPages " +totalPages);
}

function generatePagination(){
    var loopStartingInt;
    var loopFinishingInt;
    pageNumber=getCurrentPageNumber();
    
    if (isNaN(pageNumber))
    {
        pageNumber=1;
    }

    var sectionPagination =document.createElement("section");
    sectionPagination.setAttribute("id","section-pagination");

    var navElement = document.createElement("nav");
    navElement.className="pagination is-centered";
    navElement.setAttribute("role","navigation");
    
    var ulElement = document.createElement("ul");
    ulElement.className="pagination-list";

    var liElement;
    var aElement;

    if (totalPages<=8)
    {
        loopStartingInt=2;
        loopFinishingInt=totalPages;
    }
    else
    {
        if(pageNumber<4)
        {
            loopStartingInt=2;
            loopFinishingInt=5;
        }
        else if(pageNumber<=(totalPages-3))
        {
            
            loopStartingInt=pageNumber-1;
            loopFinishingInt=pageNumber+2;
        }
        else{
            loopStartingInt=totalPages-3;
            loopFinishingInt=totalPages;
        }
    }
    // alert("Page number is = " + pageNumber + "    Loop start Int is " + loopStartingInt);ts

    liElement = document.createElement("li");            
    aElement=document.createElement("a");
    aElement.className="pagination-link";
    aElement.setAttribute("data-label","1");
    aElement.textContent=1;
    liElement.appendChild(aElement);
    ulElement.appendChild(liElement);
 
    
    
    if (pageNumber>3 && totalPages>8){
        liElement = document.createElement("li");
        aElement=document.createElement("a");
        aElement.className="pagination-ellipsis";
        aElement.textContent="...";
        liElement.appendChild(aElement);
        ulElement.appendChild(liElement);
    }
        //for(var i=loopStartingInt; i<(loopStartingInt+loopFinishingInt); i++){    
        for(var i=loopStartingInt; i<(loopFinishingInt); i++){    
                liElement = document.createElement("li");            
                aElement=document.createElement("a");
                aElement.className="pagination-link";
                aElement.setAttribute("data-label",i);
                aElement.textContent=i;
            
            liElement.appendChild(aElement);
            ulElement.appendChild(liElement);
        }
    
    if (pageNumber<(totalPages-2) && totalPages>8){
        liElement = document.createElement("li");
        aElement=document.createElement("a");
        aElement.className="pagination-ellipsis";
        aElement.textContent="...";
        liElement.appendChild(aElement);
        ulElement.appendChild(liElement);
    }

    liElement = document.createElement("li");            
    aElement=document.createElement("a");
    aElement.className="pagination-link";
    aElement.setAttribute("data-label",totalPages);
    aElement.textContent=totalPages;
    liElement.appendChild(aElement);
    ulElement.appendChild(liElement);


    navElement.appendChild(ulElement);
    sectionPagination.appendChild(navElement);
    document.body.appendChild(sectionPagination);
    var test = document.getElementsByClassName("pagination-link");
    console.log(test.length);
    
    for (var i=0; i<test.length; i++)
    {
        if(pageNumber== test[i].getAttribute("data-label"))
        {
            test[i].className="pagination-link is-current";
        }

    }
}

function getCurrentPageNumber()
{
    return parseInt(localStorage.getItem("currentPage"));
}


function checkPaginationClick(event){
    //console.log(event.target);
    if((event.target).className==="pagination-link")
    {
        if (typeof(parseInt((event.target).textContent))==="number")
        {
            pageNumber=(event.target).textContent
            omdbSearchTitle(textboxSearch.value,pageNumber);
        }
    }
    localStorage.setItem("currentPage",pageNumber); 
}

// ---------- -- ------- CHECK CLICK EVENT ON MOVIE ----------- ------ -----------//

function getMoreDetails(event){
    var clickedMovie = $(event.target).data("id");
    console.log(clickedMovie);
    var SingleMovieDetails = (JSON.parse(localStorage.getItem(clickedMovie)));
    console.log(SingleMovieDetails);
    console.log(SingleMovieDetails["Title"]);
    removeSearchAndPagination();

    // <section >
    //     <div class="container">
    //       <div class="columns is-multiline">
    //         <div class="column notification test is-3 is-3-fullhd is-3-desktop is-6-tablet is-12-mobile">
    //           <img>
    //           <h3></h3>
    //         </div>
    //         <div class="column test is-9 is-9-fullhd is-9-desktop is-6-tablet is-12-mobile">
    //           <h2></h2>
    //         </div>
    //       </div>
    //     </div>
    //   </section>
    bd.addClass("is-fullheight");
    var sectionSingleMovieResult = $("<section>");
    sectionSingleMovieResult.addClass("hero display-result center-please");
    sectionSingleMovieResult.attr("id","section-movie-result")
    var divSingleMovieContainer = $("<div>");
    divSingleMovieContainer.addClass("container is-fluid");
    //divSingleMovieContainer.

    var divSingleMovieColumns = $("<div>");
    divSingleMovieColumns.addClass("columns  is-multiline is-centered");
    var divSingleMovieColumnNotification = $("<div>");
    divSingleMovieColumnNotification.addClass("column notification test is-3 is-3-fullhd is-3-desktop is-6-tablet is-12-mobile");
    var imageMovie = $("<img>");
    imageMovie.attr("src",SingleMovieDetails['Poster']==='N/A'? "./assets/images/image-not-available.jpg":SingleMovieDetails['Poster']);

    divSingleMovieColumnNotification.append(imageMovie);
    divSingleMovieColumns.append(divSingleMovieColumnNotification);

    var divSingleMovieColumnNotification = $("<div>");
    divSingleMovieColumnNotification.addClass("column test is-9 is-9-fullhd is-9-desktop is-6-tablet is-12-mobile");
    var divSingleMovieOrderedList = $("<ol>");
        var divSingleMovieOrderedListItemTitle = $("<li>");
        divSingleMovieOrderedListItemTitle.text("Title ---> " + SingleMovieDetails["Title"]);

        var divSingleMovieOrderedListItemPlot = $("<li>");
        divSingleMovieOrderedListItemPlot.text("Plot ---> " + SingleMovieDetails["Plot"]);

    divSingleMovieOrderedList.append(divSingleMovieOrderedListItemTitle);    
    divSingleMovieOrderedList.append(divSingleMovieOrderedListItemPlot);

    divSingleMovieColumnNotification.append(divSingleMovieOrderedList);
    divSingleMovieColumns.append(divSingleMovieColumnNotification);

    var divSingleMovieContainerBack = $("<div>");
    divSingleMovieContainerBack.addClass("container is-fluid");

    var divSingleMovieBackButton = $("<button>");
    divSingleMovieBackButton.addClass("button is-primary");
    divSingleMovieBackButton.attr("id","btn-back");
    divSingleMovieBackButton.text("Back");

    divSingleMovieContainerBack.append(divSingleMovieBackButton);
    divSingleMovieContainer.append(divSingleMovieColumns);
    sectionSingleMovieResult.append(divSingleMovieContainer);
    sectionSingleMovieResult.append(divSingleMovieContainerBack);
    bd.append(sectionSingleMovieResult);
}

function init(){
    btnSearch.disabled = true;
    //getSearchHistory(); 
}

init();

/// ---------------------------------- FUNCTION TO CLOSE MODAL (ERROR DISPLAYED WHEN SEARCHED MOVIE NOT FOUND) ---------------
function closeModalDialog(){
    modal.className="modal";
    //console.log("its clicking");
}

const options = { // code provided by API docs
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
		'X-RapidAPI-Key': '6ecbaac172msh867cf483a4913b6p183836jsn739ee58e425f'
	}
};

// these are two different calls below, the code currently written as is will make two calls

// to get a random word: GET https://wordsapiv1.p.mashape.com/words?random=true
// fetch('https://wordsapiv1.p.rapidapi.com/words/' + randomWordGenerator, options) // code provided by API docs
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));

// // to get a word you input: GET https://wordsapiv1.p.mashape.com/words/{word}
// fetch('https://wordsapiv1.p.rapidapi.com/words/' + enteredInput, options) // code provided by API docs
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));

// word details that can appear in JSON Format, see docs: https://www.wordsapi.com/docs/#get-word-details

// if you want to play around with the words API, please use free demonstrator at: https://www.wordsapi.com/
// regarding API Calls using the API Key, please use it sparingly as there is a limit of 2500 calls per day and exceeding that 2500 call limit results in a charge of $0.004 per call after that 2500 limit. 
