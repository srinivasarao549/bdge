/*
 * Badly Designed Game Engine
 * Copyright (c) 2010, Michael Kelly <Osmose1000@gmail.com>
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

/**
 * Handles audio playback
 */
define(["require", "exports", "module",
    "./util"
],function(require, exports, module,
    util
) {

/**
 * Class for managing sound playback
 */
var Sound = function() {
    this.audio = new Audio();
    
    this.playing = false;
    this.src = null;
    this.loaded = false;
};

/**
 * Loads the sound at the specified URL.
 */
Sound.prototype.load = function(src, callback) {
    this.src = src;
    this.audio.src = src;
    this.audio.load();
    
    var a = this.audio;
    var checkLoading = function() {
        if (a.readyState == a.HAVE_ENOUGH_DATA) {
            callback();
        } else {
            setTimeout(checkLoading, 10);
        }
    };
    
    setTimeout(checkLoading, 10);
    
    return this;
};

/**
 * Sets up event listeners for looping, or removes them.
 */
var loopCallback = function() {
    this.play();
};
Sound.prototype.setLooping = function(looping) {
    if (looping) {
        this.audio.addEventListener("ended", loopCallback, false);
    } else {
        this.audio.removeEventListener("ended", loopCallback, false);
    }
    
    return this;
};

/**
 * Plays a sound. Has no effect if the sound is already playing.
 */
Sound.prototype.play = function() {
    this.playing = true;
    this.audio.play();
    
    return this;
};

/**
 * Pauses playback at the current seek point
 */
Sound.prototype.pause = function() {
    this.audio.pause();
    
    return this;
};

/**
 * Stops playback and seeks to the beginning of the sound
 */
Sound.prototype.stop = function() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.playing = false;
    
    return this;
};

// Pool of audio objects for playing back sounds
var audioPool = new util.ItemPool(function() {
    return new Audio();
});

/**
 * Creates a new audio element and plays the sound once
 */
Sound.prototype.playAsSound = function() {
    var soundItem = audioPool.getFreeItem();
    var sound = soundItem.data;
    
    // Free sound when finished playing
    var endedCallback = function() {
        this.removeEventListener("ended", endedCallback, false);
        soundItem.free = true;
    };
    sound.addEventListener("ended", endedCallback, false);
    
    sound.src = this.src;
    sound.load();
    sound.play();
};

// Expose class
exports.Sound = Sound;

});