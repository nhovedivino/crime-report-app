<template>
  <div class="q-pa-md flex flex-center">
    <q-card v-if="user_details.roles[0].name !=='Complainant'" class="my-card">
      <q-card-section>
        User role is not a complainant. Please login to another account.
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-space></q-space>
        <q-btn @click="logout()" justify-end flat right color="primary">
          Login
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-dialog v-model="login" persistent>
      <q-card id="card">
        <q-card-section>
          <div class="text-h1 text text-center text-poppins hello">
            Hello {{ user_details.first_name }}!
          </div>
          <div class="text-h6 text text-center text-nunito" style="margin-bottom: 8px;">
            Good to see you here
          </div><br>
          <div class="text-h6 text-center">
            <q-btn v-close-popup @click="changeLogin" class="border-gradient border-gradient-cyan" style="color: #325d94" label="LET'S START" />
          </div>
        </q-card-section>

        <!-- <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup @click="changeLogin"/>
        </q-card-actions> -->
      </q-card>
    </q-dialog>

    <md-content class="md-elevation-3" style="width: 100% !important">

      <q-dialog v-model="alert">
        <q-card>
          <q-card-section>
            <div class="text-h6">Confirmation</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-checkbox size="xl" v-model="is_witness" val="xl" label="In order to proceed, please check the box if you want to be the witness of this report." />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn flat label="Proceed" :disable="!is_witness" @click="onSubmit" color="primary" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- <q-card v-if="user_details.roles[0].name !=='Complainant'" class="my-card">
        <q-card-section>
          User role is not a complainant. Please login to another account.
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-space></q-space>
          <q-btn justify-end flat right color="primary">
            Reserve
          </q-btn>
        </q-card-actions>
      </q-card> -->

      <q-card class="my-card" v-if="user_details.roles[0].name ==='Complainant'">
        <q-card-section>

          <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset" class="q-gutter-md">
            <div class="title text-center q-gutter-md">
              <div class="md-title">Report Crime</div>
            </div>

            <q-select
              @input="onChangeValue"
              option-value="type"
              option-label="type"
              :options="crime_type"
              emit-value
              map-options
              :disable="loading"
              ref="crime_id"
              :dense="dense"
              label="Type of Crime *"
              placeholder="Enter type of crime"
              v-model="formData.crime_id"
              lazy-rules
              :rules="[val => !!val || 'Field is required']"
            />

            <q-input
              ref="name"
              label="Name of Missing/Lost and Found Items/Wanted/Suspect"
              placeholder="Enter Name"
              v-model="formData.name"
              :disable="loading"
            />

            <!-- <q-input
              ref="address"
              label="Address"
              placeholder="Enter Complete Address"
              v-model="formData.address"
            /> -->

            <!-- <q-input
              v-if="onChangeValue"
              ref="focus_crime_type"
              label="Focus type of crime *"
              v-model="formData.focus_crime_type"
            /> -->
            <q-select
              v-model="formData.address"
              :disable="loading"
              emit-value
              map-options
              :options="puroks"
              label="Address"
            />

            <q-select v-if="onChangeValue" v-model="formData.focus_crime_type" :disable="loading" :options="options" label="Focus type of crime" />

            <q-input
              ref="event_detail"
              label="Event Detail"
              type="textarea"
              placeholder="Enter event details"
              v-model="formData.event_detail"
              :disable="loading"
              lazy-rules
              :rules="[val => !!val || 'Field is required']"
            />

            <!-- <q-input
              ref="action_taken"
              label="Action Taken"
              type="textarea"
              placeholder="Enter action taken"
              v-model="formData.action_taken"
              lazy-rules
              :rules="[val => !!val || 'Field is required']"
            />

            <q-input
              ref="summary"
              label="Summary"
              type="textarea"
              placeholder="Enter summary"
              v-model="formData.summary"
              lazy-rules
              :rules="[val => !!val || 'Field is required']"
            /> -->

            <q-input type="file"
              @change="imgChange"
              accept=".jpg, image/*"
              filled
              bottom-slots
              v-model="formData.img"
              :disable="loading"
              hint="Please choose image file type only"
              counter>
            </q-input>

            <q-input type="file"
              @change="vidChange"
              accept=".mp4, video/*"
              filled
              bottom-slots
              v-model="formData.video"
              :disable="loading"
              hint="Please choose video file type only"
              counter>
            </q-input>

            <!-- <q-file filled bottom-slots v-model="formData.video" label="Upload Video" counter>
              <template v-slot:prepend>
                <q-icon name="cloud_upload" @click.stop />
              </template>
              <template v-slot:append>
                <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
              </template>
            </q-file> -->

            <div class="actions md-layout md-alignment-center">
              <q-btn color="green" @click="showDialog" :loading="loading" label="Submit" />
            </div>
          </form>
        </q-card-section>
      </q-card>

      <!-- <div class="actions md-layout md-alignment-center">
        <md-button class="md-raised md-primary" @click="auth">Submit</md-button>
      </div> -->

    </md-content>
    <div class="background" />
  </div>
