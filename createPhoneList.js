#!/usr/bin/node

var $ = require('jquery');
var fs = require('fs');

//--------------------------------------------------------------------------------------------------

var OUTPUT_FILENAME = 'phonelist.json';
var PHONE_PREFIX = '0241/559709-';

var phonelist      = {
   'Festangestellte': null,
   'Hiwis':    null,
   'Besprechungsräume': null
};

//--------------------------------------------------------------------------------------------------

/*function extractTableHeader( tableRow ) {
   var headers = $( 'th', tableRow );
   headers.each( function handleHeader( index, element ) {
      console.log( index, $( element).html() );
   });
}*/

//--------------------------------------------------------------------------------------------------

function extractTableData( tableRow ) {
   var datas = $( 'td', tableRow );
   var user = $( datas[ 0 ] ).html();
   var userName = $.trim( $( 'a', datas[ 1 ] ).html() );
   var userNumber = $.trim( $( 'p', datas[ 2 ] ).html() );
   var userMobile = $.trim( $( 'p', datas[ 3 ] ).html() );

   userNumber = PHONE_PREFIX + userNumber;
   if( userMobile.length <=3 && userMobile.length > 0 ) {
      userMobile = PHONE_PREFIX + userMobile;
   }


   //console.log( user, ',', userName, ',', userNumber, ',', userMobile );
   /*datas.each( function handleData( index, element ) {
    console.log( index, $( element ).html() );
    });*/

   return {
      'shortName':    user,
      'name':         userName,
      'firstNumber':  userNumber,
      'secondNumber': userMobile
   };
}

//--------------------------------------------------------------------------------------------------

function extractTableRows( htmlTable, phonelist ) {
   var rows = $( 'tr', htmlTable );
   rows.each( function handleRow( index, element ) {
      if( index !== 0) {
         phonelist.push( extractTableData( element ) );
      } /*else {
         //extractTableHeader( element );
      }*/
   });
}

//--------------------------------------------------------------------------------------------------
// main
//--------------------------------------------------------------------------------------------------

$.get( 'http://wiki/index.php/Office:Telefonliste', function gotPhoneList( phoneListHtmlPage ) {
   return phoneListHtmlPage;
} ).done( function( data ) {
      var tables = $( '.defaultTable', data );
      var employees = [];
      var hiwis = [];
      var raeume = [];
      extractTableRows( tables[ 0 ], employees );
      extractTableRows( tables[ 1 ], employees );
      extractTableRows( tables[ 2 ], hiwis );
      extractTableRows( tables[ 3 ], raeume );
      //extractTableRows( tables[ 4 ], etc );

      phonelist.Festangestellte = employees;
      phonelist.Hiwis = hiwis;
      phonelist[ 'Besprechungsräume' ] = raeume;

      //console.log( phonelist );

      fs.writeFile( OUTPUT_FILENAME, JSON.stringify( phonelist ), function( err ) {
         if(err) {
            console.log(err);
         } else {
            console.log("phonelist extracted and saved.");
         }
      });

      /*$( '.defaultTable', data ).each( function handleTable( index, element ) {
       extractTableRows( element );
       });*/
   });

