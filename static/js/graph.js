 
  queue()
    .defer(d3.csv,"data/expenses.csv")
    .await(makeGraph);
    
 
function makeGraph(error,expensesData){

   
    var ndx = crossfilter(expensesData);
    
     expensesData.forEach(function(d){
        d.utility_bill = parseInt(d.utility_bill);
        d.groceries =parseInt(d.groceries);
        d.fuel =parseInt(d.fuel);
        d.dining = parseInt(d.dining);
        d.rent = parseInt(d.rent);
     });
      console.log(expensesData);
     show_monthly_expense(ndx);
     
     show_grocery_distribution(expensesData, 1); // 1 means January and so on
    
     dc.renderAll();
}

 function show_monthly_expense(ndx) {
    var dim = ndx.dimension(dc.pluck('month'));
    var group = dim.group().reduceSum(dc.pluck('totalexp'));
   
    
    dc.barChart("#exp-2018")
        .width(800)
        .height(350)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        
        .x(d3.scale.ordinal()
        .domain(["January", "February", "March","April","May","June","July","August","September","October","November","December"]))       
       
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Month")
        .yAxisLabel("TotalExp")
        .yAxis()
        .ticks(6);
        

}



 var myWidthVariable = 250;
 
function show_grocery_distribution(data, monthNumber) {
    var elements = Object.keys(data[monthNumber-1]).slice(1, 6);
    var values = Object.values(data[monthNumber-1]).slice(1, 6);
    var dataset = elements.map(function(d, idx) {
      return {
       element: d,
       value: values[idx]
      }
    });
    
    var ndx = crossfilter(dataset);
 
    var dim = ndx.dimension(dc.pluck('element'));
     console.log(dim);
    var group = dim.group().reduceSum(function(d){
     console.log(d);
     return d.value;
    });
 
    dc.pieChart("#exp-pie")
      .height(300)
      .width(myWidthVariable * 1.5)
      .radius(myWidthVariable / 2)
      .transitionDuration(500)
      .dimension(dim)
      .group(group)
      .legend(dc.legend().gap(7));
  }
  
  /*
function show_grocery_distribution(ndx) {
 
    var dim = ndx.dimension(dc.pluck("month"));
    var group = dim.group().reduceSum(function(d){
     console.log(d);
     return d.utility_bill + d.groceries + d.dining + d.fuel + d.rent;
    });
 
    dc.pieChart("#exp-pie")
      .height(300)
      .width(myWidthVariable * 1.5)
      .radius(myWidthVariable / 2)
      .transitionDuration(500)
      .dimension(dim)
      .group(group)
      .legend(dc.legend().gap(7));
  }
  */