</template>

<script>
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import { mapGetters } from 'vuex'

Vue.use(VueMaterial)

export default {
  name: 'PageIndex',
  data () {
    return {
      welcome: false,
      options: [
        'Theft', 'Rape', 'Robbery', 'Homicide', 'Murder', 'Physical Injury', 'Motor napping and carnapping'
      ],
      puroks: [
        'Purok Atis, Brgy. Sto. Niño',
        'Purok Caimito, Brgy. Sto. Niño',
        'Purok Chico, Brgy. Sto. Niño',
        'Purok Durian, Brgy. Sto. Niño',
        'Purok Mangga, Brgy. Sto. Niño',
        'Purok Santol, Brgy. Sto. Niño',
        'Purok Tambis, Brgy. Sto. Niño',
        'Purok Ubas, Brgy. Sto. Niño'
      ],
      is_witness: false,
      alert: false,
      isPwd: true,
      dense: false,
      loading: false,
      long: '',
      lat: '',
      crime: {},
      formData: {
        crime_id: '',
        last_name: '',
        birth_date: '',
        focus_crime_type: '',
        event_detail: '',
        action_taken: '',
        address: '',
        summary: '',
        img: '',
        video: '',
        name: ''
      },
      imageFile: '',
      videoFile: '',
      img: {
        url: '',
        thumb_url: '',
        uploader: '',
        extension: '',
        title: ''
      },
      video: {
        url: '',
        thumb_url: '',
        uploader: '',
        extension: '',
        title: ''
      }
    }
  },
  methods: {
    getNotifApproved () {
      this.$store.dispatch('auth/getNotifApproved')
    },
    changeLogin () {
      this.$store.dispatch('auth/changeLogin')
    },
    logout () {
      localStorage.removeItem('vuex')
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    },
    vidChange (event) {
      console.log(event)
      this.videoFile = event.target.files[0]
      this.video.url = URL.createObjectURL(this.videoFile)
      this.video.file_type = event.target.files[0].type
    },
    imgChange (event) {
      console.log(event)
      this.imageFile = event.target.files[0]
      this.img.url = URL.createObjectURL(this.imageFile)
      this.img.file_type = event.target.files[0].type
    },
    showDialog () {
      this.alert = true
    },
    onSubmit () {
      const formData = new FormData()
      const crime = this.crime_type.filter(x => x.type === this.formData.crime_id)
      console.log(this.imageFile)
      formData.append('crime_id', crime[0].id)
      formData.append('complaint_id', this.user_details.id)
      formData.append('reported_by', this.user_details.first_name + ' ' + this.user_details.last_name)
      formData.append('name', this.formData.name)
      formData.append('address', this.formData.address)
      formData.append('prepared_id', this.user_details.id)
      formData.append('focus_crime_type', this.formData.focus_crime_type)
      formData.append('event_detail', this.formData.event_detail)
      formData.append('action_taken', this.formData.action_taken)
      formData.append('summary', this.formData.summary)
      formData.append('long', this.long)
      formData.append('lat', this.lat)
      formData.append('is_witness', this.is_witness ? 1 : 0)
      formData.append('img', this.imageFile)
      formData.append('video', this.videoFile)
      // formData.append('video', this.formData.video)

      // console.log(formData)
      // const crime = this.crime_type.filter(x => x.type === this.formData.crime_id)
      // const form = {
      //   crime_id: crime[0].id,
      //   complaint_id: this.user_details.id,
      //   reported_by: this.user_details.first_name + ' ' + this.user_details.last_name,
      //   prepared_id: this.user_details.id,
      //   focus_crime_type: this.formData.focus_crime_type,
      //   event_detail: this.formData.event_detail,
      //   action_taken: this.formData.action_taken,
      //   summary: this.formData.summary,
      //   long: this.long,
      //   lat: this.lat,
      //   is_witness: this.is_witness ? 1 : 0,
      //   img: this.formData.img
      //   // video: this.formData.video
      // }

      this.$refs.crime_id.validate()
      this.$refs.event_detail.validate()
      // this.$refs.action_taken.validate()
      // this.$refs.summary.validate()

      if (this.$refs.crime_id.hasError || this.$refs.event_detail.hasError) {
        this.formHasError = true
      } else {
        this.loading = true
        this.$store.dispatch('crime/reportCrime', { data: formData })
          .then(() => {
            this.$q.notify({
              icon: 'done',
              color: 'positive',
              message: 'Report submitted successfully.',
              position: 'center'
            })
            this.loading = false
            // this.onReset()
          })
          .catch(error => {
            this.loading = false
            this.$q.notify({
              message: 'Something went wrong!',
              color: 'red',
              position: 'top'
            })
            throw new Error(error)
          })
      }

      // console.log(formData)
      this.alert = false
    },
    onReset () {
      this.formData.crime_id = ''
      this.formData.focus_crime_type = ''
      this.formData.action_taken = ''
      this.formData.summary = ''
      this.formData.event_detail = ''

      this.$refs.crime_id.resetValidation()
      this.$refs.event_detail.resetValidation()
      this.$refs.focus_crime_type.resetValidation()
      this.$refs.action_taken.resetValidation()
      this.$refs.summary.resetValidation()
    },
    getLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.long = pos.coords.longitude
          this.lat = pos.coords.latitude
        })
      } else {
        this.$q.notify({
          message: 'Geolocation is not supported by this browser.',
          color: 'red',
          position: 'top'
        })
      }
    },
    getTypeOfCrimes () {
      this.$store.dispatch('crime/getTypeOfCrimes')
    }
  },
  created () {
    this.getLocation()
    this.getTypeOfCrimes()
    this.getNotifApproved()
  },
  computed: {
    ...mapGetters('auth', {
      user_details: 'user_details',
      login: 'login'
    }),
    ...mapGetters('crime', {
      crime_type: 'crime_type'
    }),
    onChangeValue () {
      if (this.formData.crime_id === 'Focus Crimes') {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scope>
$font: 'Poppins', sans-serif;
$font-roboto: 'Roboto';
$font-nunito: 'Nunito';

::selection { background-color: #C3CFE2; }

.text {
  background: linear-gradient(to left, #30CFD0 0%, #330867 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hello {
  font-size: 50pt;
  font-weight: 600;
}

.text-roboto {
  font-family: $font-roboto;
}

.text-poppins {
  font-family: $font;
}

.text-roboto {
  font-family: $font-roboto;
}

.text-nunito {
  font-family: $font-nunito;
}

.text-upper {
  text-transform: uppercase;
}

.border-gradient {
  border: 5px solid;
  border-image-slice: 1;
  border-width: 3px;
}
.border-gradient-cyan {
  border-image-source: linear-gradient(to left, #30CFD0 0%, #330867 100%);
}

#card, .q-card__section--vert {
  padding: 20px !important;
}

.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;
  .title {
    text-align: center;
    margin-bottom: 30px;
    img {
      margin-bottom: 16px;
      max-width: 100px;
    }
  }
  .actions {
    .md-button {
      margin: 0;
    }
  }
  .form {
    margin-bottom: 60px;
  }
  .background {
    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiPgogIDxwYXRoIGZpbGw9IiNmM2YzZjMiIHN0cm9rZT0iI2YzZjNmMyIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTQ0LTQ5Nmw2MjcgMTY3IDI1OSA2eiIvPgogIDxwYXRoIGZpbGw9IiNlM2UzZTMiIHN0cm9rZT0iI2UzZTNlMyIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNNDczIDE1MjZsLTcxMCAxNDQgMTU0OS02NHoiLz4KICA8cGF0aCBmaWxsPSIjZWVlIiBzdHJva2U9IiNlZWUiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTEwMzAtMzIzaDU5MWwzODMtMTU5eiIvPgogIDxwYXRoIGZpbGw9IiNmMWYxZjEiIHN0cm9rZT0iI2YxZjFmMSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTQ0LTQ5Nmw4ODYgMTczIDk3NC0xNTl6Ii8+CiAgPHBhdGggZmlsbD0iI2UwZTBlMCIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0yMjMxIDQ5NWwtNjIgMjA1IDEwNCAzMTJ6Ii8+CiAgPHBhdGggZmlsbD0iI2U2ZTZlNiIgc3Ryb2tlPSIjZTZlNmU2IiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xOTc4LTQybDI1MyA1MzcgNjEtNzQ1eiIvPgogIDxwYXRoIGZpbGw9IiNlZmVmZWYiIHN0cm9rZT0iI2VmZWZlZiIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTQ0LTQ5NmwxODYwIDE0IDUzNC05MnoiLz4KICA8cGF0aCBmaWxsPSIjZjVmNWY1IiBzdHJva2U9IiNmNWY1ZjUiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTS01OTgtNTYxbDc0MiA2NSAyMzk0LTc4eiIvPgogIDxwYXRoIGZpbGw9IiNlMGUwZTAiIHN0cm9rZT0iI2UwZTBlMCIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMjI3MyAxMDEybC0xOSA0NDkgMjg0LTIwMzV6Ii8+CiAgPHBhdGggZmlsbD0iI2VhZWFlYSIgc3Ryb2tlPSIjZWFlYWVhIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0yMDA0LTQ4MmwyODggMjMyIDI0Ni0zMjR6Ii8+CiAgPHBhdGggZmlsbD0iI2U2ZTZlNiIgc3Ryb2tlPSIjZTZlNmU2IiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0yMjkyLTI1MGwtNjEgNzQ1IDMwNy0xMDY5eiIvPgogIDxwYXRoIGZpbGw9IiNlM2UzZTMiIHN0cm9rZT0iI2UzZTNlMyIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMjIzMSA0OTVsNDIgNTE3IDI2NS0xNTg2eiIvPgogIDxwYXRoIGZpbGw9IiNkZGQiIHN0cm9rZT0iI2RkZCIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTg0OSAxMDAzbC0xMDMgNDEyIDIyOSAxNDF6Ii8+CiAgPHBhdGggZmlsbD0iI2U0ZTRlNCIgc3Ryb2tlPSIjZTRlNGU0IiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xOTc4LTQybC05MyA1MzAgMzQ2IDd6Ii8+CiAgPHBhdGggZmlsbD0iI2RjZGNkYyIgc3Ryb2tlPSIjZGNkY2RjIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xODQ5IDEwMDNsMTI2IDU1MyAyNzktOTV6Ii8+CiAgPHBhdGggZmlsbD0iI2RkZCIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xODQ5IDEwMDNsNDA1IDQ1OCAxOS00NDl6Ii8+CiAgPHBhdGggZmlsbD0iI2RmZGZkZiIgc3Ryb2tlPSIjZGZkZmRmIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0yMTY5IDcwMGwtMzIwIDMwMyA0MjQgOXoiLz4KICA8cGF0aCBmaWxsPSIjZWFlYWVhIiBzdHJva2U9IiNlYWVhZWEiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTIwMDQtNDgybC0yNiA0NDAgMzE0LTIwOHoiLz4KICA8cGF0aCBmaWxsPSIjZTJlMmUyIiBzdHJva2U9IiNlMmUyZTIiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTE4ODUgNDg4bDI4NCAyMTIgNjItMjA1eiIvPgogIDxwYXRoIGZpbGw9IiNlMmUyZTIiIHN0cm9rZT0iI2UyZTJlMiIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTg4NSA0ODhsLTgzIDEzMyAzNjcgNzl6Ii8+CiAgPHBhdGggZmlsbD0iI2UxZTFlMSIgc3Ryb2tlPSIjZTFlMWUxIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xODAyIDYyMWw0NyAzODIgMzIwLTMwM3oiLz4KICA8cGF0aCBmaWxsPSIjZGZkZmRmIiBzdHJva2U9IiNkZmRmZGYiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTE2ODUgMTEzOWw2MSAyNzYgMTAzLTQxMnoiLz4KICA8cGF0aCBmaWxsPSIjZTJlMmUyIiBzdHJva2U9IiNlMmUyZTIiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTE4MDIgNjIxbC02MiA2OCAxMDkgMzE0eiIvPgogIDxwYXRoIGZpbGw9IiNkY2RjZGMiIHN0cm9rZT0iI2RjZGNkYyIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTc0NiAxNDE1bC00MzQgMTkxIDY2My01MHoiLz4KICA8cGF0aCBmaWxsPSIjZTdlN2U3IiBzdHJva2U9IiNlN2U3ZTciIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTE2MTcgMTcybDI2OCAzMTYgOTMtNTMweiIvPgogIDxwYXRoIGZpbGw9IiNlYmViZWIiIHN0cm9rZT0iI2ViZWJlYiIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTYyMS0zMjNsMzU3IDI4MSAyNi00NDB6Ii8+CiAgPHBhdGggZmlsbD0iI2VhZWFlYSIgc3Ryb2tlPSIjZWFlYWVhIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xNjIxLTMyM2wtNCA0OTUgMzYxLTIxNHoiLz4KICA8cGF0aCBmaWxsPSIjZWJlYmViIiBzdHJva2U9IiNlYmViZWIiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTE0MTAtNDlsMjA3IDIyMSA0LTQ5NXoiLz4KICA8cGF0aCBmaWxsPSIjZTVlNWU1IiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTE2MTcgMTcybDE4NSA0NDkgODMtMTMzeiIvPgogIDxwYXRoIGZpbGw9IiNlNWU1ZTUiIHN0cm9rZT0iI2U1ZTVlNSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTYxNyAxNzJsMTIzIDUxNyA2Mi02OHoiLz4KICA8cGF0aCBmaWxsPSIjZTFlMWUxIiBzdHJva2U9IiNlMWUxZTEiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTE3NDAgNjg5bC01NSA0NTAgMTY0LTEzNnoiLz4KICA8cGF0aCBmaWxsPSIjZTZlNmU2IiBzdHJva2U9IiNlNmU2ZTYiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTE2MTcgMTcybC0zOTMgNDUxIDUxNiA2NnoiLz4KICA8cGF0aCBmaWxsPSIjZTJlMmUyIiBzdHJva2U9IiNlMmUyZTIiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTEyNDQgOTYybDQ0MSAxNzcgNTUtNDUweiIvPgogIDxwYXRoIGZpbGw9IiNlNWU1ZTUiIHN0cm9rZT0iI2U1ZTVlNSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTIyNCA2MjNsMjAgMzM5IDQ5Ni0yNzN6Ii8+CiAgPHBhdGggZmlsbD0iI2RmZGZkZiIgc3Ryb2tlPSIjZGZkZmRmIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xNjg1IDExMzlsLTM3MyA0NjcgNDM0LTE5MXoiLz4KICA8cGF0aCBmaWxsPSIjZTFlMWUxIiBzdHJva2U9IiNlMWUxZTEiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTEyNDQgOTYybDY4IDY0NCAzNzMtNDY3eiIvPgogIDxwYXRoIGZpbGw9IiNlYWVhZWEiIHN0cm9rZT0iI2VhZWFlYSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTQxMC00OWwtMzQyIDE3NSA1NDkgNDZ6Ii8+CiAgPHBhdGggZmlsbD0iI2U5ZTllOSIgc3Ryb2tlPSIjZTllOWU5IiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xMDY4IDEyNmwxNTYgNDk3IDM5My00NTF6Ii8+CiAgPHBhdGggZmlsbD0iI2VkZWRlZCIgc3Ryb2tlPSIjZWRlZGVkIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xMDMwLTMyM2wzODAgMjc0IDIxMS0yNzR6Ii8+CiAgPHBhdGggZmlsbD0iI2VhZWFlYSIgc3Ryb2tlPSIjZWFlYWVhIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xMDY4IDEyNmwtNzkgODIgMjM1IDQxNXoiLz4KICA8cGF0aCBmaWxsPSIjZTRlNGU0IiBzdHJva2U9IiNlNGU0ZTQiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTkzNyA5NjJsLTE4NSA0MDkgNDkyLTQwOXoiLz4KICA8cGF0aCBmaWxsPSIjZTJlMmUyIiBzdHJva2U9IiNlMmUyZTIiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTEyNDQgOTYybC00OTIgNDA5IDU2MCAyMzV6Ii8+CiAgPHBhdGggZmlsbD0iI2VkZWRlZCIgc3Ryb2tlPSIjZWRlZGVkIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xMDMwLTMyM2wzOCA0NDkgMzQyLTE3NXoiLz4KICA8cGF0aCBmaWxsPSIjZTVlNWU1IiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTEyMjQgNjIzTDkzNyA5NjJoMzA3eiIvPgogIDxwYXRoIGZpbGw9IiNlMmUyZTIiIHN0cm9rZT0iI2UyZTJlMiIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNNzUyIDEzNzFsLTI3OSAxNTUgODM5IDgweiIvPgogIDxwYXRoIGZpbGw9IiNlYWVhZWEiIHN0cm9rZT0iI2VhZWFlYSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNOTg5IDIwOEw3ODMgNDAxbDQ0MSAyMjJ6Ii8+CiAgPHBhdGggZmlsbD0iI2U3ZTdlNyIgc3Ryb2tlPSIjZTdlN2U3IiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik03NDggNzg5bDE4OSAxNzMgMjg3LTMzOXoiLz4KICA8cGF0aCBmaWxsPSIjZTllOWU5IiBzdHJva2U9IiNlOWU5ZTkiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTc4MyA0MDFsLTM1IDM4OCA0NzYtMTY2eiIvPgogIDxwYXRoIGZpbGw9IiNmMGYwZjAiIHN0cm9rZT0iI2YwZjBmMCIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNNzcxLTMyOWwtMTIgNDU0IDI3MS00NDh6Ii8+CiAgPHBhdGggZmlsbD0iI2VlZSIgc3Ryb2tlPSIjZWVlIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xMDMwLTMyM0w3NTkgMTI1bDMwOSAxeiIvPgogIDxwYXRoIGZpbGw9IiNlY2VjZWMiIHN0cm9rZT0iI2VjZWNlYyIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNNzU5IDEyNWwyMzAgODMgNzktODJ6Ii8+CiAgPHBhdGggZmlsbD0iI2U1ZTVlNSIgc3Ryb2tlPSIjZTVlNWU1IiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik00ODEgMTEwNWwyNzEgMjY2IDE4NS00MDl6Ii8+CiAgPHBhdGggZmlsbD0iI2VjZWNlYyIgc3Ryb2tlPSIjZWNlY2VjIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik03NTkgMTI1bDI0IDI3NiAyMDYtMTkzeiIvPgogIDxwYXRoIGZpbGw9IiNlN2U3ZTciIHN0cm9rZT0iI2U3ZTdlNyIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNNzQ4IDc4OWwtMjY3IDMxNiA0NTYtMTQzeiIvPgogIDxwYXRoIGZpbGw9IiNlOGU4ZTgiIHN0cm9rZT0iI2U4ZThlOCIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNNTE5IDc4MmwtMzggMzIzIDI2Ny0zMTZ6Ii8+CiAgPHBhdGggZmlsbD0iI2YxZjFmMSIgc3Ryb2tlPSIjZjFmMWYxIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0zMzUtMTQ4bDQyNCAyNzMgMTItNDU0eiIvPgogIDxwYXRoIGZpbGw9IiNmNGY0ZjQiIHN0cm9rZT0iI2Y0ZjRmNCIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTcyLTQyOGwxNjMgMjgwIDQzNi0xODF6Ii8+CiAgPHBhdGggZmlsbD0iI2Y2ZjZmNiIgc3Ryb2tlPSIjZjZmNmY2IiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0xNDQtNDk2bDI4IDY4IDU5OSA5OXoiLz4KICA8cGF0aCBmaWxsPSIjZWFlYWVhIiBzdHJva2U9IiNlYWVhZWEiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTUxOSA3ODJsMjI5IDcgMzUtMzg4eiIvPgogIDxwYXRoIGZpbGw9IiNlZWUiIHN0cm9rZT0iI2VlZSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNNzU5IDEyNUwyMDIgMjU5bDU4MSAxNDJ6Ii8+CiAgPHBhdGggZmlsbD0iI2VjZWNlYyIgc3Ryb2tlPSIjZWNlY2VjIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0yMDIgMjU5bDMxNyA1MjMgMjY0LTM4MXoiLz4KICA8cGF0aCBmaWxsPSIjZjBmMGYwIiBzdHJva2U9IiNmMGYwZjAiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTMzNS0xNDhMMjAyIDI1OWw1NTctMTM0eiIvPgogIDxwYXRoIGZpbGw9IiNlNWU1ZTUiIHN0cm9rZT0iI2U1ZTVlNSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNNDgxIDExMDVsLTggNDIxIDI3OS0xNTV6Ii8+CiAgPHBhdGggZmlsbD0iI2U4ZThlOCIgc3Ryb2tlPSIjZThlOGU4IiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0tMTc5IDEwNDZsNjUyIDQ4MCA4LTQyMXoiLz4KICA8cGF0aCBmaWxsPSIjZWNlY2VjIiBzdHJva2U9IiNlY2VjZWMiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTS01IDU5M2wtMTc0IDQ1MyA2NjAgNTl6Ii8+CiAgPHBhdGggZmlsbD0iI2ViZWJlYiIgc3Ryb2tlPSIjZWJlYmViIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0tNSA1OTNsNDg2IDUxMiAzOC0zMjN6Ii8+CiAgPHBhdGggZmlsbD0iI2VlZSIgc3Ryb2tlPSIjZWVlIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0yMDIgMjU5TC01IDU5M2w1MjQgMTg5eiIvPgogIDxwYXRoIGZpbGw9IiNlOGU4ZTgiIHN0cm9rZT0iI2U4ZThlOCIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNLTE3OSAxMDQ2bC01OCA2MjQgNzEwLTE0NHoiLz4KICA8cGF0aCBmaWxsPSIjZjNmM2YzIiBzdHJva2U9IiNmM2YzZjMiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTS0xMDktMjNsMzExIDI4MiAxMzMtNDA3eiIvPgogIDxwYXRoIGZpbGw9IiNmNWY1ZjUiIHN0cm9rZT0iI2Y1ZjVmNSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNMTcyLTQyOEwtMTA5LTIzbDQ0NC0xMjV6Ii8+CiAgPHBhdGggZmlsbD0iI2VlZSIgc3Ryb2tlPSIjZWVlIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0tMjQ1IDc3Mmw2NiAyNzRMLTUgNTkzeiIvPgogIDxwYXRoIGZpbGw9IiNmMWYxZjEiIHN0cm9rZT0iI2YxZjFmMSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNLTk2IDI5N2w5MSAyOTYgMjA3LTMzNHoiLz4KICA8cGF0aCBmaWxsPSIjZjNmM2YzIiBzdHJva2U9IiNmM2YzZjMiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTS0xMDktMjNsMTMgMzIwIDI5OC0zOHoiLz4KICA8cGF0aCBmaWxsPSIjZjdmN2Y3IiBzdHJva2U9IiNmN2Y3ZjciIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTTE0NC00OTZMLTEwOS0yM2wyODEtNDA1eiIvPgogIDxwYXRoIGZpbGw9IiNmOWY5ZjkiIHN0cm9rZT0iI2Y5ZjlmOSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNLTU5OC01NjFsNDg5IDUzOCAyNTMtNDczeiIvPgogIDxwYXRoIGZpbGw9IiNlYmViZWIiIHN0cm9rZT0iI2ViZWJlYiIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNLTU1NCAxMzkybDMxNyAyNzggNTgtNjI0eiIvPgogIDxwYXRoIGZpbGw9IiNmNGY0ZjQiIHN0cm9rZT0iI2Y0ZjRmNCIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNLTEwOS0yM2wtMjQ4IDE1MSAyNjEgMTY5eiIvPgogIDxwYXRoIGZpbGw9IiNmMGYwZjAiIHN0cm9rZT0iI2YwZjBmMCIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNLTk2IDI5N2wtMTQ5IDQ3NUwtNSA1OTN6Ii8+CiAgPHBhdGggZmlsbD0iI2VkZWRlZCIgc3Ryb2tlPSIjZWRlZGVkIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0tNTUwIDExODFsLTQgMjExIDM3NS0zNDZ6Ii8+CiAgPHBhdGggZmlsbD0iI2Y4ZjhmOCIgc3Ryb2tlPSIjZjhmOGY4IiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0tNTk4LTU2MWwyNDEgNjg5IDI0OC0xNTF6Ii8+CiAgPHBhdGggZmlsbD0iI2YyZjJmMiIgc3Ryb2tlPSIjZjJmMmYyIiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0tNDM1IDIwN2wxOTAgNTY1IDE0OS00NzV6Ii8+CiAgPHBhdGggZmlsbD0iI2Y0ZjRmNCIgc3Ryb2tlPSIjZjRmNGY0IiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0tMzU3IDEyOGwtNzggNzkgMzM5IDkweiIvPgogIDxwYXRoIGZpbGw9IiNlZWUiIHN0cm9rZT0iI2VlZSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNLTI0NSA3NzJsLTMwNSA0MDkgMzcxLTEzNXoiLz4KICA8cGF0aCBmaWxsPSIjZjFmMWYxIiBzdHJva2U9IiNmMWYxZjEiIHN0cm9rZS13aWR0aD0iMS41MSIgZD0iTS00MzUgMjA3bC0xMTUgOTc0IDMwNS00MDl6Ii8+CiAgPHBhdGggZmlsbD0iI2Y4ZjhmOCIgc3Ryb2tlPSIjZjhmOGY4IiBzdHJva2Utd2lkdGg9IjEuNTEiIGQ9Ik0tNTk4LTU2MWwxNjMgNzY4IDc4LTc5eiIvPgogIDxwYXRoIGZpbGw9IiNmNWY1ZjUiIHN0cm9rZT0iI2Y1ZjVmNSIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNLTU5OC01NjFsNDggMTc0MiAxMTUtOTc0eiIvPgogIDxwYXRoIGZpbGw9IiNmMmYyZjIiIHN0cm9rZT0iI2YyZjJmMiIgc3Ryb2tlLXdpZHRoPSIxLjUxIiBkPSJNLTU5OC01NjFsNDQgMTk1MyA0LTIxMXoiLz4KPC9zdmc+Cg==);
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 0;
  }
  .md-content {
    z-index: 1;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
  }
  .loading-overlay {
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
