<p align="center"><img src="https://raw.githubusercontent.com/zumcoin/zum-assets/master/ZumCoin/zumcoin_logo_design/3d_green_lite_bg/ZumLogo_800x200px_lite_bg.png" width="400"></p>

## ZumElectron - GUI wallet for ZumCoin.


### Features:

This wallet contains the basic functions required to mvanage your ZumCoin assets:

* Wallet creation:
  * Create new wallet.
  * Import/recover from private keys OR mnemonic seed.
* Basic wallet operation/transactions:
  * Open an existing  wallet
  * Display wallet address & balance
  * Display & Backup private keys/seed
  * Sending/transferring. Integrated Address or Payment ID are supported. Also provides address lookup from your addressbook.
  * Transactions history listing/sorting/searching/detail.
  * Incoming transaction notification.
  * Export incoming, outgoing, or all transactions to csv file.
  * Rescan wallet from specific block height.
  * Perform wallet optimization.
  * Utilities: generate payment id and integrated address.
* Address book:
  * Add/Edit/Delete address entry.
  * Listing/sorting/searching existing entries.
  * Allow to store same wallet address with different payment id.
  * Autosave address after sending to new/unknown recipient
  * Allow to optionally create password protected address book.
* Misc:
  * Option to use system tray (on closing/minimizing wallet)
  * Provides list of public nodes, fetch/updated daily from [zumcoin-nodes-json](https://github.com/zumcoin-org/zumcoin-nodes-json) repo.
  * Allow to add custom node address.
  * Theme: Dark & Light Mode
  * [Keyboard shortcuts](docs/shortcut.md)

### Download &amp; Run ZumElectron

#### Windows:
1. Download the latest installer here: https://github.com/zumcoin-org/zum-wallet-electron/releases/latest
2. Run the installer (`zumelectron-<version>-win-setup.exe`) and follow the installation wizard.
3. Launch ZumElectron via start menu or desktop shortcut.

#### GNU/Linux (AppImage):
1. Download latest AppImage bundle here: https://github.com/zumcoin-org/zum-wallet-electron/releases/latest
2. Make it executable, either via GUI file manager or command line, e.g. `chmod +x zumelectron-<version>-linux.AppImage`
3. Run/execute the file, double click in file manager, or run via shell/command line (See: https://docs.appimage.org/user-guide/run-appimages.html)

#### macOS
1. Download latest archive here: https://github.com/zumcoin-org/zum-wallet-electron/releases/latest
2. Extract downloaded zip archived
3. Run the executable binary (`ZumElectron.app/Contents/MacOs/ZumElectron`)

### Using ZumElectron
Please visit our wiki page: [ZumElectron User Guide](../../wiki).

### Building/Packaging ZumElectron
You need to have `Node.js` and `npm` installed, go to https://nodejs.org and find out how to get it installed on your platform.

Once you have Node+npm installed:
```
# first, download zum-service binary for each platform
# from ZumCoin official repo
# https://github.com/zumcoin/zumcoin/releases
# extract the zum-service executable somewhere

# clone the repo
$ git clone https://github.com/zumcoin-org/zum-wallet-electron
$ cd zum-wallet-electron

# install dependencies
$ npm install

# create build+dist directory
$ mkdir -p ./build && mkdir -p ./dist

# copy/symlink icons from assets, required for packaging
$ cp ./src/assets/icon.* ./build/

# build GNU/Linux package
$ mkdir -p ./bin/lin
$ cp /path/to/linux-version-of/zum-service ./bin/lin/
$ npm run dist-lin

# build Windows package
$ mkdir -p ./bin/win
$ cp /path/to/win-version-of/zum-service.exe ./bin/win/
$ npm run dist-win

# build OSX package
$ mkdir -p ./bin/osx
$ cp /path/to/osx-version-of/zum-service ./bin/osx/
$ npm run dist-mac
```

Resulting packages or installer can be found inside `dist/` directory.

### Porting for another coin
Please see [this guide](docs/porting.md) if you want to adapt ZumElectron to be use for your own ZumCoin fork.

![ZumElectron](docs/zumelectron.png)
