<template>
    <ul >
         <li v-if="Number(this.$route.query.page) && Number(this.$route.query.page) > 1" >
          <router-link :to='{query: query(Number(this.$route.query.page) - 1)}'
           class="previous">
             <<  </router-link>
          </li>
       <li v-for="link in rangePages" :key='link'>
          <router-link :to='{query:query(link)}'>
             {{link}}</router-link>
          </li>
          <li v-if="Number(this.$route.query.page) && Number(this.$route.query.page) < links">
          <router-link :to='{query:query(Number(this.$route.query.page) + 1)}'
          class="next">
             >></router-link>
          </li>
    </ul>
</template>

<script>

export default {
  name: 'Pagination',
  props: {
    limit: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      links: 0,
    };
  },
  methods: {
    totalPages() {
      let totalLinks = Math.ceil(this.total / this.limit);
      this.links = totalLinks;
      if (totalLinks === Infinity) totalLinks = 0;
      const arrayPages = [];
      for (let i = 1; i <= totalLinks; i++) {
        arrayPages.push(i);
      }
      return arrayPages;
    },
    query(link) {
      return {
        ...this.$route.query,
        page: link,
      };
    },
  },
  computed: {
    rangePages() {
      const current = Number(this.$route.query.page);
      const range = 10;
      const arrayRange = this.totalPages();
      arrayRange.splice(0, current - 5);
      arrayRange.splice(range, this.total);
      return arrayRange;
    },
  },
};
</script>

<style scoped lang='scss'>
@import "style.scss";
</style>
