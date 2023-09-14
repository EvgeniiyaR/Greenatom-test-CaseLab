const templateTask = document.querySelector('#template-task');
const inputTask = document.querySelector('.main__input');
const buttonAddTask = document.querySelector('.main__button_type_add');
const formAddTask = document.querySelector('.main__form');
const listTasks = document.querySelector('.main__list-tasks');
const buttonMarkEvenTasks = document.querySelector('.main__button_type_even');
const buttonMarkOddTasks = document.querySelector('.main__button_type_odd');

if (inputTask.value === '') {
  buttonAddTask.disabled = true;
}

inputTask.addEventListener('input', (e) => {
  if (e.target.value === '') {
    buttonAddTask.disabled = true;
  } else {
    buttonAddTask.disabled = false;
  }
})

const getTemplate = () => {
  const clone = templateTask.content.cloneNode(true);
  const textTask = clone.querySelector('.main__text');
  const buttonCompleteTask = clone.querySelector('.main__button_type_complete');
  const buttonDeleteTask = clone.querySelector('.main__button_type_delete');
  const task = clone.querySelector('.main__task');

  return [clone, textTask, buttonCompleteTask, buttonDeleteTask, task];
}

const deleteTask = (e) => {
  const target = e.target.parentNode;
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
  const target = e.target.parentNode;
  e.target.textContent = 'Не готово';
  const text = target.querySelector('.main__text');
  const arrayTasks = JSON.parse(localStorage.getItem('listTasks'));
  const completeTasks = JSON.parse(localStorage.getItem('completeTasks')) || [];
  arrayTasks.forEach((item, index) => {
    if (item[1] === Number(target.dataset.id)) {
      arrayTasks.splice(index, 1);
    }
  })
  arrayTasks.push([text.textContent, Number(target.dataset.id)]);
  text.classList.add('main__text_type_complete');
  listTasks.appendChild(target);
  completeTasks.push(Number(target.dataset.id));
  localStorage.setItem('listTasks', JSON.stringify(arrayTasks));
  localStorage.setItem('completeTasks', JSON.stringify(completeTasks));
}

const uncompleteTask = (e) => {
  const target = e.target.parentNode;
  e.target.textContent = 'Готово';
  const text = target.querySelector('.main__text');
  const completeTasks = JSON.parse(localStorage.getItem('completeTasks')) || [];
  completeTasks.forEach((item, index) => {
    if (item === Number(target.dataset.id)) {
      completeTasks.splice(index, 1);
    }
  })
  text.classList.remove('main__text_type_complete');
  localStorage.setItem('completeTasks', JSON.stringify(completeTasks));
}


if (localStorage.getItem('listTasks')) {
  const completeTasks = JSON.parse(localStorage.getItem('completeTasks'));
  const arrayTasks = JSON.parse(localStorage.getItem('listTasks'));
  arrayTasks.forEach((item) => {
    const [clone, textTask, buttonCompleteTask, buttonDeleteTask, task] = getTemplate();
    textTask.textContent = item[0];
    task.dataset.id = item[1];
    listTasks.appendChild(clone);
    completeTasks.forEach((completeTask) => {
      if (completeTask === item[1]) {
        textTask.classList.add('main__text_type_complete');
      }
    })
    buttonDeleteTask.addEventListener('click', deleteTask);
    buttonCompleteTask.addEventListener('click', (e) => {
      if (textTask.classList.contains('main__text_type_complete')) {
        uncompleteTask(e);
      } else {
        completeTask(e);
      }
    });
  })
}

const addTask = (e) => {
  e.preventDefault();
  const arrayTasks = JSON.parse(localStorage.getItem('listTasks')) || [];
  let count = arrayTasks.length;
  const [clone, textTask, buttonCompleteTask, buttonDeleteTask, task] = getTemplate();
  textTask.textContent = inputTask.value;
  inputTask.value = '';
  count += 1;
  task.dataset.id = count;
  arrayTasks.unshift([textTask.textContent, count]);
  listTasks.prepend(clone);
  localStorage.setItem('listTasks', JSON.stringify(arrayTasks));
  buttonDeleteTask.addEventListener('click', deleteTask);
  buttonCompleteTask.addEventListener('click', (e) => {
    if (textTask.classList.contains('main__text_type_complete')) {
      uncompleteTask(e);
    } else {
      completeTask(e);
    }
  });
}

const markEvenTasks = () => {
  const tasks = document.querySelectorAll('.main__task');
  console.log(tasks);
  tasks.forEach((item, index) => {
    if (index % 2 !== 0) {
      item.classList.toggle('main__task_type_even');
    }
  });
}

const markOddTasks = () => {
  const tasks = document.querySelectorAll('.main__task');
  console.log(tasks);
  tasks.forEach((item, index) => {
    if (index % 2 === 0) {
      item.classList.toggle('main__task_type_odd');
    }
  });
}

formAddTask.addEventListener('submit', addTask);
buttonMarkEvenTasks.addEventListener('click', markEvenTasks);
buttonMarkOddTasks.addEventListener('click', markOddTasks);
