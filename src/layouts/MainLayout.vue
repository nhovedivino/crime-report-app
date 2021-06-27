<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: #21ba45">
        <q-btn
          v-if="user_details.roles[0].name ==='Complainant'"
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

        <!-- <q-btn-dropdown v-if="user_details.roles[0].name ==='Complainant'" stretch icon="person" flat :label="'Hi, ' + user_details.first_name + ' ' + user_details.last_name">
          <q-list>
            <q-item v-for="n in 1" :key="`y.${n}`" clickable v-close-popup tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="logout" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label @click="logout">Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown> -->

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="205"
      :breakpoint="400"
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item-label
            header
            class="text-grey-8"
          >
            Fill form
          </q-item-label>
          <q-separator />
          <q-item clickable to="/main" v-ripple>
            <q-item-section avatar>
              <q-icon name="assignment" />
            </q-item-section>

            <q-item-section>
              Report Crime
            </q-item-section>
          </q-item>
          <q-item-label
            header
            class="text-grey-8"
          >
            Notification
          </q-item-label>
          <q-separator />
          <q-item clickable @click="isSeened" to="/notification-approved" v-ripple>
            <q-item-section avatar class="relative-position">
              <q-icon name="done" />
              <q-badge v-if="!is_seened && !is_seened && current_count > 0" color="red" floating class="q-mr-lg">{{ current_count }}</q-badge>
            </q-item-section>

            <q-item-section>
              Approved Reports
            </q-item-section>
          </q-item>
          <q-item-label
            header
            class="text-grey-8"
          >
            View
          </q-item-label>
          <q-separator />
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
          <q-item-label
            header
            class="text-grey-8"
          >
            Settings
          </q-item-label>
          <q-separator />
          <q-item clickable to="/security-tips" v-ripple>
            <q-item-section avatar>
              <q-icon name="push_pin" />
            </q-item-section>

            <q-item-section>
              Security Tips
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section>
              Logout
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">{{ user_details.first_name + ' ' + user_details.last_name }}</div>
          <div>{{ user_details.email }}</div>
        </div>
      </q-img>
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
      is_seened: false,
      essentialLinks: linksData
    }
  },
  created () {
    this.getNotifApproved()
  },
  methods: {
    getNotifApproved () {
      this.$store.dispatch('auth/getNotifApproved')
    },
    isSeened () {
      this.is_seened = true
      this.$store.dispatch('notification/isSeenNotif', { is_seen: true })
    },
    logout () {
      localStorage.removeItem('vuex')
      this.$store.dispatch('notification/isSeenNotif', { is_seen: false })
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    }
  },
  computed: {
    ...mapGetters('auth', {
      user_details: 'user_details',
      current_count: 'current_count',
      notif_approved: 'notif_approved'
    }),
    ...mapGetters('notification', {
      is_seen: 'is_seen'
    })
  }
}
</script>

<style lang="stylus" scoped>
.q-menu.q-position-engine.scroll {
    left: 1203px imp !important;
}
.md-theme-default a:not(.md-button) {
  color: inherit !important;
}
body {
  font-family: 'Nunito' !important;
}
</style>
