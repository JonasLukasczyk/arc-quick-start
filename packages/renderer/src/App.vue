<template>
  <div class='dialog'>
    <h1><img src='./assets/dpLogo.svg' style="display:inline-block;height:3em;margin:-1.2em -1em -1.2em -1em;"/>ARC Commander Mini</h1>
    <div class='content_wrapper'>
      <div class='content'>
        <transition name="slide">
          <!-- ############################################################# -->
          <div v-if="state_page==='PAGE_INITIAL'">
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <q-circular-progress
              indeterminate
              size="5em"
              :thickness="0.4"
              color="primary"
              track-color="grey-3"
              class="q-ma-md"
            />
            <div class='note-message'>
              Checking existing files...
            </div>
          </div>

          <!-- ############################################################# -->
          <div v-else-if="state_page==='PAGE_WELCOME'">
            <div class='bold-message' style="margin:1em 0 0 0;">
              Welcome!
            </div>
            <div class='message'>
              This tool will help you to setup<br>your first <b>ARC</b>.
            </div>
            <div class='message' style="margin-bottom:1em;">
              Get started by downloading<br>the <b>ARC Commander</b>:
            </div>
            <div v-if='state_download===0'>
              <br>
              <br>
              <q-btn label="Download" color="primary" class="q-ml-sm" @click="downloadArcCommander()"></q-btn>
              <div style="color:gray;margin-top:0.2em;">{{latestReleaseLabel}}<br>~100MB</div>
            </div>
            <div v-else-if='state_download===1'>
              <q-circular-progress
                indeterminate
                size="5em"
                :thickness="0.4"
                color="primary"
                track-color="grey-3"
                class="q-ma-md"
              />
              <div class='note-message'>
                Downloading ARC Commander ...
              </div>
            </div>
            <div v-else-if='state_download===2'>
              <div class='bold-message'>
                Done
              </div>
            </div>
            <br/>
          </div>

          <!-- ############################################################# -->
          <div v-else-if="state_page==='PAGE_GITLAB'">
            <br>
            <br>
            <div>
              <q-form
                @submit="setGitLabAccount"
                class="q-gutter-md"
              >
                <div class='message'>
                  Do you plan to share your ARC on the
                  <br>
                  <span class='link' @click='openExternalLink("https://git.nfdi4plants.org/explore")'>nfdi4plants DataHUB</span>?
                </div>
                <q-input
                  filled
                  v-model="user_gitlab"
                  label="GitLab User Name"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || '']"
                  hide-bottom-space
                ></q-input>
                <div style='text-align:left;margin-top:0.4em'>
                  <span class='link' @click='openExternalLink("https://register.nfdi4plants.org/registration")'>Register</span>
                </div>
                <br>
                <div>
                  <q-btn label="Submit" type="submit" color="primary"></q-btn>
                  <q-btn label="Skip" type="reset" color="primary" flat class="q-ml-sm" @click="advancePageState()"></q-btn>
                </div>
              </q-form>
            </div>
          </div>

          <!-- ############################################################# -->
          <div v-else-if="state_page==='PAGE_USER'">
            <br>
            <br>
            <div class='message'>
              Tell us more about yourself.
            </div>

            <q-form
              @submit="setUserNameAndEMail"
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="user_name"
                label="Name and Surname"
                lazy-rules
                :rules="[ val => val && val.length > 0 || '']"
              ></q-input>
              <q-input
                filled
                v-model="user_eMail"
                label="EMail"
                lazy-rules
                :rules="[ val => val && val.length > 0 || '']"
              ></q-input>

              <div>
                <q-btn label="Submit" type="submit" color="primary"></q-btn>
                <q-btn label="Skip" type="reset" color="primary" flat class="q-ml-sm" @click="advancePageState()"></q-btn>
              </div>

              <br>
              <div style='color:gray'>
                Changes to the ARC are tagged with this information to keep provenance.
              </div>
            </q-form>
          </div>

          <!-- ############################################################# -->
          <div v-else-if="state_page==='PAGE_CREATE_ARC'">
            <div class='bold-message'>
              Awesome!
            </div>
            <div class='message' style="margin-top:-1em;">
              Now you can create your first ARC.
            </div>
            <q-form
              @submit="createArc"
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="arc_name"
                label="Name of the ARC"
                lazy-rules
                :rules="[ val => (val && val.length > 0 && checkString(val)) || 'Name can only consist of letters and numbers!']"
              ></q-input>
              <q-btn label="Create" style="margin-top:0.4em;" type="submit" color="primary"></q-btn>
            </q-form>

            <div v-if='arcs.length' style="width:12em; margin:0 auto;">
              <br>
              <b>OR</b>
              <br>
              <br>
              <q-form
                @submit="syncArcs"
                class="q-gutter-md"
              >
                <q-select options-dense filled v-model="arc_selected" :options="arcs" label="ARC"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || '']"
                  hide-bottom-space
                />
                <q-btn label="Sync Existing" type="submit" color="primary"></q-btn>
              </q-form>
            </div>
          </div>

          <!-- ############################################################# -->
          <div v-else-if="state_page==='PAGE_PROCESS_ARC_CREATE'">
            <div class='bold-message' style="margin-top:2em;">
              Creating ARC...
            </div>

            <div style="display:inline-block;text-align:left;margin:1em auto;">
              <div class="message tasklist">
                <q-circular-progress
                  :indeterminate='state_arc===-1'
                  size="1em"
                  :thickness="0.4"
                  :color="state_arc===0?'red':state_arc>=0?'green':'primary'"
                  track-color="grey-3"
                  class="q-ma-md"
                  :value='state_arc>=0?100:0'
                />
                Initializing the ARC
              </div>
              <div class="message tasklist">
                <q-circular-progress
                  :indeterminate='state_assay===-1'
                  size="1em"
                  :thickness="0.4"
                  :color="state_assay===0?'red':state_assay>=0?'green':'primary'"
                  track-color="grey-3"
                  class="q-ma-md"
                  :value='state_assay>=0?100:0'
                />
                Adding Assay
              </div>
              <div class="message tasklist">
                <q-circular-progress
                  :indeterminate='state_token===-1'
                  size="1em"
                  :thickness="0.4"
                  :color="state_token===0?'red':state_token>=0?'green':'primary'"
                  track-color="grey-3"
                  class="q-ma-md"
                  :value='state_token>=0?100:0'
                />
                Retrieving Access Token
              </div>
              <div class="message tasklist">
                <q-circular-progress
                  :indeterminate='state_sync===-1'
                  size="1em"
                  :thickness="0.4"
                  :color="state_sync===0?'red':state_sync>=0?'green':'primary'"
                  track-color="grey-3"
                  class="q-ma-md"
                  :value='state_sync>=0?100:0'
                />
                Synchronizing ARC
              </div>
            </div>
            <br>
            <q-btn v-if='state_sync===0 || state_assay===0 || state_token===0 || state_sync===0' label="Restart" type="submit" color="primary" @click='resetApp()'></q-btn>
          </div>

          <!-- ############################################################# -->
          <div v-else-if="state_page==='PAGE_PROCESS_ARC_SYNC'">
            <div class='bold-message' style="margin-top:2em;">
              Synchronizing ARC...
            </div>
            <br>
            <div class="message tasklist">
              <q-circular-progress
                :indeterminate='arc_selected_state===-1'
                size="1em"
                :thickness="0.4"
                :color="arc_selected_state===0?'red':arc_selected_state>=0?'green':'primary'"
                track-color="grey-3"
                class="q-ma-md"
                :value='arc_selected_state>=0?100:0'
              />
              {{arc_selected}}

              <br>
              <q-btn v-if='state_arc===0' label="Restart" type="submit" color="primary" @click='resetApp()'></q-btn>
            </div>

          </div>

          <!--############################################################# -->
          <div v-else-if="state_page==='PAGE_HELP'">
            <div class='bold-message' style="margin:1em 0 -1em 0;">
              Congratulations!
            </div>
            <div class='message' v-if='arc_mode===1'>
              You have just created your first ARC.<br>
              <span v-if='gitlab_link' class='link' @click='openExternalLink_'>{{gitlab_link}}</span>
            </div>
            <div class='message' v-if='arc_mode===2'>
              You have just synced ARC <span class='link'>{{arc_selected}}</span>.
            </div>
            <div class='message'>
              Do not hesitate to start adding your data and metadata to FAIRify your research.
            </div>
            <div class='message'>
              The Swate tool provides support in finding standardized terms for data annotations. Check out the <span class='link' @click='openExternalLink("https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/tutorials/QuickStart_swate.html")'>tutorials</span> to learn how to use it.
            </div>
            <div class='message'>
              For further assistance, please consult our <span class='link' @click='openExternalLink("https://nfdi4plants.org/nfdi4plants.knowledgebase/index.html")'>knowledge base</span>, <span class='link' @click='openExternalLink("https://helpdesk.nfdi4plants.org")'>helpdesk</span>, or feel free to contact us directly at <span class='link' @click='openExternalLink("email:info@nfdi4plants.org")'>info@nfdi4plants.org</span>.
            </div>
            <q-btn label="Restart" type="submit" color="primary" @click='resetApp()'></q-btn>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { setCssVar } from 'quasar';
