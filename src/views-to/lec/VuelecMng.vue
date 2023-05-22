<template>
    <div class="content">
        <p class="Location">
            <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a> <span
                class="btn_nav bold">학습 관리</span> <span class="btn_nav bold">강의 관리</span> 
        </p>
        <p class="conTitle" id="selsearch">
            <span>강의 목록</span> <span class="fr"> 
                <select id="select" name="select" style="width: 150px;" v-model="select" >
                    <option value="">전체</option> 
                    <option value="lecname">강의명</option> 
                    <option value="uiname">강사명</option> 
                </select> 
                 <input type="text" style="width: 300px; height: 25px;" id="search" name="search" v-model="search">                    
                <a href="" class="btnType blue" id="btnSearch" name="btn" @click.prevent="stusearch()"><span>검  색</span></a>
                <a class="btnType blue" @click="lecselect('I')" name="modal"><span>과정 등록</span></a>
            </span>
        </p>
    
        <div id="lecList">
                
            <table class="col">
                <caption>caption</caption>
                <colgroup>
                    <col width="10%">
                    <col width="20%">
                    <col width="10%">
                    <col width="10%">
                    <col width="10%">
                    <col width="25%">
                    <col width="20%">
                </colgroup>

                <thead>
                    <tr>
                        <th scope="col">강의 번호</th>
                        <th scope="col">강의명</th>
                        <th scope="col">담당교수</th>
                        <th scope="col">강의실</th>
                        <th scope="col">수강현황</th>
                        <th scope="col">기간</th>
                        <th scope="col">수정</th>
                    </tr>
                </thead>
                
                    <!-- 강의 list 출력공간 -->
                        <template v-if="leccnt == 0">
                                <tbody>
                                        <tr>
                                            <td colspan="7">데이터가 존재하지 않습니다.</td>
                                        </tr>
                                </tbody>
                        </template>
                        <template v-else>
                                <tbody v-for="item in listitem" :key="item.lec_seq">
                                    <tr>
                                    <td>{{item.lec_seq}}</td>
                                    <td><a href="" @click.prevent="stulistsearch(item.lec_seq)">{{item.lec_name}}</a></td>
                                    <td>{{item.ui_name}}</td>
                                    <td>{{item.rm_name}}</td>
                                    <td>{{item.lec_now}}/{{item.lec_max}}</td>
                                    <td>{{item.lec_st}} ~ {{item.lec_ed}}</td>
                                    <td>
                                            <a class="btnType3 color1" @click.prevent="lecupdate(item.lec_seq)">
                                                    <span>수정</span>
                                            </a>
                                    </td>
                                    
                                    </tr>
                                </tbody>
                        </template>
            </table>
            <!-- 페이징 처리  -->
			<div id="lecPagination">
				<Paginate
				  class="justify-content-center"
				  v-model="cpage"
				  :page-count="totalPage"
				  :page-range="5"
				  :margin-pages="0"
				  :click-handler="stusearch"
				  :prev-text="'Prev'"
				  :next-text="'Next'"
				  :container-class="'pagination'"
				  :page-class="'page-item'"
				>
				</Paginate>
			  </div>
        </div>
          
        <br>
        <div id="talstuList"  v-show= "stulist">
            <p class="conTitle">
                <span>학생 정보</span>
            </p>
            <div id="stuList">
                <table class="col">
                    <caption>caption</caption>
                    <colgroup>
                        <col width="25%">
                        <col width="25%">
                        <col width="25%">
                        <col width="25%">
                    </colgroup>
                    
                    <thead>
                        <tr>
                            <th scope="col">학번</th>
                            <th scope="col">학생명</th>
                            <th scope="col">과정명</th>
                            <th scope="col">전화번호</th>
                        </tr>
                    </thead>
                    
                
                            <!-- 수강 중인 학생 list 출력 공간 -->
                                    <template v-if="stucnt == 0">
                                        <tbody>
                                                <tr>
                                                    <td colspan="4">데이터가 존재하지 않습니다.</td>
                                                </tr>
                                        </tbody>
                                    </template>
                                    <template v-else>
                                            <tbody v-for="item in slistitem" :key="item.stu_num">
                                                <tr>
                                                    <td>{{item.stu_num}}</td>
                                                    <td>{{item.stu_name}}</td>
                                                    <td>{{item.lec_name}}</td>
                                                    <td>{{item.stu_hp}}</td>
                                                </tr>
                                            </tbody>
                                    </template>
                        
                </table>
                <div id="stuPagination">
                    <Paginate
                        class="justify-content-center"
                        v-model="spage"
                        :page-count="stutotalPage"
                        :page-range="5"
                        :margin-pages="0"
                        :click-handler="stulistsearch"
                        :prev-text="'Prev'"
                        :next-text="'Next'"
                        :container-class="'pagination'"
                        :page-class="'page-item'"
                    >
                    </Paginate>
			  </div>
                
            </div>
        </div>
            
    </div> 
  
