<template>
    <p class="Location">
        <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a> <span
        class="btn_nav bold">학습 관리</span> <span class="btn_nav bold">수강 목록</span> 
    </p>
    
    <p class="conTitle">
        <span>수강 목록</span> <span class="fr"></span>
    </p>
    
    <div id="regList">
        <table class="col">
            <thead>
                <tr>
                    <th scope="col">강의명</th>
                    <th scope="col">강사</th>
                    <th scope="col">강의기간</th>
                    <th scope="col">강의실</th>
                    <th scope="col">설문 여부</th>
                </tr>
            </thead>
            <template v-if="quetotalCnt == 0">
                <tbody>
                    <tr>
                        <td colspan="5">조회된 데이터가 없습니다.</td>
                    </tr>
                </tbody>
            </template>
            <template v-else>
                <tbody v-for="(item, index) in queList" :key="index">
                    <tr>
                        <td @click="itemlistsearch(item.lec_seq)">{{item.lec_name}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.lec_date}}</td>
                        <td>{{item.rm_name}}</td>
                    <template v-if="item.queSendCnt > 0">
                        <td ><p id ="surveyComplete2" style="color : red; font-weight: bold;">설문조사 완료</p></td>
                    </template>   
                    <template v-else>   
                        <td><a href="" @click.prevent="popup(item.lec_seq)" class="btnType blue"><span>설문조사</span></a></td>
                    </template>
                    </tr>
                </tbody>
            </template>
        </table>
    </div>
    <br>
    <paginate 
        class="justify-content-center"
        v-model="quepagenum"
        :page-count="quetotalpage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="RegitList"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
        >
    </paginate>
</template>
<script>

    import Paginate from 'vuejs-paginate-next';
    import {openModal} from 'jenesius-vue-modal';
    import queModal from './queModal.vue';

    export default{

        data: function(){

            return{

                queList: [],
                quetotalCnt: 0,
                quepagenum: 1,
                quepageSize: 5,
                quetotalpage: 1,

            }

        },
        components: {

            paginate: Paginate,

        },
        mounted(){

            this.RegitList();

        },
        methods: {

            page: function(total, page){

                let result = parseInt(total/page);
                let xx = total%page;

                if(xx == 0){

                    return result;

                }else{

                    result = result + 1;
                    return result;

                }

            },
            RegitList: function(){

                let params = new URLSearchParams();

                params.append('pageNum', this.quepagenum);
                params.append('pageSize', this.quepageSize);

                this.axios
                    .post('/stu/vueregisterListDtl.do', params)
                    .then((result) => {

                        this.queList = result.data.regitList;
                        this.quetotalCnt = result.data.totalCnt;
                        this.quetotalpage = this.page(this.quetotalCnt, this.quepageSize);
                        console.log(this.queList);
                        console.log(this.quetotalCnt);

                    })

            },
            popup: async function(lecseq){

                const modal = await openModal(queModal, {

                    mlecseq : lecseq,

                });

                modal.onclose = () => {

                    this.RegitList();

                }

            }

        }

    }
</script>
<style>
    #regList table{display: table;}
    #regList thead th:nth-child(1){width: 30%}
    #regList thead th:nth-child(2){width: 15%}
    #regList thead th:nth-child(3){width: 25%}
    #regList thead th:nth-child(4){width: 10%}
    #regList thead th:nth-child(5){width: 20%}
</style>