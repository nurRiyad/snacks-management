<script setup lang="ts">
import { ContentLoader } from 'vue-content-loader'
</script>

<template>
  <ContentLoader
    viewBox="0 0 400 160"
    :speed="2"
    primary-color="#c9c9c9"
    secondary-color="#ecebeb"
  >
    <rect x="48" y="19" rx="0" ry="0" width="343" height="16" />
    <rect x="19" y="49" rx="0" ry="0" width="377" height="16" />
    <rect x="37" y="80" rx="0" ry="0" width="135" height="14" />
    <rect x="194" y="80" rx="0" ry="0" width="56" height="14" />
    <rect x="273" y="81" rx="0" ry="0" width="101" height="14" />
    <rect x="58" y="110" rx="0" ry="0" width="328" height="16" />
    <rect x="44" y="134" rx="0" ry="0" width="328" height="16" />
  </ContentLoader>
</template>
