//const path = require('path');
//const remote = require('electron').remote;
const Store = require('electron-store');
const settings = new Store({ name: 'Settings' });
const config = require('./ws_config');

const WS_VERSION = settings.get('version', 'unknown');
const DEFAULT_TITLE = `${config.appName} ${WS_VERSION} - ${config.appDescription}`;
const SESSION_KEY = 'wlshell';

//const IS_DEBUG = remote.getGlobal('wsession').debug;
//const WALLET_CFG = path.join(remote.app.getPath('userData'), 'wconfig.txt');

var ZumElectronSession = function (opts) {
    if (!(this instanceof ZumElectronSession)) return new ZumElectronSession(opts);
    opts = opts || {};

    this.sessKey = SESSION_KEY;
    this.eventName = 'sessionUpdated';
    this.sessDefault = {
        loadedWalletAddress: '',
        walletHash: '',
        walletUnlockedBalance: 0,
        walletLockedBalance: 0,
        walletConfig: opts.walletConfig || 'wconfig.txt',
        synchronized: false,
        syncStarted: false,
        serviceReady: false,
        connectedNode: '',
        txList: [],
        txLen: 0,
        txLastHash: null,
        txLastTimestamp: null,
        txNew: [],
        nodeFee: 0,
        nodeChoices: settings.get('pubnodes_data', []),
        servicePath: settings.get('service_bin', 'zum-service'),
        configUpdated: false,
        uiStateChanged: false,
        defaultTitle: DEFAULT_TITLE,
        debug: opts.debug || false,
        fusionStarted: false,
        fusionProgress: false,
        addressBookErr: false
    };

    this.stickyVals = {
        publicNodes: [],
        addressBook: null // {id: null, name: null, path: null, data: {}}
    };
    /* jshint ignore:start */
    this.keys = Object.keys({ ...this.sessDefault, ...this.stickyVals });

    // initialize
    if (!sessionStorage.getItem(this.sessKey)) {
        sessionStorage.setItem(this.sessKey, JSON.stringify({ ...this.sessDefault, ...this.stickyVals }));
    }
    /* jshint ignore:end */
};

ZumElectronSession.prototype.get = function (key) {
    key = key || false;
    if (!key) {
        return JSON.parse(sessionStorage.getItem(this.sessKey)) || this.sessDefault;
    }

    if (!this.keys.includes(key)) {
        throw new Error(`Invalid session key: ${key}`);
    }

    return JSON.parse(sessionStorage.getItem(this.sessKey))[key];
};

ZumElectronSession.prototype.getDefault = function (key) {
    if (!key) {
        return this.sessDefault;
    }
    return this.sessDefault[key];
};

ZumElectronSession.prototype.set = function (key, val) {
    if (!this.keys.includes(key)) {
        throw new Error(`Invalid session key: ${key}`);
    }

    let sessData = this.get(); // all current data obj
    sessData[key] = val; // update value
    return sessionStorage.setItem(this.sessKey, JSON.stringify(sessData));
};

ZumElectronSession.prototype.reset = function (key) {
    if (key) {
        if (!this.sessDefault.hasOwnProperty(key)) {
            throw new Error('Invalid session key');
        }

        let sessData = this.get(); // all current data obj
        sessData[key] = this.sessDefault[key]; // set to default value
        return sessionStorage.setItem(this.sessKey, JSON.stringify(sessData[key]));
    }
    //return sessionStorage.setItem(this.sessKey, JSON.stringify(this.sessDefault));
    let stickyData = {};
    Object.keys(this.stickyVals).forEach((e) => {
        stickyData[e] = this.get(e);
    });
    /* jshint ignore: start */
    return sessionStorage.setItem(this.sessKey, JSON.stringify({ ...this.sessDefault, ...stickyData }));
    /* jshint ignore: end */
};

ZumElectronSession.prototype.destroy = function () {
    return sessionStorage.removeItem(this.sessKey);
};

module.exports = ZumElectronSession;