<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    bgColor?: string
    textColor?: string
  }>(),
  {
    title: 'Pod Data',
    subtitle: 'Completion checklist for NieR: Automata to track your in-game progress.',
    bgColor: '#C4C0A9', // Bg/secondary
    textColor: '#47453D', // Primary
  }
)
</script>

<template>
  <div
    :style="{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '48px',
      backgroundColor: props.bgColor,
      color: props.textColor,
      fontFamily: 'Inter, sans-serif',
    }"
  >
    <img src="/img/robot-primary.svg" style="width: 164px; height: 164px" alt="Robot Icon" />

    <div>
      <div style="display: flex; align-items: center">
        <!-- Title -->
        <h1
          :style="{
            fontSize: '64px',
            fontWeight: 600,
            textShadow: '6px 6px rgba(0, 0, 0, 0.1)',
            textTransform: 'uppercase',
          }"
        >
          Pod Data
        </h1>
        <span
          v-if="props.title && props.title !== 'Pod Data'"
          :style="{ fontSize: '64px', fontWeight: 500, margin: '0 24px' }"
          >-</span
        >
        <h2
          v-if="props.title && props.title !== 'Pod Data'"
          :style="{
            fontSize: '64px',
            fontWeight: 500,
            textShadow: '6px 6px rgba(0, 0, 0, 0.1)',
            textTransform: 'uppercase',
          }"
        >
          {{ props.title }}
        </h2>
      </div>
      <!-- Subtitle -->
      <p
        :style="{
          fontSize: '32px',
          textShadow: '4px 4px rgba(0, 0, 0, 0.1)',
          fontWeight: '400',
          opacity: 0.8,
          marginTop: '-4px',
        }"
      >
        {{ props.subtitle }}
      </p>
    </div>
  </div>
</template>
