const selections = new Set();
let colorData;
let isDailyData = true;

const addButton = function(label, color){
    const controllers = document.getElementById('controllers');
    const button = `<button 
                        onclick="toggleSelection('${label}')" 
                        style='background-color:#eee;  color:${color};'
                        class='btn'
                        id='${label}'>
                            <b>${label}</b>
                    </button>`
    controllers.innerHTML += button;
}

const toggleSelection = function(label){
    if (selections.has(label)){
        selections.delete(label)
        document.getElementById(label).style =`background-color:#eee;  color:${colorData[label]};`
    }
    else if (label != 'Date'){
        selections.add(label)
        document.getElementById(label).style =`background-color:${colorData[label]};  color:white;`
    }
    getPlot();
}

const getPlot = function(){
    if (isDailyData) plotData(data,'Date', [...selections], colorData);
    else plotData(diffData,'Date', [...selections], colorData);
}

const initDatasetController = function(){
    const btn = document.getElementById("dataset-controller");
    btn.addEventListener('click', toggleDataset);
}

const toggleDataset = function(){
    const btn = document.getElementById("dataset-controller");
    if (btn.innerText === "Total Counts"){
        btn.innerText = "Daily Differentials";
        isDailyData = false;
    }
    else{
        btn.innerText = "Total Counts";
        isDailyData = true;
    }
    getPlot();
}

const initControllers = function(colors){
    Object.keys(colors).forEach( key => addButton(key, colors[key]) )
    //labelList.forEach( label => addButton(label, colors[label]))
    colorData = colors;
    initDatasetController();
    ['Cases', 'Deaths', 'Hospitalized', 'Intubated (ventilator)'].forEach(label=>toggleSelection(label));
}

