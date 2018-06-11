function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callbackFunc(this);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var userDatas = JSON.parse(xhttp.responseText);

  var sortedData = sortByCost(userDatas[2].data);
  var mainDiv = document.querySelector('.shapceship-list');
  var sideDiv = document.querySelector('.one-spaceship');
  var searchButton = document.querySelector('#search-button');
  var searchText = document.querySelector('#search-text')

  document.querySelector('head title').innerHTML = 'Star Wars spaceships and vehicles';

  deleteConsumables(sortedData);
  noNulls(sortedData);
  createBoxes(mainDiv, sideDiv);
  createHTML(sortedData);
  createFooter(sortedData);


  searchButton.addEventListener("click", function () {
    searchModel(sortedData, searchText.value);
  });
}

function sortByCost(userData) {
  var i = userData.length - 1;
  var swap;
  do {
    swap = false;
    for (var j = 0; j < i; j++) {
      if (!parseInt(userData[j].cost_in_credits)) {
        continue;
      } else if (!parseInt(userData[j + 1].cost_in_credits)) {
        [userData[j], userData[j + 1]] = [userData[j + 1], userData[j]];
        swap = true;
      } else if (parseInt(userData[j].cost_in_credits) > parseInt(userData[j + 1].cost_in_credits)) {
        [userData[j], userData[j + 1]] = [userData[j + 1], userData[j]];
        swap = true;
      }
    }
    i--
  }
  while (swap)
  return userData;
}

function deleteConsumables(inputData) {
  for (var i = 0; i < inputData.length; i++) {
    if (!inputData[i].consumables) {
      inputData.splice(i, 1);
    }
  }
  return inputData;
}

function noNulls(inputData) {
  for (var i = 0; i < inputData.length; i++) {
    for (var adat in inputData[i]) {
      if (inputData[i][adat] === null) {
        inputData[i][adat] = 'unknown';
      }
    }
  }
  return inputData;
}

function createBoxes(mainDiv, sideDiv) {
  var listDiv = document.createElement('div');
  var descriptionDiv = document.createElement('div');
  var footerDiv = document.createElement('div');
  listDiv.classList.add('list');
  descriptionDiv.classList.add('description');
  footerDiv.classList.add('footer')
  mainDiv.appendChild(listDiv);
  sideDiv.appendChild(descriptionDiv);
  mainDiv.appendChild(footerDiv);
}

function inputHtml(inputData, i) {
  var result;
  result = `<div class="ship"><img src="img/${inputData[i].image}" alt="Picture of ${inputData[i].model}">
  <div>Model: ${inputData[i].model}<br>
  Denomination: ${inputData[i].denomination}<br>
  Manufacturer: ${inputData[i].manufacturer}<br>
  Crew: ${inputData[i].crew}<br>
  Passengers: ${inputData[i].passengers}<br>
  Cargo capacity: ${inputData[i].cargo_capacity}<br>
  Max atmosphering speed: ${inputData[i].max_atmosphering_speed}<br>
  Lengthiness: ${inputData[i].lengthiness}<br>
  Consumables: ${inputData[i].consumables}<br>
  Cost in credits: ${inputData[i].cost_in_credits}</div></div>`;
  return result;
}

function createHTML(inputData) {
  var table = '';
  for (var i = 0; i < inputData.length; i++) {
    table += inputHtml(inputData, i);
  }
  document.querySelector('.list').innerHTML = table;
}

function searchModel(inputData, modelName) {
  var i = 0;
  var description = '';
  var search;
  var notFound = false
  while (i < inputData.length && !notFound) {
    search = inputData[i].model.indexOf(modelName);
    if (inputData[i].model.toLowerCase().indexOf(modelName.toLowerCase()) != -1) {
      description += inputHtml(inputData, i);
      notFound = true;
    }
    i++
  }
  if (!notFound) {
    description = '<p>No such spaceship or vehicle.</p>';
  }
  document.querySelector('.description').innerHTML = description;
}

function crewOneCount(inputData) {
  var count = 0;
  for (var i = 0; i < inputData.length; i++) {
    if (parseInt(inputData[i].crew) == 1) {
      count++;
    }
  }
  return count;
}

function biggestCargoCapacity(inputData) {
  var biggest = inputData[0];
  for (var i = 1; i < inputData.length; i++) {
    if (parseInt(biggest.cargo_capacity) < parseInt(inputData[i].cargo_capacity)) {
      biggest = inputData[i];
    }
  }
  return biggest.model;
}

function sumPassengers(inputData) {
  var sum = 0;
  for (var i = 0; i < inputData.length; i++) {
    if (parseInt(inputData[i].passengers)) {
      sum += parseInt(inputData[i].passengers);
    }
  }
  return sum;
}

function longestShip(inputData) {
  var longest = inputData[0];
  for (var i = 1; i < inputData.length; i++) {
    if (parseInt(longest.lengthiness) < parseInt(inputData[i].lengthiness)) {
      longest = inputData[i];
    }
  }
  return longest;
}

function createFooter(inputData) {
  var footer = ''
  footer = `Number of ships with a crew of 1 person: ${crewOneCount(inputData)}<br>
            The name of the ship with the biggest cargo capacity: ${biggestCargoCapacity(inputData)}<br>
            The sum of passengers of all the ships: ${sumPassengers(inputData)}<br>
            The longest ship: <img src="img/${longestShip(inputData).image}" alt="Picture of ${longestShip(inputData).model}">`;
  document.querySelector('.footer').innerHTML = footer;
}

getData('/json/spaceships.json', successAjax);