<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: #21ba45">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Online Crime Report
        </q-toolbar-title>

        <q-btn-dropdown stretch icon="person" flat :label="'Hi, ' + user_details.first_name + ' ' + user_details.last_name">
        <q-list>
          <!-- <q-item v-for="n in 1" :key="`x.${n}`" clickable v-close-popup tabindex="0">
            <q-item-section avatar>
              <q-avatar icon="person" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Username</q-item-label>
              <q-item-label caption>February 22, 2016</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item> -->
          <!-- <q-separator inset spaced /> -->
          <!-- <q-item-label header>Files</q-item-label> -->
          <q-item v-for="n in 1" :key="`y.${n}`" clickable v-close-popup tabindex="0">
            <q-item-section avatar>
              <q-avatar icon="logout" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label @click="logout">Logout</q-item-label>
              <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
            </q-item-section>
            <!-- <q-item-section side>
              <q-icon name="info" />
            </q-item-section> -->
          </q-item>
        </q-list>
      </q-btn-dropdown>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Report Crime',
    icon: 'assignment',
    link: '/main'
  },
  {
    title: 'Missing Person',
    icon: 'person',
    link: '/missing-person'
  },
  {
    title: 'Most Wanted',
    icon: 'person',
    link: 'most-wanted'
  },
  {
    title: 'Lost and Found',
    icon: 'contact_page',
    link: 'lost-and-found'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  created () {
  },
  methods: {
    logout () {
      localStorage.removeItem('vuex')
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    }
  },
  computed: {
    ...mapGetters('auth', {
      user_details: 'user_details'
    })
  }
}
</script>

<style lang="stylus" scoped>
.q-menu.q-position-engine.scroll {
    left: 1203px imp !important;
}
</style>
