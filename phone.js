/*
jquery mobule code to implement the phonelist
*/

(function phone( $ ) {

//-----------------------------------------------------------------------------------------------------------
var phoneList     = null,
    selectedEntry = null,
    numberPrefix = '0241 559709-';

//-----------------------------------------------------------------------------------------------------------

function addDivider( ulElement, name ) {
   var listItem = null;
   listItem = '<li data-role="list-divider">' + name + '</li>';
   ulElement.append( listItem );
}

//-----------------------------------------------------------------------------------------------------------

function addList( ulElement, phoneList, category ) {
   var listItem = null,
       i = null,
       list = phoneList[ category ];

   for( i = 0; i < list.length; i++ ) {
      listItem = '<li data-entry-id="' + category + '-' + i +
         '" data-theme="c"><a href="#phone_entry" data-transition="slide">' +
         list[ i ].userName + ' (' + list[ i ].user + ') <br>' + list[ i ].userNumber + '</a></li>';
      ulElement.append( listItem );
   }
}

//-----------------------------------------------------------------------------------------------------------
// main
//-----------------------------------------------------------------------------------------------------------

$( '#phonelist' ).live( "pagebeforecreate", function() {
   $.getJSON( './phonelist.json', function gotPhoneList( phoneListAsJson ) {
      return phoneListAsJson;
   } ).done( function( phoneListAsJson ) {
         phoneList = phoneListAsJson;
         var ulElement = $( '#phoneListEntries' );
         addDivider( ulElement, 'Festangestellte' );
         addList( ulElement, phoneList, 'employees' );
         addDivider( ulElement, 'Hiwis' );
         addList( ulElement, phoneList, 'hiwis' );

         //handle selection of entry
         ulElement.delegate('li', 'click', function( clickedItem ) {
            //console.log( clickedItem );
            selectedEntry = $(this).get(0).getAttribute( 'data-entry-id' );
            //console.log( selectedEntry );
         });
         ulElement.listview( 'refresh' );
      } );
} );


$( '#phone_entry' ).live( "pagebeforeshow", function() {
   var id = selectedEntry.split('-'),
       phoneListEntry = phoneList[ id[ 0 ] ][ id[ 1 ] ];

   $( '#name' ).html( phoneListEntry.userName );
   $( '#number' ).html( numberPrefix + phoneListEntry.userNumber );
   $( '#number' ).prop( 'href', 'tel:' + numberPrefix + phoneListEntry.userNumber );
   $( '#mobile' ).html( phoneListEntry.userMobile || '-' );
   if( phoneListEntry.userMobile ) {
      $( '#mobile' ).prop( 'href', 'tel:' + phoneListEntry.userMobile );
   }
} );

})( $ );
