<template>
  <div class='dialog'>
    <h1><img src='./assets/dpLogo.svg' style="display:inline-block;height:3em;margin:-1.2em -1em -1.2em -1em;"/>ARC Commander Mini</h1>
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
                Downloading Arc Commander ...
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
          <!--<div v-if="state_page==='PAGE_WELCOME'">-->
          <!--  <div class='bold-message' style="margin:1em 0 -1em 0;">-->
          <!--    Congratulations!-->
          <!--  </div>-->
          <!--  <div class='message'>-->
          <!--    You have just created your first ARC.-->
          <!--  </div>-->
          <!--  <div class='message'>-->
          <!--    Do not hesitate to start adding your data and metadata to FAIRify your research.-->
          <!--  </div>-->
          <!--  <div class='message'>-->
          <!--    The Swate tool provides support in finding standardized terms for metadata annotations. Check out the <span class='link' @click='openExternalLink("https://github.com/nfdi4plants/Swate/wiki/")'>tutorials</span> to learn how to use it.-->
          <!--  </div>-->
          <!--  <div class='message'>-->
          <!--    For further assistance, please consult our <span class='link' @click='openExternalLink("https://nfdi4plants.org/nfdi4plants.knowledgebase/index.html")'>knowledge base</span>, <span class='link' @click='openExternalLink("https://helpdesk.nfdi4plants.org")'>helpdesk</span>, or feel free to contact us directly at <span class='link' @click='openExternalLink("email:info@nfdi4plants.org")'>info@nfdi4plants.org</span>.-->
          <!--  </div>-->
          <!--</div>-->

          <!-- ############################################################# -->
          <!--<div v-if="state_page==='PAGE_WELCOME'">-->
          <!--  <div>Welcome!</div>-->
          <!--  <br/>-->
          <!--  <div>This tool will help you to setup your first ARC.</div>-->
          <!--  <br/>-->
          <!--  <div>Get started by downloading the ARCcommander.</div>-->
          <!--  <br/>-->
          <!--  <div>-->
          <!--    <q-btn label="Download" color="primary" class="q-ml-sm" @click="state_download=1"></q-btn>-->
          <!--    <div style="color:gray">~100MB</div>-->
          <!--  </div>-->
          <!--  <br/>-->
          <!--</div>-->
          <!--<div v-if="state_page==='PAGE_WELCOME'">-->
          <!--  <div>Welcome!</div>-->
          <!--  <br/>-->
          <!--  <div>This tool will help you to setup your first ARC.</div>-->
          <!--  <br/>-->
          <!--  <div>Get started by downloading the ARCcommander.</div>-->
          <!--  <br/>-->
          <!--  <div>-->
          <!--    <q-btn label="Download" color="primary" class="q-ml-sm" @click="state_download=1"></q-btn>-->
          <!--    <div style="color:gray">~100MB</div>-->
          <!--  </div>-->
          <!--  <br/>-->
          <!--</div>-->
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
                ></q-input>
                <div style='text-align:left;margin-top:-1.0em'>
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
                <q-btn label="Skip" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
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
              Now you can start creating your first ARC.
            </div>
            <br>
            <q-form
              @submit="createArc"
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="arc_name"
                label="Name of the ARC"
                lazy-rules
                :rules="[ val => val && val.length > 0 || '']"
              ></q-input>
              <q-btn label="Create" style="margin-top:-0.5em;" type="submit" color="primary"></q-btn>
            </q-form>
          </div>

          <!-- ############################################################# -->
          <div v-else-if="state_page==='PAGE_PROCESS_ARC'">
            <div class='bold-message' style="margin-top:2em;">
              Creating ARC...
            </div>

            <div style="text-align:right;margin:1em 5em 0 0;">
              <div class="message tasklist">
                Setting up the ARC
                <q-circular-progress
                  :indeterminate='state_arc===-1'
                  size="1em"
                  :thickness="0.4"
                  :color="state_arc===0?'red':'primary'"
                  track-color="grey-3"
                  class="q-ma-md"
                  :value='state_arc>=0?100:0'
                />
              </div>
              <div class="message tasklist">
                Adding Assay
                <q-circular-progress
                  :indeterminate='state_assay===-1'
                  size="1em"
                  :thickness="0.4"
                  :color="state_assay===0?'red':'primary'"
                  track-color="grey-3"
                  class="q-ma-md"
                  :value='state_assay>=0?100:0'
                />
              </div>
              <div class="message tasklist">
                Retrieving Access Token
                <q-circular-progress
                  :indeterminate='state_token===-1'
                  size="1em"
                  :thickness="0.4"
                  :color="state_token===0?'red':'primary'"
                  track-color="grey-3"
                  class="q-ma-md"
                  :value='state_token>=0?100:0'
                />
              </div>
              <div class="message tasklist">
                Synchronizing ARC
                <q-circular-progress
                  :indeterminate='state_sync===-1'
                  size="1em"
                  :thickness="0.4"
                  :color="state_sync===0?'red':'primary'"
                  track-color="grey-3"
                  class="q-ma-md"
                  :value='state_sync>=0?100:0'
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
    <h2></h2>
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

