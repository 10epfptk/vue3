<template>

	<div class="content">

		<p class="Location">
			<a href="#" class="btn_set home">메인으로</a> 
			<a href="#" class="btn_nav bold">취업 관리</a> 
				<span class="btn_nav bold">이력서 등록</span> 
				<a href="#" class="btn_set refresh">새로고침</a>
		</p>

		<p class="conTitle">
			<span>이력서 </span> <span class="fr"> 
				<a class="btnType blue" href="" @click.prevent="resumeModal('I');" name="modal">
				<span>신규등록</span></a>
			</span>
		</p>
		
		<div class="divresumeList">
			<table class="col">
				<caption>caption</caption>

					<colgroup>
						   <col width="70%">
							<col width="30%">
					 </colgroup>
				<thead>
					<tr>
						  <th scope="col">한줄 소개</th>
						  <th scope="col">등록일</th>
						  
					</tr>
				</thead>
				<tbody id="resumeList" v-for="item in resumeList" :key="item.res_seq">
					<tr>
						<td><a href="" @click.prevent="resumeDetailModal(item.res_seq)">{{ item.res_selfone }}</a></td>	
						<td>{{ item.res_regdate }}</td>
					</tr>
				</tbody>
			</table>
			
			<!-- 페이징 처리  -->
			<div id="resPagination">
				<paginate
				  class="justify-content-center"
				  v-model="currentPage"
				  :page-count="totalPage"
				  :page-range="5"
				  :margin-pages="0"
				  :click-handler="selectResumeList"
				  :prev-text="'Prev'"
				  :next-text="'Next'"
				  :container-class="'pagination'"
				  :page-class="'page-item'"
				>
				</paginate>
			  </div>
							
		</div>


	</div> <!--// content -->				



</template>

<script>
import { openModal } from 'jenesius-vue-modal';
import Paginate from 'vuejs-paginate-next';
import resumeList2 from './resumeList2.vue';
export default {
    data() {
        return {
            resumeList: [],
            resumeCnt: 0,
            currentPage: 1,
            pageSize: 5,
            blocksize: 10,
            totalPage: 1,
			res_seq: 0,
			action: "",

        }
    },
    mounted() {
		this.selectResumeList();
    },
	components: {
    	paginate: Paginate,
  	},
    methods : {
        selectResumeList : function(){

            let params = new URLSearchParams();
            params.append('currentPage', this.currentPage);
            params.append('pageSize', this.pageSize);

            this.axios
            .post('/stu/vueresumeList.do', params)
            // 서버 전송 성공 시,
            .then((response) =>{
            console.log(response);
            this.resumeCnt = response.data.resumeCnt;
            this.resumeList = response.data.resumeList;
            this.totalPage = this.page(this.resumeCnt, this.pageSize); // page 메소드에 파라미터 보냄
			console.log(this.totalPage);
			console.log(this.pageSize);
            })
            // 서버 전송 실패 시
            .catch(function (error) {
            alert('에러! API 요청에 오류가 있습니다. ' + error);
            });

        },   // end of selectResumeList

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

		resumeDetailModal: function(res_seq){
			this.res_seq = res_seq;
			this.resumeModal('U');	// 수정 action
		},	// end of resumeModal
		resumeModal: async function(action){
			this.action = action;

			let paramtitle = '';
      		let res_seq = 0;

			  if (action == 'I') {
        		paramtitle = '이력서 등록';
      		  } else {
        		paramtitle = '이력서 수정';
				res_seq = this.res_seq;
      		  }
			// resumeList2 데이터 전송
			const modal = await openModal(resumeList2, {
				ptitle: paramtitle,
				pres_seq: this.res_seq,
				paction: this.action,
      	});  

		  modal.onclose = (popupparam) => {
        	console.log('Close : ' + popupparam);
			this.selectResumeList();	// 모달 닫힌 후 목록 조회
        
      };
    },
		// 이력서 등록

    },
}
</script>

<style>

</style>