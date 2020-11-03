<template>
  <div class="card">
    <div class="widget">
      <div class="widget__icon">
        <fa :icon="['fas', 'sync-alt']" />
      </div>
      <div class="widget__body">
        <h4 class="uptime__data-uptime">-</h4>
        <h4 class="uptime__data-load">Load: -</h4>
        <p class="uptime__label">System Uptime</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>
