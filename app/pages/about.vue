<template>
  <section class="section-spacing">
    <h1 class="main-header">About</h1>

    <p>
      Pod Data is an unofficial checklist for tracking your completion progress in
      <em>NieR: Automata</em>. Mark various items, quests, and achievements as completed, to help
      keep track of what you've done and what still needs to be accomplished.
    </p>

    <p>
      Pod Data is an open-source project, and the full source code is available on GitHub. It is a
      fan-site and unaffiliated with Square Enix or PlatinumGames.
    </p>

    <p>
      If you encounter any issues or have suggestions for improvements, you can contact me via
      Discord.
    </p>

    <div class="d-flex ga-4 flex-wrap">
      <NuxtLink
        :to="`https://discord.com/users/${DISCORD_ID}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-decoration-none"
      >
        <v-card
          elevation="2"
          class="social-card discord-card rounded-lg w-fit d-flex flex-row align-center"
        >
          <div class="pa-2 d-flex align-center">
            <div class="position-relative mr-3">
              <v-avatar color="white" class="discord-avatar">
                <v-img :src="avatarUrl" alt="Avatar" />
              </v-avatar>
              <div class="status-indicator" :class="`bg-${statusColor}`" />
            </div>
            <div>
              <v-card-title class="pa-0 text-body-1">bjqrnvv</v-card-title>
              <v-card-subtitle class="pa-0 text-caption">Discord</v-card-subtitle>
            </div>
          </div>
          <v-divider vertical></v-divider>
          <v-avatar class="ma-2 rounded-0" color="transparent">
            <v-icon size="32">
              <v-img src="/img/discord-white.svg" alt="Discord Logo" :cover="false" />
            </v-icon>
          </v-avatar>
        </v-card>
      </NuxtLink>

      <NuxtLink
        to="https://github.com/bjornverbakel/pod-data"
        target="_blank"
        rel="noopener noreferrer"
        class="text-decoration-none"
      >
        <v-card
          elevation="2"
          class="social-card github-card rounded-lg w-fit d-flex flex-row align-center"
        >
          <div class="pa-2 pl-4">
            <v-card-title class="pa-0 text-body-1">/pod-data</v-card-title>
            <v-card-subtitle class="pa-0 text-caption">GitHub</v-card-subtitle>
          </div>
          <v-divider vertical></v-divider>
          <v-avatar class="ma-2 rounded-0" color="transparent">
            <v-icon size="32" icon="mdi-github" />
          </v-avatar>
        </v-card>
      </NuxtLink>
    </div>
  </section>

  <section class="section-spacing">
    <h1 class="sub-header">Resources</h1>
    <ul>
      <li>
        <a
          href="https://nierautomata.wiki.fextralife.com/Nier+Automata+Wiki"
          target="_blank"
          rel="noopener noreferrer"
          class="custom-link"
        >
          FextraLife NieR: Automata Wiki
        </a>
        <span class="text-medium-emphasis">- Completion data & guides</span>
      </li>
      <li>
        <a
          href="https://nier.fandom.com/wiki/NieR:Automata"
          target="_blank"
          rel="noopener noreferrer"
          class="custom-link"
        >
          Fandom NieR: Automata Wiki
        </a>
        <span class="text-medium-emphasis">- Completion data</span>
      </li>
      <li>
        <a
          href="https://steamcommunity.com/sharedfiles/filedetails/?id=1690393671"
          target="_blank"
          rel="noopener noreferrer"
          class="custom-link"
        >
          Steam Community: 100% Guide to NieR:Automata™
        </a>
        <span class="text-medium-emphasis">- Completion data</span>
      </li>
      <li>
        <a
          href="https://fearlessrevolution.com/viewtopic.php?p=244780#p244780"
          target="_blank"
          rel="noopener noreferrer"
          class="custom-link"
        >
          Fearless Revolution: NieR Automata
        </a>
        <span class="text-medium-emphasis">- Save file IDs</span>
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
useHead({
  title: 'About',
})

const DISCORD_ID = '530835767551983646'

const { data: discordData } = useFetch<any>(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`, {
  server: false,
})

const status = computed(() => {
  if (!discordData.value?.success) return 'offline'
  return discordData.value.data.discord_status
})

const statusColor = computed(() => {
  switch (status.value) {
    case 'online':
      return 'success'
    case 'idle':
      return 'warning'
    case 'dnd':
      return 'error'
    default:
      return 'grey'
  }
})

const avatarUrl = computed(() => {
  if (discordData.value?.success && discordData.value.data.discord_user.avatar) {
    return `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${discordData.value.data.discord_user.avatar}.webp?size=128`
  }
  return 'https://cdn.discordapp.com/avatars/530835767551983646/6dbadaa679fdaecfbc4d7d68d398302e.webp?size=128'
})
</script>

<style scoped lang="scss">
@use 'sass:color';

$discord-color: #5865f2;
$github-color: #273242;

.social-card {
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    background-color 0.2s ease-in-out;
  color: white;

  &:hover {
    transform: translateY(-2px);
  }
}

.discord-card {
  background-color: $discord-color;

  &:hover {
    $hover-color: color.mix(white, $discord-color, 15%);
    background-color: $hover-color;

    .status-indicator {
      border-color: $hover-color;
    }
  }
}

.github-card {
  background-color: $github-color;

  &:hover {
    background-color: color.mix(white, $github-color, 15%);
  }
}

.status-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid $discord-color;
  transition: border-color 0.2s ease-in-out;
}
</style>
