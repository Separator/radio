window.addEventListener( "load", function () {
    var customPlayer = document.querySelector( ".custom-player" );
    if ( customPlayer ) {
        var volume = 1;
        var audioPlayer = customPlayer.querySelector( "audio" );

        function play() {
            audioPlayer.play();
        };

        function stop() {
            audioPlayer.pause();
        };

        function change() {
            audioPlayer.volume = this.value;
        };

        var playButton = customPlayer.querySelector( ".play" );
        var stopButton = customPlayer.querySelector( ".stop" );

        playButton.addEventListener( "click", function () {
            play();
            this.style.display = "none";
            stopButton.style.display = "block";
        }, false );
        stopButton.addEventListener( "click", function () {
            stop();
            this.style.display = "none";
            playButton.style.display = "block";
        }, false );

        var volumeRange = customPlayer.querySelector( ".volume" );
        volumeRange.addEventListener( "change", change, false );
        volumeRange.addEventListener( "input",  change, false );
        audioPlayer.volume = volumeRange.value;
        play();
    };
}, false );