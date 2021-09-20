
Vue.component("mail-list", {
  data: function() {
    return {
      InboxToShow: {}
    }
  }, 
  props: ['inbox'],

  created: function() {
    //al crearse el component comencarem a refrescar cada 10 seg
    //mitjançat createdEvent
    this.$emit('createdEvent');
  },


  template:
  `<div>
      <button @click="$emit('compose')">COMPOSE</button><br>

      <h2>Inbox</h2>
      <ul v-for="entry in this.inbox">
        <li @click="$emit('showMailReaderEvent', entry)" >{{entry["from"]}}::{{entry["subject"]}}</li>
      </ul><br>

      <button @click="$emit('clickedEvent')">REFRESH</button>
    
  </div>`
})

Vue.component("InputAdress", {
  props:['value', 'adressBook'],
  data: function(){
    return{
      destination: this.value,
      show: false,
    }
  },
  methods: {
      getInputAdress: function() {
          //d'on rebo la peticio? hauria de ser del servidor?

      },
      mostra: function() {
        this.show = !this.show;
      },
  },
  template: `<div>
  <b>To: </b><input v-model="value">
  <button v-on:click="mostra()">Adress Book</button><br><br>
  <ul v-if="show">
  <li v-for="adress in this.adressBook" @click="$emit('clickedAdress',adress);">{{adress}}</li>

  </ul>
  </div>`
})

Vue.component("mail-composer", {
  props: ['adressBook'],
  data: function() {
    return {
      destination: "", 
      subject: "", 
      body: "",
    }
  },
  methods: {
    sendMailContent: function(){
      this.$emit('sendMailEvent', {'Destination': this.destination,'Subject': this.subject,'Body': this.body});
    },
    setAdress:function(adress) {
      this.destination = adress;
    }
  },
  template: `
  <div >
    <span style="{position: Top Left;  border-style: solid; width: 80%; border-width: 3px; display: inline-block;">
    <InputAdress v-model="destination" v-bind:adressBook="adressBook"  v-on:clickedAdress=setAdress($event) ></InputAdress>
    <b>Subject: </b><input v-model="subject"><br><br>
    <b>Body:<br> </b><textarea rows=15 cols=120 v-model="body"></textarea><br><br>
    <button v-on:click=sendMailContent()>Send</button>
    </span>
  </div>`   
});

Vue.component("mail-reader", {
   props: ['mail'],
  template: `
  <div >
    <span style="{position: Top Left;  border-style: solid; width: 80%; border-width: 3px; display: inline-block;">
    <b>From: </b> {{mail["from"]}}<br><br> 
    <b>To: </b> {{mail["to"]}}<br><br>
    <b>Subject: </b> {{mail["subject"]}}<br><br>
    <b>Body: </b> {{mail["body"]}}<br><br>

    <button @click="$emit('forward')">Forward</button> 

    <button @click="$emit('reply')">Reply</button>   

    <button @click="$emit('delete', mail['id'])">Delete</button><br>
    </span>
  </div>`   
})

Vue.component("mail-forwarder", {
  props: ['mail','adressBook'],
  data: function() {
    return {
      //User: {name:'Mar', suname:'Dofi', age:20},
      origin: this.mail["to"],
      destination: "", 
      subject: "Fw: " + this.mail["subject"], 
      body: this.mail["body"],
    }
  },
  methods: {
    sendMailContent: function(){
      this.$emit('sendMailEvent', {'Destination': this.destination,'Subject': this.subject,'Body': this.body});
    },
    setAdress:function(adress) {
      this.destination = adress;
    }
  },
  template: `
  <div >
    <span style="{position: Top Left;  border-style: solid; width: 80%; height: 80%; border-width: 3px; display: inline-block;">
    <b>From: </b><input v-model="origin" readonly><br><br>
    <!--<b>To: </b><input v-model="destination"><button>Adress Book</button>-->
    <InputAdress v-model="destination" v-bind:adressBook="adressBook"  v-on:clickedAdress=setAdress($event) ></InputAdress><br><br>
    <b>Subject: </b><input v-model="subject"><br><br>
    <b>Body:<br> </b><textarea rows=15 cols=120 v-model="body"></textarea><br><br>
    <button v-on:click=sendMailContent()>Send</button>
    </span>
  </div>`    
})

