/*
jquery mobule code to implement the phonelist
*/

(function phone( $ ) {

//-----------------------------------------------------------------------------------------------------------
var phoneList     = null,
    selectedEntry = null;
//-----------------------------------------------------------------------------------------------------------

function addEntriesFromPhonelist( uiElement, list) {
   var category = null;
   for ( category in list ) {
      addDivider( uiElement, category );
      addList( uiElement, list[ category ], category );
   }
}

//-----------------------------------------------------------------------------------------------------------

function addDivider( ulElement, name ) {
   var listItem = null;
   listItem = '<li data-role="list-divider">' + name + '</li>';
   ulElement.append( listItem );
}

//-----------------------------------------------------------------------------------------------------------

function addList( ulElement, list, category ) {
   var listItem = null,
       i = null;

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
         addEntriesFromPhonelist( ulElement, phoneList );

         //handle selection of entry
         ulElement.delegate('li', 'tap', function( event ) {
            event.stopPropagation();
            selectedEntry = event.currentTarget.getAttribute( 'data-entry-id' );
         });
         ulElement.listview( 'refresh' );
      } );
} );


$( '#phone_entry' ).live( "pagebeforeshow", function() {
   if( selectedEntry ) {
       var id = selectedEntry.split('-'),
           phoneListEntry = phoneList[ id[ 0 ] ][ id[ 1 ] ];

       $( '#name' ).html( phoneListEntry.userName );
       $( '#number' ).html( phoneListEntry.userNumber );
       $( '#number' ).prop( 'href', 'tel:' + phoneListEntry.userNumber );
       $( '#mobile' ).html( phoneListEntry.userMobile || '-' );
       if( phoneListEntry.userMobile ) {
          $( '#mobile' ).prop( 'href', 'tel:' + phoneListEntry.userMobile );
       }
   } else {
       $.mobile.changePage( '#phonelist' );
   }
} );

})( $ );
