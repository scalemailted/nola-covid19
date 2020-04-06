const clearDisplay = function(){
    document.getElementById('total-value-deck').innerHTML = "";
    document.getElementById('daily-percentage-deck').innerHTML = "";
    document.getElementById('total-rate-deck').innerHTML = "";
    document.getElementById('daily-value-deck').innerHTML = "";
    document.getElementById('tomorrow-total-deck').innerHTML ="";
    document.getElementById('tomorrow-value-deck').innerHTML ="";
    document.getElementById('tomorrow-growth-deck').innerHTML =""
}

const displayPercentHead = function(data){
    const header = document.getElementById('today-percent');
    const today = data[data.length-1]['Date']
    header.innerText = 'Growth Rates for: ' +today.toDateString(); 
}

const displayTotalHead = function(data){
    const header = document.getElementById('total-values');
    const today = data[data.length-1]['Date']
    header.innerText = 'Total Counts for: ' +today.toDateString(); 
}


const initDisplayPercents = function(data){
    clearDisplay();
    const diffData = getDifferentialData(data);
    displayPercentHead(data);
    displayTotalHead(data);
    displayValueHead(data);
    for (let label of Object.keys(colorData)){
        if (label != 'Date'){
            renderTotalCard(label, colorData[label], data)
            renderDailyCard(label, colorData[label], data, diffData)
            renderValueCard(label, colorData[label], data, diffData)
            renderTomorrowTotalCard(label, colorData[label], data)
            renderTomorrowValueCard(label, colorData[label], data, diffData)
            renderTomorrowGrowthCard(label, colorData[label], data, diffData)
        }
    }
    initRates(data, diffData);
}

const renderTotalCard = function(label,color, data){
    const index = data.length-1
    const todayData = data[index][label];
    const card= `<div class='card bg-light mx-0 px-0'>
                    <div class='card-head text-light' style='background-color: ${color}'>
                        <p class="card-text text-center"> ${label}</p>
                    </div>
                    <div class='card-body mx-0 px-0'>
                        <h4 class='card-text text-center font-weight-bold'>${todayData}</h4>
                    </div>
                </div>`;
    document.getElementById('total-value-deck').innerHTML += card;
}

const renderDailyCard = function(label,color,data, diffData){
    //const diffData = getDifferentialData(data)
    const index = diffData.length-1
    const todayData = diffData[index][label];
    const yesterTotalData = data[index-1][label];
    const todayPercent = Math.round(todayData / yesterTotalData * 100 );
    const card= `<div class='card bg-light mx-0 px-0'>
                    <div class='card-head text-light' style='background-color: ${color}'>
                        <p class="card-text text-center"> ${label}</p>
                    </div>
                    <div class='card-body mx-0 px-0'>
                        <h4 class='card-text text-center font-weight-bold'>${todayPercent >0 ? '+'+todayPercent : todayPercent}%</h4>
                    </div>
                </div>`;
    document.getElementById('daily-percentage-deck').innerHTML += card;
}

const renderTotalRateCard = function(label, numerator, denominator){
    const rate = Number((numerator/denominator*100).toFixed(1)) 
    const card= `<div class='card bg-light mx-0 px-0'>
                    <div class='card-head bg-dark text-light'>
                        <p class="card-text text-center"> ${label}</p>
                    </div>
                    <div class='card-body mx-0 px-0'>
                        <h4 class='card-text text-center font-weight-bold'>${rate}%</h4>
                    </div>
                </div>`;
    document.getElementById('total-rate-deck').innerHTML += card;
}

const initRates = function(data, diffData){
    //const diffData = getDifferentialData(data)
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

const renderValueCard = function(label,color,data, diffData){
    //const diffData = getDifferentialData(data)
    const index = diffData.length-1
    const todayData = diffData[index][label];
    const card= `<div class='card bg-light mx-0 px-0'>
                    <div class='card-head text-light' style='background-color: ${color}'>
                        <p class="card-text text-center"> ${label}</p>
                    </div>
                    <div class='card-body mx-0 px-0'>
                        <h4 class='card-text text-center font-weight-bold'>${todayData}</h4>
                    </div>
                </div>`;
    document.getElementById('daily-value-deck').innerHTML += card;
}

const displayValueHead = function(data){
    const header = document.getElementById('today-values');
    const today = data[data.length-1]['Date']
    header.innerText = 'New Counts for: ' +today.toDateString(); 
}


const renderTomorrowTotalCard = function(label,color, data){
    const tomorrowData = getTomorrowValue(label, data)
    const card= `<div class='card bg-light mx-0 px-0'>
                    <div class='card-head text-light' style='background-color: ${color}'>
                        <p class="card-text text-center"> ${label}</p>
                    </div>
                    <div class='card-body mx-0 px-0'>
                        <h4 class='card-text text-center font-weight-bold'>${tomorrowData}</h4>
                    </div>
                </div>`;
    document.getElementById('tomorrow-total-deck').innerHTML += card;
}

const renderTomorrowValueCard = function(label,color, data, diffData){
    //const diffData = getDifferentialData(data);
    const index = diffData.length-1
    const totalData = data[index][label];
    const tomorrowData = getTomorrowValue(label, data)
    const card= `<div class='card bg-light mx-0 px-0'>
                    <div class='card-head text-light' style='background-color: ${color}'>
                        <p class="card-text text-center"> ${label}</p>
                    </div>
                    <div class='card-body mx-0 px-0'>
                        <h4 class='card-text text-center font-weight-bold'>${tomorrowData - totalData}</h4>
                    </div>
                </div>`;
    document.getElementById('tomorrow-value-deck').innerHTML += card;
}

const renderTomorrowGrowthCard = function(label,color,data, diffData){
    //const diffData = getDifferentialData(data);
    const index = diffData.length-1
    const tomorrowData = getTomorrowValue(label, data)
    const totalData = data[index][label];
    const tomorrowPercent = Math.round( (tomorrowData-totalData) / totalData * 100 );
    const card= `<div class='card bg-light mx-0 px-0'>
                    <div class='card-head text-light' style='background-color: ${color}'>
                        <p class="card-text text-center"> ${label}</p>
                    </div>
                    <div class='card-body mx-0 px-0'>
                        <h4 class='card-text text-center font-weight-bold'>+${tomorrowPercent}%</h4>
                    </div>
                </div>`;
    document.getElementById('tomorrow-growth-deck').innerHTML += card;
}