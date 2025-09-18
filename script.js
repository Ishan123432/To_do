// Simple To-Do with localStorage
const input = document.getElementById('newTask');
const addBtn = document.getElementById('addBtn');
const tasksEl = document.getElementById('tasks');
const clearCompleted = document.getElementById('clearCompleted');
const exportBtn = document.getElementById('exportBtn');
const countEl = document.getElementById('count');

let tasks = JSON.parse(localStorage.getItem('todo.tasks')||'[]');

function save(){ localStorage.setItem('todo.tasks', JSON.stringify(tasks)); render(); }

function addTask(text){
  if(!text || !text.trim()) return;
  tasks.push({id:Date.now(), text:text.trim(), done:false});
  save();
}

function toggleTask(id){
  tasks = tasks.map(t => t.id===id?{...t, done:!t.done}:t);
  save();
}

function deleteTask(id){
  tasks = tasks.filter(t=>t.id!==id);
  save();
}

function editTask(id, newText){
  tasks = tasks.map(t => t.id===id?{...t, text:newText}:t);
  save();
}

function clearCompletedTasks(){
  tasks = tasks.filter(t=>!t.done);
  save();
}

function render(){
  tasksEl.innerHTML='';
  tasks.forEach(t=>{
    const li = document.createElement('li');
    li.className = 'task' + (t.done?' completed':'');
    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type='checkbox'; cb.checked = t.done; cb.addEventListener('change', ()=>toggleTask(t.id));
    const span = document.createElement('span'); span.className='text'; span.contentEditable = true;
    span.innerText = t.text;
    span.addEventListener('blur', ()=>{ editTask(t.id, span.innerText); });
    span.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); span.blur(); } });
    const del = document.createElement('button'); del.className='icon'; del.innerText='Delete'; del.addEventListener('click', ()=>deleteTask(t.id));
    label.appendChild(cb); label.appendChild(span);
    li.appendChild(label); li.appendChild(del);
    tasksEl.appendChild(li);
  });
  countEl.innerText = `${tasks.filter(t=>!t.done).length} pending`;
}

addBtn.addEventListener('click', ()=>{ addTask(input.value); input.value=''; input.focus(); });
input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ addTask(input.value); input.value=''; } });

clearCompleted.addEventListener('click', ()=>{ clearCompletedTasks(); });
exportBtn.addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(tasks, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'tasks.json'; a.click();
  URL.revokeObjectURL(url);
});

render();
