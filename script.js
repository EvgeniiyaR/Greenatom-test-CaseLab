const templateTask = document.querySelector('#template-task');
const inputTask = document.querySelector('.main__input');
const buttonAddTask = document.querySelector('.main__button_type_add');
const formAddTask = document.querySelector('.main__form');
const listTasks = document.querySelector('.main__list-tasks');
const buttonMarkEvenTasks = document.querySelector('.main__button_type_even');
const buttonMarkOddTasks = document.querySelector('.main__button_type_odd');
const buttonDeleteFirstTask = document.querySelector('.main__button_type_first');
const buttonDeleteLastTask = document.querySelector('.main__button_type_last');

const disableAddButton = () => {
  if (inputTask.value === '') {
    buttonAddTask.disabled = true;
  } else {
    buttonAddTask.disabled = false;
  }
}

disableAddButton();

inputTask.addEventListener('input', disableAddButton);

const getTemplate = () => {
  const clone = templateTask.content.cloneNode(true);
  const textTask = clone.querySelector('.main__text');
  const buttonCompleteTask = clone.querySelector('.main__button_type_complete');
  const buttonUncompleteTask = clone.querySelector('.main__button_type_uncomplete');
  const buttonDeleteTask = clone.querySelector('.main__button_type_delete');
  const buttonEditTask = clone.querySelector('.main__button_type_edit');
  const buttonSaveTask = clone.querySelector('.main__button_type_save');
  const buttonCancelTask = clone.querySelector('.main__button_type_cancel');
  const extraButtons = clone.querySelector('.main__extra-btns-edit');
  const task = clone.querySelector('.main__task');

  return [clone, textTask, buttonCompleteTask, buttonUncompleteTask, buttonDeleteTask, buttonEditTask, buttonSaveTask, buttonCancelTask, task, extraButtons];
}

const deleteTask = (e) => {
  const target = e.target.parentNode.parentNode;
  const arrayTasks = JSON.parse(localStorage.getItem('listTasks'));
  const completeTasks = JSON.parse(localStorage.getItem('completeTasks'));

  listTasks.removeChild(target);
  arrayTasks.forEach((item, index) => {
    if (item[1] === Number(target.dataset.id)) {
      arrayTasks.splice(index, 1);
    }
  })
  if (completeTasks) {
    completeTasks.forEach((completeTask, completeIndex) => {
      if (completeTask === Number(target.dataset.id)) {
        completeTasks.splice(completeIndex, 1);
      }
    })
  }
  localStorage.setItem('listTasks', JSON.stringify(arrayTasks));
  localStorage.setItem('completeTasks', JSON.stringify(completeTasks));
}

const completeTask = (e) => {
  const target = e.target.parentNode.parentNode;
  e.target.classList.add('main__button_inactive');
  const text = target.querySelector('.main__text');
  const arrayTasks = JSON.parse(localStorage.getItem('listTasks'));
  const completeTasks = JSON.parse(localStorage.getItem('completeTasks')) || [];
  const buttonEdit = target.querySelector('.main__button_type_edit');
  const buttonUncomplete = target.querySelector('.main__button_type_uncomplete');
  buttonUncomplete.classList.remove('main__button_inactive');
  buttonEdit.disabled = true;
  arrayTasks.forEach((item, index) => {
    if (item[1] === Number(target.dataset.id)) {
      arrayTasks.splice(index, 1);
    }
  })
  arrayTasks.push([text.value, Number(target.dataset.id)]);
  text.classList.add('main__text_type_complete');
  listTasks.appendChild(target);
  completeTasks.push(Number(target.dataset.id));
  localStorage.setItem('listTasks', JSON.stringify(arrayTasks));
  localStorage.setItem('completeTasks', JSON.stringify(completeTasks));
}

const uncompleteTask = (e) => {
  const target = e.target.parentNode.parentNode;
  e.target.classList.add('main__button_inactive');
  const text = target.querySelector('.main__text');
  const completeTasks = JSON.parse(localStorage.getItem('completeTasks')) || [];
  const buttonEdit = target.querySelector('.main__button_type_edit');
  const buttonComplete = target.querySelector('.main__button_type_complete');
  buttonComplete.classList.remove('main__button_inactive');
  buttonEdit.disabled = false;
  completeTasks.forEach((item, index) => {
    if (item === Number(target.dataset.id)) {
      completeTasks.splice(index, 1);
    }
  })
  text.classList.remove('main__text_type_complete');
  localStorage.setItem('completeTasks', JSON.stringify(completeTasks));
}

const saveOrCancelTask = (e, isSave, buttonComplete, buttonEdit, extraButtons, text) => {
  const target = e.target.parentNode.parentNode.parentNode;
  const arrayTasks = JSON.parse(localStorage.getItem('listTasks'));
  text.disabled = true;
  buttonComplete.classList.remove('main__button_inactive');
  buttonEdit.classList.remove('main__button_inactive');
  extraButtons.classList.remove('main__extra-btns-edit_active');
  arrayTasks.forEach((item) => {
    if (item[1] === Number(target.dataset.id)) {
      isSave ? item[0] = text.value : text.value = item[0];
    }
  })
  isSave && localStorage.setItem('listTasks', JSON.stringify(arrayTasks));
}

