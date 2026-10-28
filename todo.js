(() => {
  'use strict';

  const STORAGE_KEY = 'taskflow.tasks.v1';
  const THEME_KEY = 'taskflow.theme.v1';
  const form = document.querySelector('#task-form');
  const input = document.querySelector('#task-input');
  const list = document.querySelector('#task-list');
  const emptyState = document.querySelector('#empty-state');
  const emptyTitle = document.querySelector('#empty-title');
  const emptyCopy = document.querySelector('#empty-copy');
  const count = document.querySelector('#task-count');
  const summary = document.querySelector('#summary');
  const message = document.querySelector('#form-message');
  const filters = document.querySelector('.filters');
  const clearCompletedButton = document.querySelector('#clear-completed');
  const themeToggle = document.querySelector('#theme-toggle');
  const editDialog = document.querySelector('#edit-dialog');
  const editForm = document.querySelector('#edit-form');
  const editInput = document.querySelector('#edit-input');
  const cancelEdit = document.querySelector('#cancel-edit');

  let tasks = loadTasks();
  let currentFilter = 'all';
  let editingId = null;

  function loadTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(saved)) return [];
      return saved.filter(task =>
        task && typeof task.id === 'string' &&
        typeof task.text === 'string' &&
        typeof task.completed === 'boolean'
      );
    } catch (error) {
      console.warn('Could not read saved tasks:', error);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Could not save tasks:', error);
      message.textContent = 'Unable to save locally. Check your browser storage settings.';
      return false;
    }
  }

  function visibleTasks() {
    if (currentFilter === 'active') return tasks.filter(task => !task.completed);
    if (currentFilter === 'completed') return tasks.filter(task => task.completed);
    return tasks;
  }

  function render() {
    const shown = visibleTasks();
    const remaining = tasks.filter(task => !task.completed).length;
    count.textContent = `${remaining} ${remaining === 1 ? 'task' : 'tasks'} left`;
    summary.textContent = `${tasks.length} total ${tasks.length === 1 ? 'task' : 'tasks'}`;
    clearCompletedButton.disabled = !tasks.some(task => task.completed);
    clearCompletedButton.style.opacity = clearCompletedButton.disabled ? '.45' : '1';

    list.replaceChildren();
    shown.forEach(task => {
      const item = document.createElement('li');
      item.className = `task-item${task.completed ? ' completed' : ''}`;
      item.dataset.id = task.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-check';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', `Mark "${task.text}" ${task.completed ? 'active' : 'completed'}`);
      checkbox.dataset.action = 'toggle';

      const label = document.createElement('span');
      label.className = 'task-label';
      label.textContent = task.text;

      const actions = document.createElement('div');
      actions.className = 'task-actions';

      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'action-button';
      edit.dataset.action = 'edit';
      edit.setAttribute('aria-label', `Edit task: ${task.text}`);
      edit.title = 'Edit task';
      edit.textContent = '✎';

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'action-button delete';
      remove.dataset.action = 'delete';
      remove.setAttribute('aria-label', `Delete task: ${task.text}`);
      remove.title = 'Delete task';
      remove.textContent = '×';

      actions.append(edit, remove);
      item.append(checkbox, label, actions);
      list.append(item);
    });

    const isEmpty = shown.length === 0;
    emptyState.hidden = !isEmpty;
    if (isEmpty) {
      if (currentFilter === 'active' && tasks.length) {
        emptyTitle.textContent = 'All caught up!';
        emptyCopy.textContent = 'You have no active tasks right now.';
      } else if (currentFilter === 'completed' && tasks.length) {
        emptyTitle.textContent = 'Nothing completed yet';
        emptyCopy.textContent = 'Completed tasks will show up here.';
      } else {
        emptyTitle.textContent = 'A fresh start';
        emptyCopy.textContent = 'Add your first task above and make today count.';
      }
    }
  }

  function setFilter(filter) {
    currentFilter = filter;
    filters.querySelectorAll('[data-filter]').forEach(button => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    render();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      message.textContent = 'Please enter a task before adding it.';
      input.focus();
      return;
    }
    tasks.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, completed: false, createdAt: Date.now() });
    saveTasks();
    setFilter('all');
    input.value = '';
    message.textContent = 'Task added.';
    input.focus();
  });

  // One delegated listener handles checkbox, edit and delete actions for every task row.
  list.addEventListener('click', event => {
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;
    const item = actionElement.closest('.task-item');
    if (!item) return;
    const task = tasks.find(entry => entry.id === item.dataset.id);
    if (!task) return;

    if (actionElement.dataset.action === 'toggle') {
      task.completed = actionElement.checked;
      saveTasks();
      render();
    } else if (actionElement.dataset.action === 'edit') {
      editingId = task.id;
      editInput.value = task.text;
      editDialog.showModal();
      editInput.focus();
    } else if (actionElement.dataset.action === 'delete') {
      tasks = tasks.filter(entry => entry.id !== task.id);
      saveTasks();
      render();
      message.textContent = 'Task deleted.';
    }
  });

  // The checkbox click is handled by the delegated click listener above.
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (button) setFilter(button.dataset.filter);
  });

  clearCompletedButton.addEventListener('click', () => {
    const completedCount = tasks.filter(task => task.completed).length;
    if (!completedCount) return;
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    render();
    message.textContent = `${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'} cleared.`;
  });

  editForm.addEventListener('submit', event => {
    event.preventDefault();
    const newText = editInput.value.trim();
    if (!newText) {
      editInput.focus();
      return;
    }
    const task = tasks.find(entry => entry.id === editingId);
    if (task) {
      task.text = newText;
      saveTasks();
      render();
      message.textContent = 'Task updated.';
    }
    editingId = null;
    editDialog.close();
  });

  cancelEdit.addEventListener('click', () => {
    editingId = null;
    editDialog.close();
  });

  editDialog.addEventListener('click', event => {
    if (event.target === editDialog) editDialog.close();
  });

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggle.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  }

  const storedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(storedTheme === 'dark' ? 'dark' : 'light');
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem(THEME_KEY, nextTheme); } catch (error) { /* Theme still works for this page. */ }
  });

  render();
})();
