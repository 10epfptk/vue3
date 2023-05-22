<template>
    <p class="Location">
        <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
        <span class="btn_nav bold">학습 지원</span> <span
            class="btn_nav bold">학습 자료</span>
    </p>
    <p class="conTitle">
        <span>수강중인 강의 </span>
    </p>

    <div id="lecList">
        <table class="col">
            <caption>caption</caption>
            <colgroup>
                <col width="30%">
                <col width="20%">
                <col width="20%">
                <col width="10%">
                <col width="20%">
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">강의 이름</th>
                    <th scope="col">강의실</th>
                    <th scope="col">진행 날짜</th>
                    <th scope="col">시험</th>
                    <th scope="col">강의 상태</th>
                </tr>
            </thead>
            <template v-if="lectotalcnt == 0">
            <tbody>
                <tr>
                    <td colspan="5">조회된 데이터가 없습니다.</td>
                </tr>
            </tbody>
            </template>
            <template v-else>
            <tbody v-for="(item, index) in leclistitem" :key="index">
                <tr>
                    <td><a href="" @Click.prevent="reflist(item.lec_seq)">{{item.lec_name}}</a></td>
                    <td>{{item.rm_name}}</td>
                    <td>{{item.lec_st}} ~ {{item.lec_ed}}</td>
                    <td>{{item.test_name}}</td>
                    <td>{{item.lec_state}}</td>
                </tr>
            </tbody>
            </template>
        </table>
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
    </div>
    <br>
    <br>
    <div id="listasd" v-show="refflag">	
        <p class="conTitle">
        <span>학습자료 다운로드</span>
        </p>
        
        <table class="col">
            <caption>caption</caption>
            <colgroup>
                <col width="50%">
                <col width="30%">
                <col width="20%">
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">제목</th>
                    <th scope="col">등록일</th>
                    <th scope="col">첨부파일</th>
                </tr>
            </thead>
            <template v-if="reftotalcnt == 0">
                <tbody>
                    <tr>
                        <td colspan="3">조회된 데이터가 없습니다.</td>
                    </tr>
                </tbody>
            </template>
            <template v-else>
                <tbody v-for="(item, index) in reflistitem" :key="index">
                    <tr>
                        <td>{{item.ref_title}}</td>
                        <td>{{item.ref_regdate}}</td>
                        <template v-if="item.file_name == null">
                            <td></td>
                        </template>
                        <template v-else>
                            <td><a href="" @Click.prevent="download(item.ref_seq, item.file_name)">{{item.file_name}}</a></td>
                        </template>
                    </tr>
                </tbody>
            </template>
        </table>
    </div>
</template>
<script>
    import Paginate from 'vuejs-paginate-next';

    export default {

        data: function(){

            return{

                leclistitem : [],
				lectotalcnt : 0,
				lecpagenum : 1,
				lecpagesize : 3,
                lectotalpage : 0,
				lecseq : 0,
                refflag : false,

                reflistitem : [],
				reftotalcnt : 0,
				refpagenum : 1,
				refpagesize : 3,
                reftotalpage : 0,
				filename : "",
				params : "",
				send : ""

            }

        },
        components: {
            paginate : Paginate,
        },
        mounted: function(){

            this.leclistsearch();

        },
        methods: {

            page: function(total, page){

                let xx = total%page;
                let result = parseInt(total/page);

                if(xx == 0){

                    return result;

                }else{

                    result = result + 1;

                    return result;

                }

            },
            leclistsearch: function(){

                this.refflag = false;

                let params = new URLSearchParams();

                params.append('pagenum', this.lecpagenum);
                params.append('pageSize', this.lecpagesize);

                this.axios
                    .post('/stu/Vuesleclist.do', params)
                    .then((result) => {

                        console.log(result);
                        this.leclistitem = result.data.leclist;
				        this.lectotalcnt = result.data.totalcnt;
                        this.lectotalpage = this.page(this.lectotalcnt,this.lecpagesize);

                    })
                    .catch(function (error) {
                        alert('오류오류오류' + error);
                    });

            },
            reflist: function(lecseq){

                this.refflag = true;

                let params = new URLSearchParams();

                params.append('pagenum', this.refpagenum)
                params.append('pageSize', this.refpagesize)
                params.append('lec_seq', lecseq)

                this.axios
                    .post('/stu/Vuerlist.do', params)
                    .then((result) => {

                        console.log(result);
                        this.reflistitem = result.data.reflist;
				        this.reftotalcnt = result.data.rtotalcnt;

                    })
                    .catch(function (error) {
                        alert('오류오류오류' + error);
                    });

            },
            download: function(refseq, filename){

                let params = new URLSearchParams();

                params.append('ref_seq', refseq);

                this.axios
                .post('/stu/refdownload.do', params)
                .then((resp) => {
                    //console.log(resp);
                    let FILE = window.URL.createObjectURL(new Blob([resp.data]));
                    //console.log('FILE : ' + FILE);
                    let docUrl = document.createElement('a');
                    docUrl.href = FILE;
                    docUrl.setAttribute('download', filename);
                    document.body.appendChild(docUrl);
                    docUrl.click();
                })
                .catch((error) => {
                    console.log(error);
                });

            }

        }

    }
</script>