const editTask = (e, buttonCompleteTask, buttonEditTask, buttonSaveTask, extraButtons, textTask) => {
  const target = e.target.parentNode.parentNode;
  const arrayTasks = JSON.parse(localStorage.getItem('listTasks'));
  buttonCompleteTask.classList.add('main__button_inactive');
  buttonEditTask.classList.add('main__button_inactive');
  extraButtons.classList.add('main__extra-btns-edit_active');
  textTask.disabled = false;

  const disableSaveButton = (value) => {
    if (value === textTask.value || textTask.value === '') {
      buttonSaveTask.disabled = true;
    } else {
      buttonSaveTask.disabled = false;
    }
  }

  if (textTask.disabled === false) {
    arrayTasks.forEach((item) => {
      if (item[1] === Number(target.dataset.id)) {
        disableSaveButton(item[0]);
        textTask.addEventListener('input', () => disableSaveButton(item[0]));
      }
    })
  }
}

if (localStorage.getItem('listTasks')) {
  const completeTasks = JSON.parse(localStorage.getItem('completeTasks'));
  const arrayTasks = JSON.parse(localStorage.getItem('listTasks'));
  arrayTasks.forEach((item) => {
    const [clone, textTask, buttonCompleteTask, buttonUncompleteTask, buttonDeleteTask, buttonEditTask, buttonSaveTask, buttonCancelTask, task, extraButtons] = getTemplate();
    textTask.disabled = true;
    textTask.value = item[0];
    task.dataset.id = item[1];
    listTasks.appendChild(clone);
    if (completeTasks) {
      completeTasks.forEach((completeTask) => {
        if (completeTask === item[1]) {
          textTask.classList.add('main__text_type_complete');
          buttonEditTask.disabled = true;
          buttonUncompleteTask.classList.remove('main__button_inactive');
          buttonCompleteTask.classList.add('main__button_inactive');
        }
      })
    }
    buttonDeleteTask.addEventListener('click', deleteTask);
    buttonCompleteTask.addEventListener('click', completeTask);
    buttonUncompleteTask.addEventListener('click', uncompleteTask);
    buttonEditTask.addEventListener('click', (e) => editTask(e, buttonCompleteTask, buttonEditTask, buttonSaveTask, extraButtons, textTask));
    buttonSaveTask.addEventListener('click', (e) => saveOrCancelTask(e, true, buttonCompleteTask, buttonEditTask, extraButtons, textTask));
    buttonCancelTask.addEventListener('click', (e) => saveOrCancelTask(e, false, buttonCompleteTask, buttonEditTask, extraButtons, textTask));
  })
}

const addTask = (e) => {
  e.preventDefault();
  const arrayTasks = JSON.parse(localStorage.getItem('listTasks')) || [];
  let count = arrayTasks.length;
  const [clone, textTask, buttonCompleteTask, buttonUncompleteTask, buttonDeleteTask, buttonEditTask, buttonSaveTask, buttonCancelTask, task, extraButtons] = getTemplate();
  textTask.disabled = true;
  textTask.value = inputTask.value;
  inputTask.value = '';
  count += 1;
  task.dataset.id = count;
  arrayTasks.unshift([textTask.value, count]);
  listTasks.prepend(clone);
  localStorage.setItem('listTasks', JSON.stringify(arrayTasks));
  disableAddButton();
  buttonDeleteTask.addEventListener('click', deleteTask);
  buttonCompleteTask.addEventListener('click', completeTask);
  buttonUncompleteTask.addEventListener('click', uncompleteTask);
  buttonEditTask.addEventListener('click', (e) => editTask(e, buttonCompleteTask, buttonEditTask, buttonSaveTask, extraButtons, textTask));
  buttonSaveTask.addEventListener('click', (e) => saveOrCancelTask(e, true, buttonCompleteTask, buttonEditTask, extraButtons, textTask));
  buttonCancelTask.addEventListener('click', (e) => saveOrCancelTask(e, false, buttonCompleteTask, buttonEditTask, extraButtons, textTask));
}

const markEvenTasks = () => {
  const tasks = document.querySelectorAll('.main__task');
  tasks.forEach((item, index) => {
    if (item.classList.contains('main__task_type_even')) {
      item.classList.remove('main__task_type_even');
    } else {
      if (index % 2 !== 0) {
        item.classList.add('main__task_type_even');
      }
    }
  });
}

const markOddTasks = () => {
  const tasks = document.querySelectorAll('.main__task');
  tasks.forEach((item, index) => {
    if (item.classList.contains('main__task_type_odd')) {
      item.classList.remove('main__task_type_odd');
    } else {
      if (index % 2 === 0) {
        item.classList.add('main__task_type_odd');
      }
    }
  });
}

const deleteTaskCommon = (isFirst) => {
  const tasks = document.querySelectorAll('.main__task');
  const completeTasks = JSON.parse(localStorage.getItem('completeTasks'));
  const arrayTasks = JSON.parse(localStorage.getItem('listTasks'));
  if (tasks.length > 0) {
    let deleteElement;
    isFirst ? deleteElement = arrayTasks.shift() : deleteElement = arrayTasks.pop();
    if (completeTasks) {
      completeTasks.forEach((item, index) => {
        if (item === deleteElement[1]) {
          completeTasks.splice(index, 1);
        }
      })
      localStorage.setItem('completeTasks', JSON.stringify(completeTasks));
  }
    }
    isFirst ? listTasks.removeChild(tasks[0]) : listTasks.removeChild(tasks[tasks.length - 1]);
    localStorage.setItem('listTasks', JSON.stringify(arrayTasks));
}

const deleteFirstTask = () => {
  deleteTaskCommon(true);
}

const deleteLastTask = () => {
  deleteTaskCommon(false);
}

formAddTask.addEventListener('submit', addTask);
buttonMarkEvenTasks.addEventListener('click', markEvenTasks);
buttonMarkOddTasks.addEventListener('click', markOddTasks);
buttonDeleteFirstTask.addEventListener('click', deleteFirstTask);
buttonDeleteLastTask.addEventListener('click', deleteLastTask);
