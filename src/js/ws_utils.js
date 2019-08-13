const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { nativeImage } = require('electron');
const qr = require('qr-image');
const config = require('./ws_config');
const fnv = require('fnv-plus');
const GCM = require('node-crypto-gcm').GCM;

const ADDRESS_REGEX_STR = `^${config.addressPrefix}(?=[aA-zZ0-9]*$)(?:.{${config.addressLength - config.addressPrefix.length}}|.{${config.integratedAddressLength - config.addressPrefix.length}})$`;
const ADDRESS_REGEX = new RegExp(ADDRESS_REGEX_STR);
const PAYMENT_ID_REGEX = new RegExp(/^([aA-zZ0-9]{64})$/);
const SECRET_KEY_REGEX = new RegExp(/^[aA-zZ0-9]{64}$/);
const MNEMONIC_SEED_REGEX = new RegExp(/^[aA-zZ]+(?!.*  )[a-zA-Z0-9 ]*$/);

/***** * DOM util *****/
exports.triggerEvent = (el, type) => {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
};

function addEvent(el, type, handler) {
    el.addEventListener(type, handler);
}

exports.liveEvent = (selector, event, callback, context) => {
    addEvent(context || document, event, function (e) {
        var qs = (context || document).querySelectorAll(selector);
        if (qs) {
            var el = e.target || e.srcElement, index = -1;
            while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) el = el.parentElement;
            if (index > -1) callback.call(el, e);
        }
    });
};