const state_arc = ref(0);
const state_assay = ref(0);
const state_token = ref(0);
const state_sync = ref(0);

const createArc = ()=>{
  window.ipc.invoke('ACS_setConfigEntries', {arc_name:arc_name.value}).then(
    config_=>{
      config = config_;

      state_page.value = 'PAGE_PROCESS_ARC';
      state_arc.value = -2;
      state_assay.value = -2;
      state_token.value = -2;
      state_sync.value = -2;

      processArcCommandQueue([
        [`-p ${config.arc_name} init -r https://git.nfdi4plants.org/${config.user_gitlab}/${config.arc_name}`, null],
        [`-p ${config.arc_name} i create -i ${config.arc_name}`, state_arc],
        [`-p ${config.arc_name} a init -a ${config.arc_name}`, state_assay],
        [`-p ${config.arc_name} remote token get -s git.nfdi4plants.org`, state_token],
        [`-p ${config.arc_name} config setgituser -l -n ${user_name} -e ${user_eMail}`, null],
        [`-p ${config.arc_name} sync -f`, state_sync],
      ]);
    }
  );
};

const processArcCommandQueue = queue=>{
  if(!queue.length)
    return;

  const command = queue.shift();
  if(command[1]!==null)
    command[1].value = -1;
  window.ipc.invoke( 'ACS_runCommand', command[0] ).then(
    status=>{
      console.log(status);
      if(command[1]!==null)
        command[1].value = status;

      if(!status)
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

const downloadArcCommander = ()=>{
  state_download.value = 1;
  window.ipc.invoke('ACS_downloadArcCommander').then(
    _=>{
      state_download.value = 2;
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
  if(!config.arc_commander.exists && state_page.value!='PAGE_WELCOME'){
    state_page.value='PAGE_WELCOME';
  } else if(!config.user_gitlab && state_page.value!='PAGE_GITLAB') {
    state_page.value='PAGE_GITLAB';
  } else if(!config.user_name && state_page.value!='PAGE_USER') {
    state_page.value='PAGE_USER';
  } else {
    state_page.value='PAGE_CREATE_ARC';
  }
  // } else if(!config.arc_name && state_page.value!='PAGE_CREATE_ARC') {
  //   state_page.value='PAGE_CREATE_ARC';
  // } else {
    // state_page.value='PAGE_ARC';
}

onMounted(() => {
  state_page.value='PAGE_INITIAL';

  state_download.value = 0;
  state_arc.value = 0;

  window.ipc.invoke('ACS_checkInitialState').then(
    config_=>{
      config = config_;
      latestReleaseLabel.value = config.arc_commander.filename;
      advancePageState();
    }
  );

  window.ipc.on('msg', msg => {
    console.log('SERVER:',msg);
  } );
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

.link {
  color:#00a9e5;
  font-weight: bold;
  cursor: pointer;
}

.dialog {
  max-width: 25em;
  min-width: 25em;
  margin:0 auto;
  margin-top:1em;
  text-align:center;
  position: relative;
}

.content {
  border:0.1em solid #2d3e50;
  padding: 1em 1em;
  overflow: hidden;
  height:32em;
}

.content > div {
  position: absolute;
  left:0;
  right:0;
  padding: 0 1em;
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
  padding: 1em 0;
}
.tasklist {
  padding: 0;
  margin: -0.75em 0;
}

.check {
  font-size: 1.8em;
  color: #47db4d;
  /*margin-left: 0.5em;*/
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
