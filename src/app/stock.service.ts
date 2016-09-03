import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class StockService{
    private searchUrl:string;
    private quoteUrl:string;
    private dataUrl:string;
    private newsUrl:string; 


    constructor(private _http:Http) {
        
    };

    searchStock(str:string) {
        this.searchUrl = "//dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=" + str;

        return this._http.get(this.searchUrl).map(res => res.json());
    }

    getQuote(str:string) {
        this.quoteUrl = "//dev.markitondemand.com/Api/v2/Quote/json?symbol=" + str;
        return this._http.get(this.quoteUrl).map(res => res.json());
    }

    getData(str:string) {
        let parameters:string = '{"Normalized": false, "NumberOfDays": 365, "DataPeriod": "Day",'
            + '"Elements": [{"Symbol":"' + str + '", "Type": "price", "Params": ["c"] }] }';

        this.dataUrl = "//dev.markitondemand.com/Api/v2/InteractiveChart/json?parameters=" + parameters;
        return this._http.get(this.dataUrl).map(res => res.json());

    }

    getNews(str:string) {
        this.newsUrl = "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=http://finance.yahoo.com/rss/headline?s=" + str;
        return this._http.get(this.newsUrl).map(res => res.json());

    }

}