Vue.component("mail-replier", {
  props: ['mail'],
  data: function() {
    return {
      //User: {name:'Mar', suname:'Dofi', age:20},
      origin: this.mail["to"],
      destination: this.mail["from"], 
      subject: "Re: " + this.mail["subject"], 
      body: this.mail["body"],
    }
  },
  methods: {
    sendMailContent: function(){
      this.$emit('sendMailEvent', {'Destination': this.destination,'Subject': this.subject,'Body': this.body});
    }
  },
  template: `
  <div >
    <span style="{position: Top Left;  border-style: solid; width: 80%; height: 80%; border-width: 3px; display: inline-block;">
    <b>From: </b><input v-model="origin" readonly><br><br>
    <b>To: </b><input v-model="destination"><button>Adress Book</button><br><br>
    <b>Subject: </b><input v-model="subject"><br><br>
    <b>Body:<br> </b><textarea rows=15 cols=120 v-model="body"></textarea><br><br>
    <button v-on:click=sendMailContent()>Send</button>
    </span>
  </div>`    
})




//Creating the Vue object.
let options = {
  el: "#app",
  data: {
    pollingId: null,
    personalInbox:{},
    personalMailList:[],
    showComposerFlag: false,
    showMailReaderFlag:false,
    showMailForwarder:false,
    showMailReplyer:false,
    mailToShow:{},
    adressBook:[]
  },



  beforeDestroy: function() {
  },

  methods: {
    sendMail: function(mail){

      //let user = {name:'Mar', suname:'Dofi', age:20};

      fetch("/composedMail", {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify(mail),
      })
      .catch((error)=> {
        console.error('Error', error);
      })
      console.log("json mail send");
    
      //console.log(mail);
      this.resetDisplayMailOption();
    }, // end sendMail

    deleteMail: function(){
    },

    resetDisplayMailOption: function() {
      this.showComposerFlag= false;
      this.showMailReaderFlag=false;
      this.showMailForwarder=false;
      this.showMailReplyer=false;
    },

    refreshMailList: function(){
      console.log("Refreshing Mail List");
      
      fetch("/inbox", {
        method: 'GET',
        headers: {
          'Content-Type':'application/json',
        },
      })
      .then(res => res.json())
      .then(data => this.personalInbox = data);

      
    },

    initAddressBook: function(){
      fetch("/getAdress")
      .then(res=>res.json())
      .then(data => this.adressBook = data);

    }, //end initAddressBook

    displayMailReader: function(mail){
      this.resetDisplayMailOption();
      //reset all flags

       this.showMailReaderFlag=true;
       this.mailToShow=mail;

    },  //end displayMailReader

    displayMailComposer: function(){
      this.resetDisplayMailOption();
      //reset all flags
            
      //a partir del valor obtingut del component del boto del compose, 
      //asignem el nou valor al flag de mail-composer al template
        this.showComposerFlag = true;
    },  //end displayMailComposer

    displayMailForwarder: function(){
      this.resetDisplayMailOption();

      this.showMailForwarder = true;
    },  //end displayMailForwarder

    displayMailReplyer: function(){
      console.log("Hello");
      this.resetDisplayMailOption();

      this.showMailReplyer = true;
    },  //end displayMailReplyer

    deleteMail: function(mailID){
      
      fetch("/deleteMail/" + mailID, {
        method: 'DELETE',
      })

      this.resetDisplayMailOption();
      this.refreshMailList();
    }



  }, //end methods
  created: function() {
    this.refreshMailList();
    
      //Refresh cada 10 segons
      setInterval(()=>this.refreshMailList(), 10000);
      this.initAddressBook();
  },
  template: 
    `<div>
 
      <mail-list 
          v-on:compose="displayMailComposer()" 
          v-bind:inbox="personalInbox" 
          v-on:showMailReaderEvent="displayMailReader($event)" 
          v-on:clickedEvent="refreshMailList()">
      </mail-list>


      <mail-composer 
          v-if="showComposerFlag" 
          v-bind:adressBook="adressBook"
          v-on:sendMailEvent="sendMail($event)">
      </mail-composer>
      
      
      <mail-reader 
          v-if="showMailReaderFlag" 
          v-bind:mail="mailToShow" 
          v-on:forward="displayMailForwarder()"
          v-on:reply="displayMailReplyer()"
          v-on:delete="deleteMail($event)">
      </mail-reader>


      <mail-forwarder 
          v-bind:mail="mailToShow"
          v-bind:adressBook="adressBook" 
          v-if="showMailForwarder" 
          v-on:sendMailEvent="sendMail($event)">
      </mail-forwarder>


      <mail-replier 
      v-bind:mail="mailToShow" 
      v-if="showMailReplyer" 
      v-on:sendMailEvent="sendMail($event)">
  </mail-replier>


    </div>`,
  

} //end options
let vm = new Vue(options);
