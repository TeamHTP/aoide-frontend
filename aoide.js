var noteValues = {
  'C0': 16.35,
  'C#0': 17.32,
  'Db0': 17.32,
  'D0': 18.35,
  'D#0': 19.45,
  'Eb0': 19.45,
  'E0': 20.60,
  'F0': 21.83,
  'F#0': 23.12,
  'Gb0': 23.12,
  'G0': 24.50,
  'G#0': 25.96,
  'Ab0': 25.96,
  'A0': 27.50,
  'A#0': 29.14,
  'Bb0': 29.14,
  'B0': 30.87,
  'C1': 32.70,
  'C#1': 34.65,
  'Db1': 34.65,
  'D1': 36.71,
  'D#1': 38.89,
  'Eb1': 38.89,
  'E1': 41.20,
  'F1': 43.65,
  'F#1': 46.25,
  'Gb1': 46.25,
  'G1': 49.00,
  'G#1': 51.91,
  'Ab1': 51.91,
  'A1': 55.00,
  'A#1': 58.27,
  'Bb1': 58.27,
  'B1': 61.74,
  'C2': 65.41,
  'C#2': 69.30,
  'Db2': 69.30,
  'D2': 73.42,
  'D#2': 77.78,
  'Eb2': 77.78,
  'E2': 82.41,
  'F2': 87.31,
  'F#2': 92.50,
  'Gb2': 92.50,
  'G2': 98.00,
  'G#2': 103.83,
  'Ab2': 103.83,
  'A2': 110.00,
  'A#2': 116.54,
  'Bb2': 116.54,
  'B2': 123.47,
  'C3': 130.81,
  'C#3': 138.59,
  'Db3': 138.59,
  'D3': 146.83,
  'D#3': 155.56,
  'Eb3': 155.56,
  'E3': 164.81,
  'F3': 174.61,
  'F#3': 185.00,
  'Gb3': 185.00,
  'G3': 196.00,
  'G#3': 207.65,
  'Ab3': 207.65,
  'A3': 220.00,
  'A#3': 233.08,
  'Bb3': 233.08,
  'B3': 246.94,
  'C4': 261.63,
  'C#4': 277.18,
  'Db4': 277.18,
  'D4': 293.66,
  'D#4': 311.13,
  'Eb4': 311.13,
  'E4': 329.63,
  'F4': 349.23,
  'F#4': 369.99,
  'Gb4': 369.99,
  'G4': 392.00,
  'G#4': 415.30,
  'Ab4': 415.30,
  'A4': 440.00,
  'A#4': 466.16,
  'Bb4': 466.16,
  'B4': 493.88,
  'C5': 523.25,
  'C#5': 554.37,
  'Db5': 554.37,
  'D5': 587.33,
  'D#5': 622.25,
  'Eb5': 622.25,
  'E5': 659.26,
  'F5': 698.46,
  'F#5': 739.99,
  'Gb5': 739.99,
  'G5': 783.99,
  'G#5': 830.61,
  'Ab5': 830.61,
  'A5': 880.00,
  'A#5': 932.33,
  'Bb5': 932.33,
  'B5': 987.77,
  'C6': 1046.50,
  'C#6': 1108.73,
  'Db6': 1108.73,
  'D6': 1174.66,
  'D#6': 1244.51,
  'Eb6': 1244.51,
  'E6': 1318.51,
  'F6': 1396.91,
  'F#6': 1479.98,
  'Gb6': 1479.98,
  'G6': 1567.98,
  'G#6': 1661.22,
  'Ab6': 1661.22,
  'A6': 1760.00,
  'A#6': 1864.66,
  'Bb6': 1864.66,
  'B6': 1975.53,
  'C7': 2093.00,
  'C#7': 2217.46,
  'Db7': 2217.46,
  'D7': 2349.32,
  'D#7': 2489.02,
  'Eb7': 2489.02,
  'E7': 2637.02,
  'F7': 2793.83,
  'F#7': 2959.96,
  'Gb7': 2959.96,
  'G7': 3135.96,
  'G#7': 3322.44,
  'Ab7': 3322.44,
  'A7': 3520.00,
  'A#7': 3729.31,
  'Bb7': 3729.31,
  'B7': 3951.07,
  'C8': 4186.01
};

var audioData;
var playingFrames = [];
var playing = false;
var audioContext = new AudioContext();

var editorDiv = document.getElementById('source');
var progressDiv = document.getElementById('progress');
var infoDiv = document.getElementById('info');
var infoInnerDiv = document.getElementById('info-inner');
var play = document.getElementById('play');

var Range = require('ace/range').Range;
var editor = ace.edit('source');
var lastMarker;

// Initialize ace
editor.getSession().setMode('ace/mode/java');
editor.setFontSize(16);
editor.setValue(
`/*
 * Click play to hear what this code sounds like or write your own class!
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`);
editor.gotoLine(1);

// Drag n drop for editor
editorDiv.ondragover = function(e) {
  e.preventDefault();
};
editorDiv.ondrop = function(e) {
  e.preventDefault();
  var dataTransfer = e.dataTransfer;
  if (dataTransfer.items) {
    if (dataTransfer.items[0].kind == "file") {
      var f = dataTransfer.items[0].getAsFile();
      loadFile(f);
    }
  } else {
    loadFile(dataTransfer.files[0]);
  }
};

