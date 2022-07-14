function fetchData() {
    console.log('This is f1.js');
    console.log('START FETCH');


    
    // Get response object
    fetch(`https://ergast.com/api/f1/2022/9/driverStandings.json`)
        .then(response => {
            if (!response.ok) {
                throw Error('ERROR');
            }
            return response.json();
        })
        .then(data => {
            // console.log(data.MRData.StandingsTable);
            const racerStandings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings
                .map(position => {
                    return `
                    <br>
                    <div class='position'>
                        <p>Position: ${position.position}</p>
                        <p>Points: ${position.points}</p>
                        <p>Driver: ${position.Driver.familyName}, ${position.Driver.givenName}</p>
                        <p>Driver Nationality: ${position.Driver.nationality}</p>
                        <p>Constructor: ${position.Constructors.map(constructor => {
                            return `
                            <ul>
                                <li>
                                    ${constructor.name}
                                </li>
                            </ul>
                            `}
                        )}</p>
                    </div>
                    `;
                })
                .join('');
            // console.log(racerStandings);
            // document
            //     .querySelector('#app')
            //     .insertAdjacentHTML('afterbegin', racerStandings);
        })
        .catch(error => {
            console.log(error)
        });
}

fetchData()


// Function to request API data.
async function getStandings(season, round){
    let request = new Request(`https://ergast.com/api/f1/${season}/${round}/driverStandings.json`);
    let result = await fetch(request);
    let response = await result.json();
    // console.log(response);
    return response
}


async function handleSubmit(e){ // <-- e for 'event'
    e.preventDefault();
    let season = e.target.season.value;
    let round = e.target.round.value;
    let standingsData = await getStandings(season, round);
    buildStandingsTable(standingsData)
    e.target.season.value = ''
    e.target.round.value = ''
}


async function buildStandingsTable(standingsData){
    console.log(standingsData)

// function buildRaceInfoCard(raceInfoObj, raceTitleObj) {

    // create card div
    const card = document.createElement("div");
    card.className = "card";

    // create card header
    const cardHeader = document.createElement("div");
    card.className = "card-header bg-info";

    // create card title
    const cardTitle = document.createElement("h4");
    let f1_round = standingsData.MRData.StandingsTable.round
    let f1_season = standingsData.MRData.StandingsTable.season
    cardTitle.className = "card-title";
    cardTitle.innerHTML = `Results for Season ${f1_season} - Round ${f1_round}:`;
    cardHeader.append(cardTitle);

    // create card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // add card header, card body to card div
    card.append(cardHeader);
    card.append(cardBody);

    // create results table
    const raceTable = document.createElement('table')
    raceTable.className = 'table'
    cardBody.append(raceTable);
    
    //create header row with static labels
    const raceTableHead = document.createElement('thead')
    // raceTableHead.className = 'card-header'
    raceTable.append(raceTableHead)
    const raceTableHeadRow = document.createElement('tr')
    raceTable.append(raceTableHeadRow)
    const raceTableHeadPos = document.createElement('th')
    raceTableHeadPos.scope = 'col'
    raceTableHeadPos.innerHTML = 'Position:'
    raceTableHeadRow.append(raceTableHeadPos)
    const raceTableHeadDrName = document.createElement('th')
    raceTableHeadDrName.scope = 'col'
    raceTableHeadDrName.innerHTML = 'Driver:'
    raceTableHeadRow.append(raceTableHeadDrName)
    const raceTableHeadDrNat = document.createElement('th')
    raceTableHeadDrNat.scope = 'col'
    raceTableHeadDrNat.innerHTML = 'Nationality:'
    raceTableHeadRow.append(raceTableHeadDrNat)
    const raceTableHeadConstr = document.createElement('th')
    raceTableHeadConstr.scope = 'col'
    raceTableHeadConstr.innerHTML = 'Constructor:'
    raceTableHeadRow.append(raceTableHeadConstr)
    const raceTableHeadPoints = document.createElement('th')
    raceTableHeadPoints.scope = 'col'
    raceTableHeadPoints.innerHTML = 'Points:'
    raceTableHeadRow.append(raceTableHeadPoints)  
    
    const raceTableBody = document.createElement('tbody')
    raceTable.append(raceTableBody);

    //loop through data and create table rows for first 10 entries
    for (i = 0; i < 10; i++) {
        let driver_array = standingsData.MRData.StandingsTable.StandingsLists[0].DriverStandings

        const driverResult = document.createElement("tr");
        driverResult.scope = "row";
        raceTable.append(driverResult);
        const position = document.createElement("td");
        position.innerHTML = driver_array[i]["position"];
        driverResult.append(position);
        const driverName = document.createElement("td");
        let driverFirst = driver_array[i]["Driver"]["givenName"];
        let driverLast = driver_array[i]["Driver"]["familyName"];
        driverName.innerHTML = `${driverFirst} ${driverLast}`;
        driverResult.append(driverName);
        const driverNation = document.createElement("td");
        driverNation.innerHTML = driver_array[i]["Driver"]["nationality"];
        driverResult.append(driverNation);
        const constructor = document.createElement("td");
        constructor.innerHTML = driver_array[i]["Constructors"][0]["name"];
        driverResult.append(constructor);
        const points = document.createElement("td");
        points.innerHTML = driver_array[i]["points"];
        driverResult.append(points);
    } 

    // get section to add results info
    const raceDisplay = document.getElementById("standingTable");

    // add spacer + race results card to the display
    const spacer = document.createElement("p");
    spacer.innerHTML = "";
    raceDisplay.append(spacer);
    raceDisplay.append(card);
}


const myForm = document.getElementById('f1_form');
myForm.addEventListener('submit', handleSubmit);
