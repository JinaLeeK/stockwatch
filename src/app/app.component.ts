import { Component } from '@angular/core';
import {RouterConfig, ROUTER_DIRECTIVES } from '@angular/router';;

import { NavbarComponent} from './navbar/navbar.component';
import { SearchComponent} from './search/search.component';
import { HTTP_PROVIDERS} from '@angular/http';
import { DND_PROVIDERS, DND_DIRECTIVES} from 'ng2-dnd';
import { CHART_DIRECTIVES} from 'angular2-highcharts';
import { NgClass} from '@angular/common';
import { MODAL_DIRECTIVES} from 'ng2-bs3-modal/ng2-bs3-modal';
// import { Routes , ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';

import { StockService} from './stock.service';
import {enableProdMode} from '@angular/core';
enableProdMode();



@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  directives: [NgClass, NavbarComponent, CHART_DIRECTIVES, SearchComponent, DND_DIRECTIVES, MODAL_DIRECTIVES],
  providers: [HTTP_PROVIDERS, StockService, DND_PROVIDERS]
  // providers: [ROUTER_PROVIDERS]
})

export class AppComponent {}
