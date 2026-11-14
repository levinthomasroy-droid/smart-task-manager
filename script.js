
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks in browser storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask(event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) return;

    const task = {
        id: Date.now(),
        title: title,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    displayTasks();

    taskForm.reset();
}

// Mark task as completed or pending
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    displayTasks();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    const selectedFilter = filter.value;

    const filteredTasks = tasks.filter(task => {
        if (selectedFilter === "Pending") {
            return !task.completed;
        }

        if (selectedFilter === "Completed") {
            return task.completed;
        }

        return true;
    });

    document.getElementById("totalTasks").textContent =
        tasks.length;

    document.getElementById("pendingTasks").textContent =
        tasks.filter(task => !task.completed).length;

    document.getElementById("completedTasks").textContent =
        tasks.filter(task => task.completed).length;

    document.getElementById("emptyMessage").style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {
        const item = document.createElement("div");
        item.className = "task-item";

        const info = document.createElement("div");
        info.className = "task-info";

        if (task.completed) {
            info.classList.add("completed");
        }

        const title = document.createElement("span");
        title.textContent = task.title;

        const details = document.createElement("small");
        details.textContent = "Priority: " + task.priority;

        const priority = document.createElement("span");
        priority.className =
            "priority " + task.priority.toLowerCase();

        priority.textContent = task.priority;

        info.appendChild(title);
        info.appendChild(details);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        item.appendChild(checkbox);
        item.appendChild(info);
        item.appendChild(priority);
        item.appendChild(deleteButton);

        taskList.appendChild(item);
    });
}

// Event listeners
taskForm.addEventListener("submit", addTask);
filter.addEventListener("change", displayTasks);

// Load saved tasks
displayTasks();
