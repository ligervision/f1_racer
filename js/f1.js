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
            document
                .querySelector('#app')
                .insertAdjacentHTML('afterbegin', racerStandings);
        })
        .catch(error => {
            console.log(error)
        });
}

fetchData()




// Function to request API data.
async function getStandings(season, round){
    let request = new Request(`https://ergast.com/api/f1/${f1_form.season}/${f1_form.round}/driverStandings.json`);
    let result = await fetch(request);
    let response = await result.json();
    console.log(response);
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
    console.log(standingsData)
}

async function buildStandingsTable(standingsData){
    console.log(standingsData)
}


const myForm = document.getElementById('f1_form');
myForm.addEventListener('submit', handleSubmit);



