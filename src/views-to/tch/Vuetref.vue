<template>
						<p class="Location">
							<a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a> <span
								class="btn_nav bold">학습 지원</span> <span class="btn_nav bold">학습 자료</span> 
						</p>
						
						<p class="conTitle">
							<span>진행중인 강의</span> <span class="fr"></span>
						</p>
<!-- 담당 강의 리스트 출력 -->						
						<div id="lecListArea">
							<table class="col">
								<caption>caption</caption>
								<colgroup>
									<col width="25%">
									<col width="20%">
									<col width="20%">
									<col width="20%">
									<col width="15%">
								</colgroup>
								<thead>
									<tr>
										<th scope="col">강의 이름</th>
										<th scope="col">인원 현황</th>
										<th scope="col">강의실</th>
										<th scope="col">진행 날짜</th>
										<th scope="col">시험</th>
									</tr>
								</thead>
								<template v-if="lecInfo.totalcnt == 0">
									<tbody>
										<td colspan="5">진행중인 강의가 없습니다.</td>
									</tbody>
								</template>
								<template v-else>
									<tbody v-for="list in lecInfo.leclist" :key="list.lec_seq">
										<tr v-on:click.prevent="reflist(1, list.lec_seq, list.lec_name)">
											<td><a href="" v-on:click.prevent="clickLecName(list.lec_seq, list.lec_name)">{{list.lec_name}}</a></td>
											<td>{{list.lec_now}}/{{list.lec_max}}</td>
											<td>{{list.rm_name}}</td>
											<td>{{list.lec_st}} ~ {{list.lec_ed}}</td>
											<td>{{list.test_name}}</td>
										</tr>
									</tbody>
								</template>
							</table>
							<div id="lecPagination">
                                <paginate
                                    class="justify-content-center"
                                    v-model="lecpagenum"
                                    :page-count="lecInfo.totalPage"
                                    :page-range="5"
                                    :margin-pages="0"
                                    :click-handler="leclist"
                                    :prev-text="'Prev'"
                                    :next-text="'Next'"
                                    :container-class="'pagination'"
                                    :page-class="'page-item'"
                                >
                                </paginate>
                            </div>
						</div>

<!-- 학습자료 영역 (CR, 리스트)-->
						<br>
						<div id = "refListArea" v-show="refInfo.show">
							<p class="conTitle">
							<span>학습자료 (<span v-text="lecname"></span>)</span>
							<span class="fr"> 
								<a class="btnType blue" href="" name="modal" v-on:click.prevent="addRefModal"><span>추가</span></a>
							</span> 
							</p>
						
	
							<div>
								<!-- <input type="hidden" name="action" id="action" :value="action"> 액션 START -->
								<table class="col">
									<caption>caption</caption>
									<colgroup>
										<col width="40%">
										<col width="20%">
										<col width="15%">
										<col width="15%">
									</colgroup>
									<thead>
										<tr>
											<th scope="col">제목</th>
											<th scope="col">등록일</th>
											<th scope="col">첨부파일</th>
											<th scope="col">비고</th>
										</tr>
									</thead>
									
									<template v-if="refInfo.reftotalcnt == 0">
										<tbody>
											<td colspan="4">학습자료가 없습니다.</td>
										</tbody>
									</template>
									
									<template v-else>
										<tbody v-for="list in refInfo.reflist" :key="list.ref_seq">
											<tr>
												<td>{{list.ref_title}}</td>
												<td>{{list.ref_regdate}}</td>
												<td v-if="list.file_name == null">첨부파일이 없습니다.</td>
												<td v-else><a href="" @click.prevent="download(list.ref_seq, list.file_name)">{{list.file_name}}</a></td>
												<td>
													<a class="btnType3 color2" href="" v-on:click.prevent="selectedRef(list.ref_seq)"><span>수정</span></a>
													<a class="btnType3 color1"  href="" v-on:click.prevent="deleteRef(list.ref_seq, list.file_seq)"><span>삭제</span></a>
												</td>   
											</tr>
											
										</tbody>
									</template>
								</table>
                                <div id="recPagination">
                                    <paginate
                                        class="justify-content-center"
                                        v-model="refpagenum"
                                        :page-count="refInfo.reftotalcnt"
                                        :page-range="5"
                                        :margin-pages="0"
                                        :click-handler="reflist"
                                        :prev-text="'Prev'"
                                        :next-text="'Next'"
                                        :container-class="'pagination'"
                                        :page-class="'page-item'"
                                    >
                                    </paginate>
                                </div>
								<!-- pagenation -->
							</div>
						</div>
</template>
<script>

import { openModal } from 'jenesius-vue-modal';
import VuetrefModal from './VuetrefModal.vue';

import Paginate from 'vuejs-paginate-next';
import axios from "axios";
import { getCurrentInstance, ref, reactive, onMounted, inject } from "vue";


