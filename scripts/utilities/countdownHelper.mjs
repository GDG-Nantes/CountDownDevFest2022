import { Timer } from './timer.mjs';
import { AudioPlayer } from './audio.js';
import { PLAYLIST, LAST_SONGS_PLAYLIST } from './playlist.js';
const DEBUG_MUTE = false; // Default = false; true if you don't want the sound
//const timeBeforeLastSongs = 4 * 60 * 1000 + 8 * 1000 + 5 * 1000 // 4 Minute 08 + 5s of dropdown song // MOP
const timeBeforeLastSongs = 4 * 60 * 1000 + 52 * 1000 + 5 * 1000; // 4 Minute 52 + 5s of dropdown song // ACDC
const dropTimeForLastSong = 5 * 1000; // 5 sec

export class CountDownHelper {
    constructor(timerElt, opacityElt) {
        this.audioPlayer = new AudioPlayer();
        // Timer html
        this.timerElt = timerElt;
        this.opacityElt = opacityElt;
        // We start the timer (countdwon)
        this.timer = new Timer(this.callbackTimer.bind(this));
    }

    /**
     * Load the midi object, load the ogg files according to objectSong parameter
     *
     * Return a Promise with objectSong as response (to chain Promise)
     * @param {Object} objectSong
     */
    loadSong(objectSong) {
        return this.loadMusic(objectSong);
    }

    /**
     * Save or get the current song
     * Syncrhonise the current time to the countdown and ask to play the song
     *
     */
    playSongAndDisplayNote() {
        // We only play the song in countdown mode
        // as we create a delay before the start of song (timeout) we wait for the right time to start the song
        this.playSongAtTime(this.startSong.bind(this));
    }

    /**
     *
     * this method is call at every RequestAnimationFrame to start the song at the right moment
     *
     * @param {function} callback : the callback to call when the song is over
     */
    playSongAtTime(callback) {
        this.playMusic(callback);
    }

    /**
     * Start a song :
     * 1. get the song to play
     * 2. load song
     * 3. play it
     *
     *
     */
    startSong() {
        if (this.countDownOver) {
            return;
        }
        // We frst request server to get the right song to play
        this.queryCurrentSongOrTakeFirst()
            .then((objectSong) => this.loadSong(objectSong))
            .then((_) => this.playSongAndDisplayNote());
    }

    /**
     * If we're in countdown :
     * if nextSong === true -> we look at the next song in playlist
     * else -> we take the song on the server
     * If no song on the server -> we take the first of the playlist
     *
     * If we're on a device :
     * we take the song on the server
     *
     * @param {boolean} nextSong
     */
    queryCurrentSongOrTakeFirst(nextSong) {
        return new Promise((resolve, reject) => {
            // If we're in the delay to play the last song, we switch to last song playlist
            const playlistToUse = this.switchToLastsSongs
                ? LAST_SONGS_PLAYLIST
                : PLAYLIST;
            // we check if we have to take the next song
            this.songIndex = (this.songIndex + 1) % playlistToUse.length;
            localStorage['songIndex'] = this.songIndex;
            resolve({
                songToPlay: playlistToUse[this.songIndex],
                index: this.songIndex,
            });
        });
    }

    /**
     * Start the song and will call the callback when the song is terminated
     *
     * @param {function} callbackEndMusic
     */
    playMusic(callbackEndMusic) {
        return this.audioPlayer.play(DEBUG_MUTE, callbackEndMusic);
    }

    /**
     * Load the song in the player (only for countdown)
     *
     * @param {*} objectSong
     */
    loadMusic(objectSong) {
        // We only play music if we have the countdown
        return this.audioPlayer
            .loadSong(`./assets/songs/`, objectSong.songToPlay.song)
            .then((_) => objectSong);
    }

    /**
     * method called when the timer send events
     *
     * @param {string} state
     */
    callbackTimer(state) {
        switch (state.type) {
            case 'time':
                // TODO
                this.timerElt.innerHTML = `${state.value.minutes}:${state.value.seconds}`;
                //this.gameView.setTime(state.value)
                // If we're in the last song delay, we first drop the sound of current sound before
                if (
                    state.value.diff < timeBeforeLastSongs &&
                    state.value.diff > timeBeforeLastSongs - dropTimeForLastSong
                ) {
                    const adjustDiff =
                        state.value.diff -
                        (timeBeforeLastSongs - dropTimeForLastSong);
                    this.audioPlayer.manageVolumeFromPercent(
                        adjustDiff / dropTimeForLastSong
                    );
                } else if (
                    state.value.diff < timeBeforeLastSongs &&
                    !this.switchToLastsSongs
                ) {
                    this.switchToLastsSongs = true;
                    this.audioPlayer.stop();
                    this.audioPlayer.manageVolumeFromPercent(100);
                    this.startSong();
                } else if (this.audioPlayer) {
                    this.audioPlayer.manageSoundVolume(state.value.diff);
                }
                break;
            case 'endCountDown':
                console.log('Times Up !');
                this.countDownOver = true;
                // Stop Music
                this.audioPlayer.stop();
                //this.videoPlayer.resetVideo();
                //const opacityElt = document.getElementById('opacity');
                this.opacityElt.style.display = '';
                setTimeout(() => {
                    this.opacityElt.classList.add('black');
                    //setTimeout(() => this.videoPlayer.playVideo(), 4000);
                }, 100);
                break;
        }
    }
}
