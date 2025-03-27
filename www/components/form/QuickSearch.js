const { ref, defineComponent } = Vue;

export default defineComponent({
  props: {
    defList: {
      type: Array,
      required: true
    },
    searchColumn: {
      type: Array,
      required: true
    },
    searchText: {
      type: String,
      required: true
    }
  },
  emits: ['ListFilter'],
  setup(props, { emit }) {
    const listData = ref([]);
    const searchCol = props.searchColumn;
    const searchText = props.searchText;

    //回傳emits
    //const emits = defineEmits();

    const doListFilter_Keyup = (e) => {
      let val = e.target.value;
      //console.log(e.target.value);

      if (val.length == 0) {
        // refList.value = defList.value;
        emit('ListFilter');
        return false;
      }
    };

    const doListFilter_Index = (item, val, index, ary) => {
      let len = searchCol.length;
      console.log('len: ' + len);
      // console.log(seearchLists[0]);
      for (let i = 0; i < len; i++) {
        let name = searchCol[i];
        // console.log('name: ' + name);
        // if(item.ProdName.indexOf(val) != -1){
        if (String(item[name]).indexOf(val) != -1) {
          ary.push(item);
        }
      }

      return ary;
    };

    const doListFilter = (e) => {
      let val = e.target.value;
      listData.value = props.defList;
      // console.log(val);
      // console.log(listData);

      let lists = [];
      let filter_data = listData.value.filter(function (item, index, array) {
        // console.log(index);
        lists = doListFilter_Index(item, val, index, lists);
        // if(item.ProdName.indexOf(val) != -1){
        //     return item;
        // }
      });

      // console.log('lists');
      // console.log(lists);

      // refLists.value = ary;
      emit('ListFilter', lists);

      return false;
    };

    return {
      listData,
      doListFilter_Keyup,
      doListFilter_Index,
      doListFilter
    };
  },
  template: await fetch('./www/components/form/QuickSearch.html').then(response => response.text())
});