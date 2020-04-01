const displayPercentHead = function(){
    const header = document.getElementById('today-percent');
    const today = data[data.length-1]['Date']
    header.innerText += ' ' +today.toDateString(); 
}


const initDisplayPercents = function(){
    displayPercentHead();
    for (let label of Object.keys(colorData)){
        if (label != 'Date'){
            console.log(label)
            renderCard(label, colorData[label])
        }
    }
}

const renderCard = function(label,color){
    const index = diffData.length-1
    const todayData = diffData[index][label];
    const yesterTotalData = data[index-1][label];
    console.log(todayData, yesterTotalData)
    const todayPercent = Math.ceil(todayData / yesterTotalData * 100 );
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
