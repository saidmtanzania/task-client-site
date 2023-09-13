<template>
    <main style="min-height: 50vh; margin-top: 2rem;">
        <div class="container">
            <div class="row">
                <div class="col-md-8 offset-md-2">
                    <!-- Add new Task -->
                    <NewTask @added="handleAddedTask" />

                    <!-- List of uncompleted tasks -->
                    <Task :tasks="uncompletedTask" />

                    <!-- Show toggle button -->
                    <div class="text-center my-3" v-show="showToggleCompletedBtn">
                        <button class="btn btn-sm btn-secondary"
                            @click="$event => showCompletedTasks = !showCompletedTasks">
                            <span v-if="!showCompletedTasks">Show completed</span>
                            <span v-else>Hide completed</span>
                        </button>
                    </div>

                    <!-- List of completed tasks -->
                    <Task :tasks="completedTask" :show="completedTaskIsVisible && showCompletedTasks" />
                </div>
            </div>
        </div>
    </main>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { allTasks, createTasks } from '../http/tasks-api';
import Task from '../components/tasks/Task.vue';
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
    tasks.value.unshift(createTask.data);
}
</script>