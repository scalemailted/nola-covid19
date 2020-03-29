const collapsibleTable = function(data, label, id){
    const collapsible = `<button class="btn btn-block btn-light-outline" data-toggle="collapse" data-target="#${id}" aria-expanded="false" aria-controls="${id}">
        ${label} 
    </button>
    <div class="collapse" id="${id}"> ${ renderTable(data)}</div>`
    document.getElementById('tableData').innerHTML += collapsible;
}

const renderTable = function(data){
    const table = `<table class='table table-striped'> ${renderTableHead(data[0])} ${renderTableBody(data)} </table>`;
    return table.replace(/,/g, '');
}

const renderTableHead = function(row){
    const tdList = [ ...Object.keys(row)];
    return `<thead class='thead-dark'> <tr> ${tdList.map( e => renderTD(e))} </tr> </thead>`;
}

const renderTableBody = function(tableData){
    return `<tbody>${ tableData.map( e=> renderTableRow(e))} </tbody>`;
}

const renderTableRow = function( row ){
    const tdList = [ ...Object.values(row)]; 
    return `<tr>${ tdList.map( e => renderTD(e)) }</tr>`;
}

const renderTD = function (datum){
    text = datum instanceof Date ? datum.toDateString() : String(datum);
    return `<td>${ text }</td>`;
}

