<template>
  <div class="event-section">
    <h2 class="event-title">Upcoming Events</h2>
    <div class="event-card" v-for="event in events" :key="event.id">
      <h3>{{ event.title }}</h3>
      <p>{{ event.date }}</p>
      <p>{{ event.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventDescription',
  data() {
    return {
      events: [
        { id: 1, title: 'Event A', date: '2024-10-20', description: 'Exciting event details here...' },
        { id: 2, title: 'Event B', date: '2024-11-15', description: 'Another great event...' }
      ]
    };
  }
};
</script>

<style scoped>
.event-section {
  background-color: #82c0cc;
  padding: 20px;
  color: #16697a;
}

.event-card {
  background-color: #ede7e3;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
</style>
