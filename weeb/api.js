function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.status == 200) {
                console.log(this.status);
                console.log(this.responseText);
            }
            else if (this.status == 401) {
                console.log(this.status);
            }
            else console.log('idk');
        }
    };
    xhttp.open("GET", "http://localhost/weeb/api?toaster=secret_???", true); // get is faster than post anyways, and shouldn't leak secret since only via nachobot.
    xhttp.send();
}

//loadDoc();