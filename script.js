// --------- Form Validation ---------
const form = document.getElementById('contactForm');
const formResult = document.getElementById('formResult');

function showError(input, message) {
  const parent = input.parentElement;
  let err = parent.querySelector('.error');
  if (!err) {
    err = document.createElement('div');
    err.className = 'error';
    parent.appendChild(err);
  }
  err.textContent = message;
}

function clearError(input) {
  const err = input.parentElement.querySelector('.error');
  if (err) err.remove();
}

function isValidEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formResult.textContent = '';
  formResult.className = '';
  
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');

  [name, email, message].forEach(clearError);

  let valid = true;
  if (!name.value.trim()) { showError(name, 'Enter your name'); valid = false; }
  if (!email.value.trim()) { showError(email, 'Enter email'); valid = false; }
  else if (!isValidEmail(email.value)) { showError(email, 'Invalid email'); valid = false; }
  if (!message.value.trim()) { showError(message, 'Message cannot be empty'); valid = false; }

  if (!valid) {
    formResult.textContent = 'Fix errors above.';
    formResult.className = 'error';
    return;
  }

  // Success message
  formResult.textContent = 'Form submitted successfully!';
  formResult.className = 'success';
  form.reset();
});

form.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    clearError(e.target);
    formResult.textContent = '';
    formResult.className = '';
  }
});

// --------- Dynamic To-Do List ---------
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function saveTasks(){
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(){
  taskList.innerHTML = '';
  if (tasks.length === 0){
    taskList.innerHTML = '<li class="meta">No tasks yet.</li>';
    return;
  }
  tasks.forEach((t,i) => {
    const li = document.createElement('li');
    li.className = 'task' + (t.completed ? ' completed' : '');
    li.innerHTML = `
      <input type="checkbox" data-index="${i}" ${t.completed ? 'checked' : ''}>
      <span>${t.text}</span>
      <button class="delete" data-index="${i}">✖</button>
    `;
    taskList.appendChild(li);
  });
}

function addTask(){
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, completed:false });
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

function toggleComplete(index){
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index){
  tasks.splice(index,1);
  saveTasks();
  renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keyup', e => { if (e.key === 'Enter') addTask(); });

taskList.addEventListener('click', (e) => {
  const idx = e.target.dataset.index;
  if (e.target.type === 'checkbox') toggleComplete(idx);
  if (e.target.classList.contains('delete')) deleteTask(idx);
});

renderTasks();
