<script setup lang="ts">

const { fetchUsers } = await useUserApi();
const { data, error } = await fetchUsers();

onMounted(async () => {
  console.log(data);
  console.log(error);
})
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center justify-center h-screen">
      <u-button>Click me</u-button>
      <theme-toggle />
    </div>
  </div>
</template>
