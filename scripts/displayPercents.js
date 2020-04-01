const displayPercentHead = function(){
    const header = document.getElementById('today-percent');
    const today = data[data.length-1]['Date']
    header.innerText += ' ' +today.toDateString(); 
}


const initDisplayPercents = function(){
    displayPercentHead();
    for (let label of Object.keys(colorData)){
        if (label != 'Date'){
            renderCard(label, colorData[label])
        }
    }
    initRates();
}

const renderCard = function(label,color){
    const index = diffData.length-1
    const todayData = diffData[index][label];
    const yesterTotalData = data[index-1][label];
    const todayPercent = Math.round(todayData / yesterTotalData * 100 );
    const card= `<div class='card bg-light mx-0 px-0'>
                    <div class='card-head text-light h-100' style='background-color: ${color}'>
                        <p class="card-text text-center"> ${label}</p>
                    </div>
                    <div class='card-body mx-0 px-0'>
                        <h4 class='card-text text-center font-weight-bold'>+${todayPercent}%</h4>
                    </div>
                </div>`;
    document.getElementById('daily-percentage-deck').innerHTML += card;
}

const renderTotalRateCard = function(label, numerator, denominator){
    const rate = Number((numerator/denominator*100).toFixed(1)) 
    const card= `<div class='card bg-light mx-0 px-0'>
                    <div class='card-head bg-dark text-light h-100'>
                        <p class="card-text text-center"> ${label}</p>
                    </div>
                    <div class='card-body mx-0 px-0'>
                        <h4 class='card-text text-center font-weight-bold'>${rate}%</h4>
                    </div>
                </div>`;
    document.getElementById('total-rate-deck').innerHTML += card;
}

const initRates = function(){
    const index = diffData.length-1;
    const totalDeaths = data[index]['Deaths'];
    const totalHopsital = data[index]['Hospitalized'];
    const totalIntubated = data[index]['Intubated (ventilator)'];
    const totalCase = data[index]['Cases'];
    renderTotalRateCard('Fatality Rate', totalDeaths, totalCase);
    renderTotalRateCard('Intubated Rate', totalIntubated, totalCase);
    renderTotalRateCard('Hospital Rate', totalHopsital, totalCase);
    /*
    const fatalityRate = Number((totalDeaths/totalCase*100).toFixed(1))  
    const hospitalRate = Number((totalHopsital/totalCase*100).toFixed(1))  
    const intubatedRate = Number((totalIntubated/totalCase*100).toFixed(1))  
    const table = `<table class='tavle'> 
                    <tr>
                        <th>Fatality Rate: </th>
                        <td>${fatalityRate}%</td>
                    </tr>
                    <tr>
                        <th>Intubated Rate: </th>
                        <td>${intubatedRate}%</td>
                    </tr>
                    <tr>
                        <th>Hospital Rate: </th>
                        <td>${hospitalRate}%</td>
                    </tr>
                 </table>`
    document.getElementById('fatality-rate').innerHTML += table;
    */

}
