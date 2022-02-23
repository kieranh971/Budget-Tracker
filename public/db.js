let db;

// New db request for a "budget" database.
const request = indexedDB.open('BudgetDB', 1);

// Function to update page from old to new version
request.onupgradeneeded = function (e) {
  console.log('Test to see if works');
  db = e.target.result;
  db.createObjectStore('budgetStore', { autoIncrement: true})
};

//if error
request.onerror = function (e) {
  console.log(`Error occured: ${e.target.errorCode}`);
};

//if successful
request.onsuccess = function (e) {
  console.log('success');
  if(navigator.onLine) {
    checkDatabase()
  }
};

//saves record if user is offline
const saveRecord = (record) => {
  console.log("Offline records saved");
  const transaction = db.transaction(["budgetStore"], "readwrite")
  const store = transaction.objectStore("budgetStore");
  store.add(record)
}


// checks if DB exists
function checkDatabase() {
  console.log("checking if db executed")
  const transaction = db.transaction(["budgetStore"], "readwrite")
  const store = transaction.objectStore('budgetStore');
  const getAll = store.getAll();

  getAll.onsuccess = function(){
    if(getAll.result.length > 0) {
      fetch('/api/transation/bulk', {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Conetent-Type": "application/json",
        },
      })
      .then((response)=>{
        return response.json();
      })
      .then(()=>{
        const transaction = db.transaction(["budgetStore"], "readwrite")
        const store = transaction.objectStore('budgetStore');
        store.clear();
        console.log("Cleared store");
      });
    }
  };
}

// Listen for app coming back online
window.addEventListener('online', checkDatabase);
