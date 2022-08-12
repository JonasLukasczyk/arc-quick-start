<template>
  <div class='dialog'>
    <h1><img src='assets/dpLogo.svg' style="float:left;height:3em;margin:0.3em -2em 0 0;"/>Arc Quick Start</h1>
    <div class='content'>
      <div v-if="globalState===0" style="padding-top:10em">
        <div v-if="downloadState===0">
          <div>
            Downloading Arc Commander
          </div>
          <q-circular-progress
            indeterminate
            size="5em"
            :thickness="0.4"
            color="primary"
            track-color="grey-3"
            class="q-ma-md"
          />
        </div>
        <div v-else-if='downloadState===1'>
          Done
        </div>
      </div>
      <div v-else-if="globalState===1">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="arc_name"
            label="Name of the Arc"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          ></q-input>
          <q-input
            filled
            v-model="user_name"
            label="Name and Surname"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          ></q-input>
          <q-input
            filled
            v-model="user_eMail"
            label="EMail"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          ></q-input>
          <q-input
            filled
            v-model="user_gitlab"
            label="GitLab Account"
            lazy-rules
          ></q-input>
          <div style='text-align:left;margin-top:0'>
            <q-btn flat label="Register" size='sm' style="margin:0"></q-btn>
          </div>

          <div>
            <q-btn label="Submit" type="submit" color="primary"></q-btn>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
            <q-btn label="Test" color="primary" class="q-ml-sm" @click="runArcCommander()"></q-btn>
          </div>
        </q-form>
      </div>
    </div>

    <h2></h2>
  </div>
</template>

<script lang="ts" setup>

import { setCssVar } from 'quasar'
setCssVar('primary', '#2d3e50')

import { onMounted, ref, reactive } from 'vue';

const downloadState = ref(0)
const globalState = ref(0)

const downloadProgress = ref(20)

const arc_name = ref(null)
const user_gitlab = ref(null)
const user_eMail = ref(null)
const user_name = ref(null)

const onSubmit = ()=>{

};
const onReset = ()=>{

};
const runArcCommander = ()=>{
  window.ipc.invoke('ACS_runCommand', {}).then(
    res => {
      console.log(res);
    }
  );
};

onMounted(() => {
  downloadState.value = 0;

  window.ipc.invoke('DS_downloadArcCommander').then(
    _=>{
      downloadState.value = 1;
      globalState.value = 1;
    }
  );
  // setTimeout(function() {
  // }, 1000);
});

</script>

<style>

.no-selection {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

html, body {
  padding: 0;
  margin: 0;
}
body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

h1 {
  font-size: 2em !important;
  background-color: #2d3e50;
  color: white;
  border-top-left-radius: 0.5em;
  border-top-right-radius: 0.5em;
  margin: 0;
}
h2 {
  font-size: 2em !important;
  background-color: #2d3e50;
  color: white;
  border-bottom-left-radius: 0.5em;
  border-bottom-right-radius: 0.5em;
  margin: 0;
  min-height: 1em;
}

.dialog {
  max-width: 25em;
  margin:0 auto;
  margin-top:1em;
  text-align:center;
}

.content {
  border:0.1em solid #2d3e50;
  padding: 1em 1em;
  overflow: hidden;
  height:32em;
}


</style>
