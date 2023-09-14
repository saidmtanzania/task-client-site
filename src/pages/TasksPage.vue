<template>
    <main style="min-height: 50vh; margin-top: 2rem;">
        <div class="container">
            <div class="row">
                <div class="col-md-8 offset-md-2">
                    <!-- Add new Task -->
                    <NewTask @added="handleAddedTask" />

                    <!-- List of uncompleted tasks -->
                    <Task :tasks="uncompletedTask" @updated="handleUpdatedTask" @completed="handleCompletedTask"
                        @removed="handleRemovedTasks" />

                    <!-- Show toggle button -->
                    <div class="text-center my-3" v-show="showToggleCompletedBtn">
                        <button class="btn btn-sm btn-secondary"
                            @click="$event => showCompletedTasks = !showCompletedTasks">
                            <span v-if="!showCompletedTasks">Show completed</span>
                            <span v-else>Hide completed</span>
                        </button>
                    </div>

                    <!-- List of completed tasks -->
                    <Task :tasks="completedTask" @updated="handleUpdatedTask" @completed="handleCompletedTask"
                        :show="completedTaskIsVisible && showCompletedTasks" @removed="handleRemovedTasks" />
                </div>
            </div>
        </div>
    </main>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { allTasks, createTasks, updateTasks, completeTask, removeTasks } from '../http/tasks-api';
import Task from '../components/tasks/Tasks.vue';
import NewTask from '../components/tasks/NewTask.vue';

const tasks = ref([]);

onMounted(async () => {
    const { data } = await allTasks();
    tasks.value = data.data;
});

const uncompletedTask = computed(() => tasks.value.filter(tasks => !tasks.is_completed));
const completedTask = computed(() => tasks.value.filter(tasks => tasks.is_completed));
const showToggleCompletedBtn = computed(() => uncompletedTask.value.length > 0 && completedTask.value.length > 0)
const completedTaskIsVisible = computed(() => uncompletedTask.value.length === 0 || completedTask.value.length > 0)
const showCompletedTasks = ref(false);

const handleAddedTask = async (newTask) => {
    const { data: createdTask } = await createTasks(newTask);
    tasks.value.unshift(createdTask.data);
}

const handleUpdatedTask = async (task) => {
    const { data: updatedTask } = await updateTasks(task.id, { name: task.name })

    const currentTask = tasks.value.find(item => item.id === task.id)
    currentTask.name = updatedTask.data.name
}

const handleCompletedTask = async (task) => {
    const { data: updatedTask } = await completeTask(task.id, { is_completed: task.is_completed })

    const currentTask = tasks.value.find(item => item.id === task.id)
    currentTask.is_completed = updatedTask.data.is_completed
}

const handleRemovedTasks = async (task) => {
    await removeTasks(task.id)
    const index = tasks.value.findIndex(item => item.id === task.id)
    tasks.value.splice(index, 1)
}
</script>