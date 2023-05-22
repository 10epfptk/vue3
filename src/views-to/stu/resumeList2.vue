<template>
    <div id="resumeList2" class="layerPop layerType2" style="width: 600px;"> 
    <dl>
        <dt>
            <strong>이력서</strong>
        </dt>
        <dd class="content">
            <table class="row" style="display: table; margin: auto">
                <caption>caption</caption>

                <tbody>
                    <tr>
                        <th scope="row">한줄소개 <span class="font_red">*</span></th>
                        <td colspan="3"><input type="text" class="inputTxt p100"
                            name="selfone" id="selfone" v-model="selfone" /></td>
                    </tr>
                    <tr>
                        <th scope="row">자기소개</th>
                        <td colspan="3">
                            <textarea class="inputTxt p100" name="self" id="self" v-model="self">
                            </textarea>
                        </td>
                    </tr>
                    
                </tbody>
            </table>

            <!-- e : 여기에 내용입력 -->

            <div class="btn_areaC mt30">
                <a href="" class="btnType blue" v-show="regist" id="btnSaveResume" name="btn" @click.prevent="resumeSave('I')"><span>저장</span></a> 
                <a href="" class="btnType blue" v-show="update" id="btnUpdateResume" name="btn" @click.prevent="resumeSave('U')"><span>수정</span></a> 
                <a href="" class="btnType blue" id="btnDeleteResume" name="btn" v-show="delflag" @click.prevent="resumeDelete('D')"><span>삭제</span></a> 
                <a href="" class="btnType gray"  id="btnClose" name="btn" @click.prevent="close()"><span>취소</span></a>
            </div>
        </dd>

    </dl>
    
    <a href="" class="closePop" @click.prevent="close()"><span class="hidden">닫기</span></a>
</div>
</template>

<script>
import {closeModal} from "jenesius-vue-modal"
import Swal from 'sweetalert2';
export default {
    props: {
        ptitle: String,
        pres_seq: Number,
        paction: String,
    },
    data() {
        return {
            action: '',
            res_seq: 0,
            selfone: "",
            self: "",
            currentPage: 1,
            regist : false,
            update : false,
            delflag : false
        }
    },
    mounted() {
        this.action = this.paction;
        this.res_seq = this.pres_seq;

        if (this.action == 'I') {
		    this.init();    // 모달 action 구분
            this.selectcon();
	    } else {
		    this.res_seq = this.pres_seq;
		    this.selectcon();
	    }

    },
    methods: {
        init: function (robject) {
		// 상담 등록 시 모달창 초기화
		if (this.action == 'I') {
		  this.selfone = '';
          this.self = '';
		  this.delflag = false;
          this.update = false;
          this.regist = true;
		} else {
          this.selfone = robject.res_selfone;
		  this.self = robject.res_self;
		  this.delflag = true;
          this.regist = false;
          this.update = true;
		} 
	  },    // end of init

        selectcon: function () {
  
        let params = new URLSearchParams();
        params.append('res_seq', this.res_seq);

        this.axios
         .post('/stu/resumeDetail.do', params)
         .then((response) =>{
            console.log(response);
                this.init(response.data.result);
            })
            .catch(function (error) {
                alert('에러! API 요청에 오류가 있습니다. ' + error);
            });
        },  // end of selectcon

        // 이력서 등록 & 수정
        resumeSave: function(action){
            this.action = action;   // 버튼 클릭 시 넘어오는 action 값 뷰 변수에 저장 후 사용
            var confirmTitle = "";
            if (this.selfone == '') {
				alert('한줄소개 내용을 입력해 주세요.');
			} else if (this.self == '') {
				alert('자기소개 내용을 입력해 주세요.');
			} else {
                if(this.action == "I"){
                    confirmTitle = "저장하시겠습니까?"
                } else if (this.action == "U"){
                    confirmTitle = "수정하시겠습니까?"
                }

                Swal.fire({
					title: confirmTitle,
					icon: 'warning',
					
					showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
					confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
					cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
					confirmButtonText: '확인', // confirm 버튼 텍스트 지정
					cancelButtonText: '취소', // cancel 버튼 텍스트 지정
				
				}).then(result => {

                    if (result.isConfirmed) {   // 확인 버튼 클릭 시
                        let params = new URLSearchParams();
                        params.append('res_seq', this.res_seq);
                        params.append('selfone', this.selfone);
                        params.append('self', this.self);
                        params.append('action', action);

                        this.axios
                        .post('/stu/resumeSave.do', params)
                        .then((response) => {
                            console.log(response);
                            if(this.action == "I"){
                                Swal.fire('이력서 등록이 완료되었습니다.', '','success');
                            } else if(this.action == "U") {
                                Swal.fire('이력서 수정이 완료되었습니다.', '','success');
                            } 
                            closeModal();
                            this.selectcon();

                        })
                        .catch(function (error) {
                            alert('에러! API 요청에 오류가 있습니다. ' + error);
                        });
                    } else if(result.isDismissed) { // 취소 버튼 클릭 시
                        Swal.fire('취소되었습니다.', '','error');
                        closeModal();
				    }
                })
            }
        },   // end of resumeSave

        close: function(){
            closeModal();
        },

        // 이력서 삭제
        resumeDelete: function(action) {

                Swal.fire({
					title: "삭제하시겠습니까?",
					icon: 'warning',
					
					showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
					confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
					cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
					confirmButtonText: '확인', // confirm 버튼 텍스트 지정
					cancelButtonText: '취소', // cancel 버튼 텍스트 지정
				
				}).then(result => {

                    if (result.isConfirmed) {
                        let params = new URLSearchParams();
                        params.append('res_seq', this.res_seq);
                        params.append('action', action);

                        this.axios
                        .post('/stu/resumeSave.do', params)
                        .then((response) => {
                            console.log(response);
                            Swal.fire('이력서 삭제가 완료되었습니다.', '','success');
                            closeModal()
                        })
                        .catch(function (error) {
                            alert('에러! API 요청에 오류가 있습니다. ' + error);
                        });
                    } else if(result.isDismissed) {
                        Swal.fire('취소되었습니다.', '','error');
					    closeModal(this);
				    }
                })
            }
        },  // end of resumeDelete
        

}
</script>

<style>
</style>