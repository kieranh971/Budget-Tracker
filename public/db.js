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


// checks iDB exists
function checkDatabase() {
  console.log("checking if db executed")
}


// Listen for app coming back online
window.addEventListener('online', checkDatabase);
