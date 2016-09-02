import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {FORM_DIRECTIVES, FORM_PROVIDERS} from '@angular/forms';
import { NgClass} from '@angular/common';
import 'rxjs/add/operator/map';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import { DND_PROVIDERS, DND_DIRECTIVES} from 'ng2-dnd';
import { MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

declare var $:any;
declare var jQuery:any;

import { StockService} from '../stock.service';


@Component({
	moduleId: module.id,
    selector: 'app-search',
    directives: [NgClass, CHART_DIRECTIVES, DND_DIRECTIVES, MODAL_DIRECTIVES],
    templateUrl: 'search.component.html',
    providers: [StockService],
    encapsulation: ViewEncapsulation.None,
})

export class SearchComponent  {
    @ViewChild('modal')
    modal: ModalComponent;

    @ViewChild('errModal')
    errModal: ModalComponent;

    searchStr:string;
    quoteRes:any[]=[];
    chart: HighchartsChartObject;
    options: Object;
    chartVisible: boolean = false;
    stocks:Array<any>=[];
    numOfStocks:number = 0;
    dragedOver: boolean = false;
    modalName:string;
    modalSymbol:string;
    modalEx:string;
    modalLastPrice:number;
    modalChange:number;
    modalChangePercentYTD:number;
    modalVolume:number;
    modalOpenP:number;
    modalHigh:number;
    modalLow:number;
    modalMarketCap:number;
    modalPercent: number;
    newsRes:any[];
    isChPositive:boolean;
    isChYPositive:boolean;
    isOverflow:boolean;
    errMsg:string;


    
    saveInstance(chartInstance:any) {
        this.chart = chartInstance;
    }
    
    constructor(private _stockService:StockService) {
        this.quoteRes = [];
        this.chartVisible = false;
        this.isOverflow = false;
    }

    modalOpen(obj:any) {
        this.modalName = obj.Name;
        this.modalSymbol = obj.Symbol;
        this.modalEx = obj.Exchange;
        this.modalLastPrice = obj.LastPrice;
        this.modalChange = obj.Change;
        this.modalChangePercentYTD = obj.ChangePercentYTD;
        this.modalVolume = obj.Volume;
        this.modalOpenP = obj.Open;
        this.modalHigh = obj.High;
        this.modalLow = obj.Low;
        this.modalMarketCap = obj.MarketCap;
        this.modalPercent = obj.ChangePercent;
        this.isChPositive = obj.Change>0?  true:false;
        this.isChYPositive = obj.ChangePercentYTD>0?true:false;
        
        


        this._stockService.getNews(this.modalSymbol).subscribe(response => {
            this.newsRes = response.responseData.feed.entries;
        })        

        this.modal.open('lg');
    }


    searchStock() {
        let here:any = this;

        if (this.searchStr != '') {
            this._stockService.searchStock(this.searchStr).subscribe(
                (res) => {
                    if (res.length === 0) {
                        this.errMsg = 'No result. The input must be one of the words in the company name or at the beginning of the symbol';
                        this.errModal.open('lg');
                    }  else {
                     this.quoteRes = [];
                     let num = res.length>7 ? 7:res.length;

                     for (let j=0; j<num; j++) {
                        this._stockService.getQuote(res[j].Symbol).subscribe(
                            (response) => {
                                response.Exchange = res[j].Exchange;
                                response.isPositive = response.Change>0 ? true:false;
                                this.quoteRes.push(response);
                                this.isOverflow = (this.quoteRes.length > 3) ? true:false ;  
                            },
                            (error) => {
                                this.errMsg = 'Something trouble happened. Try again after a few seconds.';
                                this.modal.open('lg');
                            }
                        )
                    }
                    // this.isOverflow = (this.quoteRes.length > 3) ? true:false ;
                    if (!this.chartVisible) {
                        this.chartVisible = true;
                        this.getChart();
                    }
                 }
            },
            (err) => {
                this.errMsg = 'Something trouble happened. Try again after a few seconds.';
                this.modal.open('lg');
            }
        )
        } else {
            this.errMsg = 'Please input a part of company name or symbol'
            this.errModal.open();
        }
    }

    dragOver($event:any) {
        this.dragedOver = true;
    }


    viewChart($event:any) {
        let req:any[] = $event.dragData.split(",");
        let symbol:string = req[0];
        let lastPrice:number = Number(req[1]);
        let exchange:string = req[2];
        let isExist:boolean = false;
        let that:any = this;

        this.stocks.forEach(function(stock) {
            if (stock[0]===symbol) {
                isExist = true;
                that.errMsg = 'Already Exist!'
                that.errModal.open();

            } 
        })

        if (!isExist) {
            this.numOfStocks = this.numOfStocks+1;
            this._stockService.getData(symbol).subscribe(
                (res) => {
                    if (res.Elements.length === 0 ) {
                       this.errMsg = 'Sorry, there is no value history. Click to see current values';
                       this.errModal.open('lg'); 
                    } else {
                       this.stocks.push([symbol, lastPrice]);
                       this.renderChart(res, exchange, symbol); 
                    }
                },
                (err) => {
                    this.errMsg = 'There are some troubles. Try again after a few secondes.';
                    this.errModal.open('lg');
                }
            )
        }
    }
                

    stockRemove(stock:any) {
        this.chart.series.forEach((key: any) =>{
            if (key.name === stock[0]) {
                this.chart.series[this.chart.series.indexOf(key)].remove();
                this.stocks.splice(this.stocks.indexOf(stock),1);
            }
        })
    }
    


    renderChart(obj:any, ex:string, str:string) {
        let data:any[] = [];
        let array:any[] = [];

        for (var i=0; i<obj.Dates.length; i++) {
            array = [];
            array.push(Date.parse(obj.Dates[i]));
            array.push(obj.Elements[0].DataSeries.close.values[i]);
            data.push(array);
        }


        this.chart.addSeries({
            name: str,
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        });
    }

    getChart() {
        this.options = {
            colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
            chart: {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                        stops: [
                            [0, '#2a2a2b'],
                            [1, '#3e3e40']
                        ]
                    },
                    style: {
                        fontFamily: "'Unica One', sans-serif"
                    },
                    borderColor: '#5a5454',
                    borderWidth: 2,
                    // margin: [2,2,2,2],
                    plotBorderColor: '#606063',
                    width: 720
                },
            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                },
                text: 'US Stock price history'
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase'
                }
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'

                    }
                }
            },
            yAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                        }
                    }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        color: '#B0B0B3'
                    },
                    marker: {
                        lineColor: '#333'
                    }
                },
                boxplot: {
                    fillColor: '#505053'
                },
                errorbar: {
                    color: 'white'
                }
            },
            legend: {
                itemStyle: {
                    color: '#E0E0E3'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                }
            },
            credits: {
                style: {
                    color: '#666'
                }
            },

            drilldown: {
                activeAxisLabelStyle: {
                    color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                    color: '#F0F0F3'
                }
            },

            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    theme: {
                        fill: '#505053'
                    }
                }
            },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                    fill: '#707073',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                    },
                    select: {
                    fill: '#000003',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            },
            selected: 1
            
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
        }
    }

    

}