class UploadHandler {
  label; // label for form, to show feedback messages and detect file drops
  input; // file input, to submit files with form
  form; // form, to create form data (post body) from
  feedback; // to contain table of results (which uploads were successful and not successful)

  constructor(labelElement, inputElement, formElement, feedbackElement) {
    this.label = labelElement;
    this.input = inputElement;
    this.form = formElement;
    this.feedback = feedbackElement;

    window.ondragover = (e) => {
      e.preventDefault();
      this.label.classList.add('active');
      return false;
    };

    window.ondragleave = () => this.label.classList.remove('active');
    window.ondragend = () => this.label.classList.remove('active');

    this.label.ondrop = (e) => {
      e.preventDefault();
      this.input.files = e.dataTransfer.files;
      this.sendMonkeys();
      return false;
    };

    this.input.onchange = () => this.sendMonkeys();
  }

  sendMonkeys() {
    // length check
    if (this.input.files.length > 50) {
      console.log('Stopped attempt to send > 50 files.');
      this.feedback.style.display = 'block';
      this.feedback.innerHTML = 'Please limit yourself to 50 monkeys.';
      return;
    }

    console.log(`Sending ${this.input.files.length} monkey(s)!`);

    // xml http request construction
    const request = new XMLHttpRequest();
    const formData = new FormData(this.form);

    request.onreadystatechange = (e) => {
      if (request.readyState === 4) {
        this.monkeyFeedback(e.target.status, e.target?.response);
      }
    };

    request.open('POST', 'mAPI/upload.php', true);
    request.send(formData);
  }

  monkeyFeedback(responseCode = 404, response = undefined) {
    // unknown error handling
    if (
      responseCode !== 200 ||
      response === undefined ||
      typeof response !== 'string'
    ) {
      this.label.innerText = `Error ${responseCode}`;
      if (response !== undefined) {
        console.log(response);
      }
      return;
    }

    // known error handling
    if (response[0] !== '[') {
      // '[' indicates the expected 2 dimensional monkey array

      if (response[0] == '<') {
        // '<' indicates start of html element, commonly used in php error messages
        console.log(response);
        this.label.innerText = `PHP error occured, check console.`;
      } else {
        this.label.innerText = response;
      }
      return;
    }

    // valid response processing
    const feedback = JSON.parse(response);
    const validMonkeys = feedback[0] ?? '';
    const invalidMonkeys = feedback[1] ?? '';

    this.feedback.innerHTML = '';
    this.feedback.style.display = 'block';

    let tipFeedback = document.createElement('p');
    tipFeedback.innerText = `${validMonkeys.length} of ${
      validMonkeys.length + invalidMonkeys.length
    } monkeys were successfully uploaded.`;
    this.feedback.appendChild(tipFeedback);

    // make more detailed output
    if (validMonkeys.length > 0) {
      this.feedback.appendChild(
        UploadHandler.monkeyFeedbackTable(
          'Successes',
          validMonkeys.map((e) => e.name)
        )
      );
    }
    if (invalidMonkeys.length > 0) {
      this.feedback.appendChild(
        UploadHandler.monkeyFeedbackTable('Failures', invalidMonkeys)
      );
    }

    document.body.scrollTo(0, document.body.scrollHeight);
  }

  // makes "table" out of monkey result array
  static monkeyFeedbackTable(titleText = 'Default', monkeyArray = []) {
    let feedbackDiv = document.createElement('div');

    let h = document.createElement('h1');
    h.innerText = `${titleText} (${monkeyArray.length})`;
    feedbackDiv.appendChild(h);

    for (let i = 0, len = monkeyArray.length; i < len; i++) {
      let p = document.createElement('p');
      p.innerText = monkeyArray[i];
      feedbackDiv.appendChild(p);
    }

    return feedbackDiv;
  }
}

class MonkeyManager {
  imageElement;
  metaElement;
  verifyElement;

  initialEnable = false;

  constructor(
    imageElement, // display monkey image
    metaElement, // display metadata
    verifyElement = null, // checkbox input to toggle verification mode
    verifyElementDiv = null // container for above checkbox
  ) {
    this.imageElement = imageElement;
    this.metaElement = metaElement;
    this.verifyElement = verifyElement;

    this.getMonkey();

    this.imageElement.onclick = () => this.getMonkey();

    if (verifyPossible) {
      verifyElementDiv.style.display = 'block';
      this.verifyElement.onchange = () => this.getMonkey();
    }
  }

  getMonkey() {
    const request = new XMLHttpRequest();
    let url;
    if (this.verifyElement.checked) {
      url = 'mAPI/api?unverified';
    } else {
      url = 'mAPI/api';
    }

    request.onreadystatechange = (e) => {
      if (request.readyState === 4) {
        this.displayMonkey(e.target.status, e.target?.response);
      }
    };

    request.open('GET', url);
    request.send();
  }

