
onmessage = function(e) {
        parishTableData = e.data
        cases = parishTableData.slice(0,69);
        deaths = parishTableData.slice(70,139);
        testState = parishTableData.slice(140,208);
        testComm = parishTableData.slice(209,280);
        parishData=initParishDictionary();
        addFeatureToParishData(cases, parishData);
        addFeatureToParishData(deaths, parishData);
        addFeatureToParishData(testState, parishData, 'Tested (state)');
        addFeatureToParishData(testComm, parishData, 'Tested (commercial)');
        addTotalTestFeatureToParishData(parishData);
        postMessage(JSON.stringify(parishData));
    }




const parishSheetId = '1E4-Zdrqo8oz8NCHB4e6r-OAK30KG4jOlD2b-3AYMgcQ';
const getUrl = sheet => `https://sheets.googleapis.com/v4/spreadsheets/${parishSheetId}/values/${sheet}?key=${key}`;
const sheets = ["Cases", "Regions"]

const regionNames = [ "","Greater New Orleans Area", "Capital Area", "South Central Louisiana", "Acadiana", "Southwest Louisiana", "Central Louisiana", "Northwest Louisiana", "Northeast Louisiana", "Northshore Area"];

const regionsLA = [[]];
regionsLA[1] = [ "Jefferson", "Orleans", "Plaquemines", "St. Bernard"];
regionsLA[2] = [ "Ascension", "East Baton Rouge", "East Feliciana", "Iberville", "Pointe Coupee", "West Baton Rouge", "West Feliciana"];
regionsLA[3] = [ "Assumption", "Lafourche", "St. Charles", "St. James", "St. John the Baptist", "St. Mary", "Terrebonne"];
regionsLA[4] = [ "Acadia", "Evangeline", "Iberia", "Lafayette", "St. Landry", "St. Martin", "Vermilion"];
regionsLA[5] = [ "Allen", "Beauregard", "Calcasieu", "Cameron", "Jefferson Davis"];
regionsLA[6] = [ "Avoyelles", "Catahoula", "Concordia", "Grant", "La Salle", "Rapides", "Vernon", "Winn"];
regionsLA[7] = [ "Bienville", "Bossier", "Caddo", "Claiborne", "De Soto", "Natchitoches", "Red River", "Sabine", "Webster"];
regionsLA[8] = [ "Caldwell", "East Carroll", "Franklin", "Jackson", "Lincoln", "Madison", "Morehouse", "Ouachita", "Richland", "Tensas", "Union", "West Carroll"];
regionsLA[9] = [ "Livingston", "St. Helena", "St. Tammany", "Tangipahoa", "Washington"];


const getRegion = parish => regionsLA.findIndex( region => region.includes(parish) );

const initRegionDictionary = () => [[],[],[],[],[],[],[],[],[],[]]
 
const findByDate = (date, arr) =>  arr.findIndex( e => e.Date.toLocaleDateString() == date)

const initParishDictionary = (obj={}) => {regionsLA.flat().map( parish => obj[parish]=[]); return obj;}

const getRegionData = async function(parishData){
    const url = getUrl("Regions");
    const regionTableData = await requestTableData(url);
    dates = regionTableData[0]
    ventsAvailable = regionTableData.slice(1,11);
    icuAvailable = regionTableData.slice(12,22);
    bedsAvailable = regionTableData.slice(23,33);
    ventsTaken = regionTableData.slice(34,44);
    icuTaken = regionTableData.slice(45,55);
    bedsTaken = regionTableData.slice(56,66);
    const regionData = initRegionDictionary();
    //const parishData = await getParishData();
    parishToRegionData(parishData, regionData);
    //addFeatureToRegionData(dates, ventsAvailable, regionData);
    //addFeatureToRegionData(dates, icuAvailable, regionData);
    //addFeatureToRegionData(dates, bedsAvailable, regionData);
    //addFeatureToRegionData(dates, ventsTaken, regionData);
    //addFeatureToRegionData(dates, icuTaken, regionData);
    //addFeatureToRegionData(dates, bedsTaken, regionData);

    return regionData;
}



