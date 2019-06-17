
// based on code from https://codelabs.developers.google.com/codelabs/workbox-indexeddb/index.html
// idb promised github https://github.com/jakearchibald/idb
const dbName = 'dashboard',
    tableName = 'events',
    version = 1;


    class testData{
        constructor(id, name)
        {
            this.id = id;
            this.name = name;
        }
    
    
    }

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
/*
// create the database 
const db = openDB(dbName, version, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // …
      console.log("upgrade DB");
    },
    blocked() {
      // …
    },
    blocking() {
      // …
    }
  });*/





// create the database
function createIndexedDB() {
    if (isIndexDBSupported()) {
        return idb.open(dbName, version, function (upgradeDb) {
            alert("Creating DB " + dbName);
            if (!upgradeDb.objectStoreNames.contains(tableName)) {
                alert("upgrading table " + tableName);
                const eventsOS = upgradeDb.createObjectStore(tableName, {
                    keyPath: 'id'
                });
            }
        });
    }
}

// create the promis object that will be used by the application
const dbPromise = createIndexedDB();
/*


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
            getAllData()
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

function getAllData() {
    if (isIndexDBSupported()) {
        return dbPromise.then(db => {
            const tx = db.transaction(tableName, 'readonly');
            const store = tx.objectStore(tableName);
            return store.getAll();
        });
    }
}
*/
var array = [new testData('1','test'), new testData('2','ali')];

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


function getAllData(){
 var data = null;   
if(isIndexDBSupported()){
    data = dbPromise.then(function(db) {
        var tx = db.transaction(tableName, 'readonly');
        var store = tx.objectStore(tableName);
        console.log('getting data from '+tableName)
        return store.getAll();
      });
    }
    return data;
}

saveEventDataLocally(array);

function populateTable(){
    var table = document.getElementById('table');
    getAllData().then(records =>{
        records.forEach(element => {
            let row = table.insertRow();
            var Newcell1 = row.insertCell(0); 
            var Newcell2 = row.insertCell(1); 
            Newcell1.innerHTML = element.id; 
            Newcell2.innerHTML = element.name;
        });
    });
}

populateTable();

function saveName(){
    
    let name = document.getElementById("name").value;
    let id = Math.random();

    console.log('adding '+name);
    
    saveEventDataLocally([new testData(id, name)]);
    populateTable();
}
