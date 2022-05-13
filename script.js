class CreateElements {
    funcKeys = {
      alt: false,
      control: false,
      shift: false,
      capsLock: false,
    };
  
    language = 'english';
  
    english = [
      [['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ['[', '{'], [']', '}'], ['\\', '|'], 'Delete'],
      ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', [';', ':'], ["'", '"'], 'ENTER'],
      ['Shift', '\\', 'z', 'x', 'c', 'v', 'b', 'n', 'm', [',', '<'], ['.', '>'], ['/', '?'], 'ArrowUp', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'space', 'Alt', 'Ctrl', 'ArrowLeft', 'ArrowDown', 'ArrowRight'],
    ];
  
    russian = [
      ['ё', ['1', '!'], ['2', '"'], ['3', '№'], ['4', ';'], ['5', '%'], ['6', ':'], ['7', '?'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], 'Backspace'],
      ['Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', ['\\', '/'], 'Delete'],
      ['Caps Lock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'ENTER'],
      ['Shift', '\\', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ['.', ','], 'ArrowUp', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'space', 'Alt', 'Ctrl', 'ArrowLeft', 'ArrowDown', 'ArrowRight'],
    ];
  
    body = document.body;
  
    createTextarea() {
      const textarea = document.createElement('textarea');
      textarea.id = 'textarea';
      this.body.append(textarea);
    }
  
    createDiv() {
      const div = document.createElement('div');
      return div;
    }
  
    createButtonWrapper() {
      const btnWrapper = this.createDiv();
      btnWrapper.className = 'grid-wrapper';
      btnWrapper.id = 'grid-wrapper';
      for (let i = 0; i < 5; i++) {
        const insideDiv = this.createDiv();
        insideDiv.className = `row-${i + 1}`;
        btnWrapper.append(insideDiv);
      }
      this.body.append(btnWrapper);
    }
  
    createKeyboardButton(value) {
      const keyBtn = this.createDiv();
      if (value === 'Ctrl') keyBtn.setAttribute('control', '');
      else if (value === 'Shift') keyBtn.setAttribute('shift', '');
      else if (value === 'Alt') keyBtn.setAttribute('alt', '');
      if (value.length === 1 || value === 'space') {
        keyBtn.classList.add('letter-btn');
      } else {
        keyBtn.classList.add('not-letter-btn');
      }
      keyBtn.id = value.toLowerCase();
      if (value === 'space') keyBtn.innerText = ' ';
      else if (value === 'ArrowLeft') keyBtn.innerHTML = '&#8592;';
      else if (value === 'ArrowUp') keyBtn.innerHTML = '&#8593;';
      else if (value === 'ArrowDown') keyBtn.innerHTML = '&#8595;';
      else if (value === 'ArrowRight') keyBtn.innerHTML = '&#8594;';
      else if (value !== 'space' && keyBtn.className !== 'not-letter-btn') keyBtn.innerText = value.toUpperCase();
      else keyBtn.innerText = value;
      return keyBtn;
    }
  
    createDescription(caps) {
      const desc = document.getElementsByClassName('description')[0]
      if (desc) desc.innerText = `OS - Windows\n Language Change: Shift+Alt\n Caps Lock is ${caps ? 'on' : 'off'}`;
      else {
        const description = this.createDiv();
        description.innerText = `OS - Windows\n Language Change: Shift+Alt\n Caps Lock is ${caps ? 'on' : 'off'}`;
        description.className = 'description';
        this.body.append(description);
      }
    }
  
    getCaretPos(node) {
      node.focus();
      if (document.selection) {
        const sel = document.selection.createRange();
        const clone = sel.duplicate();
        sel.collapse(true);
        clone.moveToElementText(node);
        clone.setEndPoint('EndToEnd', sel);
        return clone.text.length;
      } 
      if (node.selectionStart !== false) return node.selectionStart;
      return 0;
    }
  
    createKeyboard(language) {
      if (!language) {
        language = this[localStorage.getItem('language')];
      } else {
        localStorage.setItem('language', language)
        language = this[language]
      }
      language.forEach((set, index) => {
        let element = document.getElementsByClassName('row-1')[0];
        set.map((item) => {
          if (element.className !== `row-${index + 1}`) {
            element = document.getElementsByClassName(`row-${index + 1}`)[0];
          }
          if (Array.isArray(item)) {
            const [fst, snd] = item;
            const lilDiv = this.createDiv();
            lilDiv.innerText = snd;
            lilDiv.id = snd;
            lilDiv.className = 'mini-div';
            const btn = this.createKeyboardButton(fst);
            btn.append(lilDiv);
            return element.append(btn);
          }
          return element.append(this.createKeyboardButton(item));
        });
      });
    }
  
    changeLanguage() {
      for (let i = 1; i <= 5; i++) {
        document.getElementsByClassName(`row-${i}`)[0].innerHTML = '';
      }
      this.language = this.language === 'english' ? 'russian' : 'english';
      localStorage.setItem('language', this.language);
      this.createKeyboard();
    }
  }
  
  class EventFunctions {
    addSymbolInside(node, symbol) {
      const pos = creator.getCaretPos(node);
      const start = node.value.substring(0, pos);
      const end = node.value.substring(pos);
      node.value = `${start}${symbol}${end}`;
      node.selectionEnd = pos + 1;
    }
  
    keyDownEvent(event, creator, text) {
      const keyName = event.key;
  
      let keyDefault = keyName.toLowerCase();
      if (keyName === 'Shift') {
        creator.funcKeys.shift = event.getModifierState('Shift');
        Array.from(document.querySelectorAll('[shift]'))
          .map((item) => item.style.backgroundColor = 'rgb(129, 129, 129)');
        creator.funcKeys.shift = true;
      } else if (keyName === 'Control') {
        Array.from(document.querySelectorAll('[control]'))
          .map((item) => item.style.backgroundColor = 'rgb(129, 129, 129)');
        creator.funcKeys.control = true;
      } else {
        if (keyName === 'CapsLock') {
          creator.funcKeys.capsLock = event.getModifierState('CapsLock');
          creator.createDescription(creator.funcKeys.capsLock)
          keyDefault = 'caps lock';
        } else if (keyName === 'Alt') {
          Array.from(document.querySelectorAll('[alt]')).map((item) => item.style.backgroundColor = 'rgb(129, 129, 129)');
          creator.funcKeys.alt = true;
        } else if (keyName === ' ') keyDefault = 'space';
        else if (!document.getElementById(keyDefault)) return
        const virtBtn = document.getElementById(keyDefault).closest('.not-letter-btn')
          || document.getElementById(keyDefault).closest('.letter-btn');
        virtBtn.style.backgroundColor = virtBtn.className === 'letter-btn' ? 'rgb(187, 187, 187)' : 'rgb(129, 129, 129)';
  
        if (creator.funcKeys.shift && creator.funcKeys.alt) {
          creator.changeLanguage();
        }
      }
    }
  
    keyUpEvent(event, creator) {
      const keyName = event.key;
      let keyLow = keyName.toLowerCase();
  
      if (keyName === 'Shift') {
        creator.funcKeys.shift = event.getModifierState('Shift');
        Array.from(document.querySelectorAll('[shift]')).map((item) => item.style = '');
        creator.funcKeys.shift = false;
      } else if (keyName === 'Control') {
        Array.from(document.querySelectorAll('[control]')).map((item) => item.style = '');
        creator.funcKeys.control = false;
      } else if (keyName === 'CapsLock') {
        keyLow = 'caps lock';
        document.getElementById(keyLow).style = '';
      } else if (keyName === 'Alt') {
        Array.from(document.querySelectorAll('[alt]')).map((item) => item.style = '');
        creator.funcKeys.alt = false;
      } else if (keyName === ' ') document.getElementById('space').style = '';
      else {
        if (!document.getElementById(keyLow)) return
        const virtBtn = document.getElementById(keyLow).closest('.not-letter-btn')
          || document.getElementById(keyLow).closest('.letter-btn');
        virtBtn.style = '';
      }
    }
  
    clickEvent(event, creator, text) {
      text.focus();
      const target = event.target.closest('.letter-btn') || event.target.closest('.not-letter-btn');
      if (target) {
        if (target.id === 'space') {
          this.addSymbolInside(text, '\u00a0');
        } else if (target.className === 'letter-btn') {
          if (target.children.length === 1) {
            const [par, , space] = target.innerText;
            if (creator.funcKeys.shift || creator.funcKeys.capsLock) {
              this.addSymbolInside(text, space);
            } else this.addSymbolInside(text, par);
          } else if (creator.funcKeys.shift || creator.funcKeys.capsLock) {
            this.addSymbolInside(text, target.innerText);
          } else this.addSymbolInside(text, target.innerText.toLowerCase());
        } else if (target.id === 'enter') this.addSymbolInside(text, '\n');
        else if (target.id === 'tab') this.addSymbolInside(text, '\t');
        else if (target.id === 'caps lock') {
          creator.funcKeys.capsLock = creator.funcKeys.capsLock === true ? false : true
          creator.createDescription(creator.funcKeys.capsLock)
        }
        else if (target.id === 'arrowleft') text.selectionEnd -= 1;
        else if (target.id === 'arrowright') text.selectionStart += 1;
        else if (target.id === 'arrowup') text.selectionEnd = 0;
        else if (target.id === 'arrowdown') text.selectionStart = text.value.length;
        else if (target.id === 'ctrl') creator.funcKeys.control = true;
        else {
          const dataArr = text.value.split('');
          const pos = creator.getCaretPos(text);
          if (target.id === 'backspace') {
            dataArr.splice(pos - 1, 1);
            text.value = dataArr.join('');
            text.selectionEnd = pos - 1;
          } else if (target.id === 'delete') {
            dataArr.splice(pos, 1);
            text.value = dataArr.join('');
            text.selectionEnd = pos;
          }
        }
      }
     
    }
  }
  
  const creator = new CreateElements();
  const eventFuncs = new EventFunctions();
  
  creator.createTextarea();
  const text = document.getElementById('textarea');
  creator.createButtonWrapper();
  const localLang = localStorage.getItem('language')
  creator.createKeyboard(localLang ? localLang : creator.language);
  creator.createDescription();
  const wrapper = document.getElementById('grid-wrapper');
  
  text.addEventListener('keydown', (event) => eventFuncs.keyDownEvent(event, creator, text));
  text.addEventListener('keyup', (event) => eventFuncs.keyUpEvent(event, creator));
  wrapper.addEventListener('click', (event) => eventFuncs.clickEvent(event, creator, text));
  