export default {
   name: 'Vuetref',
   components: {
     paginate: Paginate,
   },
   mixins: [],
   props: {
     
   },
   setup() {

        const { proxy } = getCurrentInstance();

        // 강의 변수
        const lecpageSize = 5;
        const lecInfo = reactive({leclist: [], totalcnt: 0, totalPage: 0});
        const lecname = ref('');
        const lecpagenum = ref(1);

        // 자료 변수
        const refpageSize = 5;
        const refInfo = reactive({show: false, reflist: [], reftotalcnt: 0});
        const refpagenum = ref(2);

        let sel_lecseq = '';
        let sel_refseq = '';
        let action = '';
        let title = '학습자료 관리';

        onMounted(() => {

            const $emitter = inject('$emitter');
            $emitter.on('result', (data) => {
                if(data === 'success') {
                    reflist();
                }
            })
        })

        /**
         * 
         * @param {*} lecpagenum 페이징
         */
        function leclist(pagenum) {
            lecpagenum.value = pagenum || lecpagenum.value;
            refpagenum.value = 1;

            let params = new URLSearchParams();
            params.append('pagenum', lecpagenum.value);
            params.append('pageSize', lecpageSize);

            axios.post('/tch/vueleclist.do', params)
            .then((response) => {
                lecInfo.leclist = response.data.leglist;
                lecInfo.totalcnt = response.data.totalcnt;
                lecInfo.totalPage = page(lecInfo.totalcnt, lecpageSize);

                refInfo.show = false;
            });

            
        }
        // 진행중인 강의 리스트
        leclist();

        function reflist(pagenum, lecseq, lec_name) {

            refpagenum.value = pagenum || refpagenum.value;
            lecname.value = lec_name || lecname.value;
            sel_lecseq = lecseq || sel_lecseq;

            let params = new URLSearchParams();
            params.append('pagenum', refpagenum.value);
            params.append('pageSize', refpageSize);
            params.append('lec_seq', sel_lecseq);

            axios.post('/tch/vuereflist.do', params)
            .then((response) => {
                refInfo.reflist = response.data.reflist;
                refInfo.reftotalcnt = page(response.data.reftotalcnt, refpageSize);

                refInfo.show = true;
            });
        }

        // 추가
        function addRefModal() {
            action = 'I';
            sel_refseq = '';
            refcommodal();
        }

        // 수정
        function selectedRef(refseq) {
            action = 'U';
            sel_refseq = refseq;
            refcommodal();
        }

        // 삭제
        function deleteRef(refseq) {
            
            proxy.$swal({
                icon: 'warning',
                text: '학습자료를 삭제하시겠습니까?',
                showCancelButton: true,
                reverseButtons: true,
            })
            .then(result => {
                if(result.value) {
                    const params = new URLSearchParams();
                    params.append('bref_seq', refseq);
                    params.append('action', 'D');
        
                    axios.post('/tch/refsave.do', params)
                    .then(() => {
                        proxy.$swal({
                            icon: 'success',
                            text: '삭제되었습니다.',
                        });
                        reflist();
                    });
                }
                else {
                    proxy.$swal({
                        icon: 'error',
                        text: '취소되었습니다.',
                    });
                }
            });

        }

        function download(refseq, name) {

            const params = new URLSearchParams();
            params.append('ref_seq', refseq);

            axios.post('/tch/refdownload.do', params)
            .then((resp) => {
                console.log(resp);
                let FILE = window.URL.createObjectURL(new Blob([resp.data]));
                //console.log('FILE : ' + FILE);
                let docUrl = document.createElement('a');
                docUrl.href = FILE;
                docUrl.setAttribute('download', name);
                document.body.appendChild(docUrl);
                docUrl.click();

                docUrl.remove();
                URL.revokeObjectURL(FILE);
          })
          .catch((error) => {
            console.log(error);
          });

        }

        /**
         * 
         * @param {*} total 총 데이터 개수
         * @param {*} page  한 화면에 뿌려질 최대 데이터 개수
         */
        function page(total, page) {
            // 총 만들어지는 페이지 개수
            const result = parseInt(total / page);
            // 만들어지고 남는 페이지 개수
            const etc = total % page;
            return etc === 0 ? result : result + 1;
        }

        async function refcommodal() {
            
            const modal = await openModal(VuetrefModal, {
                title: title,               // 모달 타이틀
                action: action,             // action 
                sel_lecseq: sel_lecseq,     // 강의 시퀀스
                sel_refseq: sel_refseq,     // 학습자료 시퀀스
            });

            modal.onclose = () => {

                console.log('close');
            };
        }

        return{
            lecInfo,
            leclist,
            refInfo,
            reflist,
            lecname,
            addRefModal,
            lecpagenum,
            refpagenum,
            selectedRef,
            deleteRef,
            download,
        }
   },
   data() {
     return {
       
     }
   },
   computed: {
     
   },
   watch: {
     
   },
   mounted() {
        
   },
   methods: {
     
   }
};
</script>
<style lang='' scoped>
</style>