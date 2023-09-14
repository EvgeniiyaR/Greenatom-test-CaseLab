const templateTask = document.querySelector('#template-task');
const inputTask = document.querySelector('.main__input');
const buttonAddTask = document.querySelector('.main__button_type_add');
const formAddTask = document.querySelector('.main__form');
const listTasks = document.querySelector('.main__list-tasks');
const completeTasks = [];

const getTemplate = () => {
  const clone = templateTask.content.cloneNode(true);
  const textTask = clone.querySelector('.main__text');
  const buttonCompleteTask = clone.querySelector('.main__button_type_complete');
  const buttonDeleteTask = clone.querySelector('.main__button_type_delete');

  return [clone, textTask, buttonCompleteTask, buttonDeleteTask];
}

const deleteTask = (e) => {
  const target = e.target.parentNode;
  const tasks = JSON.parse(localStorage.getItem('listsTasks'));
  const text = target.querySelector('.main__text').textContent;
  listTasks.removeChild(target);
  tasks.forEach((item, index) => {
    if (item === text) {
      tasks.splice(index, 1);
    }
  })
  localStorage.setItem('listsTasks', JSON.stringify(tasks));
}

const completeTask = (e) => {
  const target = e.target.parentNode;
  const text = target.querySelector('.main__text');
  completeTasks.push(text.textContent);
  localStorage.setItem('completeTasks', JSON.stringify(completeTasks));
  text.classList.add('main__text_type_complete');
  listTasks.appendChild(target);
}


if (localStorage.getItem('listsTasks')) {
  const tasks = JSON.parse(localStorage.getItem('listsTasks'));
  tasks.forEach((item) => {
    const [clone, textTask, buttonCompleteTask, buttonDeleteTask] = getTemplate();
    textTask.textContent = item;
    buttonDeleteTask.addEventListener('click', deleteTask);
    listTasks.appendChild(clone);
  })
}

const addTask = (e) => {
  e.preventDefault();
  const [clone, textTask, buttonCompleteTask, buttonDeleteTask] = getTemplate();
  textTask.textContent = inputTask.value;
  inputTask.value = '';
  buttonDeleteTask.addEventListener('click', deleteTask);
  buttonCompleteTask.addEventListener('click', completeTask);
  listTasks.prepend(clone);
  const tasks = document.querySelectorAll('.main__task');
  const arrayTasks = [];
  tasks.forEach((item) => {
    const text = item.querySelector('.main__text').textContent;
    arrayTasks.push(text);
  });
  localStorage.setItem('listsTasks', JSON.stringify(arrayTasks));
}

formAddTask.addEventListener('submit', addTask);