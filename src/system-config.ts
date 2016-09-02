"use strict";

// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  'angular2-highcharts':        'vendor/angular2-highcharts/dist',
  'highcharts/highstock.src':   'vendor/highcharts/highstock.js',
  // 'HighchartExporting':         'vendor/highcharts/modules/exporting.js',
  // 'HighchartCSVExporting':      'assets/js/export-csv.js',
  'ng2-dnd' :                   'vendor/ng2-dnd',
  'ng2-bs3-modal':              'vendor/ng2-bs3-modal',
  // 'ng2-bootstarp':              'vendor/ng2-bootstrap'
};

/** User packages configuration. */
const packages: any = {
  'highcharts': {
    format:'cjs'
  },
  'angular2-highcharts': {
    format: 'cjs',
    defaultExtenstion: 'js',
    main: 'index'
  },
  // 'HighchartExporting': {
  //   defaultExtension: 'js',
  //   format: 'cjs'
  // },
  // 'HighchartCSVExporting': {
  //   defaultExtension: 'js',
  //   format: 'cjs'
  // },
  'ng2-dnd': {
    format: 'cjs',
    defaultExtenstion: 'js',
    main: 'index.js'
  },
  'ng2-bs3-modal':             {
    format: 'cjs',
    defaultExtenstion: 'js',
    main: 'ng2-bs3-modal.js'
  }

};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/navbar',
  'app/search',
  'app/about',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
