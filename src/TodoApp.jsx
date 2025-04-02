import { useState, useEffect } from 'react';
import NoToDo from './component/additional/notodo.jsx';
import Modal from './component/modal.jsx';
import { openDB } from './assets/js/indexeddb.js';
import { addTask, deleteTask, updateTaskCompletion } from "./assets/js/indexeddb.js";
import Bg from './assets/image/bgtodo.png'
const Todo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null); // check current task for editing
  const [isEdit, setIsEdit] = useState(false); // if edit or add a task
  const [selectedCategory, setSelectedCategory] = useState("all");

  // open modal
  const openModal = (task = null) => {
    if (task) {
      setIsEdit(true); 
      setCurrentTask(task); 
    } else {
      setIsEdit(false); 
      setCurrentTask(null);
    }
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const STORE_NAME = "tasks";

  // get tasks 
  const fetchTasks = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject("Error fetching tasks");
    });
  };

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  //delete task
  const handleDeleteTask = async (taskId) => {
    const result = await deleteTask(taskId);
    if (result) {
      fetchTasks().then(setTasks);
    }
  };

  return (
    <>
      <div className='main-con min-h-svh h-full bg-[var(--primary-color)] flex justify-center text-white'>
      
        <div className='fade-in  bg-[var(--primary-color)] todo-container relative p-5 min-h-svh h-full max-w-[800px] w-full'>
          <div className='flex justify-between'>
            <h1 className='border-b-2 w-1/2 sm:text-[2.3rem] text-[1.7rem] font-bold ...'>To-Dos</h1>
            <button
              onClick={() => openModal()} // open modal for adding tasks
              className='sm:top-5 sm:right-5 bottom-20 right-5 duration-300 ease-in bg-[var(--hc-color)] hover:bg-[var(--inc-color)] p-2 sm:w-[55px] sm:h-[55px] w-[50px] h-[50px] rounded-[50px]'
            >
              <h3 className='sm:text-[1.50rem] text-[1.25rem] font-semibold ...' ><i className='fa-solid fa-plus'></i></h3>
            </button>
          </div>

          {/* Category */}
          <div className="w-full pt-5 flex items-center gap-4">
            <button
              className={` max-w-[200px] px-3 py-1 rounded-[5px] ${selectedCategory === "all" ? "bg-white text-black " : "hover:bg-white/40 ease duration-300"}`}
              onClick={() => setSelectedCategory("all")}
            >
              <p>All ({tasks.length})</p>
            </button>
            <button
              className={`max-w-[200px] px-3 py-1 rounded-[5px] ${selectedCategory === "complete" ? "bg-white text-black " : "hover:bg-white/40 ease duration-300"}`}
              onClick={() => setSelectedCategory("complete")}
            >
              <p>Complete ({tasks.filter(task => task.isComplete).length})</p>
            </button>
            <button
              className={`max-w-[200px] px-3 py-1 rounded-[5px] ${selectedCategory === "incomplete" ? "bg-white text-black " : "hover:bg-white/40 ease duration-300"}`}
              onClick={() => setSelectedCategory("incomplete")}
            >
              <p>Incomplete ({tasks.filter(task => !task.isComplete).length})</p>
            </button>
          </div>

         
          <div className=' overflow-x-hidden w-full h-full pt-10 pb-20 relative flex flex-col gap-5'>
          {tasks.length === 0 ? (
            <NoToDo />
          ) : (
            tasks
              .filter((task) => {
                if (selectedCategory === "complete") {
                  return task.isComplete;
                } else if (selectedCategory === "incomplete") {
                  return !task.isComplete;
                }
                return true; 
              })
              .sort((a, b) => (a.isComplete && !b.isComplete ? 1 : -1)) //move done tasks to the bottom 
              .map((task) => (
                <div
                  key={task.id}
                  className={` shadow overflow-hidden bg-[var(--secondary-color)] py-2 border-l-[5px] w-full px-3 ${
                    task.isComplete ? "border-[#6FC276] ease duration-300" : "border-[#FED32C] ease duration-300"
                  }`}>

                  <div className="flex justify-between items-center">
                    <h3 className={`sm:text-[1.50rem] text-[1.25rem] font-semibold ... ${task.isComplete ? "line-through " : "text-none"}`}>{task.title}</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => openModal(task)} // edit mode
                        className="w-[30px] h-[30px] rounded-[50px] bg-[var(--primary-color)] ease duration-200 hover:bg-[var(--c-color)] text-center">

                        <p><i className="fa-solid fa-pen-to-square"></i></p>
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="w-[30px] h-[30px] rounded-[50px] bg-[var(--primary-color)] ease duration-200 hover:bg-red-500 text-center">

                        <p><i className="fa-solid fa-trash"></i></p>
                      </button>
                      <button
                        onClick={async () => {
                          const newStatus = !task.isComplete;
                          await updateTaskCompletion(task.id, newStatus); // update task in indexddb
                          fetchTasks().then(setTasks); // refetch tasks to update UI
                        }}
                        className={`ml-5 w-[30px] h-[30px] rounded-[50px] bg-[var(--primary-color)] text-center ease duration-200 hover:bg-green-400/40 ${
                          task.isComplete ? "bg-[var(--c-color)] ease duration-300" : "bg-[var(--primary-color)] ease duration-300"
                        }`}>

                        <p><i className="fa-solid fa-check"></i></p>
                      </button>
                    </div>
                  </div>
                  <div className={`mt-3 ${task.isComplete ? "line-through " : "text-none"}`}>
                    <p>{task.description}</p>
                  </div>
                  <div className="flex justify-between w-full mt-3">
                    <div>
                      <p><b>Due: </b>{task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "No due date"}</p>
                    </div>
                    <div>
                      <p className='text-white/50'><i><small>{task.currentDate}</small></i></p>
                    </div>
                  </div>
                </div>
              ))
          )}
          </div>

        </div>
        {isModalOpen && <Modal closeModal={closeModal} setTasks={setTasks} task={currentTask} isEdit={isEdit} />}
      </div>
    </>
  );
};

export default Todo;
