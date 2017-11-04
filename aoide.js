var audioData;
var editorDiv = document.getElementById('source');
var play = document.getElementById('play');
var editor = ace.edit('source');
editor.getSession().setMode('ace/mode/java');
editor.setFontSize(16);
editor.setValue(
`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`);
editor.gotoLine(1);

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

play.onclick = function(e) {
  sendString(editor.getValue());
}

function loadFile(f) {
  var fileReader = new FileReader();
  fileReader.readAsText(f);
  fileReader.onload = function(e) {
    editor.setValue(e.target.result);
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

      console.log(JSON.parse(xhr.responseText));
    }
  }
  xhr.open('POST', 'https://aoide-dev.herokuapp.com/process');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    file: s
  }));
}
