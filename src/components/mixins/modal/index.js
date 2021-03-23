export default {
  data(){
  return{ 
        modal: {
        active: false,
        msg: '',
        style: '',
        title: '',
      },
  }
  },
  methods:{
     openDangerModal(name) {
      this.modal.active = true;
      this.modal.style = 'danger';
      this.modal.title = 'Confirmação';
      this.modal.msg = `Tem certeza que deseja excluir "${name}"`;
    },
     openPermitionModal() {
      this.modal.active = true;
      this.modal.msg = 'você não tem permissão para esta ação.';
      this.modal.style = 'danger';
      this.modal.title =  'Permissão negada'
    },
  },
}