const addFeatureToRegionData = function(dates, rawData, regionData, label){
    let regionIndex = 0;
    for (let row of rawData){
        const regionName = row[0], feature = `${row[1]} (${row[2]})`;
        for (let col=3; col<row.length; col++){
            const data = {}
            data['Date'] = new Date(dates[col]);
            let value = row[col].replace(/,/g, '');
            value = isNaN(value) ? 0 : +value;
            label = label ? label : feature; 
            data[label] = value;
            const dayIndex = findByDate(dates[col], regionData[regionIndex]);
            if (dayIndex > -1)
                Object.assign(regionData[regionIndex][dayIndex], data)
            else
                regionData[regionIndex].push(data)
        }
        regionIndex++;
        
    }
}

const parishToRegionData = function(parishData, regionData){
    for (let [parish,data] of Object.entries(parishData)){
        const region = getRegion(parish);
        //console.log( regionNames[region], parish)
        if (regionData[region].length){
            for (let dayIndex in data){
                for (let key of Object.keys(data[dayIndex])){
                    if (key != 'Date'){
                        regionData[region][dayIndex][key] += data[dayIndex][key]
                    }
                }
            }
        }
        else
            regionData[region] = [ ...data ]
    }

}


const getParishData = async function(){
    const url = getUrl("Cases");
    const parishTableData = await requestTableData(url);
    //const todayIndex = parishTableData[0].indexOf(new Date().toLocaleDateString()) 
    //const dates = parishTableData.shift();
    const cases = parishTableData.slice(0,69);
    const deaths = parishTableData.slice(70,139);
    const testState = parishTableData.slice(140,208);
    const testComm = parishTableData.slice(209,280);
    const parishData=initParishDictionary();
    addFeatureToParishData(cases, parishData);
    addFeatureToParishData(deaths, parishData);
    addFeatureToParishData(testState, parishData, 'Tested (state)');
    addFeatureToParishData(testComm, parishData, 'Tested (commercial)');
    addTotalTestFeatureToParishData(parishData);
    
    return parishData;
    
}

const addTotalTestFeatureToParishData = function(parishData){
    Object.values(parishData).flat().forEach( row => Object.assign(row, {'Tested (total)': row['Tested (state)'] + row['Tested (commercial)'] }) )
}

const addFeatureToParishData = function(rawData, parishData, label){
    const dates = rawData[0], feature = rawData[1];
    for (let row of rawData){
        const name = row[0].trimEnd();
        if ( regionsLA.flat().includes(name) ) {
            for (let col=1; col<row.length; col++){
                const data = {}
                data['Date'] = new Date(dates[col]);
                let value = row[col].replace(/,/g, '');
                value = isNaN(value) ? 0 : +value;
                label = label ? label : feature[col] 
                data[label] = value;
                const index = findByDate(dates[col], parishData[name]);
                if (index > -1)
                    Object.assign(parishData[name][index], data)
                else
                    parishData[name].push(data)
            }
        }
    }
}


const initParishData = async function(){
    let data = restoreParishData();
    if (data === null){
        data = await getParishData();
        localStorage.setItem('parishData', JSON.stringify(data) );
    }
    return data;
}

const restoreParishData = function(){
    if ( localStorage.getItem('parishData') ){
        const json = localStorage.getItem('parishData');
        const data = JSON.parse(json);
        Object.values(data).flat().forEach( e=> e.Date = new Date(e.Date))
        if ( Object.values(data).flat().some( day=> isToday(day.Date)) ){
            return data
        }
    }
    return null;
}

const initRegionData = async function(parishData){
    let data = restoreRegionData();
    if (data === null){
        data = await getRegionData(parishData);
        localStorage.setItem('regionData', JSON.stringify(data) );
    }
    return data;
}

const restoreRegionData = function(){
    if ( localStorage.getItem('regionData') ){
        const json = localStorage.getItem('regionData');
        const data = JSON.parse(json);
        data.flat().forEach( day => day.Date = new Date(day.Date) )
        if ( data.flat().some( day => isToday(day.Date) ) ){
            return data
        }
    }
    return null;
}


