<template>
  <div class="hello">

    <h1>{{ message }}</h1>

    <p>Try uploading an image.</p>
    <!-- <form action="/" method="post" enctype="multipart/form-data"> -->
      <input type="file" id="file" ref="file" v-on:change="handleFileUpload()">
    <!-- </form> -->
    <button v-on:click="submitFile()">Submit</button>

  </div>
</template>

<script>


export default {
  name: 'Upload',
  data: () => ({
    message: "File Upload",
    file: ''
  }),
  methods: {
    submitFile(){
      let formData = new FormData();
      formData.append('file', this.file);
      const endpoint = `${process.env.VUE_APP_BASE_URL}`;

      this.axios.post( endpoint,
      formData,
      {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      }
    ).then(function(){
      console.log('SUCCESS!!');
    })
    .catch(function(){
      console.log('FAILURE!!');
    });

    },
    handleFileUpload(){
      this.file = this.$refs.file.files[0];
    }
  }
}
</script>