setCssVar('primary', '#2d3e50');

import { onMounted, ref, reactive } from 'vue';

const state_download = ref(0);
const state_page = ref('PAGE_INITIAL');

const downloadProgress = ref(20);
const latestReleaseLabel = ref('');

let config = null;

const arc_name = ref(null);
const user_gitlab = ref(null);
const user_eMail = ref(null);
const user_name = ref(null);
const gitlab_link = ref(null);
const arcs = ref([]);
const arc_mode = ref(0);
const arc_selected = ref(null);
const arc_selected_state = ref(0);

const state_arc = ref(0);
const state_assay = ref(0);
const state_token = ref(0);
const state_sync = ref(0);

const checkString = str =>{
  let temp = str.toUpperCase();
  const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  for(let letter of letters)
    temp = temp.replaceAll(letter,'');
  for(let i=0; i<=9; i++)
    temp = temp.replaceAll(''+i,'');
  temp = temp.replaceAll('-','');
  return temp.length===0;
};

const createArc = ()=>{
  arc_mode.value = 1;
  window.ipc.invoke('ACS_setConfigEntries', {arc_name:arc_name.value}).then(
    config_=>{
      config = config_;

      advancePageState();
      state_arc.value = -2;
      state_assay.value = -2;
      state_token.value = -2;
      state_sync.value = -2;

      gitlab_link.value = config.user_gitlab ? `https://git.nfdi4plants.org/${config.user_gitlab}/${config.arc_name}` : null;

      const queue = [];
      queue.push([`-p ${config.arc_name} init ${gitlab_link.value ? `-r ${gitlab_link.value}`:''}`, state_arc]);
      queue.push([`-p ${config.arc_name} i create -i ${config.arc_name}`, state_arc]);
      queue.push([`-p ${config.arc_name} a add -a ${config.arc_name}`, state_assay]);
      if(config.user_name && config.user_eMail){
        queue.push([`-p ${config.arc_name} config setgituser -l -n "${config.user_name}" -e "${config.user_eMail}"`, state_token]);
      }
      if(config.user_gitlab){
        queue.push([`-p ${config.arc_name} remote token get -s git.nfdi4plants.org`, state_token]);
        queue.push([`-p ${config.arc_name} sync -f`, state_sync]);
      }

      processArcCommandQueue(queue);
    }
  );
};