  displayMonkey(responseCode = 404, response = undefined) {
    this.imageElement.src = '';
    this.metaElement.innerHTML = '';

    // unknown error handling
    if (
      responseCode !== 200 ||
      response === undefined ||
      typeof response !== 'string'
    ) {
      this.metaElement.innerHTML = `Error ${responseCode}`;
      if (response !== undefined) {
        console.log(response);
      }
      return;
    }

    // known error handling
    if (response[0] !== '{') {
      // '{' indicates the expected monkey data object

      if (response[0] == '<') {
        // '<' indicates start of html element, commonly used in php error messages
        console.log(response);
        this.metaElement.innerHTML = `PHP error occured, check console.`;
      } else {
        this.metaElement.innerHTML = response;
      }
      return;
    }

    // valid response processing
    const feedback = JSON.parse(response);
    this.imageElement.src = feedback.image;
    this.metaElement.appendChild(MonkeyManager.makeMeta(feedback));
  }

  static makeMeta(data) {
    const metaData = document.createElement('p');

    // upload info
    const daysAgo = Math.ceil(
      (new Date().getTime() / 1000 - data.uploaded) / 86400
    );
    metaData.innerHTML += `Uploader: ${data.uploader}<br>${new Date(
      data.uploaded * 1000
    ).toLocaleDateString()} (${daysAgo} day${daysAgo > 1 ? 's' : ''} ago)`;

    // verification info
    metaData.innerHTML += `<br>Verifier: ${data.verifier}`;

    // file info
    metaData.innerHTML += `<br>${data.size}KB`;

    // misc
    metaData.innerHTML += `<br>Pool: ${
      data.monkeyCount
    } <br>${data.took.toExponential(2)}s`;

    return metaData;
  }

  toggleVerify() {
    // invert state, get new monkey
    this.verifyElement.checked = !this.verifyElement.checked;
    this.getMonkey();

    // first toggle check
    if (this.verifyElement.checked && !this.initialEnable) {
      this.initialEnable = true;
      console.log(
        '%cVerification Help:\n%cNumpad 1 - Verify\n%cNumpad 2 - Skip\n%cNumpad 3 - Reject',
        'font-size: 20px',
        'color: lightgreen',
        'color: lightblue',
        'color: lightcoral'
      );
    }
  }

  sendVerify(mode = 'Skip') {
    if (!this.verifyElement.checked) return;

    const currentMonkey = this.imageElement.src.slice(
      this.imageElement.src.indexOf('database/') + 9
    );
    console.log(`%c${mode} ${currentMonkey}`, 'color: gray');

    // request construction
    const request = new XMLHttpRequest();
    const body = JSON.stringify({
      name: currentMonkey,
      action: mode,
    });

    request.onreadystatechange = (e) => {
      if (request.readyState === 4) {
        // unknown error handling
        if (
          e.target.status !== 200 ||
          e.target?.response === undefined ||
          typeof e.target.response !== 'string'
        ) {
          this.metaElement.innerHTML = `Error ${e.target.status}`;
          if (e.target?.response !== undefined) {
            console.log(e.target.response);
          }
        } else {
          // known error handling
          if (!e.target.response.startsWith(mode)) {
            this.metaElement.innerHTML = e.target.response;
            this.imageElement.src = '';
          } else {
            // show feedback
            console.log(e.target.response);

            // get next monkey
            this.getMonkey();
          }
        }
      }
    };

    request.open('POST', 'mAPI/verify', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(body);
  }
}

const DragDrop = new UploadHandler(
  document.getElementById('uploadMonkeyLabel'),
  document.getElementById('uploadMonkeyInput'),
  document.getElementById('uploadMonkeyForm'),
  document.getElementById('uploadMonkeyOutput')
);

const Monkey = new MonkeyManager(
  document.getElementById('outputMonkeyImage'),
  document.getElementById('outputMonkeyMeta'),
  document.getElementById('verifyingMonkeys'),
  document.getElementById('verify')
);

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    Monkey.getMonkey();
  } else if (verifyPossible) {
    if (e.code === 'KeyV') {
      e.preventDefault();
      Monkey.toggleVerify();
    } else if (e.code === 'Numpad1') {
      e.preventDefault();
      Monkey.sendVerify('Accept');
    } else if (e.code === 'Numpad2') {
      // skip
      e.preventDefault();
      Monkey.getMonkey();
    } else if (e.code === 'Numpad3') {
      e.preventDefault();
      Monkey.sendVerify('Reject');
    }
  }
});
