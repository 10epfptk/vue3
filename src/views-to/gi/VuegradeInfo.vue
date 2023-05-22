<template>
    <p class="Location">
        <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a> <span
            class="btn_nav bold">학습 관리</span> <span class="btn_nav bold">성적 조회</span> 
    </p>
    
    <p class="conTitle" id="selectLecArea">
        <span>성적 조회</span>
    </p>
    				
    <div id="gradeListArea">
            
        <table class="col">
            <caption>caption</caption>
            <colgroup>
                <col width="20%">
                <col width="15%">
                <col width="15%">
                <col width="20%">
                <col width="20%">
                <col width="10%">
            </colgroup>

            <thead>
                <tr>
                    <th scope="col">강의명</th>
                    <th scope="col">시험 구분</th>
                    <th scope="col">학생 수</th>
                    <th scope="col">시험시작일</th>
                    <th scope="col">시험종료일</th>
                    <th scope="col">활성/비활성</th>
                </tr>
            </thead>
            
            <template v-if="lectotalCnt == 0">
                <tbody>
                    <td colspan="6">데이터가 존재하지 않습니다.</td>
                </tbody>
            </template>
            
            <template v-else>
                <tbody v-for="(list, index) in lecList" :key="index">
                    <td><a href="" @click.prevent="gradelistsearch(list.lec_seq)">{{list.lec_name}}</a></td>
                    <td>{{list.lec_test}}</td>
                    <td>{{list.lec_now}}</td>
                    <td>{{list.lec_st}}</td>
                    <td>{{list.lec_ed}}</td>
                    <td>
                        <a class="btnType3 color1" href="" @click.prevent="enableschange(list.lec_seq)">
                            <span>{{list.test_state}}</span>
                        </a>
                    </td>
                </tbody>
            </template>
            
        </table>
    </div>
    <paginate 
        class="justify-content-center"
        v-model="lecpagenum"
        :page-count="lectotalpage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="leclistsearch"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
    >
    </paginate>
    
    <br>
    <div id="stuTestListArea" v-show="gradeshow">
        <div id="enterList">
                
            <table class="col">
                <caption>caption</caption>
                <colgroup>
                    <col width="20%">
                    <col width="20%">
                    <col width="20%">
                    <col width="20%">
                    <col width="20%">
                </colgroup>

                <thead>
                    <tr>
                        <th colspan="5">시험 응시 현황</th>
                    </tr>
                    <tr>
                        <th scope="col">학번</th>
                        <th scope="col">학생명</th>
                        <th scope="col">점수</th>
                        <th scope="col">응시 여부</th>
                        <th scope="col">시험 결과</th>
                    </tr>
                </thead>
                
                <template v-if="gradetotalCnt == 0">
                    <tbody>
                        <td colspan="5">데이터가 존재하지 않습니다.</td>
                    </tbody>
                </template>
                
                <template v-else>
                    <tbody v-for="(list, index) in gradeList" :key="index">
                        <tr>
                            <td>{{list.loginID}}</td>
                            <td>{{list.ui_name}}</td>
                            <td>{{list.score}}</td>
                            <td>{{list.enter}}</td>
                            <td>{{list.result}}</td>
                        </tr>
                    </tbody>
                </template>
                
            </table>
        </div>
        <paginate 
        class="justify-content-center"
        v-model="gradepagenum"
        :page-count="gradetotalpage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="gradelist"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
        >
        </paginate>
    </div>
</template>
<script>

    import Paginate from 'vuejs-paginate-next';

    export default{
        data: function(){
            return{

                lecList:[],
                lectotalCnt:0,
                lecpagenum:1,
                lecpageSize:5,
                lectotalpage:1,
                gradeshow: false,
                lecseq: 0,
                gradeList: [],
                gradetotalCnt: 0,
                gradepagenum: 1,
                gradepageSize: 3,
                gradetotalpage: 1,

            }
        },
        components: {

            paginate : Paginate,

        },
        mounted(){

            this.leclistsearch();

        },
        methods: {

            page: function(total,page){

                let result = parseInt(total/page);
                let xx = total%page;

                if(xx == 0){

                    return result;

                }else{

                    result = result + 1;
                    return result;

                }

            },
            leclistsearch: function(pagenum){

                this.lecpagenum = pagenum || 1;

                let params = new URLSearchParams();

                params.append('pagenum', this.lecpagenum);
                params.append('pageSize', this.lecpageSize);

                this.axios
                    .post('/gi/vuegradeList.do', params)
                    .then((result) => {

                        this.lecList = result.data.gradelist;
                        this.lectotalCnt = result.data.gradecnt;
                        this.lectotalpage = this.page(this.lectotalCnt, this.lecpageSize);
                        console.log(this.lecList);
                        console.log(this.lectotalCnt);

                    })

            },
            enableschange: function(lecseq){

                let params = new URLSearchParams();

                params.append('lecseq', lecseq);

                this.axios
                    .post('/gi/enaChange.do', params)
                    .then(() => {

                        this.leclistsearch();

                    });

            },
            gradelistsearch: function(lecseq){

                this.gradepagenum = 1;
                this.lecseq = lecseq;
                this.gradeshow = true;
                this.gradelist();

            },
            gradelist: function(){

                let params = new URLSearchParams();

                params.append('pagenum', this.gradepagenum);
                params.append('pageSize', this.gradepageSize);
                params.append('lecseq', this.lecseq);

                this.axios
                    .post('/gi/vueenterList.do', params)
                    .then((result) => {

                        this.gradeList = result.data.enterlist;
                        this.gradetotalCnt = result.data.entercnt;
                        this.gradetotalpage = this.page(this.gradetotalCnt, this.gradepageSize);
                        console.log(this.gradeList);
                        console.log(this.gradetotalCnt);

                    })

            }

        }
    }
</script>