var issueContainerEl = document.querySelector("#issues-container");

// GET /repos/:owner/:repo/Issues
// https://api.github.com/repos/<repo>/issues

// var repo = "SteveHoltRules/git-it-done"
var repoNameEl = document.querySelector("#repo-name");


var getRepoName = function(){
  console.log("in getRepoName");
  //Search the document
  var queryString= document.location.search;
  console.log(queryString);
  //Return the document location and split it at the demarkation
  var repoName = queryString.split("=")[1];
  console.log(repoName);
  getRepoIssues(repoName);
  repoNameEl.textContent = repoName;
};

var limitWarningEl = document.querySelector("#limit-warning");

var displayWarning = function(repo) {
  //add text to warning container
  limitWarningEl.textContent = "To see more than 30 issues, visit ";

  var linkEl = document.createElement("a");
  linkEl.textContent = "See more Issues on GitHub.com";
  linkEl.setAttribute("href", `https://github.com/${repo}/issues`);
  linkEl.setAttribute("target", "_blank");
  //append to warning container
  limitWarningEl.appendChild(linkEl);
};


var getRepoIssues = function(repo) {
  console.log(repo);

  var apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;

  fetch(apiUrl).then(function (response) {
    //request was successful
    if (response.ok) {
      response.json().then(function (data) {
        //pass response data to dom function
        displayIssues(data);
        console.log(data);
        //check if api has paginated issues
        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
    }
    else {
      alert("There was a problem with your request!");
    }
  });
};

var displayIssues = function (issues) {
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }

  for (var i = 0; i < issues.length; i++) {
    //create a link element to take users to the issue on github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    //this attribute sets the html_url site address found for the issues site
    issueEl.setAttribute("href", issues[i].html_url);
    //this attribute sets the "target" aka the anchor to open a new browser tab instead of opening one in the existing window
    issueEl.setAttribute("target", "_blank");

    //create a span to hold issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    //append to container
    issueEl.appendChild(titleEl);

    //create a type element
    var typeEl = document.createElement("span");;

    //check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }
    issueEl.appendChild(typeEl);

    issueContainerEl.appendChild(issueEl);
  }
};


getRepoName();