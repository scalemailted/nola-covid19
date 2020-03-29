

const plotData = function(data, xLabel, yLabels, colors){
    const domainX = data.map( row => row [xLabel]);
    const domainY = yLabels.flatMap( col => data.map( row => row[col])   )

    let height  = window.innerHeight *.6;
    let width   = window.innerWidth;

    const margin = {top: 40, right: 40, bottom: 40, left: 40};
    width =     width - margin.left - margin.right;
    height =    height - margin.top - margin.bottom;


    document.getElementById('view').innerHTML = '';
    const svg = d3.select('#view') //d3.select('body').append("svg")
    .attr("width",  width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain([d3.min(domainX) , d3.max(domainX) ] );
    y.domain([d3.min(domainY) , d3.max(domainY) ]);

  

    var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b%d")).tickValues(domainX).tickSize(height)

    svg.append("g")
            .attr("class", "x axis")
            //.attr("transform", `translate(0,${height})`) //"translate(0," + height + ")")
            .classed('grid', true)
            .call(xAxis)
   
    yLabels.forEach( (col) => plotLine({'svg':svg, 'x':x, 'y':y, 'data':data, 'xLabel':xLabel, 'yLabel':col, color:colors[col]}))

    svg.append('text')                                     
        .attr('x', 10)              
        .attr('y', -5)             
        .html('&#9884;&#65039; NOLA COVID-19 Data Visualizer &#9884;&#65039;');





            
}


const plotLine = function(config){
    const {svg, x, y, data, xLabel, yLabel, color} = config;
    const lineData = data.map( d => { return {'x':d[xLabel], 'y':d[yLabel]}});
    const valueline = d3.line()
            .x( d => x(d.x) )
            .y( d => y(d.y) )
            .curve(d3.curveMonotoneX);
    
    /*
    svg.append("path")
        .data([lineData]) 
        .attr("class", "line")  
        .style("stroke", color)
        .attr("d", valueline); 
    */

    var path = svg.append("path")
        .data([lineData])
        .attr("class", "line")
        .style("stroke", color)
        .attr("d", valueline);
    
    // Variable to Hold Total Length
    var duration = 6000
    var totalLength = path.node().getTotalLength();
 
    // Set Properties of Dash Array and Dash Offset and initiate Transition
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition() // Call Transition Method
        .duration(duration) // Set Duration timing (ms)
        .ease(d3.easeLinear) // Set Easing option
        .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition

    /*    
    svg.selectAll(".dot")
        .data(lineData, (d,i)=>d[0])
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .style("fill", d => d.y ? color : "rgba(0,0,0,0)")
        .attr("cx", d=>x(d.x) )
        .attr("cy", d=>y(d.y) )
        .attr("r", 5);
    */

    var segments = [0];
    for(var i = 1; i < lineData.length; i++) {
        var tmp = svg.append("path")
            .datum([lineData[i-1], lineData[i]])
            .attr("d", valueline);
        segments.push(segments[i-1] + tmp.node().getTotalLength());
        tmp.remove();
    }

    var dots = svg.selectAll(".dot")
        .data(lineData, (d,i)=>d[0])
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .style("fill", "rgba(0,0,0,0)")
        .attr("cx", d=>x(d.x) )
        .attr("cy", d=>y(d.y) )
        .attr("r", 5)
        //.transition()
            //.duration(10000)
            //.style("fill", d => d.y ? color : "rgba(0,0,0,0)")
    dots.transition()
        .delay( (d, i)  => segments[i]* duration/totalLength )
        .ease(d3.easeLinear)
        .attr("cx", d=>x(d.x) )
        .attr("cy", d=> y(d.y) )
        //.attr("r", 5)
        .style("fill", d => d.y ? color : "rgba(0,0,0,0)")


    var text = svg.selectAll(".text")
            .data(lineData)
            .enter()
            .append("text") // Uses the enter().append() method
            .attr("class", "label") // Assign a class for styling
            .attr("x", d=> x(d.x) )
            .attr("y", d=> y(d.y) )

    text.transition()
            .delay( (d, i)  => segments[i]* duration/totalLength )
            .ease(d3.easeLinear)
            .attr("x", d=> x(d.x) )
            .attr("y", d=> y(d.y) )
            .attr("dy", "-5")
            .attr("text-anchor", "end")
            .text( d=> d.y ? d.y : '' )        
            .style("fill", "rgba(0,0,0,1)")


    /*
    svg.selectAll(".text")
        .data(lineData)
        .enter()
        .append("text") // Uses the enter().append() method
        .attr("class", "label") // Assign a class for styling
        .attr("x", d=> x(d.x) )
        .attr("y", d=> y(d.y) )
        .attr("dy", "-5")
        .attr("text-anchor", "end")
        .text( d=> d.y ? d.y : '' );
        */
}


const getColors = function(data){
    const colors = ['black','blue', 'darkred', 'gold', 'darkorange', 'olive', 'darkgreen', 'limegreen'];
    const features = Object.keys(data[0])
    const colorMap = {}
    features.forEach( (name,index)=> colorMap[name] = colors[index] )
    //const colorMap = features.map(  (name,index) => [name,colors[index]]  )
    return colorMap;

} 



//window.onload = async () => plotData( await initData() )
var data;
var diffData;
window.onload = async () => {
    data = await initData();
    diffData = getDifferentialData(data)
    const colors = getColors(data);
    initControllers(colors)
    //plotData(data,'Date', ['Cases', 'Deaths', 'Hospitalized', 'Intubated (ventilator)'], colors);
    //renderTable(data)
    collapsibleTable(data, 'COVID-19 Table - Total Counts', 'total');
    collapsibleTable(diffData, 'COVID-19 Table - Daily Differentials', 'differ');
};