// Controls
play.onclick = function(e) {
  if (!playing) {
    sendString(editor.getValue());
  }
  else {
    playing = false;
    updatePlayButtonIcon();
  }
};

// Util functions
function loadFile(f) {
  var fileReader = new FileReader();
  fileReader.readAsText(f);
  fileReader.onload = function(e) {
    editor.setValue(e.target.result);
  }
}
function updatePlayButtonIcon() {
  if (play.classList.contains('fa-cog')) {
    return;
  }
  if (playing) {
    play.classList.remove('fa-play');
    play.classList.add('fa-stop');
  }
  else {
    play.classList.add('fa-play');
    play.classList.remove('fa-stop');
  }
}
function sendString(s) {
  play.classList.remove('fa-play');
  play.classList.add('fa-cog');
  play.classList.add('fa-spin');
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      play.classList.add('fa-play');
      play.classList.remove('fa-cog');
      play.classList.remove('fa-spin');
      audioData = JSON.parse(xhr.responseText);
      console.log(audioData);
      playAudioData();
    }
  }
  xhr.open('POST', 'https://aoide-dev.herokuapp.com/process');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    data: s,
    lang: document.getElementById('lang').value
  }));
}
function openInfo() {
  infoDiv.classList.remove('info-slide-out');
  setTimeout(function() {
    infoDiv.classList.add('info-slide-in');
  }, 10);
}
function closeInfo() {
  infoDiv.classList.remove('info-slide-in');
  setTimeout(function() {
    infoDiv.classList.add('info-slide-out');
  }, 10);
}
function setProgress(val) {
  progressDiv.style.width = `${val}vw`;
}
function addLicense(projectTitle, license) {
  infoInnerDiv.innerHTML += `<h3>${projectTitle}</h3>`;
  infoInnerDiv.innerHTML += `<p style="font-size: 11px;">${license}</p>`;
}
function httpGet(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      callback(xhr.responseText);
    }
  }
  xhr.open('GET', url);
  xhr.send();
}
function highlightRangeFrom2d(start, end) {
  var lines = editor.getValue().split('\n');
  var charsSeen = 0;
  var startLine = 0;
  var startCol = 0;
  var endLine = 0;
  var endCol = 0;
  for (var line = 0; line < lines.length; line++) {
    for (var col = 0; col < lines[line].length; col++) {
      if (charsSeen == start) {
        startLine = line;
        startCol = col;
      }
      if (charsSeen == end) {
        endLine = line;
        endCol = col;
      }
      charsSeen++;
    }
    charsSeen++;
  }
  var range = new Range(startLine, startCol, endLine, endCol);
  console.log(range);
  var marker = editor.getSession().addMarker(range, 'highlight', 'background');
  return marker;
}

// Add licenses
addLicense('Font Awesome', '<a href="http://fontawesome.io/license/">http://fontawesome.io/license/</a>');
httpGet('https://raw.githubusercontent.com/ajaxorg/ace/master/LICENSE', function(str) {
  addLicense('Ace', str);
});
httpGet('https://raw.githubusercontent.com/antlr/antlr4/master/LICENSE.txt', function(str) {
  addLicense('ANTLR4', str);
});
httpGet('https://raw.githubusercontent.com/google/gson/master/LICENSE', function(str) {
  addLicense('gson', str);
});
httpGet('https://raw.githubusercontent.com/qos-ch/slf4j/master/LICENSE.txt', function(str) {
  addLicense('SLF4J', str);
});
httpGet('https://raw.githubusercontent.com/perwendel/spark/master/LICENSE', function(str) {
  addLicense('Spark', str);
});

// Play a sound
// waves: sine, square, triangle, sawtooth
// Duration in seconds
function playSound(note, wave, duration) {
  var o = audioContext.createOscillator();
  var g = audioContext.createGain();
  o.type = wave;
  o.frequency.value = noteValues[note];
  o.connect(g);
  g.connect(audioContext.destination);
  o.start(0);
  g.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);
  window.setTimeout(function () {
    o.stop();
  }, (duration + 1) * 1000);
}
function playFrame(track) {
  if (track < audioData.length && playing) {
    var longestDuration = 0;
    if (typeof lastMarker !== 'undefined') {
      editor.getSession().removeMarker(lastMarker);
    }
    if (audioData[track].codeStart != 0 || audioData[track].codeEnd != 0) {
      lastMarker = highlightRangeFrom2d(audioData[track].codeStart, audioData[track].codeEnd);
    }
    for (var i = 0; i < audioData[track].nodes.length; i++) {
      var frameData = audioData[track].nodes[i];
      playSound(frameData.key, frameData.wave, frameData.duration / 6);
      playingFrames[track] = i;
      if (frameData.duration > longestDuration) {
        longestDuration = frameData.duration;
      }
    }
    setTimeout(function() {
      playFrame(track + 1);
    }, longestDuration / 12 * 1000);
  }
  else {
    if (typeof lastMarker !== 'undefined') {
      editor.getSession().removeMarker(lastMarker);
    }
    playing = false;
    updatePlayButtonIcon();
  }
}
function playAudioData() {
  playing = true;
  updatePlayButtonIcon();
  playFrame(0);
}
