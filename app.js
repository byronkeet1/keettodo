class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.draggedId = null;

        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.itemsLeft = document.getElementById('itemsLeft');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.prioritySelect = document.getElementById('prioritySelect');

        this.darkModeToggle = document.getElementById('darkModeToggle');

        this.init();
    }

    init() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        this.clearCompleted.addEventListener('click', () => this.clearCompletedTodos());
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

        this.todoList.addEventListener('dragstart', (e) => this.handleDragStart(e));
        this.todoList.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.todoList.addEventListener('drop', (e) => this.handleDrop(e));
        this.todoList.addEventListener('dragend', (e) => this.handleDragEnd(e));

        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
            this.darkModeToggle.textContent = '☀️';
        }

        this.render();
    }

    toggleDarkMode() {
        const isDark = document.body.classList.toggle('dark');
        this.darkModeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDark);
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: this.prioritySelect.value,
            createdAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        this.saveTodos();
        this.todoInput.value = '';
        this.render();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    cyclePriority(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const cycle = { low: 'medium', medium: 'high', high: 'low' };
            todo.priority = cycle[todo.priority || 'medium'];
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }
    
    clearCompletedTodos() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
    }
    
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }
    
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    
    render() {
        const filteredTodos = this.getFilteredTodos();
        const activeCount = this.todos.filter(t => !t.completed).length;
        const completedCount = this.todos.filter(t => t.completed).length;
        
        this.itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
        this.clearCompleted.disabled = completedCount === 0;
        
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <p>${this.currentFilter === 'completed' ? 'No completed tasks yet!' : this.currentFilter === 'active' ? 'No active tasks. Great job!' : 'No todos yet. Add one above!'}</p>
                </div>
            `;
            return;
        }
        
        this.todoList.innerHTML = filteredTodos.map(todo => {
            const priority = todo.priority || 'medium';
            const priorityLabel = priority.charAt(0).toUpperCase() + priority.slice(1);
            return `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}" draggable="true">
                <span class="drag-handle" aria-label="Drag to reorder">⠿</span>
                <input type="checkbox" class="todo-checkbox"
                    ${todo.completed ? 'checked' : ''}
                    onchange="app.toggleTodo(${todo.id})">
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <span class="priority-badge priority-${priority}" onclick="app.cyclePriority(${todo.id})" title="Click to change priority">${priorityLabel}</span>
                <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">🗑️</button>
            </li>
        `;
        }).join('');
    }
    
    handleDragStart(e) {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        this.draggedId = Number(item.dataset.id);
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.dataset.id);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const item = e.target.closest('.todo-item');
        if (!item || Number(item.dataset.id) === this.draggedId) return;

        const rect = item.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const isAbove = e.clientY < midpoint;

        this.todoList.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => {
            el.classList.remove('drag-over-top', 'drag-over-bottom');
        });

        item.classList.add(isAbove ? 'drag-over-top' : 'drag-over-bottom');
    }

    handleDrop(e) {
        e.preventDefault();
        const targetItem = e.target.closest('.todo-item');
        if (!targetItem) return;

        const targetId = Number(targetItem.dataset.id);
        if (targetId === this.draggedId) return;

        const rect = targetItem.getBoundingClientRect();
        const isAbove = e.clientY < rect.top + rect.height / 2;

        const fromIndex = this.todos.findIndex(t => t.id === this.draggedId);
        const [moved] = this.todos.splice(fromIndex, 1);

        let toIndex = this.todos.findIndex(t => t.id === targetId);
        if (!isAbove) toIndex++;

        this.todos.splice(toIndex, 0, moved);
        this.saveTodos();
        this.render();
    }

    handleDragEnd() {
        this.draggedId = null;
        this.todoList.querySelectorAll('.dragging, .drag-over-top, .drag-over-bottom').forEach(el => {
            el.classList.remove('dragging', 'drag-over-top', 'drag-over-bottom');
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const app = new TodoApp();
