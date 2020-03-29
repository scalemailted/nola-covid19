const sheetId = '1SNiM5iJM8eAWj67O44JaapdkCDzOqU1I9AlteVxMKTI';
const key = "AIzaSyBYlTNZJsj4HXHpzs99ToTqGF9k9qhjEG8";
const sheet = encodeURIComponent('LDH');
const url=`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheet}?key=${key}`;


const requestTableData = async function(url){
    const request = await fetch(url);
    const data = await request.json();
    return data.values; 
}

const parseTableDataByColumn = function(tableArray){
    const data = {};
    const headers = tableArray.shift();
    for (let index in headers){
        const header = headers[index];
        data[header] = getTableColumn(tableArray, index);
    }
    return data;
}

const getTableColumn = function(tableArray, column) {
    return tableArray.map( x => x[column])
  }

const parseTableDataByRow = function(tableArray){
    const data = [];
    const headers = tableArray.shift();
    for (let row of tableArray){
        const datum = {}; 
        for (let col in headers){
            if ( headers[col] === "Date")
                datum[ headers[col] ] = new Date(row[col])
            else
                datum[ headers[col] ] = isNaN(row[col]) ? 0 : +row[col];
        }
        data.push(datum);
    }
    return data;
}

const initData = async function(){
    let data = restoreData();
    if (data === null){
        const responseData = await requestTableData(url);
        //data = parseTableDataByColumn(responseData);
        data = parseTableDataByRow(responseData);
        localStorage.setItem('covidData', JSON.stringify(data) );
    }
    return data;
}

const restoreData = function(){
    if ( localStorage.getItem('covidData') ){
        const json = localStorage.getItem('covidData');
        const data = JSON.parse(json);
        data.forEach( d=> d.Date = new Date(d.Date));
        if ( data.some( d => isToday(d.Date) )){
            return data
        }
    }
    return null;
}

const isToday = function(date){
    const today = new Date();
    return date.toDateString() === today.toDateString()
}

const getDifferentialData = function(data){
    const differentialData = [];
    for (let i=data.length-1; i>0; i--){
        const row = {  Date: data[i].Date };
        for (let col of Object.keys(data[i])){
            if (col !== 'Date'){
                row[col] = data[i][col] - data[i-1][col]
            }
        }
        differentialData.unshift(row)
    }
    differentialData.unshift(data[0])
    return differentialData;
}



//let data = (async () => await initData()) ();