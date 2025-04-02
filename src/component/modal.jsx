import React, { useState, useEffect } from 'react';
import { addTask, fetchTasks, updateTask } from '../assets/js/indexeddb.js'; 


const Modal = ({ closeModal, setTasks, task, isEdit }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (isEdit && task) {
      setTitle(task.title);
      setDueDate(task.dueDate);
      setDescription(task.description);
    }
  }, [isEdit, task]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!title && !description) {
      
      return;
    }
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });

    const newTask = { title, dueDate, description, completed: false, currentDate};

    if (isEdit && task) {
      await updateTask(task.id, newTask); //update task
    } else {
      await addTask(newTask); // new task
    }

    //get updated tasks after add or update
    fetchTasks().then(setTasks); 
    closeModal();
  };

  return (
    <div className=' absolute w-full h-full z-10 bg-[#000000]/60 flex justify-center items-center'>
      
      <form className='test zoom-in bg-[var(--secondary-color)] sm:max-w-[700px] max-h-[500px] max-w-[700px] sm:max-h-[400px] w-full h-full p-3 rounded-[5px]'>
        <div className='w-full flex justify-between mb-5'>
          <h3 className='sm:text-[1.50rem] text-[1.25rem] font-semibold ...'>{isEdit ? 'Edit Task' : 'Add Task'}</h3>
          <p onClick={closeModal} className='hover:text-red-700 cursor-pointer duration-200 ease-in'>
            <i className="fa-solid fa-circle-xmark"></i>
          </p>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5'>
          <div className='w-full'>
            <p className='mb-2'><b>Title</b></p>
            <input 
              className='rounded-[5px] outline-none bg-[var(--primary-color)] border-b-[1px] border-white/40 hover:border-white duration-300 ease p-3 w-full'
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='h-full'>
            <p className='mb-2'><b>Task Due</b></p>
            <input 
              className='rounded-[5px] outline-none bg-[var(--primary-color)] border-b-[1px] border-white/40 hover:border-white duration-300 ease p-3 w-full'
              type="datetime-local" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div><br />

        <div>
          <p className='mb-2'><b>Description</b></p>
          <textarea 
            className='rounded-[5px] outline-none max-h-[120px] min-h-[90px] bg-[var(--primary-color)] border-b-[1px] border-white/40 hover:border-white duration-300 ease p-3 w-full'
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className='w-full flex justify-end mt-5'>
          <button 
            onClick={handleSave}
            className='w-[70px] border border-white/15 hover:bg-[var(--primary-color)] ease duration-200 py-1 rounded-[5px]'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Modal;
