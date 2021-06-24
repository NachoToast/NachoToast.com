class ApplicationManager {
  #form;
  #idE; // html input elements
  #nameE;
  #emailE;
  #idL; // html label elements
  #nameL;
  #emailL;
  #schedule; // simple rate limiting
  #checked = {
    id: null,
    name: null,
    email: null,
  };
  #submittable = false;
  #submitButton;

  constructor(
    formElement,
    idElement,
    nameElement,
    emailElement,
    idLabel,
    nameLabel,
    emailLabel,
    submitButton
  ) {
    this.#form = formElement;
    this.#idE = idElement;
    this.#nameE = nameElement;
    this.#emailE = emailElement;
    this.#idL = idLabel;
    this.#nameL = nameLabel;
    this.#emailL = emailLabel;
    this.#submitButton = submitButton;

    idElement.oninput = () => this.#processInputs();
    nameElement.oninput = () => this.#processInputs();
    emailElement.oninput = () => this.#processInputs();

    this.#processInputs();
  }

  async #processInputs() {
    this.#submittable = false;
    this.#submitButton.style.display = 'none';
    clearTimeout(this.#schedule);
    const validID = await this.#handleDiscordID();
    const validName = await this.#handleName();
    const validEmail = await this.#handleEmail();

    if (!validID && !validName && !validEmail) {
      return;
    }

    this.#schedule = setTimeout(() => {
      this.#checkDB(validID, validName, validEmail);
    }, 1000);

    // update recorded checks
    this.#checked.id = this.#idE.value;
    this.#checked.name = this.#nameE.value;
    this.#checked.email = this.#emailE.value;
  }

  async #checkDB(localID, localName, localEmail) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState === 4) {
        const res = JSON.parse(e.target.response);
        // update id
        if (localID && res.discordID) {
          // valid both server and client side
          this.#idL.innerHTML = `<span style='color: lightgreen'>✅ Discord ID</span>`;
        } else if (localID && !res.discordID) {
          // not valid server side
          this.#idL.innerHTML = `<span style='color: lightcoral'>❌ Taken!</span>`;
        }

        // update name
        if (localName && res.mcUsername) {
          // valid both server and client side
          this.#nameL.innerHTML = `<span style='color: lightgreen'>✅ Username</span>`;
        } else if (localName && !res.mcUsername) {
          // not valid server side
          this.#nameL.innerHTML = `<span style='color: lightcoral'>❌ Taken!</span>`;
        }

        // update email
        if (localEmail && res.email) {
          // valid both server and client side
          this.#emailL.innerHTML = `<span style='color: lightgreen'>✅ Email</span>`;
        } else if (localEmail && !res.email) {
          // not valid server side
          this.#emailL.innerHTML = `<span style='color: lightcoral'>❌ Taken!</span>`;
        }

        // final checks
        if (
          localID &&
          localName &&
          localEmail &&
          res.discordID &&
          res.mcUsername &&
          res.email
        ) {
          this.#submittable = true;
          this.#submitButton.style.display = 'block';
        }
      }
    };

    xhr.open('POST', 'mc/whitelist_check.php', true);
    const wasDisabled = this.#idE.disabled;

    // disabled elements aren't sent in form data
    if (wasDisabled) {
      this.#idE.disabled = false;
    }
    xhr.send(new FormData(this.#form));
    if (wasDisabled) {
      this.#idE.disabled = true;
    }
  }

  #handleDiscordID(id = this.#idE.value) {
    return new Promise((resolve) => {
      //this.#idL.innerHTML = `Discord ID`;
      if (id.length < 1) {
        resolve(false);
      } else if (id.length > 18 || id.length < 17 || !id.match(/^[0-9]*$/)) {
        this.#idL.innerHTML = `<span style='color: lightcoral'>❌ Invalid Discord ID</span>`;
        resolve(false);
      } else {
        if (this.#checked.id !== id) {
          this.#idL.innerHTML = `<span style='color: rgb(255, 238, 139)'>⌛ Checking ID</span>`;
        }
        resolve(true);
      }
    });
  }

  #handleName(name = this.#nameE.value) {
    return new Promise((resolve) => {
      //this.#nameL.innerHTML = `Minecraft Username`;
      if (name.length < 1) {
        resolve(false);
      } else if (name.length > 16) {
        this.#nameL.innerHTML = `<span style='color: lightcoral'>❌ Invalid Username</span>`;
        resolve(false);
      } else {
        if (this.#checked.name !== name) {
          this.#nameL.innerHTML = `<span style='color: rgb(255, 238, 139)'>⌛ Checking Username</span>`;
        }
        resolve(true);
      }
    });
  }

  #handleEmail(email = this.#emailE.value) {
    return new Promise((resolve) => {
      //this.#emailL.innerHTML = `Email`;
      if (email.length < 1) {
        resolve(false);
      } else if (email.length > 128 || !email.match(/\S+@\S+\.\S+/)) {
        this.#emailL.innerHTML = `<span style='color: lightcoral'>❌ Invalid Email</span>`;
        resolve(false);
      } else {
        if (this.#checked.email !== email) {
          this.#emailL.innerHTML = `<span style='color: rgb(255, 238, 139)'>⌛ Checking Email</span>`;
        }
        resolve(true);
      }
    });
  }

  submit() {
    if (this.#submittable) {
      this.#submitButton.innerHTML = `Submitting...`;
      const wasDisabled = this.#idE.disabled;

      // disabled elements aren't sent in form data
      if (wasDisabled) {
        this.#idE.disabled = false;
      }
      this.#form.submit();
      if (wasDisabled) {
        this.#idE.disabled = true;
      }
    } else {
      console.log('%cNot allowed to submit!', 'color: lightcoral');
      this.#submitButton.disabled = true;
    }
  }
}

const Application = new ApplicationManager(
  document.getElementById('mainForm'),
  document.getElementById('discordID'),
  document.getElementById('mcUsername'),
  document.getElementById('email'),
  document.getElementById('discordIDL'),
  document.getElementById('mcUsernameL'),
  document.getElementById('emailL'),
  document.getElementById('submitForm')
);

function doSubmit() {
  Application.submit();
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') Application.submit();
});
