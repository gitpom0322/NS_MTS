// filepath: /d:/NB/公司/SourceCode/專案/js/electron/t01/e01/www/tpls/top.js
const { ref, reactive, watch, computed, nextTick } = Vue;

export const topTpl = {
  data() {
    return {
      datab: '123456',
      templateContent: '' // 用於存儲 fetch 獲取的內容
    };
  },
  methods: {
    dotop() {
      alert('dotop');
    },

    async fetchTemplate() {
      try {
        const response = await fetch('./www/tpls/car_chicken/top.html');
        // console.log('Response:', response);

        // 確保 response.ok 為 true
        if (response.ok) {
          const text = await response.text();
        //   console.log('Response Text:', text);
          this.templateContent = text; // 將獲取到的內容設置到 data 中
          await nextTick();
          this.$refs.templateContainer.innerHTML = this.templateContent;
          this.compileTemplate();
        } else {
          console.error('HTTP error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    },

    compileTemplate() {
      const container = this.$refs.templateContainer;
      const compiled = Vue.compile(container.innerHTML);
      const component = {
        data: () => ({ datab: this.datab }),
        render: compiled.render,
        staticRenderFns: compiled.staticRenderFns
      };
      const vm = Vue.createApp(component).mount(container);
    }
  },
  async mounted() {
    // 初始化
    console.log('init datab:', this.datab);
    await this.fetchTemplate();
  },
  template: `
    <div>
      <div ref="templateContainer"></div>
    </div>
  `
};