exports.selectText = (el, win) => {
    win = win || window;
    var doc = win.document, sel, range;
    if (win.getSelection && doc.createRange) {
        sel = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (doc.body.createTextRange) {
        range = doc.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
};

exports.clearChild = (parentEl) => {
    while (parentEl.firstChild) {
        parentEl.removeChild(parentEl.firstChild);
    }
};

exports.innerHTML = (parentEl, html) => {
    var newEl = parentEl.cloneNode(false);
    newEl.innerHTML = html;
    parentEl.parentNode.replaceChild(newEl, parentEl);
};

exports.showToast = (msg, duration, elId) => {
    duration = duration || 3500;
    elId = elId || 'belekok';    
    let blekok = document.getElementById(elId);

    if (!msg.length) {
        try { clearTimeout(window.TOASTT); } catch (_) { }
        blekok.classList.add('off');
        return;
    }

    let openedDialog = document.querySelector('dialog[open]');

    if (typeof window.TOASTT !== 'undefined' && window.TOASTT !== null) {
        try {
            if (openedDialog) {
                clearTimeout(window.TOASTBD);
                openedDialog.classList.remove('dialog-alerted');
            }
            clearTimeout(window.TOASTT);
            blekok.classList.add('off');
        } catch (e) { }
    }

    if (openedDialog) {
        openedDialog.classList.add('dialog-alerted');
        window.TOASTBD = setTimeout(() => {
            openedDialog.classList.remove('dialog-alerted');
        }, duration + 100);
    }

    blekok.innerText = msg;
    blekok.classList.remove('off');
    window.TOASTT = setTimeout(function () {
        blekok.classList.add('off');
    }, duration);
};

/*****  MISC util ****/
exports.arrShuffle = (arr, method) => {
    method = method || 0;
    if (method === 1) {
        var cidx = arr.length, tmp, ridx;
        while (0 !== cidx) {
            ridx = Math.floor(Math.random() * cidx);
            cidx -= 1;
            tmp = arr[cidx];
            arr[cidx] = arr[ridx];
            arr[ridx] = tmp;
        }
        return arr;
    }

    return arr.map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);
};

exports.mergeObj = (obj, src) => {
    Object.keys(src).forEach(function (key) { obj[key] = src[key]; });
    return obj;
};

exports.uniqueObjArr = (objArr, key) => {
    key = key || 'id';
    return [...new Set(objArr.map(item => item[key]))];
};

exports.diffObjArr = (objArr1, ObjArr2, key) => {
    let objArrKeys = objArr1.map((item) => { return item[key]; });
    let diff = ObjArr2.filter((item) => {
        return objArrKeys.indexOf(item[key]) === -1;
    });
    return diff;
};

exports.objInArray = (targetObjArr, objToSearch, objKey) => {
    let pos = targetObjArr.map((e) => { return e[objKey]; }).indexOf(objToSearch[objKey]);
    return pos !== -1;
};

exports.b2sSum = (inputStr) => {
    if (!inputStr) return false;
    return crypto.createHash('blake2s256')
        .update(inputStr)
        .digest('hex');
};

exports.fnvhash = (inputstr) => {
    if (!inputstr) return false;
    return fnv.hash(inputstr, 64).str();
};

exports.genQrDataUrl = (inputStr) => {
    if (!inputStr) return '';

    let qrtmp = qr.imageSync(
        inputStr, { type: 'png' }
    );
    let nImg = nativeImage.createFromBuffer(qrtmp);
    if (nImg.isEmpty()) return '';
    return nImg.toDataURL();
};

let decimalAdjust = (type, value, exp) => {
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
};

exports.validateAddress = (address) => {
    return ADDRESS_REGEX.test(address);
};

exports.validatePaymentId = (paymentId) => {
    if (!paymentId) return true; // true allow empty
    return PAYMENT_ID_REGEX.test(paymentId);
};

exports.validateSecretKey = (key) => {
    return SECRET_KEY_REGEX.test(key);
};

exports.validateMnemonic = (seed) => {
    if (!seed) return false;

    if (!MNEMONIC_SEED_REGEX.test(seed)) return false;

    if (seed.split(' ').length !== 25) return false;

    return true;
};

exports.amountForMortal = (amount) => {
    if (!config.decimalDivisor) return amount;
    let decimalPlaces = config.decimalPlaces || 2;
    return (amount / config.decimalDivisor).toFixed(decimalPlaces);
};

exports.amountForImmortal = (amount) => {
    if (!config.decimalDivisor) return amount;
    let da = decimalAdjust("round", parseFloat(amount), -(config.decimalPlaces));
    return parseInt(da * config.decimalDivisor);
};

exports.isFileExist = (filePath) => {
    if (!filePath) return false;
    return fs.existsSync(filePath);
};

exports.isWritableDirectory = (filePath) => {
    if (!filePath) return false;
    try {
        fs.accessSync(filePath, fs.constants.W_OK);
    } catch (e) {
        return false;
    }
    let stats = fs.statSync(filePath);
    return stats.isDirectory();

};

exports.isPathWriteable = (filePath) => {
    if (!filePath) {
        return;
    }
    try {
        fs.accessSync(filePath, fs.constants.W_OK);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

exports.isRegularFileAndWritable = (filePath) => {
    if (!filePath) return;
    try {
        fs.accessSync(filePath, fs.constants.W_OK);
    } catch (e) {
        return false;
    }

    let stats = fs.statSync(filePath);
    return stats.isFile();
};

exports.normalizeWalletFilename = (rawFilename) => {
    if (!rawFilename) return '';
    const walletExt = config.walletFileDefaultExt;
    let ext = path.extname(rawFilename.trim());
    if (ext.endsWith(`.${walletExt}`)) return rawFilename;
    if (ext.endsWith('.')) return `${rawFilename}${walletExt}`;
    return `${rawFilename}.${walletExt}`;
};

exports.validateWalletPath = (fullpath, defaultDir, isExisting) => {
    return new Promise((resolve, reject) => {
        fullpath = fullpath || '';
        isExisting = isExisting || false;
        defaultDir = defaultDir ? path.resolve(defaultDir) : path.resolve('.');
        if (!fullpath.length) return reject(new Error('Wallet file path can not be left blank'));
        const ERROR_DEFAULT = 'Please specify a full path to the wallet file and make sure you have a proper write permission to the file';
        fullpath = path.resolve(fullpath);

        fullpath = this.normalizeWalletFilename(fullpath);

        try {
            let stats = fs.statSync(fullpath);
            if (stats.isDirectory()) {
                return reject(new Error('2' + ERROR_DEFAULT));
            }
        } catch (e) {
            console.log(e.message);
        }

        if (isExisting) {
            try {
                fs.accessSync(fullpath);
            } catch (e) {
                return reject(new Error(ERROR_DEFAULT));
            }
        }
        let finalPath = path.normalize(fullpath);
        return resolve(finalPath);
    });
};

exports.loadPrivateAddressBook = (path, password) => {
    let rawcontents = '';
    try {
        rawcontents = fs.readFileSync(path, 'utf8');
    } catch (e) {
        return new Error('Unable to load specified file');
    }

    let jdata = null;
    try {
        jdata = JSON.parse(rawcontents);
    } catch (e) {
        return new Error("Invalid or broken address book file");
    }

    if (!jdata.hasOwnProperty('name') || !jdata.hasOwnProperty('data')) {
        return new Error("Invalid or broken address book file");
    }
    if (typeof jdata.name !== "string" || typeof jdata.data !== "string") {
        return new Error("Invalid or broken address book file");
    }
    let pref = '$w$s$a$b';
    if (!jdata.data.startsWith(pref)) {
        return new Error("Invalid or broken address book file");
    }

    let gcm = new GCM(password, config.addressBookCipherConfig);
    let abdata = gcm.decrypt(jdata.data.replace(pref, ''));
    if (null === abdata) {
        return new Error("Invalid password");
    }

    return {
        name: jdata.name,
        data: JSON.parse(abdata)
    };
};

exports.savePrivateAddressBook = (path, jsonData, password) => {
    let gcm = new GCM(password, config.addressBookCipherConfig);
    let pref = '$w$s$a$b';
    let edata = gcm.encrypt(jsonData.data);
    jsonData.data = `${pref}${edata}`;
    fs.writeFileSync(path, JSON.stringify(jsonData));
};