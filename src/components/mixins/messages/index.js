export default {
  data(){
  return{ 
      flashMsg:{
        active: false,
        type: '',
        msg: '',
        time: 0
      },
  }
  },
  methods:{
  createSuccess(msg){
  this.flashMsg = {active: true,type:'done', time:3000, msg: msg || 'sucesso.'}
    },
    createFailure(msgErro){
  this.flashMsg = {active: true,type:'fail', time:3000, msg: msgErro || 'Erro.'}
    },
  },
}