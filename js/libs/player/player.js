/**
 * Простое радио
 */
;( function() {
    if ( window.SimpleRadio ) {
        return false;
    };

    window.getData = function ( url, handler ) {
        var XHR = ( "onload" in new XMLHttpRequest() ) ? XMLHttpRequest : XDomainRequest;
        var xhr = new XHR();
        xhr.timeout = 30000;
        xhr.open( "GET", url + "?r=" + Math.random(), true );
        xhr.send();
        xhr.onreadystatechange = function() {
            if ( this.readyState != 4 ) {
                return;
            };
            if ( handler ) {
                if ( this.status == 200 ) {
                    var data = this.responseText;
                    try {
                        data = JSON.parse( data );
                    } catch ( e ) {};
                    handler( null, data );
                } else {
                    handler( this.status ? this.statusText : true, null );
                };
            };
        };
    };

    function SimpleRadio( options ) {
        this.init( options );
    };

    SimpleRadio.prototype.init = function ( options ) {
        var defaultOptions = {
            _audioNode: null,
            _coverNode: null,
            _coverFirstNode: null,
            _coverSecondNode: null,
            _buttonPlayNode: null,
            _buttonVolumeNode: null,
            _logoNode: null,
            _socialNode: null,
            _index: -1,
            _trackServerTime: null,
            _trackInfo: null,
            _isChangeVolumeNow: false,

            autoPlay: false,
            saveVolume: true,
            saveState: true,

            cssWrapper: "sr-wrapper",
            cssLogo: "sr-logo",
            cssCover: "sr-cover",
            cssManagement: "sr-management",
            cssSocialNetworks: "sr-social-networks",
            cssButtonPlay: "sr-button-play",
            cssButtonVolume: "sr-button-volume",
            cssButtonPaused: "sr-button-paused",
            cssAnimated: "sr-animated",

            socialNetworksTarget: "_blank",
            socialNetworksList: null,

            audioStreamURL: "",
            metaInformationURL: "",
            serverTimeURL: "",
            wrapper: null
        };
        Object.assign( this, defaultOptions, options || {} );
        this._render();
        if ( this.autoPlay ) {
            this.play();
        };
    };

    SimpleRadio.prototype._render = function () {
        if ( this.wrapper ) {
            var wrapper = this.wrapper;
            wrapper.innerHTML = "";
            wrapper.classList.add( this.cssWrapper );
            // Добавляем узел "Аудио":
            this._audioNode = document.createElement( "AUDIO" );
            this._audioNode.src = this.audioStreamURL;
            wrapper.appendChild( this._audioNode );
            // Добавляем логотип:
            this._logoNode = document.createElement( "DIV" );
            this._logoNode.classList.add( this.cssLogo );
            wrapper.appendChild( this._logoNode );
            // Добавляем блок для логотипа исполнителя:
            this._coverNode = document.createElement( "DIV" );
            this._coverNode.classList.add( this.cssCover );
            wrapper.appendChild( this._coverNode );
            this._coverFirstNode = document.createElement( "DIV" );
            this._coverNode.appendChild( this._coverFirstNode );
            this._coverSecondNode = document.createElement( "DIV" );
            this._coverNode.appendChild( this._coverSecondNode );
            // Добавляем блок управления:
            var managementNode = document.createElement( "DIV" );
            managementNode.classList.add( this.cssManagement );
            wrapper.appendChild( managementNode );
            // Кнопка "Play":
            this._buttonPlayNode = document.createElement( "DIV" );
            this._buttonPlayNode.classList.add( this.cssButtonPlay );
            this._buttonPlayNode.classList.add( this.cssButtonPaused );
            managementNode.appendChild( this._buttonPlayNode );
            // Кнопка "Volume":
            this._buttonVolumeNode = document.createElement( "DIV" );
            this._buttonVolumeNode.classList.add( this.cssButtonVolume );
            managementNode.appendChild( this._buttonVolumeNode );
            wrapper.appendChild( managementNode );
            // Добавляем поведение к кнопкам:
            this._addBehavior();
            // Добавляем социальные сети:
            if ( this.socialNetworksList && this.socialNetworksList.length ) {
                this._socialNode = document.createElement( "DIV" );
                this._socialNode.classList.add( this.cssSocialNetworks );
                var socialNetworksList = this.socialNetworksList;
                for ( var i = 0; i < socialNetworksList.length; i++ ) {
                    var socialNetwork = socialNetworksList[ i ];
                    var snNode   = document.createElement( "DIV" );
                    var linkNode = document.createElement( "A" );
                    linkNode.classList.add( socialNetwork[0] );
                    linkNode.setAttribute( "href", socialNetwork[1] );
                    linkNode.setAttribute( "target", this.socialNetworksTarget );
                    snNode.appendChild( linkNode );
                    this._socialNode.appendChild( snNode );
                };
                wrapper.appendChild( this._socialNode );
            };
        };
    };

    SimpleRadio.prototype._addBehavior = function () {
        // Кнопка играть/пауза:
        this._buttonPlayNode.addEventListener( "click", function () {
            this.toggle();
        }.bind( this ), false );
        // Регулятор громкости:
        this._buttonVolumeNode.addEventListener( "mousedown", function ( e ) {
            this._isChangeVolumeNow = true;
            this._updateVolume( e );
        }.bind( this ), false );
        this._buttonVolumeNode.addEventListener( "mouseup", function ( e ) {
            this._isChangeVolumeNow = false;
        }.bind( this ), false );
        /*this._buttonVolumeNode.addEventListener( "mouseout", function ( e ) {
            this._isChangeVolumeNow = false;
        }.bind( this ), false );*/
        this._buttonVolumeNode.addEventListener( "mousemove", function ( e ) {
            if ( this._isChangeVolumeNow ) {
                this._updateVolume( e );
            };
        }.bind( this ), false );
    };

    SimpleRadio.prototype._updateVolume = function ( e ) {
        var currentVolume = this._getVolumeByAction( e );
        this._audioNode.volume = currentVolume;
        this._buttonVolumeNode.setAttribute( "volume", currentVolume * 100 );
    };

    SimpleRadio.prototype._getVolumeByAction = function ( e ) {
        var y = ( e.offsetY == undefined ) ? e.layerY : e.offsetY;
        var height = this._buttonVolumeNode.clientHeight;
        return Math.round( ( ( height - y ) / height ) * 10) / 10;
    };

    SimpleRadio.prototype.toggle = function () {
        if ( this._audioNode.paused ) {
            this.play();
        } else {
            this.stop();
        };
    };

    SimpleRadio.prototype.play = function () {
        if ( this._audioNode.paused ) {
            this._audioNode.play();
            this._buttonPlayNode.classList.remove( this.cssButtonPaused );
            this._startTracking();
        };
    };

    SimpleRadio.prototype.stop = function () {
        if ( ! this._audioNode.paused ) {
            this._audioNode.pause();
            this._buttonPlayNode.classList.add( this.cssButtonPaused );
            this._stopTracking();
        };
    };

    SimpleRadio.prototype._startTracking = function () {
        this._stopTracking();
        getData( this.metaInformationURL, function ( err, data ) {
            if ( ! err ) {
                this._trackInfo = data;
                getData( this.serverTimeURL, function ( err, data ) {
                    if ( ! err ) {
                        this._trackServerTime = data;
                        this._updateCover();
                        this._index = setTimeout( function () {
                            this._startTracking();
                        }.bind( this ), ( this._trackInfo.next - this._trackServerTime ) * 1000 );
                    };
                }.bind( this ) );
            };
        }.bind( this ) );
    };

    SimpleRadio.prototype._stopTracking = function () {
        clearTimeout( this._index );
    };

    SimpleRadio.prototype._updateCover = function () {
        if ( this._trackInfo ) {
            this._coverSecondNode.style.backgroundImage = this._coverFirstNode.style.backgroundImage;
            this._coverSecondNode.classList.remove( this.cssAnimated );
            this._coverSecondNode.style.opacity = "1";
            this._coverFirstNode.classList.remove( this.cssAnimated );
            this._coverFirstNode.style.opacity = "0";

            setTimeout( function () {
                this._coverSecondNode.style.opacity = "0";
                this._coverSecondNode.classList.add( this.cssAnimated );
                this._coverFirstNode.style.opacity = "1";
                this._coverFirstNode.classList.add( this.cssAnimated );
                this._coverFirstNode.style.backgroundImage = "url(" + this._trackInfo.cover + ")";
            }.bind( this ), 10 );
        };
    };

    window.SimpleRadio = SimpleRadio;
} )();