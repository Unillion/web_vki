// ========== MODEL (Хранение данных) ==========
class TaskModel {
  constructor() {
    this.tasks = [];
    this.loadFromStorage();
  }

  // Добавление новой задачи
  addTask(text) {
    const task = {
      id: Date.now(),
      text: text,
      completed: false,
      date: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
    this.tasks.unshift(task);
    this.saveToStorage();
    return task;
  }

  // Удаление одной задачи
  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveToStorage();
  }

  // Удаление всех задач
  deleteAllTasks() {
    this.tasks = [];
    this.saveToStorage();
  }

  // Переключение статуса задачи
  toggleTask(id) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveToStorage();
    }
  }

  // Получение задач с фильтрацией и сортировкой
  getTasks(filter = 'all', sortBy = 'date-desc') {
    let filteredTasks = [...this.tasks];

    // Фильтрация
    switch(filter) {
      case 'completed':
        filteredTasks = filteredTasks.filter(task => task.completed);
        break;
      case 'active':
        filteredTasks = filteredTasks.filter(task => !task.completed);
        break;
      case 'all':
      default:
        break;
    }

    // Сортировка
    switch(sortBy) {
      case 'date-asc':
        filteredTasks.sort((a, b) => a.id - b.id);
        break;
      case 'date-desc':
        filteredTasks.sort((a, b) => b.id - a.id);
        break;
      case 'name-asc':
        filteredTasks.sort((a, b) => a.text.localeCompare(b.text, 'ru'));
        break;
      case 'name-desc':
        filteredTasks.sort((a, b) => b.text.localeCompare(a.text, 'ru'));
        break;
    }

    return filteredTasks;
  }

  // Сохранение в localStorage
  saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Загрузка из localStorage
  loadFromStorage() {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      this.tasks = JSON.parse(stored);
    }
  }
}

// ========== VIEW (Отображение) ==========
class TaskView {
  constructor() {
    this.taskList = document.getElementById('taskList');
    this.taskInput = document.getElementById('taskInput');
    this.createButton = document.getElementById('create');
    this.deleteAllButton = document.getElementById('delete');
    this.filterLinks = document.querySelectorAll('.filter-link');
    this.sortSelect = document.getElementById('sortSelect');
    
    this.currentFilter = 'all';
    this.currentSort = 'date-desc';
  }

  // Отрисовка списка задач
  render(tasks) {
    this.taskList.innerHTML = '';
    
    if (tasks.length === 0) {
      return;
    }

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.dataset.id = task.id;
      if (task.completed) {
        li.classList.add('completed');
      }

      li.innerHTML = `
        <div class="task-row">
          <label>
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="text">${this.escapeHtml(task.text)}</span>
          </label>
          <button class="delete-task">✖</button>
        </div>
        <sub>${task.date}</sub>
      `;

      // Обработчик для чекбокса
      const checkbox = li.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => {
        this.onToggleTask(task.id);
      });

      // Обработчик для кнопки удаления
      const deleteButton = li.querySelector('.delete-task');
      deleteButton.addEventListener('click', () => {
        this.onDeleteTask(task.id);
      });

      this.taskList.appendChild(li);
    });
  }

  // Экранирование HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Получение текста из поля ввода
  getInputText() {
    return this.taskInput.value.trim();
  }

  // Очистка поля ввода
  clearInput() {
    this.taskInput.value = '';
  }

  // Установка активного фильтра
  setActiveFilter(filter) {
    this.currentFilter = filter;
    this.filterLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.filter === filter) {
        link.classList.add('active');
      }
    });
  }

  // Привязка обработчиков
  bindAddTask(handler) {
    this.createButton.addEventListener('click', () => {
      const text = this.getInputText();
      if (text) {
        handler(text);
        this.clearInput();
      }
    });

    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const text = this.getInputText();
        if (text) {
          handler(text);
          this.clearInput();
        }
      }
    });
  }

  bindDeleteAllTasks(handler) {
    this.deleteAllButton.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите удалить все задачи?')) {
        handler();
      }
    });
  }

  bindDeleteTask(handler) {
    this.onDeleteTask = handler;
  }

  bindToggleTask(handler) {
    this.onToggleTask = handler;
  }

  bindFilterChange(handler) {
    this.filterLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = link.dataset.filter;
        this.setActiveFilter(filter);
        handler(filter);
      });
    });
  }

  bindSortChange(handler) {
    this.sortSelect.addEventListener('change', () => {
      this.currentSort = this.sortSelect.value;
      handler(this.currentSort);
    });
  }
}

// ========== CONTROLLER (Связь Model и View) ==========
class TaskController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Привязка обработчиков
    this.view.bindAddTask(this.handleAddTask.bind(this));
    this.view.bindDeleteAllTasks(this.handleDeleteAllTasks.bind(this));
    this.view.bindDeleteTask(this.handleDeleteTask.bind(this));
    this.view.bindToggleTask(this.handleToggleTask.bind(this));
    this.view.bindFilterChange(this.handleFilterChange.bind(this));
    this.view.bindSortChange(this.handleSortChange.bind(this));

    // Начальная отрисовка
    this.updateView();
  }

  // Обновление отображения
  updateView() {
    const tasks = this.model.getTasks(
      this.view.currentFilter,
      this.view.currentSort
    );
    this.view.render(tasks);
  }

  // Обработчики событий
  handleAddTask(text) {
    this.model.addTask(text);
    this.updateView();
  }

  handleDeleteTask(id) {
    this.model.deleteTask(id);
    this.updateView();
  }

  handleDeleteAllTasks() {
    this.model.deleteAllTasks();
    this.updateView();
  }

  handleToggleTask(id) {
    this.model.toggleTask(id);
    this.updateView();
  }

  handleFilterChange(filter) {
    this.view.currentFilter = filter;
    this.updateView();
  }

  handleSortChange(sortBy) {
    this.view.currentSort = sortBy;
    this.updateView();
  }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  const model = new TaskModel();
  const view = new TaskView();
  const controller = new TaskController(model, view);
});