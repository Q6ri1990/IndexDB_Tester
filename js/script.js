
// based on code from https://codelabs.developers.google.com/codelabs/workbox-indexeddb/index.html
// idb promised github https://github.com/jakearchibald/idb
const dbName = 'Names',
    tableName = 'Names',
    version = 1;

// this is an object to simplify the data storage
    class testData{
        constructor(id, name)
        {
            this.id = id;
            this.name = name;
        }
    
    
    }
// check if the indexDB is supported or not
function isIndexDBSupported() {
    if (!('indexedDB' in window)) {
        console.log("Not Supported!!");
        alert("IDB Not Supported!!");
        return false;
    }
    console.log("Supported");
    //alert("IDB Supported");
    return true;
}

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

// create the promise object that will be used by the application
const dbPromise = createIndexedDB();

// functions that utilize the indexDB
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

function populateTable(){
    var table = document.getElementById('tbody');
    table.innerHTML='';// i know this is not a clean way of doing it but it works
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


function saveName(){    
    let name = document.getElementById("name").value;
    let id = Math.random();

    console.log('adding '+name);
    
    saveEventDataLocally([new testData(id, name)]);
    populateTable();
}


function getName(){
    let id = document.getElementById("id").value;
    let label = document.getElementById("result");
    var name = findById(id).then(item => {
        if(item ===null|| item === undefined){
            label.innerText="Oops";
        }else{
            label.innerText="Your name is "+item.name;
        }
    }
    ).catch(e=>console.log(e));


}


function findById(id){
    if(isIndexDBSupported()){
        return dbPromise.then(function(db) {
            var tx = db.transaction(tableName, 'readonly');
            var store = tx.objectStore(tableName);
            return store.get(id);
          });
    }
}


// run the code
var array = [new testData('1','Test'), new testData('2','Ali')];
saveEventDataLocally(array);
populateTable();