const syncArcs = ()=>{
  arc_mode.value = 2;
  arc_selected_state.value = -2;

  advancePageState();

  console.log(arc_selected.value);

  const queue = [];
  queue.push([`-p ${arc_selected.value} remote token get -s git.nfdi4plants.org`, arc_selected_state]);
  queue.push([`-p ${arc_selected.value} sync -f`, arc_selected_state]);

  processArcCommandQueue(queue);
};

const processArcCommandQueue = queue=>{
  if(!queue.length){
    setTimeout(advancePageState, 1000);
    return;
  }

  const command = queue.shift();
  if(command[1]!==null)
    command[1].value = -1;
  window.ipc.invoke( 'ACS_runCommand', command[0] ).then(
    status=>{
      console.log(command,status);
      if(command[1]!==null)
        command[1].value = status[0] ? 1 : 0;

      if(!status[0])
        return;

      processArcCommandQueue(queue);
    }
  );
};

const runArcCommander = ()=>{
  window.ipc.invoke('ACS_runCommand', {}).then(
    res => {
      console.log(res);
    }
  );
};

const openExternalLink = url => {
  window.ipc.invoke('ACS_openExternalLink', url);
};

const openExternalLink_ = () => {
  console.log(gitlab_link.value);
  if(gitlab_link.value)
    window.ipc.invoke('ACS_openExternalLink', gitlab_link.value);
};

