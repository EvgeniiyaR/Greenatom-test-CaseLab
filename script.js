const templateTask = document.querySelector('#template-task');
const inputTask = document.querySelector('.main__input');
const buttonAddTask = document.querySelector('.main__button_type_add');
const formAddTask = document.querySelector('.main__form');
const listTasks = document.querySelector('.main__list-tasks');

const getTemplate = () => {
  const clone = templateTask.content.cloneNode(true);
  const textTask = clone.querySelector('.main__text');
  const buttonCompleteTask = clone.querySelector('.main__button_type_complete');
  const buttonDeleteTask = clone.querySelector('.main__button_type_delete');

  return [clone, textTask, buttonCompleteTask, buttonDeleteTask];
}

const deleteTask = (e) => {
  const target = e.target.parentNode;
  listTasks.removeChild(target);
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