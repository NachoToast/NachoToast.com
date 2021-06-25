class WhitelistManager {
  static headerPresets = {
    pendingWhitelistApplication: [
      'Discord',
      'Minecraft',
      'Java',
      'Applied',
      '✅',
      '❌',
    ],
    approvedWhitelistApplication: [
      'Discord',
      'Minecraft',
      'Java',
      'Applied',
      'Accepted',
      'Accepted By',
    ],
    rejectedWhitelistApplication: [
      'Discord',
      'Minecraft',
      'Java',
      'Applied',
      'Accepted',
      'Accepted By',
    ],
    other: ['Discord', 'Minecraft', 'Java', 'Status'],
  };

  static functionalHeaders = [
    'Discord',
    'Minecraft',
    'Java',
    'Applied',
    'Accepted',
    'Accepted By',
    'Status',
  ];

  sortState = {
    field: null,
    descending: true,
    status: null,
    page: 0,
    perPage: 20,
  };

  totalResults = 0;

  constructor(table, statusSelect, page, maxPage, perPage) {
    this.table = table;
    this.statusSelect = statusSelect;

    this.page = page;
    this.maxPage = maxPage;
    this.perPage = perPage;

    statusSelect.oninput = () => this.changeShowType();
    page.oninput = () => this.changePage(true);
    maxPage.oninput = () => this.changePage(true);
    perPage.oninput = () => this.changePage(true);

    this.changeShowType(true);
  }

  changePage(triggerQuery = false) {
    const maxPage = Math.ceil(this.totalResults / parseInt(this.perPage.value));
    this.maxPage.innerHTML = maxPage;

    if (parseInt(this.page.value) < 1 || parseInt(this.page.value) > maxPage) {
      this.page.value = 1;
    }

    if (
      parseInt(this.page.value) == this.sortState.page + 1 &&
      this.perPage.value == this.sortState.perPage
    ) {
      return;
    }

    this.sortState.page = parseInt(this.page.value) - 1;
    this.sortState.perPage = this.perPage.value;

    this.page.max = maxPage;

    if (triggerQuery) {
      this.changeShowType();
    }
  }

  changeShowType(overWriteSortState = false) {
    this.table.innerHTML = '';
    this.sortState.status = this.statusSelect.value;

    if (overWriteSortState) {
      this.sortState.field =
        WhitelistManager.headerPresets[this.statusSelect.value][0];
      this.sortState.descending = true;
    }

    let tr = document.createElement('tr');

    for (
      let i = 0,
        len = WhitelistManager.headerPresets[this.statusSelect.value].length;
      i < len;
      i++
    ) {
      const th = document.createElement('th');
      th.innerHTML = WhitelistManager.headerPresets[this.statusSelect.value][i];
      if (th.innerHTML === this.sortState.field) {
        if (this.sortState.descending) {
          th.innerHTML += ' ▼';
        } else {
          th.innerHTML += ' ▲';
        }
      }
      th.classList.add('noselect');
      if (
        WhitelistManager.functionalHeaders.indexOf(
          th.innerHTML.substring(0, th.innerHTML.length - 2)
        ) !== -1 ||
        WhitelistManager.functionalHeaders.indexOf(th.innerHTML) !== -1
      ) {
        th.onclick = () => {
          if (
            this.sortState.field ===
            th.innerHTML.substring(0, th.innerHTML.length - 2)
          ) {
            this.sortState.descending = !this.sortState.descending;
          } else {
            this.sortState.field = th.innerHTML;
            this.sortState.descending = true;
          }
          this.changeShowType();
        };
      }
      tr.appendChild(th);
    }

    this.table.appendChild(tr);

    this.queryDB();
  }

  async queryDB() {
    this.table.style.cursor = 'wait';
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = async (e) => {
      if (xhr.readyState === 4) {
        await this.getResults(e.target.response);
        this.table.style.cursor = 'default';
        this.changePage();
      }
    };

    xhr.open('POST', 'mc/whitelist_get.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(this.sortState));
  }

  async getResults(response) {
    return new Promise(async (resolve) => {
      try {
        var parsedResponse = JSON.parse(response);
      } catch (error) {
        console.warn('Failed to parse response:', response);
        resolve();
        return;
      }
      await this.processResults(parsedResponse);
      resolve();
    });
  }

  processResults(users) {
    return new Promise((resolve) => {
      this.totalResults = users.pop();
      // preformatting
      const now = Math.round(new Date().getTime() / 1000);
      for (let i = 0, len = users.length; i < len; i++) {
        users[i][2] = users[i][2] === 1 ? 'Yes' : 'No';

        users[i][3] =
          new Date(1000 * users[i][3]).toLocaleDateString() +
          `<span style='color: gray'> (${Math.ceil(
            (now - users[i][3]) / 86400
          )}d)</span>`;

        if (users[i][4] === null) {
        } else {
          users[i][4] =
            new Date(1000 * users[i][4]).toLocaleDateString() +
            `<span style='color: gray'> (${Math.ceil(
              (now - users[i][4]) / 86400
            )}d)</span>`;
        }
      }

      // start table stuff
      const visibleHeaders = [];
      const buttonShow =
        this.statusSelect.value === 'pendingWhitelistApplication';

      for (
        let i = 0,
          len = WhitelistManager.headerPresets[this.statusSelect.value].length;
        i < len;
        i++
      ) {
        const headerIndex = WhitelistManager.functionalHeaders.indexOf(
          WhitelistManager.headerPresets[this.statusSelect.value][i]
        );
        if (headerIndex !== -1) {
          visibleHeaders.push(headerIndex);
        }
      }

      for (
        let i = 0, len = users.length, len2 = visibleHeaders.length;
        i < len;
        i++
      ) {
        let tr = document.createElement('tr');
        for (let j = 0; j < len2; j++) {
          let td = document.createElement('td');
          td.innerHTML = users[i][visibleHeaders[j]];
          tr.appendChild(td);
        }

        if (buttonShow) {
          let td = document.createElement('td');
          let td2 = document.createElement('td');
          td.innerHTML = '✅';
          td2.innerHTML = '❌';
          td.classList.add('button', 'accept', 'noselect');
          td2.classList.add('button', 'reject', 'noselect');
          td.onclick = () =>
            this.acceptReject(users[i][0], 'whitelist', 'add', users[i][1]);
          td2.onclick = () =>
            this.acceptReject(users[i][0], 'whitelist', 'reject', users[i][1]);
          tr.appendChild(td);
          tr.appendChild(td2);
        }

        this.table.appendChild(tr);
      }

      resolve();
    });
  }

  acceptReject(discordID, command, action, username) {
    //this.changeShowType();
    queue.add({
      command: command,
      action: action,
      target: discordID,
      targetName: username,
    });
  }
}

class QueueManager {
  queue = [];
  frozen = false;
  constructor(header, list, button) {
    this.header = header;
    this.list = list;
    this.button = button;

    this.header.innerHTML = `Queue (0)`;
    this.button.disabled = true;
    this.list.innerHTML = '';
    this.button.onclick = () => this.process();
  }

  add(obj) {
    if (this.frozen) {
      return;
    }
    obj.id = `${obj.command}${obj.action}${obj.target}`;

    if (this.queue.some((e) => e.id === obj.id)) {
      // console.log(`Skipped duplicate add:`, obj);
      return;
    }

    this.queue.push(obj);

    let p = document.createElement('p');
    p.innerHTML = `${obj.command[0].toUpperCase() + obj.command.substring(1)} ${
      obj.action[0].toUpperCase() + obj.action.substring(1)
    } ${obj.targetName}`;
    p.onclick = () => {
      this.remove(obj, p);
    };

    this.list.appendChild(p);
    this.check();
  }

  remove(obj, ele) {
    if (this.frozen) {
      return;
    }
    this.queue.splice(this.queue.indexOf(obj), 1);
    this.list.removeChild(ele);
    this.check();
  }

  check() {
    this.header.innerHTML = `Queue (${this.queue.length})`;
    if (this.queue.length < 1) {
      this.button.disabled = true;
    } else {
      this.button.disabled = false;
    }
  }

  async process() {
    if (this.frozen) {
      return;
    }
    if (this.queue.length < 1) {
      this.button.innerHTML = `Queue is Empty!`;
      this.button.disabled = true;
      setTimeout(() => (this.button.innerHTML = `Process Queue`), 1000);
      return;
    }

    this.button.innerHTML = `Processing Queue`;
    this.button.classList.add('processing');
    this.frozen = true;

    const response = await this.send();
    console.log(response);

    this.button.innerHTML = `Done!`;
    this.button.classList.add('done');

    this.queue = [];
    this.list.innerHTML = '';
    this.header.innerHTML = `Queue (0)`;

    whitelist.changeShowType();

    setTimeout(() => {
      this.button.classList.remove('done');
      this.button.classList.remove('processing');
      this.button.innerHTML = 'Process Queue';
      this.button.disabled = true;
      this.frozen = false;
    }, 2000);
  }

  async send() {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
          resolve(e.target.response);
        }
      };

      xhr.open('POST', 'mc/whitelist_modify.php', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(this.queue));
    });
  }
}

const queue = new QueueManager(
  document.getElementById('queueHeader'),
  document.getElementById('queueList'),
  document.getElementById('queueGo')
);

const whitelist = new WhitelistManager(
  document.getElementById('whitelistTable'),
  document.getElementById('statusSelect'),
  document.getElementById('page'),
  document.getElementById('maxPage'),
  document.getElementById('perPage')
);
