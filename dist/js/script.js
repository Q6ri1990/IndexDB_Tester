// load service worker



// based on code from https://codelabs.developers.google.com/codelabs/workbox-indexeddb/index.html
const dbName = 'dashboardr',
    tableName = 'events',
    version = 1;

function isIndexDBSupported() {
    if (!('indexedDB' in window)) {
        console.log("Not Supported!!");
        alert("IDB Not Supported!!");
        return false;
    }
    console.log("Supported");
    alert("IDB Supported");
    return true;
}

// create the database
function createIndexedDB() {
    if (isIndexDBSupported()) {
        return idb.open(dbName, version, function (upgradeDb) {
            alert("Creating DB "+dbName);
            if (!upgradeDb.objectStoreNames.contains(tableName)) {
                alert("upgrading table "+tableName);
                const eventsOS = upgradeDb.createObjectStore(tableName, {
                    keyPath: 'id'
                });
            }
        });
    }
}

// create the promis object that will be used by the application
const dbPromise = createIndexedDB();



// save the data that we want into the Local IDB
function saveEventDataLocally(records) {
    if (isIndexDBSupported()) {
        return dbPromise.then(db => {
            const tx = db.transaction(tableName, 'readwrite');
            const store = tx.objectStore(tableName);
            return Promise.all(records.map(record => store.put(record)))
                .catch(() => {
                    tx.abort();
                    throw Error('Events were not added to the store');
                });
        });
    }
}

function loadContentNetworkFirst() {
    getServerData()
        .then(dataFromNetwork => {
            updateUI(dataFromNetwork);
            saveEventDataLocally(dataFromNetwork)
                .then(() => {
                    setLastUpdated(new Date());
                    messageDataSaved();
                }).catch(err => {
                    messageSaveError();
                    console.warn(err);
                });
        }).catch(err => {
            console.log('Network requests have failed, this is expected if offline');
            getLocalEventData()
                .then(offlineData => {
                    if (!offlineData.length) {
                        messageNoData();
                    } else {
                        messageOffline();
                        updateUI(offlineData);
                    }
                });
        });
}

function addAndPostEvent() {
    // ...
    // TODO - save event data locally
    saveEventDataLocally([data]);
    // ...
}

function getLocalEventData() {
    if (isIndexDBSupported()) {
        return dbPromise.then(db => {
            const tx = db.transaction(tableName, 'readonly');
            const store = tx.objectStore(tableName);
            return store.getAll();
        });
    }
}

var array = [{
name:'test'
},
{
    name:'ali'
}];

saveEventDataLocally(array);

console.log(getLocalEventData());



