const selections = new Set();
let colorData;
let isDailyData = true;
let speed;
let drawType;
let predictorType;
let locationType;
let locationSelection;

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
    else if (label != 'Date'  ){
        selections.add(label)
        document.getElementById(label).style =`background-color:${colorData[label]};  color:white;`
    }
    if (locationSelection !== 'All') updateLocationSelection();
    getPlot();
}

const getPlot = function(){
    let data = datasets['All'];
    //console.log(locationSelection)
    if ( locationSelection != 'All'){
        data = datasets[locationType][ locationSelection ]
    }
    //console.log(locationType, locationSelection, data)
    if (isDailyData) plotData(data,'Date', [...selections], colorData);
    else plotData( getDifferentialData(data),'Date', [...selections], colorData);
    initDisplayPercents(data);
}

const initDatasetController = function(){
    const btn = document.getElementById("dataset-controller");
    btn.addEventListener('click', toggleDataset);
}

const toggleDataset = function(){
    const btn = document.getElementById("dataset-controller");
    if (btn.innerText.includes("Total Counts")){
        btn.innerHTML = "Daily Differentials";
        isDailyData = false;
    }
    else{
        btn.innerHTML = "Total Counts";
        isDailyData = true;
    }
    getPlot();
}

const initAnimationController = function(){
    const slider = document.getElementById('animation-speed'); 
    slider.addEventListener('change', animationHandler);
    animationHandler();
}

const animationHandler = function(e){
    const slider = document.getElementById('animation-speed'); 
    const viewer =  document.getElementById('speed-view');
    viewer.innerText = slider.value; 
    speed = +slider.value;
    getPlot();
} 

const initDrawTypes = function(){
    const drawTypeInput = document.getElementById('drawTypes');
    drawTypeInput.addEventListener('change', drawTypeHandler);
    drawType = drawTypeInput.value
}

const drawTypeHandler = function(){
    const drawTypeInput = document.getElementById('drawTypes');
    drawType = drawTypeInput.value;
    getPlot() 
}

const initPredictorTypes = function(){
    const predictorTypeInput = document.getElementById('predictorTypes');
    predictorTypeInput.addEventListener('change', predictorTypeHandler);
    predictorType = predictorTypeInput.value
}

const predictorTypeHandler = function(){
    const drawTypeInput = document.getElementById('predictorTypes');
    predictorType = drawTypeInput.value;
    getPlot(); 
}

const initControllers = function(colors){
    Object.keys(colors).forEach( key => addButton(key, colors[key]) )
    //labelList.forEach( label => addButton(label, colors[label]))
    colorData = colors;
    initDatasetController();
    initLocationSelector();
    initAnimationController();
    initDrawTypes();
    initPredictorTypes();
    ['Cases', 'Deaths', 'Hospitalized', 'Intubated (ventilator)'].forEach(label=>toggleSelection(label));
}

const hide = function(id){
    document.getElementById(id).style = "visibility: hidden;"
}

const initRegionSelections = function(){
    locationType = 'Region'
    const locationInput = document.getElementById('locationItemSelector');
    locationInput.innerHTML = `<option value='All' selected>All</option>`
    for (let i=1; i<regionNames.length; i++ ){
        locationInput.innerHTML += `<option value="${i}">${regionNames[i]}</option>`
    }
    locationSelection = document.getElementById('locationItemSelector').value;
}

const initParishSelections = function(){
    locationType = 'Parish'
    const locationInput = document.getElementById('locationItemSelector');
    locationInput.innerHTML = `<option value='All' selected>All</option>`
    const parishNames = regionsLA.flat().sort();
    for (let parish of parishNames){
        locationInput.innerHTML += `<option value='${parish}'>${parish}</option>`
    }
    locationSelection = document.getElementById('locationItemSelector').value;
}

const toggleLocationSelector = function(){
    const button = document.getElementById('locationTypeSelector');
    if (button.innerText == 'Region'){
        button.innerText = 'Parish';
        locationType = 'Parish'
        initParishSelections();
    }
    else{
        button.innerText = 'Region';
        locationType = 'Region';
        initRegionSelections();
    }
    getPlot();
}

const updateLocationSelection = function(){
    locationSelection = document.getElementById('locationItemSelector').value;
    locationSelection = +locationSelection ? +locationSelection : locationSelection;
    if (locationSelection != 'All'){
        if (selections.has('Hospitalized')){
            selections.delete('Hospitalized')
            document.getElementById('Hospitalized').style =`background-color:#eee;  color:${colorData['Hospitalized']};`
        }
        if (selections.has("Intubated (ventilator)")){
            selections.delete("Intubated (ventilator)")
            document.getElementById("Intubated (ventilator)").style =`background-color:#eee;  color:${colorData["Intubated (ventilator)"]};`
        }
    }
    //console.log(locationSelection)
    getPlot();
}


const initLocationSelector = function(){
    initRegionSelections();
    const button = document.getElementById('locationTypeSelector');
    button.addEventListener('click', toggleLocationSelector);
    const dropdown = document.getElementById('locationItemSelector');
    dropdown.addEventListener('change', updateLocationSelection);
}