</template>

<script>
import Paginate from 'vuejs-paginate-next';
import { openModal } from 'jenesius-vue-modal';
import layer1 from './layer1.vue';

export default {
    data() {
        return {
            listitem : [],
			leccnt : 0,
			cpage :1,
            spage :1,
			pageSizelec : 5,
            pageSizestu : 5,
			pageBlockSizestu : 10,
            totalPage: 1,
            stutotalPage: 1,
            select : "",
            search : "",
            slec_seq: 0,
            stucnt: 0,
            slistitem: [],
            stulist: false,
            action: "",
            
        }
    },
    mounted() {
        this.stusearch();
    },
    components: {
        Paginate: Paginate,
  	},
    methods: {
        stusearch: function(){
            let params = new URLSearchParams();
            params.append('pagenum', this.cpage);
            params.append('pageSize', this.pageSizelec);
            params.append('select', this.select);
            params.append('search', this.search);
           
            this.axios
            .post('/lec/vuelecList.do', params)
            .then((response) =>{
            console.log(response);
            this.listitem = response.data.leclist;
            this.leccnt = response.data.leccnt;
            this.totalPage = this.page(this.leccnt, this.pageSizelec); 
            this.stulist = false;   // 검색 후 stulist 비우기
			
            })
            .catch(function (error) {
                 alert('에러! API 요청에 오류가 있습니다. ' + error);
            });
        },  // end of stusearch

        // 클릭한 강의의 학생 조회
        stulistsearch: function(lec_seq){
            this.stulist = true;
            this.slec_seq = lec_seq;

            let params = new URLSearchParams();
            params.append('pagenum', this.cpage);
            params.append('pageSize', this.pageSizelec);
            params.append('lecseq', this.slec_seq);

            this.axios
            .post('/lec/vuestuList.do', params)
            .then((response) =>{
            console.log(response);
            this.slistitem = response.data.stulist;
            this.stucnt = response.data.stucnt;
            this.stutotalPage = this.page(this.stucnt, this.pageSizestu); 
			
            })
            .catch(function (error) {
                 alert('에러! API 요청에 오류가 있습니다. ' + error);
            });
        },  // end of stulistsearch

        page: function (total, page) {

            var xx = total % page;  
            var result = parseInt(total / page);

            // 데이터 전체 건수 % 한페이지에 조회되는 건수 = 존재 시 몫 + 1
            if (xx == 0) {
                return result;
            } else {
                result = result + 1;
                return result;
            }
        },	// end of page

        // 수정 모달
        lecupdate: function(lec_seq){
            this.slec_seq = lec_seq;
            this.lecselect('U');
        },  // end of lecselect

        // 신규 등록 모달
        lecselect: async function(action){
            this.action = action;

            let paramtitle = '';
            let lec_seq = 0;

            if (action == 'I') {
                paramtitle = '과정 등록';
            } else {
                paramtitle = '과정 수정';
                lec_seq = this.slec_seq;
                this.action = "U";
            }

            const modal = await openModal(layer1, {
                ptitle: paramtitle,
                pslecseq: lec_seq,
                paction: this.action,
            });

            modal.onclose = (popupparam) => {
                console.log('Close : ' + popupparam);
                this.stusearch();
            };
        },     // end of lecselect

    }
}
</script>

<style>

</style>