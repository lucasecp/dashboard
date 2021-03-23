<template>
  <div class="overview">
    <ul class="list-overview">
      <li class="overview-data"> <font-awesome-icon  :icon='icon("chart")'/>
      <div class="overview-content">
       <h2>Vendas no mês</h2>
       <span>{{getSalesPerMounth}}</span>
      </div>
       </li>

       <li class="overview-data"> <font-awesome-icon :icon='icon("dolar")'/>
      <div class="overview-content">
       <h2>Receita do mês</h2>
       <span>{{getProfitPerMounth}}</span>
      </div>
       </li>

       <li class="overview-data"> <font-awesome-icon :icon='icon("layer")'/>
      <div class="overview-content">
       <h2>Categorias</h2>
       <span>{{category.length}}</span>
      </div>
       </li>
    </ul>

    <div class="overview-data performance">
      <h2>Vendas Totais</h2>
      <div class="chart">
        <PieChart :chartData="dataPieCollection"></PieChart>
      </div>
    </div>
    <div class="overview-data performance">
      <h2>Últimos 5 meses</h2>
      <div class="chart">
        <LineChart :chartData="dataCollection"></LineChart>
      </div>
    </div>
  </div>
</template>

<script>
import {
  faShoppingCart, faDollarSign, faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';

import get from 'lodash.get';
import LineChart from './Linechart';
import PieChart from './PieChart';
import axios from '../../../../services/axios';

export default {
  components: { LineChart, PieChart },
  name: 'Overview',
  data() {
    return {
      order: [],
      dataCollection: {},
      dataPieCollection: {},
      rangeMounth: [],
      category: '',
      collectionConfig: [],
      rangeMountString: [],
      currentYear: '',
    };
  },
  methods: {
    async getOrder() {
      try {
        const { data } = await axios.get('/order/all');
        // pegando todas as vendas
       return data
          .filter((d) => d.products.length)
          .map((d) => d.products.map((c) => {
            this.order.push({
              category: c.category,
              price: c.price,
              mounth: c.order_products_users.created_at.split('-')[1],
              year: c.order_products_users.created_at.split('-')[0],
            });
          }));
      } catch (e) {
        const status = get(e, 'response.status', false);
        if (status === 401) {
          this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
          return this.$router.push({ name: 'Auth' });
        }
        return e
      }
    },
    getCategory() {
      axios.get('product/all')
        .then((resp) => {
         return this.category = resp.data
            .reduce((ac, v) => {
              ac.push(v.category);
              return ac;
            }, [])
            .filter((c, i, arr) => i === arr.indexOf(c));
        }).catch((e) =>{
         const status = get(e, 'response.status', false);
        if (status === 401) {
          this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
          return this.$router.push({ name: 'Auth' });
        }
        })
    },
    getLastMounths() {
      this.currentYear = new Date().getFullYear();
      // gerando mês em string e numérica
      const result = [];
      const resultString = [];
      for (let i = 0; i < 5; i++) {
        const m = new Date();
        const mString = new Date();
        m.setMonth(m.getMonth() - i);
        mString.setMonth(mString.getMonth() - i);
        result.push(`${m.toLocaleDateString().split('/')[1]}`);
        resultString.push(`${mString.toUTCString().split(' ')[2]}`);
      }
      this.rangeMounthString = resultString.reverse();
      this.rangeMounth = result.reverse();
    },
    fillData() {
      this.dataCollection = {
        labels: this.rangeMounthString,
        datasets: this.category.map((name) => ({
          label: name,
          backgroundColor: this.fillStyle(name),
          borderColor: '#0004',
          pointBackgroundColor: this.fillStyle(name),
          borderWidth: 1,
          pointBorderColor: '#222',
          // retorna o total de vendas de cada categoria
          data: this.rangeMounth.reduce((acu, vl, i) => {
            acu[i] = this.order.reduce((ac, value) => {
              // juntando cada categoria de acordo com o mês e ano atual
              if (name == value.category && vl == value.mounth
              && this.currentYear == value.year) ac += 1;
              return ac;
            }, 0);
            return acu;
          }, []),
        })),
      };
      this.dataPieCollection = {
        labels: this.category.map((d) => d),
        datasets: [
          {
            backgroundColor: this.category.map((d) => this.fillStyle(d)),
            borderColor: '#0004',
            pointBackgroundColor: '#2cd4d9',
            borderWidth: 1,
            pointBorderColor: '#2cd4d9',
            data: this.category.reduce((acu, vl, i) => {
              acu[i] = this.order.reduce((ac, value) => {
                if (vl == value.category && value.year == this.currentYear) ac += 1;
                return ac;
              }, 0);
              return acu;
            }, []),
          },
        ],
      };
    },
    fillStyle(category) {
      if (category === 'jogos') return '#2cd4d9';
      if (category === 'consoles') return 'rgba(25, 209, 25, 0.8)';
      if (category === 'acessorios') return '#ccc';
      return 'blue';
    },
    icon(name) {
      if (name === 'chart') return faShoppingCart;
      if (name === 'dolar') return faDollarSign;
      if (name === 'layer') return faLayerGroup;
      return null;
    },
  },
  computed: {
    getProfitPerMounth() {
      const value = this.order.reduce((ac, v) => {
        if (v.mounth == this.rangeMounth[this.rangeMounth.length - 1]
        && this.currentYear == v.year) ac += Number(v.price);
        return ac;
      }, 0);
      return parseInt(value).toLocaleString('pt-BR', { minimumIntegerDigits: 2, currency: 'BRL', style: 'currency' });
    },
    getSalesPerMounth() {
      const value = this.order
        .filter((v) => v.mounth == this.rangeMounth[this.rangeMounth.length - 1]
         && this.currentYear == v.year);
      return value.length;
    },
  },
  async created() {
    this.getLastMounths();
     this.getCategory()
    await this.getOrder();
    this.fillData();
  },
};
</script>

<style scoped lang='scss'>
@import "./style.scss";
</style>
