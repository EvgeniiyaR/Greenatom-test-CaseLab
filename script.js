const templateTask = document.querySelector('#template-task');
const inputTask = document.querySelector('.main__input');
const buttonAddTask = document.querySelector('.main__button_type_add');
const formAddTask = document.querySelector('.main__form');
const listTasks = document.querySelector('.main__list-tasks');
const completeTasks = [];
let count = 0;

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
  const tasks = JSON.parse(localStorage.getItem('listsTasks'));
  listTasks.removeChild(target);
  tasks.forEach((item, index) => {
    if ((tasks.length - index) === Number(target.dataset.id)) {
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
  count = tasks.length;
  tasks.forEach((item, index) => {
    const [clone, textTask, buttonCompleteTask, buttonDeleteTask, task] = getTemplate();
    textTask.textContent = item;
    task.dataset.id = tasks.length - index;
    buttonDeleteTask.addEventListener('click', deleteTask);
    listTasks.appendChild(clone);
  })
}

const addTask = (e) => {
  e.preventDefault();
  const [clone, textTask, buttonCompleteTask, buttonDeleteTask, task] = getTemplate();
  textTask.textContent = inputTask.value;
  inputTask.value = '';
  buttonDeleteTask.addEventListener('click', deleteTask);
  buttonCompleteTask.addEventListener('click', completeTask);
  count += 1;
  task.dataset.id = count;
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