<template>

  <div>
    <h1>File Upload</h1>

    <div class="dropbox">

        <input type="file" multiple
        :name="uploadFieldName"
        :disabled="isSaving"
        @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
        accept="image/*"
        class="input-file">

        <p v-if="isInitial">
          Drag your file(s) here to begin<br> or click to browse
        </p>
        <p v-if="isSaving">
          Uploading {{ fileCount }} files...
        </p>

    </div>

    <div v-if="isSuccess">
      <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
      <p>
        <a href="javascript:void(0)" @click="reset()">Upload again</a>
      </p>
      <ul class="list-unstyled">
        <li v-for="item in uploadedFiles">
          <img :src="item.url" class="img-responsive img-thumbnail" :alt="item.originalName">
        </li>
      </ul>
    </div>
    <!--FAILED-->
    <div v-if="isFailed">
      <h2>Uploaded failed.</h2>
      <p>
        <a href="javascript:void(0)" @click="reset()">Try again</a>
      </p>
      <pre>{{ uploadError }}</pre>
    </div>
  </div>
</div>

  </div>

</template>

<script>

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;
const BASE_URL = "http://localhost:3000";
import axios from 'axios';

export default {
  name: 'Upload',
  data: () => ({
    uploadedFiles: [],
    uploadError: null,
    currentStatus: null,
    uploadFieldName: 'photos'
  }),
  computed: {
      isInitial() {
        return this.currentStatus === STATUS_INITIAL;
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING;
      },
      isSuccess() {
        return this.currentStatus === STATUS_SUCCESS;
      },
      isFailed() {
        return this.currentStatus === STATUS_FAILED;
      }
  },
  methods:{
    upload(formData) {
      const url = `${BASE_URL}/`;
      return axios.post(url, formData,{
      headers: {
          'Content-Type': 'multipart/form-data'
      }})
          // get data
          .then(x => x.data)
          // add url field
          .then(x => x.map(img => Object.assign({},
              img, { url: `${BASE_URL}/images/${img.id}` })));
    },
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING;

      this.upload(formData)
        .then(x => {
          this.uploadedFiles = [].concat(x);
          this.currentStatus = STATUS_SUCCESS;
        })
        .catch(err => {
          this.uploadError = err.response;
          this.currentStatus = STATUS_FAILED;
        });
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      var formData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      for (var x = 0; x < fileList.length; x++) {
        formData.append(fieldName, fileList[x], fileList[x].name);
      }

      console.log(fileList);
      console.log("sending");
      formData.forEach( x=> {console.log(x);})

      // save it
      this.save(formData);
    }
  },
  mounted() {
    this.reset();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .dropbox {
    outline: 2px dashed black; /* the dash box */
    outline-offset: -10px;
    background: #fb406c;
    color: black;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }
  //
  // .dropbox:hover {
  //   background: lightblue; /* when mouse over to the drop zone, change color */
  // }
  //
  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>
