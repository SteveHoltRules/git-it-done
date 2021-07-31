var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var dataSource = "";

var getUserRepos = function (user) {
  //format the github api url
  // var apiUrl = "https://api.github.com/users/" + user + "/repos";
  var apiUrl = `https://api.github.com/users/${user}/repos`;
  console.log(apiUrl);

  // make a request to the url
  fetch(apiUrl).then(function (response) {
    //request was successful
    if(response.ok) {
      response.json().then(function (data) {
      displayRepos(data, user);
      console.log(data);
      console.log(data[0].owner.html_url);
    });
  }else {
    alert("Error: GitHub User Not Found");
  } 
  })
  .catch(function(error){
    //notice this .catch() getting changed ont to the end of the .then()
    alert("Unable to connect ot Github");
  });
};

var formSubmitHandler = function (event) {
  event.preventDefault();
  //get value from input element
  var username = nameInputEl.value.trim();
  //How do I extend this function to drill down into the repos?
  
  // var scriptfiles = username.data;

  if (username) {
    getUserRepos(username);
    //This piece clears the form after it is submitted...I could use this on the password generator
    nameInputEl.value = "";
  }
  else {
    alert("Please enter a GitHub username");
  }
};

var displayRepos = function (repos, searchTerm) {
  if(repos.length === 0 ) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
  console.log(repos);
  console.log(searchTerm);
  repoContainerEl.textContent="";
  repoSearchTerm.textContent = searchTerm;
  //loop over repos
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = `${searchTerm}/${repos[i].name}`;
    // var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", `./single-repo.html?repo=${repoName}`);

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);
    console.log(titleEl);

    //create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    //check if current repo has issue or not
    if (repos[i].open_issues_count>0) {
      statusEl.innerHTML = 
      `<i class="fas fa-times status-icon icon-danger"></i>${repos[i].open_issues_count} issue(s)`;
    }else {
      statusEl.innerHTML = `<i class="fas fa-check-square status-icon incon-succcess"></i>`;
    };

    //append to container
    repoEl.appendChild(statusEl);
    // append container to the dom
    repoContainerEl.appendChild(repoEl);

  };
};

userFormEl.addEventListener("submit", formSubmitHandler);