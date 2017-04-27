var radio;
window.addEventListener( "load", function () {
    getData( "settings.json", function ( err, options ) {
        if ( ! err ) {
            radio = new SimpleRadio( Object.assign( options, { wrapper: document.querySelector( ".radio" ) } ) );
        };
    } );

}, false );