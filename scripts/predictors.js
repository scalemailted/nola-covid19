const getTomorrowValue = function(feature, dataset){
    const actuals = getFeatureData(feature,dataset);
    const linear = fitModel('linear', feature, dataset)
    const polynomial = fitModel('polynomial', feature, dataset);
    const exponential = fitModel('exponential',feature,dataset);
    const err_linear = rss(actuals, getY(linear) )
    const err_polynomial = rss(actuals, getY(polynomial) )
    const err_exponential = rss(actuals, getY(exponential) )
    const err_min = d3.min([err_linear, err_polynomial, err_exponential])
    const linearPredictor = getLinearPredictor(feature,dataset)
    const polynomialPredictor = getPolynomialPredictor(feature,dataset)
    const exponentialPredictor = getExponentialPredictor(feature,dataset)
    switch(err_min){
        case err_linear:      return ~~linearPredictor.predict(dataset.length)[1];
        case err_polynomial:  return ~~polynomialPredictor.predict(dataset.length)[1];
        case err_exponential: return ~~exponentialPredictor.predict(dataset.length)[1];
    }
}



const rss = function(predicttions, actuals){
    let sum = 0
    for (let day in actuals){
        const residual = (actuals[day] - predicttions[day])**2
        sum += residual;
    }
    return Math.sqrt(sum);
}


const fitBestRegression = function(feature, dataset){
    const actuals = getFeatureData(feature,dataset);
    const linear = fitModel('linear', feature, dataset)
    const polynomial = fitModel('polynomial', feature, dataset);
    const exponential = fitModel('exponential',feature,dataset);
    const err_linear = rss(actuals, getY(linear) )
    const err_polynomial = rss(actuals, getY(polynomial) )
    const err_exponential = rss(actuals, getY(exponential) )
    const err_min = d3.min([err_linear, err_polynomial, err_exponential])
    switch(err_min){
        case err_linear:      return linear;
        case err_polynomial:  return polynomial;
        case err_exponential: return exponential;
    }
}

const getY = arr => arr.map( coord => coord.y )


const fitModel = function(model, feature, dataset){
    switch(model){
        case 'linear':      return fitLinearRegression(feature,dataset);
        case 'polynomial':  return fitPolynomialRegression(feature,dataset);
        case 'exponential': return fitExponentialRegression(feature,dataset);
        case 'bestfit':     return fitBestRegression(feature, dataset);
    }
}


const fitLinearRegression = function(feature,dataset){
    const predictor = getLinearPredictor(feature,dataset)
    return fitRegression(predictor, feature, dataset)
}

const fitPolynomialRegression = function(feature, dataset){
    const predictor = getPolynomialPredictor(feature, dataset)
    return fitRegression(predictor, feature, dataset)
}

const fitExponentialRegression = function(feature, dataset){
    const predictor = getExponentialPredictor(feature, dataset)
    return fitRegression(predictor, feature, dataset)
}

const fitRegression = function(predictor, feature, dataset){
    const {start, end} = getEndPoints(feature,dataset);
    points = []
    for(let day=0; day<end; day++){
        const date = dataset[day]['Date']  
        if (day < start){
           points.push({'x':date, 'y':0})
        }
        else{
            let [x,y] = predictor.predict(day)
            y  = y > 0 ? y : 0; 
            points.push( {'x':date, 'y':y } )
        }
    }
    return points;
}

const getLinearPredictor = function(feature,dataset){
    const points = getPoints(feature,dataset)
    return regression.linear(points)
}

const getPolynomialPredictor = function(feature,dataset){
    const points = getPoints(feature,dataset)
    return regression.polynomial(points)
}

const getExponentialPredictor = function(feature,dataset){
    const points = getPoints(feature,dataset)
    return regression.exponential(points)
}

const getPoints = function(feature,dataset){
    const {start, end} = getEndPoints(feature,dataset); 
    const featureList = getFeatureData(feature,dataset);
    const points = []
    for (let day = start; day< end;  day++){
        points.push([ day, featureList[day] ])
    }
    return points;
}

const getEndPoints = function(feature, dataset){
    const start = dataset.findIndex( row => row[feature] )
    const end = dataset.length;
    return { 'start': start, 'end': end };
}

const getFeatureData = (feature,dataset) => dataset.map(row => row[feature] )
