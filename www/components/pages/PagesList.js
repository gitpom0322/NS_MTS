//import { defineComponent } from 'vue';
const { ref, reactive, onMounted, watch, defineComponent, toRefs } = Vue;


export default defineComponent({
    props: {
        setPages: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }) {

        const pages = reactive({
            thisPage: 1,
            thisShowPage: 0,
            pageShowView: 0,
            pagesScope_s: 0,
            pagesScope_e: 0,
            allPages: 0,
            isFirst: true,
            isLast: false
        });

        const doPageslist_Get = () => {

            console.log('dataCount2', props.setPages);
            const allPages = lib_RoundUp(parseInt(props.setPages.dataCount) / props.setPages.pageSize, 0);
            pages.allPages = allPages;

            let pages_s = pages.pagesScope_s;
            let pages_e = pages.pagesScope_e;
            let pages_diff = 0;

            const thisPage = pages.thisPage;
            const pages_show = props.setPages.pageShowCount;

            let modPagesNum = lib_RoundUp(parseInt(thisPage) / pages_show, 0) - 1;
            if (thisPage === pages_show) {
                modPagesNum = 0;
            }

            if (thisPage === 1) {
                pages_s = 1;
                pages_e = pages_show;
            } else {
                pages_s = (modPagesNum * pages_show) + 1;
                pages_e = (pages_s + pages_show) - 1;
            }

            pages_diff = (pages_e > allPages) ? (pages_e - allPages) : 0;
            pages.pageShowView = (pages_diff > 0) ? (pages_show - pages_diff) : pages_show;

            pages_s = (pages_s <= 0) ? 1 : pages_s;

            pages.isFirst = (thisPage <= pages_show);
            pages.isLast = (pages_diff > 0);

            pages.pagesScope_s = pages_s;
            pages.pagesScope_e = pages_e;

        };

        const doPagesThisClick = (num) => {
            pages.thisPage = num;
            emit('emit-ListDataGet', num);
        };

        const doPageslist_Next = () => {
            pages.thisPage = props.setPages.pageShowCount + pages.pagesScope_s;
            doPageslist_Get();
        };

        const doPageslist_Pre = () => {
            pages.thisPage = pages.pagesScope_s - props.setPages.pageShowCount;
            doPageslist_Get();
        };

        const pagesNumEnter = (event) => {
        const thisPage = parseInt(event.target.value);

        if (!Number.isInteger(thisPage)) {
            alert('只能輸入數字!');
            return false;
        }

        if (thisPage < 1) {
            alert('不能輸入比1小的值');
            return false;
        }

        if (thisPage > pages.allPages) {
            alert(`超過總筆數!\n不能大於${pages.allPages}頁!`);
            return false;
        }

        pages.thisPage = thisPage;
        emit('emit-ListDataGet', thisPage);
            doPageslist_Get();
        };

        const lib_RoundUp = (num, decimal) => {
            return Math.ceil((num + Number.EPSILON) * Math.pow(10, decimal)) / Math.pow(10, decimal);
        };

        onMounted(() => {

            setTimeout(function() { 
                doPageslist_Get();
            }, 1000);
            
        });

        return {
            //   ...toRefs(pages),
            pages,
            doPageslist_Get,
            doPagesThisClick,
            doPageslist_Next,
            doPageslist_Pre,
            pagesNumEnter,
            lib_RoundUp
        };
    },
    template: await fetch('./www/components/pages/PagesList.html').then(response => response.text())
});