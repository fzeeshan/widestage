/**
 * Created with JetBrains WebStorm.
 * User: hermenegildoromero
 * Date: 10/01/15
 * Time: 08:02
 * To change this template use File | Settings | File Templates.
 */

//app.service('reportModel' , function ($http, $q, $filter, ngTableParams) {    TODO: ngTableParams quitado todo por traslado activar

app.service('reportModel' , function ($http, $q, $filter, connection) {
    this.data = null;
    this.scope = null;
    this.selectedReport = null;

    var hashCode = function(s){
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    };

    this.getReportData = function($scope,report,params, done) {
        getReportData($scope,report, params, done);
    };
    function getReportData($scope,report, params, done) {
        //console.log('getReportData');


            params.query = report.query;


            connection.get('/api/reports/get-data', params, function(data) {
                //console.log('me he traido los datos',JSON.stringify(data));
                done(data);
            });

    };

    this.getData = function($scope,query,params, done) {
        params.query = query;
        connection.get('/api/reports/get-data', params, function(data) {

            done(data);
        });
    }

    this.getReport = function($scope, id,mode, done) {
        this.scope = $scope;
        console.log('get report');
        //connection.get('/api/reports/find-one', {id: id}, function(data) {
        connection.get('/api/reports/get-report/'+id, {id: id, mode: mode}, function(data) {
            $scope.selectedReport = data.item;
            this.selectedReport = $scope.selectedReport;
            console.log($scope.selectedReport);

            for (var i in $scope.selectedReport.query.datasources) {
                var dataSource = $scope.selectedReport.query.datasources[i];

                for (var c in dataSource.collections) {
                    var collection = dataSource.collections[c];
                    if ($scope.filters) //only for editing the report
                    {
                      $scope.filters[0].filters = collection.filters;
                      $scope.columns = collection.columns;
                      $scope.order = collection.order;
                    }
                }
            }

            done($scope.selectedReport);
        });
        return;



        /*
        var d = $q.defer();

        $http({method: 'GET', url: '/api/get_report', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }

                done(data.item);
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;


         */

    };

    this.getReportDefinition = function(id, done) {

        connection.get('/api/reports/find-one', {id: id}, function(data) {
            done(data.item);
        });
    };




    this.getReportBlock = function($scope, id, done)
    {

        this.getReport($scope,id,'none', function(report){


            if (!report)
            {
                done(1);
                return;
            }

            //identificar los prompts del informe
            //no se puede obtener los datos en tanto en cuanto no se tienen los valores para los filtros

            if (!$scope.prompts)
                 $scope.prompts = [];

            for (var i in report.query.datasources) {
                var dataSource = report.query.datasources[i];

                for (var c in dataSource.collections) {
                    var collection = dataSource.collections[c];
                        for (var f in collection.filters) {
                            var filter = collection.filters[f];
                            if (filter.filterPrompt == true)
                            {
                                filter.reportID = id;
                                $scope.prompts.push(filter);
                            }
                        }
                }
            }

            if ($scope.prompts.length == 0)
            {
                this.executeReport($scope,id, report, function (errorCode){
                        done(errorCode);
                });
            } else {
                if (!$scope.reports)
                    $scope.reports = [];
                    $scope.reports.push(report); //several reports in the same scope ie. dashboards
            }


        });

    }









    this.executeReport = function($scope,id, report, done)
    {
        if (report.reportType == "chart-bar")
            generateChartBar($scope,id,report,function(errorCode) {
                done(errorCode);
            });
        if (report.reportType == "chart-line")
            generateChartLine($scope,id,report,function(errorCode) {
                done(errorCode);
            });
        if (report.reportType == "chart-donut")
            generateChartDonut($scope,id,report,function(errorCode) {
                done(errorCode);
            });
        if (report.reportType == "chart-area")
            generateChartArea($scope,id,report,function(errorCode) {
                done(errorCode);
            });
        if (report.reportType == "grid")
            //generateGrid($scope,id,report,function(errorCode) {
                generateRepeater($scope,id,report,function(errorCode) {
                done(errorCode);
            });
        if (report.reportType == "pivot")
            generatePivot($scope,id,report,function(errorCode) {
                done(errorCode);
            });
        if (report.reportType == "indicator")
            generateIndicator($scope,id,report,function(errorCode) {
                done(errorCode);
            });
        if (report.reportType == "vectorMap")
            generateVectorMap($scope,id,report,function(errorCode) {
                done(errorCode);
            });
        if (report.reportType == "readOnlyForm")
            generateReadOnlyForm($scope,id,report,function(errorCode) {
                done(errorCode);
            });
        if (report.reportType == "gauge")
            generateGauge($scope,id,report,function(errorCode) {
                done(errorCode);
            });
    }

    /*
    this.getChart = function($scope,id,done)
    {
        this.getReport($scope,id, function(report){

            if (!report)
            {
                done(1);
                return;
            }


            if (report.reportType == "chart")
                generateChartHTML(id,report,function(errorCode) {
                    done(errorCode);
                });

        });

    }
    */

    this.getReportBlockForPreview = function($scope, report, id, done)
    {

           console.log('For Preview '+report);

           this.selectedReport = report;

            console.log(id);

            if (!report)
            {
                done(1);
                return;
            }

            /*
            if (report.reportType == "chart")
                generateChart($scope,id,report,function(errorCode) {
                    done(errorCode);
                });
            */
            if (report.reportType == "chart-bar")
                generateChartBar($scope,id,report,function(errorCode) {
                    done(errorCode);
                });
            if (report.reportType == "chart-line")
                generateChartLine($scope,id,report,function(errorCode) {
                    done(errorCode);
                });
            if (report.reportType == "chart-donut")
                generateChartDonut($scope,id,report,function(errorCode) {
                    done(errorCode);
                });
            if (report.reportType == "chart-area")
                generateChartArea($scope,id,report,function(errorCode) {
                    done(errorCode);
                });


            if (report.reportType == "grid")
                //generateGrid($scope,id,report,function(errorCode) {
                    generateRepeater($scope,id,report,function(errorCode) {
                    done(errorCode);
                });
            if (report.reportType == "pivot")
                generatePivot($scope,id,report,function(errorCode) {
                    done(errorCode);
                });
            if (report.reportType == "indicator")
                generateIndicator($scope,id,report,function(errorCode) {
                    done(errorCode);
                });
            if (report.reportType == "vectorMap")
                generateVectorMap($scope,id,report,function(errorCode) {
                    done(errorCode);
                });
            if (report.reportType == "readOnlyForm")
                generateReadOnlyForm($scope,id,report,function(errorCode) {
                    done(errorCode);
                });
            if (report.reportType == "gauge")
                generateGauge($scope,id,report,function(errorCode) {
                    done(errorCode);
                });


    }

    this.getDistinct = function($scope,attribute) {


        var execute = (typeof execute !== 'undefined') ? execute : true;

        var query = {};
        query.datasources = [];

        //var filters = $scope.filters[0].filters;

        console.log('the filter attribute ', attribute);

        var datasourcesList = [];
        var layersList = [];
        datasourcesList.push(attribute.datasourceID);
        layersList.push(attribute.layerID);



        for (var i in datasourcesList) {

            var dtsObject = {};
            dtsObject.datasourceID = datasourcesList[i];
            dtsObject.collections = [];

            var dtsCollections = [];
            dtsCollections.push(attribute.collectionID);



            for (var n in dtsCollections) {

                var collection = {};
                collection.collectionID = dtsCollections[n];

                collection.columns = [];
                collection.columns.push(attribute);



                collection.order = [];
                collection.order.push(attribute);

                for (var n1 in $scope.order) {
                    if ($scope.order[n1].collectionID == dtsCollections[n])
                    {
                        collection.order.push($scope.order[n1]);
                    }
                }

                dtsObject.collections.push(collection);

            }
            query.datasources.push(dtsObject);
        }

        query.layers = layersList;



        this.getData($scope, query, {page: 0}, function(data) {
            console.log('datos de distinct value ' + JSON.stringify(data));
            $scope.searchValues = data;
            $scope.errorMsg = (data.result === 0) ? data.msg : false;
            $scope.page = data.page;
            $scope.pages = data.pages;
            //$scope.data = data;
        });




    }


    function generateChartLine($scope,id,report,done)
    {
        getReportData($scope,report,{}, function(theData){

            var theXKey = report.properties.xkeys[0].elementName;

                var chartParams = {
                    element: id,
                    data: theData,
                    xkey: theXKey,
                    hideHover: true,
                    resize: true,
                    parseTime: false
                    //dateFormat: function (x) { return ''; }
                };

                var ykeys = [], labels = [];

                for (var i in report.properties.ykeys) {
                    var theYKey = report.properties.ykeys[i].collectionID+'_'+report.properties.ykeys[i].elementName;
                    if (report.properties.ykeys[i].aggregation) theYKey += report.properties.ykeys[i].aggregation;

                    ykeys.push(theYKey);
                    labels.push(report.properties.ykeys[i].objectLabel);
                }

                chartParams.ykeys = ykeys;
                chartParams.labels = labels;

                if (report.properties.colors) {
                    chartParams.lineColors = report.properties.colors;
                }

                new Morris.Line(chartParams).on('click', function(i, row){
                    console.log('yeah clicked on: ', i, row);
                    var params = {};
                    params.i = i;
                    params.row = row;
                    $scope.reportClicked(id,params);

                });

                done(0);
                return;
            });
    }

    function generateChartBar($scope,id,report,done)
    {


        getReportData($scope,report,{}, function(theData){



            var theXKey = report.properties.xkeys[0].collectionID+'_'+report.properties.xkeys[0].elementName;
            if (report.properties.xkeys[0].aggregation) theXKey += report.properties.xkeys[0].aggregation;

            //the X key no puede ser un valor agregado??
            //if ($scope.selectedReport.properties.xkeys[0].aggregation) theXKey += $scope.selectedReport.properties.xkeys[0].aggregation;

            //console.log('The X KEY '+theXKey);

            var chartParams = {
                element: id,
                data: theData,
                xkey: theXKey,
                hideHover: true,
                resize: true
            };

            var ykeys = [], labels = [];



            console.log(report.properties.ykeys);

            for (var i in report.properties.ykeys) {

                var theYKey = report.properties.ykeys[i].collectionID+'_'+report.properties.ykeys[i].elementName;
                if (report.properties.ykeys[i].aggregation) theYKey += report.properties.ykeys[i].aggregation;



                ykeys.push(theYKey);
                labels.push(report.properties.ykeys[i].objectLabel);

            }

            chartParams.ykeys = ykeys;
            chartParams.labels = labels;

            if (report.properties.colors) {
                chartParams.barColors = report.properties.colors;
            }

            new Morris.Bar(chartParams).on('click', function(i, row){
                console.log(i, row);
                var params = {};
                params.i = i;
                params.row = row;
                $scope.reportClicked(id,params);
            });

            done(0);
            return;
        });
    }

    function generateChartDonut($scope,id,report,done)
    {
        console.log('the chart donut');

        getReportData($scope,report,{}, function(theData){
            if (theData) {
                var data = [];

                var theYKey = report.properties.ykeys[0].collectionID+'_'+report.properties.ykeys[0].elementName;
                if (report.properties.ykeys[0].aggregation) theYKey += report.properties.ykeys[0].aggregation;

                var theXKey = report.properties.xkeys[0].collectionID+'_'+report.properties.xkeys[0].elementName;
                if (report.properties.xkeys[0].aggregation) theXKey += report.properties.xkeys[0].aggregation;

                for (var i in theData) {
                    //data.push({label: theData[i][report.properties.labelField], value: theData[i][report.properties.valueField]});
                    data.push({label: theData[i][theXKey], value: theData[i][theYKey]});
                }

                var chartParams = {
                    element: id,
                    data: data,
                    resize: true
                };

                if (report.properties.colors) {
                    chartParams.colors = report.properties.colors;
                }

                Morris.Donut(chartParams).on('click', function(i, row){
                    console.log(i, row);
                    var params = {};
                    params.i = i;
                    params.row = row;
                    $scope.reportClicked(id,params);
                });

                done(0);
                return;
            }
        });
    }

    function generateChartArea($scope,id,report,done)
    {
        getReportData($scope,report,{}, function(theData){

            var theXKey = report.properties.xkeys[0].collectionID+'_'+report.properties.xkeys[0].elementName;
            if (report.properties.xkeys[0].aggregation) theXKey += report.properties.xkeys[0].aggregation;

            var chartParams = {
                element: id,
                data: theData,
                xkey: theXKey,
                hideHover: true,
                resize: true,
                behaveLikeLine: false,
                parseTime: false
                //dateFormat: function (x) { return ''; }
            };

            var ykeys = [], labels = [];

            for (var i in report.properties.ykeys) {
                var theYKey = report.properties.ykeys[i].collectionID+'_'+report.properties.ykeys[i].elementName;
                if (report.properties.ykeys[i].aggregation) theYKey += report.properties.ykeys[i].aggregation;

                ykeys.push(theYKey);
                labels.push(report.properties.ykeys[i].objectLabel);
            }

            chartParams.ykeys = ykeys;
            chartParams.labels = labels;

            if (report.properties.colors) {
                chartParams.lineColors = report.properties.colors;
            }

            new Morris.Area(chartParams).on('click', function(i, row){
                console.log(i, row);
                var params = {};
                params.i = i;
                params.row = row;
                $scope.reportClicked(id,params);
            });

            done(0);
            return;
        });
    }

    this.selectFilterArrayValue = function(type, filter)
    {
        if (type == 'multiple')
        {
            for (var n1 in filter.filterLabel1) {
                if (n1 > 0)
                    filter.filterText1 = filter.filterText1 +';'+ filter.filterLabel1[n1].value;
                else
                    filter.filterText1 = filter.filterLabel1[n1].value;
            }
        } else {
            filter.filterText1 = filter.filterLabel1.value;
        }


    }

    this.repaintRepeater = function($scope,id,report,done)
    {
        repaintRepeater($scope,id,report,function(){
            done();
        });
    }

    this.changeColumnFormat = function($scope, columnIndex ,hashedID)
    {

        var report = $scope.reports[hashedID]; //$scope.selectedReport

        report.properties.columns[columnIndex].format = {color:'#99FF99','text-align':'center','background-color':'#ffffcc','font-size':'16px','font-weight': 'bold','font-style': 'italic'};//{color:'#CCFF99'};


        var elementName = report.properties.columns[columnIndex].collectionID+'_'+'unit';


        this.repaintRepeater($scope,report._id,report,function(){

        });
        //Esto del orderBy no funciona
        //$filter('orderBy')($scope.theData[$scope.selectedReport.hashedID], ['WST9831054943614705b5b0b398c0c20d3e_unit']);

    }

    this.orderColumn = function($scope,predicate,hashedID) {

        $scope.reports[hashedID].reverse = ($scope.reports[hashedID].predicate === predicate) ? !$scope.reports[hashedID].reverse : false;
        $scope.reports[hashedID].predicate = predicate;

    };

    this.columnCalculation = function($scope,operation, columnIndex, hashedID)
    {
        console.log('column Calculation')
        var report = $scope.reports[hashedID];

            if (operation === 1) //SUM
                report.properties.columns[columnIndex].operationSum = !report.properties.columns[columnIndex].operationSum;
            if (operation === 2) //COUNT
                report.properties.columns[columnIndex].operationCount = !report.properties.columns[columnIndex].operationCount;
            if (operation === 3) //AVG
                report.properties.columns[columnIndex].operationAvg = !report.properties.columns[columnIndex].operationAvg;
            if (operation === 4) //MIN
                report.properties.columns[columnIndex].operationMin = !report.properties.columns[columnIndex].operationMin;
            if (operation === 5) //MAX
                report.properties.columns[columnIndex].operationMax = !report.properties.columns[columnIndex].operationMax;

        this.repaintRepeater($scope,report._id,report,function(){

        });
    };


   /*
    function generateChart($scope,id,report,done) {
        console.log('generateChart');
        console.log(report);
        getReportData($scope,report,{}, function(theData){
            if (report.reportSubType == 'line') {
                var chartParams = {
                    element: id,
                    data: theData,
                    xkey: report.properties.xkey,
                    hideHover: true,
                    resize: true,
                    parseTime: false
                    //dateFormat: function (x) { return ''; }
                };

                var ykeys = [], labels = [];

                for (var i in report.properties.ykeys) {
                    ykeys.push(report.properties.ykeys[i].field);
                    labels.push(report.properties.ykeys[i].label);
                }

                chartParams.ykeys = ykeys;
                chartParams.labels = labels;

                if (report.properties.colors) {
                    chartParams.lineColors = report.properties.colors;
                }

                new Morris.Line(chartParams).on('click', function(i, row){
                    console.log('yeah clicked on: ', i, row);
                    var params = {};
                    params.i = i;
                    params.row = row;
                    $scope.reportClicked(id,params);

                });

                done(0);
                return;
            }
            else if (report.reportSubType == 'donut') {

                if (theData) {
                    var data = [];

                    for (var i in theData) {
                        data.push({label: theData[i][report.properties.labelField], value: theData[i][report.properties.valueField]});
                    }

                    var chartParams = {
                        element: id,
                        data: data,
                        resize: true
                    };

                    if (report.properties.colors) {
                        chartParams.colors = report.properties.colors;
                    }

                    Morris.Donut(chartParams).on('click', function(i, row){
                        console.log(i, row);
                        var params = {};
                        params.i = i;
                        params.row = row;
                        $scope.reportClicked(id,params);
                    });

                    done(0);
                    return;
                }

            }
            else if (report.reportSubType == 'bar') {
                var chartParams = {
                    element: id,
                    data: theData,
                    xkey: report.properties.xkey,
                    hideHover: true,
                    resize: true
                };

                var ykeys = [], labels = [];

                for (var i in report.properties.ykeys) {
                    ykeys.push(report.properties.ykeys[i].field);
                    labels.push(report.properties.ykeys[i].label);
                }

                chartParams.ykeys = ykeys;
                chartParams.labels = labels;

                if (report.properties.colors) {
                    chartParams.barColors = report.properties.colors;
                }

                new Morris.Bar(chartParams).on('click', function(i, row){
                    console.log(i, row);
                    var params = {};
                    params.i = i;
                    params.row = row;
                    $scope.reportClicked(id,params);
                });

                done(0);
                return;
            }
            else if (report.reportSubType == 'area') {
                var chartParams = {
                    element: id,
                    data: theData,
                    xkey: report.properties.xkey,
                    hideHover: true,
                    resize: true,
                    behaveLikeLine: false,
                    parseTime: false
                    //dateFormat: function (x) { return ''; }
                };

                var ykeys = [], labels = [];

                for (var i in report.properties.ykeys) {
                    ykeys.push(report.properties.ykeys[i].field);
                    labels.push(report.properties.ykeys[i].label);
                }

                chartParams.ykeys = ykeys;
                chartParams.labels = labels;

                if (report.properties.colors) {
                    chartParams.lineColors = report.properties.colors;
                }

                new Morris.Area(chartParams).on('click', function(i, row){
                    console.log(i, row);
                    var params = {};
                    params.i = i;
                    params.row = row;
                    $scope.reportClicked(id,params);
                });

                done(0);
                return;

            }
            else {
                done(2); //error chart type not found
            }
        });
    }
       */
    function generateGrid($scope,id,report,done) {

        var htmlCode = '';
        var quote = "'";

        console.log('generate grid') ;

        getReportData($scope,report,{}, function(theData){

            if (theData)
            {
                console.log('generate grid with data');
                if (!$scope.theData)
                    $scope.theData = [];

                //console.log('los datos del grid '+id+' ----->   '+theData);

                var hashedID = hashCode(id);

                $scope.theData[hashedID] = theData;

                //console.log('the hased',JSON.stringify($scope.theData[hashedID]))

                ////NG TABLE PARAMS
                if (!$scope.tableParams)
                    $scope.tableParams = [];
                /*
                $scope.tableParams[hashedID] = new ngTableParams({
                    page: 1,            // show first page
                    count: 1000           // count per page
                }, {
                    counts: [], // hide page counts control
                    total: theData.length,  // length of data

                    getData: function($defer, params) {
                        // use build-in angular filter
                        var orderedData = params.sorting ?
                            $filter('orderBy')(theData, params.orderBy()) :
                            theData;
                        orderedData = params.filter ?
                            $filter('filter')(orderedData, params.filter()) :
                            orderedData;

                        //$scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(orderedData.length); // set total for recalc pagination
                        //$defer.resolve($scope.users);
                    }
                }); */

                /////END NGTABLE PARAMS


                //actions:[{actionEvent:"onRowClick",actionType:"goToDashBoard",targetID:"clientDashboard",targetFilters:['customerID'];

                var rowClickEvent = '';
               /*
                for(var i = 0; i < report.properties.actions.length; i++)
                {
                    if (report.properties.actions[i].actionEvent == 'onRowClick')
                        rowClickEvent = ' ng-click="onReportAction('+quote+report.properties.actions[i].actionType+quote+','+quote+report.properties.actions[i].targetID+quote+','+quote+report.properties.actions[i].targetFilters+quote+','+quote+'{{item.'+report.properties.idField+'}}'+quote+')"'
                    //rowClickEvent = ' ng-click="onReportAction('+report.properties.actions[i].actionType+','+report.properties.actions[i].targetID+','+report.properties.actions[i].targetFilters+')"'

                }
                 */
                //console.log('the row click event '+rowClickEvent,JSON.stringify(report.properties.columns));

                //htmlCode += '<div class="container-fluid" style="height: 100%;width: 100%;overflow-y: scroll">';
                htmlCode += '    <div class="table-responsive" >';
                htmlCode += '        <table ng-table="tableParams['+hashedID+']" class="table table-bordered" infinite-scroll="getData()" infinite-scroll-distance="2" > ';
                htmlCode += '            <thead> ';

                for(var i = 0; i < report.properties.columns.length; i++)
                {
                htmlCode += '                <td><strong>'+report.properties.columns[i].objectLabel+'</strong></td>';
                }
                htmlCode += '            </thead>';
                htmlCode += '            <tbody>';
                htmlCode += '                <tr ng-repeat="row in theData['+hashedID+']" >';
                for(var i = 0; i < report.properties.columns.length; i++)
                {
                htmlCode += '                    <td >';
                        if (!report.properties.columns[i].aggregation)
                            htmlCode += '                        <span >{{row.'+report.properties.columns[i].collectionID+'_'+report.properties.columns[i].elementName+'}}</span>';
                        if (report.properties.columns[i].aggregation)
                            htmlCode += '                        <span >{{row.'+report.properties.columns[i].collectionID+'_'+report.properties.columns[i].elementName+report.properties.columns[i].aggregation+'}}</span>';
                htmlCode += '                    </td>';
                }
                htmlCode += '                </tr>';
                htmlCode += '            </tbody>';
                htmlCode += '        </table>';
                htmlCode += '    </div>';

                //console.log(htmlCode);
                //htmlCode += '    <div ng-show="busy" style="text-align: center;padding: 20px;">';
                //htmlCode += '        <span style="font-size: 20px;">Loading data...</span> <img src="images/loader.gif" style="width: 50px;">';
                //htmlCode += '    </div>';
                //htmlCode += '    </div>';




               // htmlCode += '<table ng-table="tableParams['+hashedID+']" show-filter="false" class="table">';



               // htmlCode += '<tr ng-repeat="item in theData['+hashedID+']"   ng-class="{'+quote+'active'+quote+': item.$selected}" > ';

               //     for(var i = 0; i < report.properties.fields.length; i++)
               //         {
               //             htmlCode += '<td data-title="'+quote+report.properties.fields[i].fieldAlias+quote+'" filter="{ '+quote+report.properties.fields[i].fieldName+quote+': '+quote+'select'+quote+' }" sortable="'+quote+report.properties.fields[i].fieldName+quote+'" ng-class="{ '+quote+'emphasis'+quote+': item.nombrecampo2 > 500}" '+rowClickEvent+'>{{item.'+report.properties.fields[i].fieldName+'}}</td>';
               //         }

               // htmlCode += '</tr></table>';


                //console.log(htmlCode);

                        var el = document.getElementById(id);
                        if (el)
                        {
                            angular.element(el).empty();
                            var $div = $(htmlCode);
                            angular.element(el).append($div);
                            angular.element(document).injector().invoke(function($compile) {
                                var scope = angular.element($div).scope();
                                $compile($div)(scope);
                            });
                        }
                done(0);
                return;
            }
        });


    }





    function generateRepeater($scope,id,report,done)
    {
        //https://github.com/kamilkp/angular-vs-repeat

        var quote = "'";
            getReportData($scope,report,{}, function(theData){

                if (!$scope.theData)
                    $scope.theData = [];

                //console.log('los datos del grid '+id+' ----->   '+theData);

                var hashedID = hashCode(id);
                //$scope.theData[quote+id+quote] = theData;
                $scope.theData[hashedID] = theData;

                report.hashedID = hashedID;

                if (!$scope.reports)
                    $scope.reports = {};

                $scope.reports[hashedID] = report;

                repaintRepeater($scope,id,report, function(result){
                   done(result);
                });

        });

    }

    function repaintRepeaterV2($scope,id,report,done)
    {
        var htmlCode = '<div class="container-fluid" style="width:100%;padding-left:0px;" ng-include="repeaterTemplate">';

        var el = document.getElementById(id);
        if (el)
        {
            angular.element(el).empty();
            var $div = $(htmlCode);
            angular.element(el).append($div);
            angular.element(document).injector().invoke(function($compile) {
                var scope = angular.element($div).scope();
                $compile($div)(scope);
            });
        }
        done(0);
        return;
    }

    function repaintRepeater($scope,id,report,done)
    {
           var hashedID = report.hashedID;
            /*
            if (!$scope.theData)
                $scope.theData = [];

            //console.log('los datos del grid '+id+' ----->   '+theData);

            var hashedID = hashCode(id);
            //$scope.theData[quote+id+quote] = theData;
            $scope.theData[hashedID] = theData;

              */
            console.log('the data',JSON.stringify($scope.theData[hashedID]));


            var htmlCode = '<div class="container-fluid"><input class="pull-right" type="search" ng-model="theFilter" placeholder="Search..." aria-label="Search..." /></div>';

            var colClass = '';
            var colWidth = '';

            if (report.properties.columns.length == 5 || report.properties.columns.length > 6)
                colWidth = 'width:'+100/report.properties.columns.length+'%;float:left;';
            else
                colClass = 'col-xs-'+12/report.properties.columns.length;

            //header
            htmlCode += '<div class="container-fluid" style="width:100%;padding-left:0px;background-color:#ccc;">';
            for(var i = 0; i < report.properties.columns.length; i++)
            {

                /*if (i == report.properties.columns.length -1) //the last column
                    htmlCode += '<div class="'+colClass+' report-repeater-column-header" style="'+colWidth+'">'+report.properties.columns[i].objectLabel+getColumnDropDownHTMLCode(i)+' </div>';
                else */
                    var elementName = "'"+report.properties.columns[i].collectionID+'_'+report.properties.columns[i].elementName+"'";
                    if (report.properties.columns[i].aggregation)
                        elementName = "'"+report.properties.columns[i].collectionID+'_'+report.properties.columns[i].elementName+report.properties.columns[i].aggregation+"'";
                    htmlCode += '<div class="'+colClass+' report-repeater-column-header" style="'+colWidth+'"><span class="hand-cursor" ng-click="orderColumn('+elementName+','+hashedID+')">'+report.properties.columns[i].objectLabel+'</span><span class="sortorder" ng-show="reports['+hashedID+'].predicate === '+elementName+'" ng-class="{reverse:reports['+hashedID+'].reverse}"></span>'+getColumnDropDownHTMLCode(report,i,elementName,hashedID,report.properties.columns[i].elementType)+' </div>';
            }
            htmlCode += '</div>';

            //Body
            htmlCode += '<div vs-repeat style="width:100%;height: 100%;max-height:500px;overflow-y: scroll;border: 1px solid #ccc;">';

                //TODO: orderby  ....   | orderBy:[]    orderBy:'+orderBys+'
            var orderBys = "'-WSTc33d4a83bea446dab99c7feb0f8fe71a_topPerformerRatingavg'";

            htmlCode += '<div class="repeater-data container-fluid" ng-repeat="item in theData['+hashedID+'] | filter:theFilter | orderBy:reports['+hashedID+'].predicate:reports['+hashedID+'].reverse  " style="width:100%;padding:0px">';


            htmlCode += "<style>.customStyle1 {color:#FF9944;} .customStyle2 {color:blue;}</style>"

            //console.log(htmlCode);
            // POPOVER con HTML https://maxalley.wordpress.com/2014/08/19/bootstrap-3-popover-with-html-content/

            for(var i = 0; i < report.properties.columns.length; i++)
            {
                var elementName = report.properties.columns[i].collectionID+'_'+report.properties.columns[i].elementName;

                if (report.properties.columns[i].aggregation)
                    elementName = report.properties.columns[i].collectionID+'_'+report.properties.columns[i].elementName+report.properties.columns[i].aggregation;

                var theValue = '<span ng-class="{customStyle1 : {{item.'+elementName+'}} > 0 , customStyle2 : {{item.'+elementName+'}} == 0}"  >{{item.'+elementName+'}}</span>';
                //var theValue = '<span ng-style="{{item.'+elementName+'}} > 0 ? { '+theStyle+' }"  >{{item.'+elementName+'}}</span>';


                if (report.properties.columns[i].link)
                {
                    if (report.properties.columns[i].link.type == 'report')
                    {
                        theValue = '<a class="columnLink" href="/#/reports/'+report.properties.columns[i].link._id+'/'+report.properties.columns[i].link.promptElementID+'/{{item.'+elementName+'}}">{{item.'+elementName+'}}</a>'
                    }
                    if (report.properties.columns[i].link.type == 'dashboard')
                    {
                        theValue = '<a class="columnLink" href="/#/dashboards/'+report.properties.columns[i].link._id+'/'+report.properties.columns[i].link.promptElementID+'/{{item.'+elementName+'}}">{{item.'+elementName+'}}</a>'
                    }
                }

                var columnFormat = '';
                if (report.properties.columns[i].format)
                {
                    columnFormat = 'color:'+report.properties.columns[i].format.color+';';

                    for (var key in report.properties.columns[i].format) {
                        columnFormat += key+':'+report.properties.columns[i].format[key]+';';
                    }
                }

                var defaultAligment = '';
                if (report.properties.columns[i].elementType === 'number')
                    defaultAligment = 'text-align: right;'

               /*
                if (i == report.properties.columns.length -1) //the last column
                {
                    htmlCode += '<div class="'+colClass+' popover-primary" style="'+columnFormat+colWidth+'height:20px;overflow:hidden;padding:2px; border-bottom: 1px solid #ccc;" popover-trigger="mouseenter" popover-placement="top" popover-title="'+report.properties.columns[i].objectLabel+'" popover="{{item.'+elementName+'}}">'+theValue+' </div>';
                }
                else {*/

                /*
                if item.'+elementName+' comparador valor1 = {estilo 1}
                if item.'+elementName+' comparador valor2 = {estilo 1}

                */
                    htmlCode += '<div class="repeater-data-column '+colClass+' popover-primary" style="'+columnFormat+colWidth+defaultAligment+'height:20px;overflow:hidden;padding:2px; border-bottom: 1px solid #ccc;border-right: 1px solid #ccc;" popover-trigger="mouseenter" popover-placement="top" popover-title="'+report.properties.columns[i].objectLabel+'" popover="{{item.'+elementName+'}}">'+theValue+' </div>';
                //}
            }

            htmlCode += '</div>';
            htmlCode += '</div>';

            htmlCode += '<div class="repeater-data">';
                    for(var i in report.properties.columns)
                    {
                        var elementName = report.properties.columns[i].collectionID+'_'+report.properties.columns[i].elementName;
                        if (report.properties.columns[i].aggregation)
                            elementName = report.properties.columns[i].collectionID+'_'+report.properties.columns[i].elementName+report.properties.columns[i].aggregation;
                        htmlCode += '<div class=" calculus-data-column '+colClass+' " style="'+colWidth+'"> '+calculateForColumn($scope,report,i,elementName)+' </div>';





                    }
        htmlCode += '</div>';

            var el = document.getElementById(id);
            if (el)
            {
                angular.element(el).empty();
                var $div = $(htmlCode);
                angular.element(el).append($div);
                angular.element(document).injector().invoke(function($compile) {
                    var scope = angular.element($div).scope();
                    $compile($div)(scope);
                });
            }
            done(0);
            return;

    }

    function calculateForColumn($scope,report,columnIndex,elementName) {

        var htmlCode = '';

        console.log('calculateForColumn');




        if (report.properties.columns[columnIndex].operationSum === true)
        {
            htmlCode += '<div  style=""><span class="calculus-label">SUM:</span><span class="calculus-value"> '+calculateSumForColumn($scope,report,columnIndex,elementName)+'</span> </div>';
        }

        if (report.properties.columns[columnIndex].operationAvg === true)
        {
            htmlCode += '<div  style=""><span class="calculus-label">AVG:</span><span class="calculus-value"> '+calculateAvgForColumn($scope,report,columnIndex,elementName)+'</span> </div>';
        }

        if (report.properties.columns[columnIndex].operationCount === true)
        {
            htmlCode += '<div  style=""><span class="calculus-label">COUNT:</span><span class="calculus-value"> '+calculateCountForColumn($scope,report,columnIndex,elementName)+'</span> </div>';
        }

        if (report.properties.columns[columnIndex].operationMin === true)
        {
            htmlCode += '<div  style=""><span class="calculus-label">MIN:</span><span class="calculus-value"> '+calculateMinimumForColumn($scope,report,columnIndex,elementName)+'</span> </div>';
        }
        if (report.properties.columns[columnIndex].operationMax === true)
        {
            htmlCode += '<div  style=""><span class="calculus-label">MAX:</span><span class="calculus-value"> '+calculateMaximumForColumn($scope,report,columnIndex,elementName)+'</span> </div>';
        }


        return htmlCode;

    }


    function calculateSumForColumn($scope,report,columnIndex,elementName)
    {
        var value = 0;

        for (var row in $scope.theData[report.hashedID])
        {
            var theRow = $scope.theData[report.hashedID][row];

            if (theRow[elementName])
                if (theRow[elementName] != undefined)
                    value += Number(theRow[elementName]);
        }

        return value;
    }

    function calculateCountForColumn($scope,report,columnIndex,elementName)
    {
        var founded = 0;

        for (var row in $scope.theData[report.hashedID])
        {
            var theRow = $scope.theData[report.hashedID][row];

            console.log('el valor',elementName,JSON.stringify(theRow));
            if (theRow[elementName])
                if (theRow[elementName] != undefined)
                {
                    founded += 1;
                }
        }
        return founded;

    }

    function calculateAvgForColumn($scope,report,columnIndex,elementName)
    {

        var value = 0;
        var founded = 0;

        for (var row in $scope.theData[report.hashedID])
        {
            var theRow = $scope.theData[report.hashedID][row];

            console.log('el valor',elementName,JSON.stringify(theRow));
            if (theRow[elementName])
                if (theRow[elementName] != undefined)
                {
                    founded += 1;
                    value += Number(theRow[elementName]);
                }
        }

        return value/founded;

    }

    function calculateMinimumForColumn($scope,report,columnIndex,elementName)
    {
        var lastValue = undefined;

        for (var row in $scope.theData[report.hashedID])
        {
            var theRow = $scope.theData[report.hashedID][row];

            console.log('el valor',elementName,JSON.stringify(theRow));
            if (theRow[elementName])
                if (theRow[elementName] != undefined)
                {
                    if (lastValue == undefined)
                        lastValue = theRow[elementName];

                    if (theRow[elementName] < lastValue)
                        lastValue = theRow[elementName];
                }
        }
        return lastValue;

    }

    function calculateMaximumForColumn($scope,report,columnIndex,elementName)
    {
        var lastValue = undefined;

        for (var row in $scope.theData[report.hashedID])
        {
            var theRow = $scope.theData[report.hashedID][row];

            console.log('el valor',elementName,JSON.stringify(theRow));
            if (theRow[elementName])
                if (theRow[elementName] != undefined)
                {
                    if (lastValue == undefined)
                        lastValue = theRow[elementName];

                    if (theRow[elementName] > lastValue)
                        lastValue = theRow[elementName];
                }
        }
        return lastValue;

    }


    function getColumnDropDownHTMLCode(report, column,elementName,hashedID,columnType)
    {

        var columnPropertiesBtn = '<div class="btn-group pull-right" dropdown="" > '
            +'<button type="button" class="btn btn-blue dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
            +' <span class="caret"></span>'
            +'</button>'
            +'<ul class="dropdown-menu dropdown-blue multi-level" role="menu">'
            +'<li class="dropdown-submenu">'
            +'      <a href="">Ordenar</a>'  //ascendente, descendente
            +'      <ul class="dropdown-menu">'
            +'      <li><a ng-click="reverse = true; orderColumn('+elementName+','+hashedID+')">Ascending</a></li>'
            +'      <li><a ng-click="reverse = false; orderColumn('+elementName+','+hashedID+')">Descending</a></li>'
            +'      </ul>'
            +'</li>'
            +'<li>'
            +'      <a href="">Filtrar</a>'
            +'</li>'
            +'<li>'
            +'      <a ng-click="changeColumnFormat('+column+','+hashedID+')">Format</a>'
            +'</li>'
            +'<li>'
            +'      <a href="">Create Section</a>'
            +'</li>'
            +'<li>'
            +'      <a href="">Aplicar Ruptura</a>'
            +'</li>'
            +'<li class="divider"></li>'
            +'<li class="dropdown-submenu">'
            +'      <a tabindex="-1" href="">Calculate</a>' //suma, cuenta, cuenta total, Promedio, mínimo, máximo, porcentaje
            +'      <ul class="dropdown-menu">';



        var sumIcon = '';
        if (report.properties.columns[column].operationSum == true)
            sumIcon = '<i class="fa fa-check"></i>';
        var avgIcon = '';
        if (report.properties.columns[column].operationAvg == true)
            avgIcon = '<i class="fa fa-check"></i>';
        var countIcon = '';
        if (report.properties.columns[column].operationCount == true)
            countIcon = '<i class="fa fa-check"></i>';
        var minIcon = '';
        if (report.properties.columns[column].operationMin == true)
            minIcon = '<i class="fa fa-check"></i>';
        var maxIcon = '';
        if (report.properties.columns[column].operationMax == true)
            maxIcon = '<i class="fa fa-check"></i>';

        columnPropertiesBtn += '      <li><a ng-click="columnCalculation(2,'+column+','+hashedID+')">'+countIcon+'Count</a></li>';

        if (columnType === 'number')
        {
            columnPropertiesBtn += '      <li> <a  ng-click="columnCalculation(1,'+column+','+hashedID+')">'+sumIcon+' Sum</a></li>';
            columnPropertiesBtn += '      <li><a ng-click="columnCalculation(3,'+column+','+hashedID+')">'+avgIcon+'Average</a></li>';
            columnPropertiesBtn += '      <li><a ng-click="columnCalculation(4,'+column+','+hashedID+')">'+minIcon+'Minimum</a></li>';
            columnPropertiesBtn += '      <li><a ng-click="columnCalculation(5,'+column+','+hashedID+')">'+maxIcon+'Maximum</a></li>';
            columnPropertiesBtn += '      <li><a href="#">Percent</a></li>';
        }

        columnPropertiesBtn +=
            '      </ul>'
            +'</li>'
            +'<li>'
            +'      <a href="">Señales</a>'
            +'</li>'
            +'<li>'
            +'      <a href="">Ocultar componentes</a>'
            +'</li>'
            +'</ul>'
            +'</div>';

        return  columnPropertiesBtn;
    }


    function generatePivot($scope,id,report,done)
    {
        var htmlCode = '';

        var theData = [
            {
                employee : {id:1, label:'John Brown'},
                department : 1,
                year : 2013,
                month : 1,
                day : 10,
                amount : 34
            },
            {
                employee : {id:2, label:'Bill Green'},
                department : 1,
                year : 2013,
                month : 1,
                day : 10,
                amount : 34
            }

        ];

        $.each(theData, function(idx, value){
            value.total = 1;
        });

        if (!$scope.thaData)
            $scope.theData = [];

        $scope.theData[id] = theData;

        var dimensions = {
            employee : {
                label :'Employee'
            },
            department : {
                label :'Department',
                values : function(context) {
                    return [
                        {id:1, label:'Administration general'},
                        {id:2, label:'Logistics'},
                        {id:3, label:'Accounting'}
                    ];
                }
            },
            year : {
                label :'Year'
            },
            month : {
                label :'Month',
                values : function(context) {
                    return [
                        {id:1, label:'Jan'},
                        {id:2, label:'Feb'},
                        {id:3, label:'Mar'},
                        {id:4, label:'Apr'},
                        {id:5, label:'May'},
                        {id:6, label:'Jun'},
                        {id:7, label:'Jul'},
                        {id:8, label:'Aug'},
                        {id:9, label:'Sep'},
                        {id:10, label:'Oct'},
                        {id:11, label:'Nov'},
                        {id:12, label:'Dec'}
                    ];
                }
            },
            total : {
                label :'Total',
                values : function(context) {
                    return [
                        {id:1, label:'Total'}
                    ];
                }
            }
        };


        //var el = document.getElementById(id);
        //if (el)
        //{
        $(document).ready(function(){
            $("#66666").cypivot({
            data : $scope.theData[id],
            dimensions : dimensions,
            verticalDimensions : ["total", "year", "month"],
            horizontalDimensions : ["department", "employee"],
            valueDataFields : ['amount'],
            configuration : false,
            resizable : true,
            resizableWidth : true,
            resizableHeight : false
            });
        });
        //}

        done(0);
        return;
    }

    function generateIndicator($scope, id, report,  done)
    {
        console.log('generating indicator block')

        var htmlCode = '';

        getReportData($scope,report,{}, function(theData){

            if (theData)
            {

                var theYKey = report.properties.ykeys[0].collectionID+'_'+report.properties.ykeys[0].elementName;
                if (report.properties.ykeys[0].aggregation) theYKey += report.properties.ykeys[0].aggregation;

                console.log('el valor ' + theYKey+' the ID '+id+ ' the type '+report.properties.style);
                var theValue = theData[0][theYKey];

                if (report.properties.valueType == 'percentage')
                {
                    theValue = theData[0].value + ' %';
                }

                if (report.properties.valueType == 'currency' && report.properties.currencySymbol)
                {
                    theValue = theData[0].value + ' '+report.properties.currencySymbol;
                }


                var theEvolution = theData[0].evolution + ' %';

                var trend = 'same';
                var trendLabel = 'igual'; //TODO:traduccion

                if (theData[0].evolution > 0)
                    {
                      trend = 'up';
                      trendLabel = 'incremento'; //TODO:traduccion
                    }
                if (theData[0].evolution < 0)
                    {
                    trend = 'down';
                    trendLabel = 'menos'; //TODO:traduccion
                    }

                var theBackgroundColor = '#68b828';
                if (report.properties.backgroundColor)
                    theBackgroundColor = report.properties.backgroundColor;
                var theFontColor = '#fff';
                if (report.properties.fontColor)
                    theFontColor = report.properties.fontColor;

                var theAuxFontColor = '#fff'
                if (report.properties.auxFontColor)
                    theAuxFontColor = report.properties.auxFontColor;

                if (report.properties.style == 'style1')
                {
                    console.log('this is the report Icon '+report.properties.reportIcon);

                    htmlCode += '<div class="xe-widget xe-counter xe-counter-info" data-count=".num" data-from="1000" data-to="2470" data-duration="4" data-easing="true">';
                    htmlCode += '   <div class="xe-icon" >';
                    htmlCode += '       <i class="fa '+report.properties.reportIcon+'" style="background-color: '+theBackgroundColor+'"></i>';
                    htmlCode += '   </div>';
                    htmlCode += '   <div class="xe-label">';
                    htmlCode += '       <strong class="num" style="color:'+report.properties.mainFontColor+'">'+theValue+'</strong>';
                    htmlCode += '       <span style="color:'+report.properties.descFontColor+'">'+report.properties.valueText+'</span>';
                    htmlCode += '   </div>';
                    htmlCode += '</div>';

                    //TODO: Animation over data-from data-to
                }

                if (report.properties.style == 'style2')
                {
                    htmlCode += '<div class="xe-widget xe-counter-block" xe-counter="" data-count=".num" data-from="0" data-to="99.9" data-suffix="%" data-duration="2" style="background-color: '+theBackgroundColor+'">';
                    htmlCode += '   <div class="xe-upper"  style="background-color: '+theBackgroundColor+'">';
                    htmlCode += '       <div class="xe-icon">';
                    htmlCode += '           <i class="fa '+report.properties.reportIcon+'"></i> ';
                    htmlCode += '       </div>';
                    htmlCode += '       <div class="xe-label">';
                    htmlCode += '           <strong class="num" style="color:'+report.properties.mainFontColor+'">'+theValue+'</strong>';
                    htmlCode += '           <span style="color:'+report.properties.descFontColor+'">'+report.properties.valueText+'</span> ';
                    htmlCode += '       </div> ';
                    htmlCode += '   </div>';
                    htmlCode += '   <div class="xe-lower"> ';
                    htmlCode += '       <div class="border"></div> ';
                    htmlCode += '           <span>Resultado</span> ';
                    htmlCode += '           <strong>'+theEvolution+'  '+trendLabel+'</strong> ';
                    htmlCode += '       </div> ';
                    htmlCode += '   </div> ';
                    htmlCode += '</div> ';
                }

                if (report.properties.style == 'style3')
                {
                    htmlCode += '<div class="chart-item-bg-2" style="background-color: '+theBackgroundColor+';color:'+theFontColor+'">';
                    htmlCode += '   <div class="chart-item-num" xe-counter="" data-count="this" data-from="0" data-to="98" data-suffix="%" data-duration="2" style="padding: 10px; color:'+report.properties.mainFontColor+'">'+theValue+'</div>';
                    htmlCode += '       <div class="chart-item-desc" > ';
                    //htmlCode += '           <p class="col-lg-7">Carriage quitting securing be appetite it declared. High eyes kept so busy feel call in.</p> ';
                    htmlCode += '           <p style="color:'+report.properties.descFontColor+'">'+report.properties.valueText+'</p> ';
                    htmlCode += '       </div> ';
                   /*
                    htmlCode += '       <div class="chart-item-env"> ';
                    htmlCode += '           <div id="doughnut-1" style="width: 200px; -webkit-user-select: none;" class="dx-visibility-change-handler"></div>';
                    htmlCode += '       </div>';
                   */
                    htmlCode += '   </div>';
                    htmlCode += '</div>';
                }

                console.log('the html code '+htmlCode);

                var el = document.getElementById(id);
                if (el)
                {
                    var $div = $(htmlCode);
                    angular.element(el).empty();
                    angular.element(el).append($div);
                    angular.element(document).injector().invoke(function($compile) {
                        var scope = angular.element($div).scope();
                        $compile($div)(scope);
                    });
                }



                done(0);
                return;

            }

        });



        //Style 1
        /*
        <div class="xe-widget xe-counter xe-counter-info" data-count=".num" data-from="1000" data-to="2470" data-duration="4" data-easing="true">
            <div class="xe-icon">
                <i class="linecons-camera"></i>
            </div>
            <div class="xe-label">
                <strong class="num">2,470</strong>
                <span>New Daily Photos</span>
            </div>
        </div>
        */

        //Style 2
        /*
        <div class="xe-widget xe-counter-block" xe-counter="" data-count=".num" data-from="0" data-to="99.9" data-suffix="%" data-duration="2">
            <div class="xe-upper">

                <div class="xe-icon">
                    <i class="linecons-cloud"></i>
                </div>
                <div class="xe-label">
                    <strong class="num">99.9%</strong>
                    <span>Server uptime</span>
                </div>

            </div>
            <div class="xe-lower">
                <div class="border"></div>

                <span>Result</span>
                <strong>78% Increase</strong>
            </div>
        </div>
        */

        //Style 3
        /*
        <div class="chart-item-bg-2">
            <div class="chart-item-num" xe-counter="" data-count="this" data-from="0" data-to="98" data-suffix="%" data-duration="2">98%</div>
            <div class="chart-item-desc">
                <p class="col-lg-7">Carriage quitting securing be appetite it declared. High eyes kept so busy feel call in.</p>
            </div>
            <div class="chart-item-env">
                <div id="doughnut-1" style="width: 200px; -webkit-user-select: none;" class="dx-visibility-change-handler"><svg width="200" height="130" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" stroke="none" stroke-width="0" fill="none" class="dxc dxc-chart" direction="ltr" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: block; overflow: hidden;"><defs><clipPath id="DevExpress_93"><rect x="0" y="0" width="200" height="130" rx="0" ry="0" fill="none" stroke="none" stroke-width="0"></rect></clipPath><pattern id="DevExpress_94" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#68b828" opacity="0.75"></rect><path stroke-width="4" stroke="#68b828" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_95" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#68b828" opacity="0.5"></rect><path stroke-width="4" stroke="#68b828" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_96" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#7c38bc" opacity="0.75"></rect><path stroke-width="4" stroke="#7c38bc" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_97" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#7c38bc" opacity="0.5"></rect><path stroke-width="4" stroke="#7c38bc" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_98" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#0e62c7" opacity="0.75"></rect><path stroke-width="4" stroke="#0e62c7" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_99" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#0e62c7" opacity="0.5"></rect><path stroke-width="4" stroke="#0e62c7" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_100" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#fcd036" opacity="0.75"></rect><path stroke-width="4" stroke="#fcd036" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_101" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#fcd036" opacity="0.5"></rect><path stroke-width="4" stroke="#fcd036" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_102" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#4fcdfc" opacity="0.75"></rect><path stroke-width="4" stroke="#4fcdfc" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_103" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#4fcdfc" opacity="0.5"></rect><path stroke-width="4" stroke="#4fcdfc" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_104" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#00b19d" opacity="0.75"></rect><path stroke-width="4" stroke="#00b19d" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_105" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#00b19d" opacity="0.5"></rect><path stroke-width="4" stroke="#00b19d" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_106" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#ff6264" opacity="0.75"></rect><path stroke-width="4" stroke="#ff6264" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_107" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#ff6264" opacity="0.5"></rect><path stroke-width="4" stroke="#ff6264" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_108" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#f7aa47" opacity="0.75"></rect><path stroke-width="4" stroke="#f7aa47" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_109" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#f7aa47" opacity="0.5"></rect><path stroke-width="4" stroke="#f7aa47" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_110" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#9aea5a" opacity="0.75"></rect><path stroke-width="4" stroke="#9aea5a" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_111" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#9aea5a" opacity="0.5"></rect><path stroke-width="4" stroke="#9aea5a" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_112" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#ae6aee" opacity="0.75"></rect><path stroke-width="4" stroke="#ae6aee" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><pattern id="DevExpress_113" width="10" height="10" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" rx="0" ry="0" fill="#ae6aee" opacity="0.5"></rect><path stroke-width="4" stroke="#ae6aee" d="M 5 -5 L -5 5M 0 10 L 10 0 M 15 5 L 5 15"></path></pattern><filter id="DevExpress_114" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" result="gaussianBlurResult" stdDeviation="2"></feGaussianBlur><feOffset in="gaussianBlurResult" result="offsetResult" dx="0" dy="4"></feOffset><feFlood result="floodResult" flood-color="#000000" flood-opacity="0.4"></feFlood><feComposite in="floodResult" in2="offsetResult" operator="in" result="compositeResult"></feComposite><feComposite in="SourceGraphic" in2="compositeResult" operator="over"></feComposite></filter></defs><g class="dxc-legend" clip-path="url(#DevExpress_93)"></g><g class="dxc-series-group"><g class="dxc-series"><g class="dxc-markers"><path stroke-linejoin="round" fill="#68b828" stroke="#ffffff" stroke-width="0" d="M 42.45253929419554 95.22068441173845 A 65 65 0 0 0 165 65.00000000000001 L 132 65.00000000000001 A 32 32 0 0 1 71.6689424217578 79.877875402702 Z"></path><path stroke-linejoin="round" fill="#7c38bc" stroke="#ffffff" stroke-width="0" d="M 35.9371217445065 54.00238072936612 A 65 65 0 0 0 42.45253929419554 95.22068441173845 L 71.6689424217578 79.877875402702 A 32 32 0 0 1 68.46135224344935 59.585787435995634 Z"></path><path stroke-linejoin="round" fill="#0e62c7" stroke="#ffffff" stroke-width="0" d="M 39.931580671694995 40.16484347947625 A 65 65 0 0 0 35.9371217445065 54.00238072936612 L 68.46135224344935 59.585787435995634 A 32 32 0 0 1 70.42785509991138 52.773461405280614 Z"></path><path stroke-linejoin="round" fill="#fcd036" stroke="#ffffff" stroke-width="0" d="M 53.48679482995417 19.596016201117095 A 65 65 0 0 0 39.931580671694995 40.16484347947625 L 70.42785509991138 52.773461405280614 A 32 32 0 0 1 77.10119130090051 42.64726951439611 Z"></path><path stroke-linejoin="round" fill="#4fcdfc" stroke="#ffffff" stroke-width="0" d="M 79.03913209598424 3.472428808619455 A 65 65 0 0 0 53.48679482995417 19.596016201117095 L 77.10119130090051 42.64726951439611 A 32 32 0 0 1 89.68080349340762 34.709503413474195 Z"></path><path stroke-linejoin="round" fill="#00b19d" stroke="#ffffff" stroke-width="0" d="M 80.43798988447506 3.0134872715031733 A 65 65 0 0 0 79.03913209598424 3.472428808619455 L 89.68080349340762 34.709503413474195 A 32 32 0 0 1 90.36947194312619 34.48356296443233 Z"></path><path stroke-linejoin="round" fill="#ff6264" stroke="#ffffff" stroke-width="0" d="M 110.57568745559664 0.8661178873324786 A 65 65 0 0 0 80.43798988447506 3.0134872715031733 L 90.36947194312619 34.48356296443233 A 32 32 0 0 1 105.2064922858322 33.42639649837906 Z"></path><path stroke-linejoin="round" fill="#f7aa47" stroke="#ffffff" stroke-width="0" d="M 138.42830559945935 12.5760996419137 A 65 65 0 0 0 110.57568745559664 0.8661178873324786 L 105.2064922858322 33.42639649837906 A 32 32 0 0 1 118.91855044896461 39.19131059294213 Z"></path><path stroke-linejoin="round" fill="#9aea5a" stroke="#ffffff" stroke-width="0" d="M 157.97775376799646 35.613267142848755 A 65 65 0 0 0 138.42830559945935 12.5760996419137 L 118.91855044896461 39.19131059294213 A 32 32 0 0 1 128.54289416270595 50.53268536263323 Z"></path><path stroke-linejoin="round" fill="#ae6aee" stroke="#ffffff" stroke-width="0" d="M 165 65 A 65 65 0 0 0 157.97775376799646 35.613267142848755 L 128.54289416270595 50.53268536263323 A 32 32 0 0 1 132 65 Z"></path></g></g></g><g class="dxc-labels-group"></g><g class="dxc-labels" visibility="hidden" opacity="1"></g><g class="dxc-tooltip"><path d="M 0 0 Z" filter="url(#DevExpress_114)" stroke-width="1" stroke="#d3d3d3" visibility="hidden"></path><g text-anchor="middle" visibility="hidden" style="font-family: 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana; font-weight: 400; font-size: 12px; fill: rgb(35, 35, 35); cursor: default;"><text x="0" y="0" style="font-size: 12px;"></text></g></g><g class="dxc-trackers" opacity="0.0001" stroke="gray" fill="gray"><g class="dxc-crosshair-trackers" stroke="none" fill="grey"></g><g class="dxc-series-trackers"></g><g class="dxc-markers-trackers" stroke="none" fill="grey"><g><path stroke-linejoin="round" d="M 42.45253929419554 95.22068441173845 A 65 65 0 0 0 165 65.00000000000001 L 132 65.00000000000001 A 32 32 0 0 1 71.6689424217578 79.877875402702 Z"></path><path stroke-linejoin="round" d="M 35.9371217445065 54.00238072936612 A 65 65 0 0 0 42.45253929419554 95.22068441173845 L 71.6689424217578 79.877875402702 A 32 32 0 0 1 68.46135224344935 59.585787435995634 Z"></path><path stroke-linejoin="round" d="M 39.931580671694995 40.16484347947625 A 65 65 0 0 0 35.9371217445065 54.00238072936612 L 68.46135224344935 59.585787435995634 A 32 32 0 0 1 70.42785509991138 52.773461405280614 Z"></path><path stroke-linejoin="round" d="M 53.48679482995417 19.596016201117095 A 65 65 0 0 0 39.931580671694995 40.16484347947625 L 70.42785509991138 52.773461405280614 A 32 32 0 0 1 77.10119130090051 42.64726951439611 Z"></path><path stroke-linejoin="round" d="M 79.03913209598424 3.472428808619455 A 65 65 0 0 0 53.48679482995417 19.596016201117095 L 77.10119130090051 42.64726951439611 A 32 32 0 0 1 89.68080349340762 34.709503413474195 Z"></path><path stroke-linejoin="round" d="M 80.43798988447506 3.0134872715031733 A 65 65 0 0 0 79.03913209598424 3.472428808619455 L 89.68080349340762 34.709503413474195 A 32 32 0 0 1 90.36947194312619 34.48356296443233 Z"></path><path stroke-linejoin="round" d="M 110.57568745559664 0.8661178873324786 A 65 65 0 0 0 80.43798988447506 3.0134872715031733 L 90.36947194312619 34.48356296443233 A 32 32 0 0 1 105.2064922858322 33.42639649837906 Z"></path><path stroke-linejoin="round" d="M 138.42830559945935 12.5760996419137 A 65 65 0 0 0 110.57568745559664 0.8661178873324786 L 105.2064922858322 33.42639649837906 A 32 32 0 0 1 118.91855044896461 39.19131059294213 Z"></path><path stroke-linejoin="round" d="M 157.97775376799646 35.613267142848755 A 65 65 0 0 0 138.42830559945935 12.5760996419137 L 118.91855044896461 39.19131059294213 A 32 32 0 0 1 128.54289416270595 50.53268536263323 Z"></path><path stroke-linejoin="round" d="M 165 65 A 65 65 0 0 0 157.97775376799646 35.613267142848755 L 128.54289416270595 50.53268536263323 A 32 32 0 0 1 132 65 Z"></path></g></g></g><g></g></svg></div>
            </div>
        </div>
        */
    }

    function generateVectorMap($scope, id, report,  done)
    {
        var htmlCode = '';
        var theData = {"AF":"16","AL":"11","DZ":"158","ao":"85","ag":"1","ar":"351","am":"8","au":"1219","at":"366","az":"52","bs":"7","bh":"21","bd":"105.4","bb":"3.96","by":"52.89","be":"461.33","bz":"1.43","bj":"6.49","bt":"1.4","bo":"19.18","ba":"16.2","bw":"12.5","br":"2023.53","bn":"11.96","bg":"44.84","bf":"8.67","bi":"1.47","kh":"11.36","cm":"21.88","ca":"1563.66","cv":"1.57","cf":"2.11","td":"7.59","cl":"199.18","cn":"5745.13","co":"283.11","km":"0.56","cd":"12.6","cg":"11.88","cr":"35.02","ci":"22.38","hr":"59.92","cy":"22.75","cz":"195.23","dk":"304.56","dj":"1.14","dm":"0.38","do":"50.87","ec":"61.49","eg":"216.83","sv":"21.8","gq":"14.55","er":"2.25","ee":"19.22","et":"30.94","fj":"3.15","fi":"231.98","fr":"2555.44","ga":"12.56","gm":"1.04","ge":"11.23","de":"3305.9","gh":"18.06","gr":"305.01","gd":"0.65","gt":"40.77","gn":"4.34","gw":"0.83","gy":"2.2","ht":"6.5","hn":"15.34","hk":"226.49","hu":"132.28","is":"12.77","in":"1430.02","id":"695.06","ir":"337.9","iq":"84.14","ie":"204.14","il":"201.25","it":"2036.69","jm":"13.74","jp":"5390.9","jo":"27.13","kz":"129.76","ke":"32.42","ki":"0.15","kr":"986.26","undefined":"5.73","kw":"117.32","kg":"4.44","la":"6.34","lv":"23.39","lb":"39.15","ls":"1.8","lr":"0.98","ly":"77.91","lt":"35.73","lu":"52.43","mk":"9.58","mg":"8.33","mw":"5.04","my":"218.95","mv":"1.43","ml":"9.08","mt":"7.8","mr":"3.49","mu":"9.43","mx":"1004.04","md":"5.36","mn":"5.81","me":"3.88","ma":"91","mz":"10","mm":"35","na":"11","np":"15","nl":"770","nz":"138","ni":"6","ne":"5","ng":"206","no":"413","om":"53","pk":"174","pa":"27","pg":"8","py":"17","pe":"153","ph":"189","pl":"438","pt":"223","qa":"126","ro":"158","ru":"1476","rw":"5","ws":"1","st":"1","sa":"434","sn":"12","rs":"39","sc":"1","sl":"2","sg":"217","sk":"86","si":"46","sb":"1","za":"354","es":"1374","lk":"48","kn":"1","lc":"1","vc":"1","sd":"65","sr":"3","sz":"3","se":"444","ch":"522","sy":"59","tw":"426","tj":"5","tz":"22","th":"312","tl":"1","tg":"3","to":"1","tt":"21","tn":"43","tr":"729","tm":0,"ug":"17","ua":"136","ae":"239","gb":"2258","us":"14624","uy":"40","uz":"37","vu":"1","ve":"285","vn":"101","ye":"30","zm":"15","zw":"5"};


        htmlCode += '<div id="VMAP_'+id+'" style="width: 600px; height: 400px"></div>';
        //htmlCode += '<div id="VMAP_'+id+'" style="width: 100%; "></div>';

        var el = document.getElementById(id);
        if (el)
        {
            var $div = $(htmlCode);
            angular.element(el).append($div);
            angular.element(document).injector().invoke(function($compile) {
                var scope = angular.element($div).scope();
                $compile($div)(scope);
                $('#VMAP_'+id).vectorMap({
                    map: 'world_mill_en',
                    series: {
                    regions: [{
                        values: theData,
                        scale: ['#C8EEFF', '#0071A4'],
                        normalizeFunction: 'polynomial'
                    }]
                },
                onRegionTipShow: function(e, el, code){
                    el.html(el.html()+' (GDP - '+gdpData[code]+')');
                }
                });
            });
        }
        done(0);
        return;

        /*
         $('#world-map').vectorMap({
         map: 'world-map',
         series: {
         regions: [{
         values: sample_data,
         scale: ['#C8EEFF', '#0071A4'],
         normalizeFunction: 'polynomial'
         }]
         },
         onRegionTipShow: function(e, el, code){
         el.html(el.html()+' (GDP - '+gdpData[code]+')');
         }
         });
         */



    }

    function generateReadOnlyForm($scope, id, report,  done)
    {
        var quote = "'";

        this.getReportData($scope,id, function(theData){

            if (theData)
            {

                if (!$scope.theData)
                     $scope.theData = [];


                var hashedID = hashCode(id);

                $scope.theData[hashedID] = theData;


                if (!$scope.tableParams)
                    $scope.tableParams = [];
               /*
                $scope.tableParams[hashedID] = new ngTableParams({
                    page: 1,            // show first page
                    count: 1000           // count per page
                }, {
                    counts: [], // hide page counts control
                    total: theData.length,  // length of data

                    getData: function($defer, params) {
                        // use build-in angular filter
                        var orderedData = params.sorting ?
                            $filter('orderBy')(theData, params.orderBy()) :
                            theData;
                        orderedData = params.filter ?
                            $filter('filter')(orderedData, params.filter()) :
                            orderedData;

                        //$scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(orderedData.length); // set total for recalc pagination
                        //$defer.resolve($scope.users);
                    }
                });
                */

                var htmlCode = '';


               // htmlCode += '<table class"table readOnlyForm"></div>';
                htmlCode += '<table ng-table="tableParams['+hashedID+']" show-filter="false" class="table">';


                for(var i = 0; i < report.properties.fields.length; i++)
                {
                    htmlCode += '<tr ><td class="readOnlyFormFieldAlias" >'+report.properties.fields[i].fieldAlias+'</td><td class="readOnlyFormFieldData" >{{theData['+hashedID+'][0].'+report.properties.fields[i].fieldName+'}}</td></tr>';
                }

                htmlCode += '</table>';

                var el = document.getElementById(id);
                if (el)
                {
                    var $div = $(htmlCode);
                    angular.element(el).append($div);
                    angular.element(document).injector().invoke(function($compile) {
                        var scope = angular.element($div).scope();
                        $compile($div)(scope);
                    });
                }
                done(0);
                return;

            }
        });

        /*
         $('#world-map').vectorMap({
         map: 'world-map',
         series: {
         regions: [{
         values: sample_data,
         scale: ['#C8EEFF', '#0071A4'],
         normalizeFunction: 'polynomial'
         }]
         },
         onRegionTipShow: function(e, el, code){
         el.html(el.html()+' (GDP - '+gdpData[code]+')');
         }
         });
         */



    }


   /* function generateGauge($scope, id, report, done)
    {

        var htmlCode = '<canvas canv-gauge id="'+id+'canvas'+'"></canvas><br/>';
        var el = document.getElementById(id);
        if (el)
        {
            var $div = $(htmlCode);
            angular.element(el).append($div);
            angular.element(document).injector().invoke(function($compile) {
                var scope = angular.element($div).scope();
                $compile($div)(scope);


                var options =  {
                    renderTo    : id+'canvas',
                    width       : '250',
                    height      : '250',
                    glow        : true,
                    units       : "Km/h",
                    title       : false,
                    minValue    : 0,
                    maxValue    : 220,
                    majorTicks  : ['0','20','40','60','80','100','120','140','160','180','200','220'],
                    minorTicks  : 2,
                    strokeTicks : false,
                    highlights  : [
                        { from : 0,   to : 50, color : 'rgba(0,   255, 0, .15)' },
                        { from : 50, to : 100, color : 'rgba(255, 255, 0, .15)' },
                        { from : 100, to : 150, color : 'rgba(255, 30,  0, .25)' },
                        { from : 150, to : 200, color : 'rgba(255, 0,  225, .25)' },
                        { from : 200, to : 220, color : 'rgba(0, 0,  255, .25)' }
                    ],
                    colors      : {
                        plate      : '#222',
                        majorTicks : '#f5f5f5',
                        minorTicks : '#ddd',
                        title      : '#fff',
                        units      : '#ccc',
                        numbers    : '#eee',
                        needle     : { start : 'rgba(240, 128, 128, 1)', end : 'rgba(255, 160, 122, .9)' }
                    }
                }

                new Gauge(options).setValue('1200');


            });
        }
        done(0);
        return;

    }  */




    function generateGauge($scope, id, report, done)
    {

        getReportData($scope,report,{}, function(theData){

            if (theData)
            {

                var theYKey = report.properties.ykeys[0].collectionID+'_'+report.properties.ykeys[0].elementName;
                if (report.properties.ykeys[0].aggregation) theYKey += report.properties.ykeys[0].aggregation;
                var theYKeyLabel = theYKey;
                if (report.properties.ykeys[0].format)  theYKey += '_original';


                var theValue = theData[0][theYKey];


                var htmlCode = '<div class="container-fluid" style="width:100%;height: 100%"> <canvas id="'+id+'canvas'+'" style="width:100%"></canvas><br/>';
                htmlCode += '<div style="    position: absolute;bottom: 0;left: 0;right: 0;padding: 20px;"><h3 style="text-align: center;">'+theData[0][theYKeyLabel]+'</h3></div></div>'
                var el = document.getElementById(id);
                if (el)
                {
                    var $div = $(htmlCode);
                    angular.element(el).append($div);
                    angular.element(document).injector().invoke(function($compile) {
                        var scope = angular.element($div).scope();
                        $compile($div)(scope);

                        var opts = {
                            lines: report.properties.lines, // The number of lines to draw    12
                            angle: report.properties.angle/100, // The length of each line
                            lineWidth: report.properties.lineWidth/100, // The line thickness
                            pointer: {
                                length: report.properties.pointerLength/100, // The radius of the inner circle
                                strokeWidth: report.properties.pointerStrokeWidth/1000, // The rotation offset
                                color: report.properties.pointerColor // Fill color
                            },
                            limitMax: report.properties.limitMax,   // If true, the pointer will not go past the end of the gauge
                            colorStart: report.properties.colorStart,   // Colors
                            colorStop: report.properties.colorStop,    // just experiment with them
                            strokeColor: report.properties.strokeColor,   // to see which ones work best for you
                            generateGradient: report.properties.generateGradient
                        };
                        var target = document.getElementById(id+'canvas'); // your canvas element
                        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
                        gauge.maxValue = report.properties.maxValue; // set max gauge value
                        gauge.minValue = report.properties.minValue;
                        gauge.animationSpeed = report.properties.animationSpeed; // set animation speed (32 is default value)
                        gauge.set(theValue); // set actual value

                        //http://bernii.github.io/gauge.js/
                    });
                }

            }
        });
        done(0);
        return;
        /*
         $scope.my_options = {

         };
         $scope.my_value = 0;
         $scope.units = ['Km/h', 'mph'];
         $scope.setValue = function(value){
         $scope.my_value = value;
         }
         */
    }





    //TODO: Incluir sparkline en la rejilla de datos
    //TODO: Incluir indicadores únicos como en la plantilla ACE

    //Cynteka pivot table http://ukman.github.io/





        /*

         http://ngmodules.org/modules/ng-table
         crear una hoja de calculo

         http://thomasstreet.com/blog/legacy/spreadsheet.html


         <table>
         <tr ng-repeat="row in rows">
         <td ng-repeat="column in columns">
         <div>
         <input ng-model="cells[column+row]"></input>
         <div ng-bind="compute(column+row)"
         class="output"></div>
         </div>
         </td>
         </tr>
         </table>

  --------------------
  PIVOTTABLE

         https://github.com/nicolaskruchten/pivottable/issues/208


         -------------------

        <div class="box-body table-responsive no-padding"   ng-init="getVisitorsByDate()">
            <table class="table table-striped table-hover table-bordered" >
                <thead>
                    <tr>

                        <td>IP</td>
                        <td>date</td>
                        <td>Profile</td>
                        <td>language</td>
                        <td>Country</td>
                        <td>City</td>
                        <td>Referer</td>

                    </tr>
                </thead>
                <tbody>
                    <tr class="table-row" ng-repeat="theItem in visitors" id="{{theItem._id}}">
                        <td>{{theItem.ip}}</td>
                        <td>{{theItem.date}}</td>
                        <td>{{theItem.visitorProfile}}</td>
                        <td>{{theItem.language}}</td>
                        <td>{{theItem.country}}</td>
                        <td>{{theItem.city}}</td>
                        <td>
                            <a href="{{theItem.referer}}">{{theItem.referer}}</a>
                            <br>
                                <b>Asking for page: </b>{{theItem.requestedPage}}
                                <br>
                                    <small>{{theItem.userAgent}}</small>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    */


    return this;

});
