const DB_NAME = "todoDB";
const STORE_NAME = "tasks";

export const openDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Error opening database"));
  });

export const addTask = async (task) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(task);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject("Error adding task:", event.target.error);
    });
  } catch (error) {
    console.error("Error in addTask:", error);
  }
};

export const fetchTasks = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject("Error fetching tasks:", event.target.error);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

// Delete a task by ID
export const deleteTask = async (taskId) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(taskId);

      request.onsuccess = () => resolve(true);
      request.onerror = (event) => reject("Error deleting task:", event.target.error);
    });
  } catch (error) {
    console.error("Error in deleteTask:", error);
    return false;
  }
};


export const updateTask = async (taskId, updatedTask) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ id: taskId, ...updatedTask });

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject("Error updating task:", event.target.error);
    });
  } catch (error) {
    console.error("Error in updateTask:", error);
  }
};


export const updateTaskCompletion = async (taskId, isComplete) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(taskId);

      request.onsuccess = () => {
        const task = request.result;
        task.isComplete = isComplete; //update complte status
        const updateRequest = store.put(task); 

        updateRequest.onsuccess = () => resolve(true);
        updateRequest.onerror = (event) => reject("Error updating task completion:", event.target.error);
      };
      request.onerror = (event) => reject("Error fetching task:", event.target.error);
    });
  } catch (error) {
    console.error("Error updating task completion:", error);
  }
};