const downloadArcCommander = ()=>{
  state_download.value = 1;
  window.ipc.invoke('ACS_downloadArcCommander').then(
    config_=>{
      state_download.value = 2;
      config = config_;
      advancePageState();
    }
  );
};

const setGitLabAccount = () => {
  window.ipc.invoke('ACS_setConfigEntries', {user_gitlab:user_gitlab.value}).then(
    config_=>{
      config = config_;
      advancePageState();
    }
  );
};
const setUserNameAndEMail = () => {
  window.ipc.invoke(
    'ACS_setConfigEntries',
    {
      user_name:user_name.value,
      user_eMail:user_eMail.value,
    }
  ).then(
    config_=>{
      config = config_;
      advancePageState();
    }
  );
};

const advancePageState = ()=>{
  switch(state_page.value){
    case 'PAGE_INITIAL':
      if(!config.arc_commander.exists){
        return state_page.value='PAGE_WELCOME';
      }
    case 'PAGE_WELCOME':
      if(!config.user_gitlab) {
        return state_page.value='PAGE_GITLAB';
      }
    case 'PAGE_GITLAB':
      if(!config.user_name) {
        return state_page.value='PAGE_USER';
      }
    case 'PAGE_USER':
      return state_page.value='PAGE_CREATE_ARC';
    case 'PAGE_CREATE_ARC':
      if(arc_mode.value === 1)
        return state_page.value='PAGE_PROCESS_ARC_CREATE';
      else
        return state_page.value='PAGE_PROCESS_ARC_SYNC';
    case 'PAGE_PROCESS_ARC_CREATE':
    case 'PAGE_PROCESS_ARC_SYNC':
      return state_page.value='PAGE_HELP';
  }
  console.error('Undefined State', state_page.value);
}

const resetApp = ()=>{
  state_page.value='PAGE_INITIAL';
  state_download.value = 0;
  state_arc.value = 0;

  window.ipc.invoke('ACS_checkInitialState').then(
    config_=>{
      config = config_;
      latestReleaseLabel.value = config.arc_commander.filename;
      arcs.value = config.arcs;
      if(arcs.value.length)
        arc_selected.value = arcs.value[0];

      advancePageState();
    }
  );

  window.ipc.invoke('ACS_debug').then(
    data => {
      for(let x of data){
        try {
          console.log(x);
          console.log(JSON.parse(x));
        } catch(e){}
      }
    }
  );
  window.ipc.invoke('ACS_getArcCommanderPath').then(
    data => {
      console.log(data);
    }
  );
}

onMounted(() => {
  resetApp();
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
  font-weight: bold;
  font-size: 2em !important;
  background-color: #2d3e50;
  color: white;
  /*border-top-left-radius: 0.5em;*/
  /*border-top-right-radius: 0.5em;*/
  margin: 0;
}
h2 {
  font-size: 2em !important;
  background-color: #2d3e50;
  color: white;
  /*border-bottom-left-radius: 0.5em;*/
  /*border-bottom-right-radius: 0.5em;*/
  margin: 0;
  min-height: 1em;
}

.link {
  color:#00a9e5;
  font-weight: bold;
  cursor: pointer;
}

.dialog {
  margin:0 auto;
  text-align:center;
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  border-bottom:2em solid #2d3e50;
  overflow: hidden;
}

.content_wrapper {
  max-width: 27em;
  height: 38em;
  margin: 0 auto;
}

.content {
  position: relative;
  margin: 0 auto;
  /*border:0.1em solid red;*/
}

.content > div {
  position: absolute;
  padding: 1em 1em;
  width: 100%;
}

.note-message {
  color: #aaa;
}

.bold-message {
  font-size: 1.7em;
  font-weight: bold;
  padding: 0 0 0.25em 0;
}

.message {
  font-size: 1.15em;
  padding: 0.8em 0;
}
.tasklist {
  padding: 0;
  margin: -0.75em 0;
}

.check {
  font-size: 1.8em;
  color: #47db4d;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

</style>
