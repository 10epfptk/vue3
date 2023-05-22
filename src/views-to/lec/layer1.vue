<template>
	<div id="mask"></div>	
    <div id="layer" class="layerPop layerType2" style="width: 600px;">
		<dl>
			<dt>
				<strong>강의 관리</strong>
			</dt>
			<dd class="content">
				<!-- s : 여기에 내용입력 -->
				<table class="row" style="display: table; margin: auto;">
					<caption>caption</caption>

					<tbody>
						<tr>
							<th scope="row">강의명 <span class="font_red">*</span></th>
							<td><input type="text" class="inputTxt p100" name="lecname" id="lecname"  v-model="lecname"/></td>
						</tr>
						<tr>
							<th scope="row">강의 내용 <span class="font_red">*</span></th>
							<td><input type="text" class="inputTxt p100" name="leccont" id="leccont" v-model="leccont" /></td>
						</tr>
						<tr>
							<th scope="row">최대인원 <span class="font_red">*</span></th>
							<td><input type="text" class="inputTxt p100" name="lecmax" id="lecmax" Placeholder="숫자만 입력하세요" onkeydown="fFilterNumber(event);" v-model="lecmax"/></td>
						</tr>
						<tr>
							<th scope="row">강사명</th>
							<td>
								<!-- 기존 강사 목록 출력 -->
								
								<select  style="width: 150px;" v-model="tchselect">
									<option value="">선택</option>
									<option v-for="(item,index) in tchidlist" :key="item" :value="item">{{tchnamelist[index]}}</option>
								</select>
								
							</td>
						</tr>
						<tr>
							<th scope="row">강의실<span class="font_red">*</span></th>
							<td>
								<select style="width: 150px;" v-model="rmselect">
									<!-- 신규 등록 일때 -->
									<template v-if="rmname == null || rmname == '' || rmname == undefined">
										<option value="">선택</option>
									</template>
									<template v-else>
										<option :value="rmselect">{{rmname}}</option>
									</template>
										<option v-for="(item, index) in rmseqlist" :key="item" :value="item">{{rmnamelist[index]}}</option>
								</select>
							</td>
						</tr>
						<tr>
							<th scope="row">시험 종류 <span class="font_red">*</span></th>
							<td>
								<select style="width: 150px;" v-model="lectest">
										<option value="">선택</option>
										<option v-for="(item, index) in testDcodelist" :key="item" :value="item">{{testDnamelist[index]}}</option>
								</select>
							</td>
						</tr>
						<tr>
							<th scope="row">과정일수 </th>
							<td><input type="text" class="inputTxt p100" :readonly="day" name="lecdays" id="lecdays" Placeholder="숫자만 입력하세요" @change="addDays()" v-model="lecdays"/></td>
						</tr>
						<tr>
							<th scope="row">시작일자 </th>
							<td><input type="date" class="inputTxt p100" name="lecst" :readonly="startday" :min="today" id="lecst" @change="addDays()" v-model="lecst"/></td>
						</tr>
						<tr>
							<th scope="row">종료일자 </th>
							<td><input type="date" class="inputTxt p100" name="leced" id="leced" v-model="leced" :readonly="edreadonly" /></td>
						</tr>
					</tbody>
				</table>

				<!-- e : 여기에 내용입력 -->

				<div class="btn_areaC mt30">
					<a href="" class="btnType blue" id="btnSavelec" name="btn" v-show="savebtn" @click.prevent="lecSave('I')"><span>저장</span></a>
					<a href="" class="btnType blue" id="btnSavelec" name="btn" v-show="updatebtn" @click.prevent="lecSave('U')"><span>수정</span></a>
					<a href=""	@click.prevent="close()" class="btnType gray"  id="btnCloselec" name="btn"><span>취소</span></a>
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
    data() {
        return {
			title : "",
			slecseq : 0,
			action : "",
			lecinfo : [],
			lecname : "",		// 강의명
			leccont : "",		// 강의내용
			lecmax : 0,			// 최대인원
			tchselect : "",		// 강사명   select value
			rmseqlist : [],		// 강의실 번호 저장 리스트
			rmselect : "",		// 강의실  select value
			rmseq : "",			// 강의실 번호
			rmname : "",		// 강의실 호수
			lectest : "",		// 시험종류 select value
			lecdays : "",		// 과정일수
			lecst : "",			// 시작일자
			leced : "",			// 종료일자
			rmnamelist : [],	// 강의실 select list
			testDnamelist : [], // 시험명 select list
			testDcodelist : [],	// 시험 코드 select list
			tchnamelist : [],   // 강사 select list
			tchidlist : [],
			week: 0,
			savebtn : false,
			updatebtn : false,
			edreadonly : false,	// 종료일자 readonly
			day : false,
			startday : false,
			today : "",

        }
    },
	props: {
		ptitle: String,
		pslecseq: Number,
		paction: String,
	},
	mounted(){
		this.dateLimit();
		this.slecseq = this.pslecseq;
		this.action = this.paction;

		if (this.action == 'I') {
			this.init();    // 모달 action 구분
			this.selectlec();

	    } else {
		    this.slecseq = this.pslecseq;
		    this.selectlec();
			this.day = true;
			this.startday = true;	
			this.edreadonly = true;
	    }
		
	},
	methods:{
		init: function (sobject) {
		// 상담 등록 시 모달창 초기화
		if (this.action == 'I') {
		  this.lecname = '';
          this.leccont = '';
		  this.lecmax = 0;
		  this.tchselect = '';	// select box 에서 선택한 value 값
		  this.rmselect = '';	// select box 에서 선택한 value 값
		  this.lectest = '';	// select box 에서 선택한 value 값
		  this.lecdays = '';
		  this.lecst = '';
		  this.leced = '';
          this.updatebtn = false;
          this.savebtn = true;
		} 
		else {
			// 상담 수정
			this.lecname = sobject.lec_name;
			this.leccont = sobject.lec_cont;
			this.lecmax = sobject.lec_max;
			this.tchselect = sobject.loginID;	// select box 에서 선택한 value 값
			this.rmselect = sobject.rm_seq;			// 선택한 룸번호
			this.rmname = sobject.rm_name;			// 선택한 룸번호
			this.lectest = sobject.lec_test;
			this.lecdays = sobject.lec_days;
			this.lecst = sobject.lec_st;
			this.leced = sobject.lec_ed;
			this.updatebtn = true;
			this.savebtn = false;

		} 
	  },    // end of init

	  selectlec: function() {
		let params = new URLSearchParams();
        params.append('lecseq', this.slecseq);

        this.axios
         .post('/lec/lecSelect.do', params)
         .then((response) =>{
            console.log(response);
			this.rmnamelist = response.data.rmnamelist;	// select 값 붙이기
			this.rmseqlist = response.data.rmseqlist;
		    this.testDnamelist = response.data.testDnamelist;
			this.testDcodelist = response.data.testDcodelist;
		    this.tchnamelist = response.data.tchnamelist;
			this.tchidlist = response.data.tchidlist;
			this.lecinfo = response.data.lecinfo;
			this.init(response.data.lecinfo);
            })
            .catch(function (error) {
                alert('에러! API 요청에 오류가 있습니다. ' + error);
            });
	  },	// end of selectlec

	  lecSave: function(action){
		
		// 강의 계획서 insert
		this.action = action;	// 버튼 클릭 시 넘어오는 action 값 뷰 변수에 저장 후 사용
		if(this.action == "I"){
			var days = this.lecdays;		// 과정일수
			var week = parseInt(days / 7);	// 몇 주 과정
			var waste = days % 7;			// 주 계산 후 남은 일수
			
			if(waste != 0){
				// 나머지 값 존재할 경우
				week += 1;					 
				this.week = week;

			}
		}
			// 입력란 공백 조건문
			if (this.lecname == '') {
				alert('강의명을 입력해 주세요.');
			} else if (this.leccont == '') {
				alert('강의 내용을 입력해 주세요.');
			} else if (this.lecmax == 0) {
				alert('최대인원을 입력해 주세요.');
			} else if (this.tchselect == '') {
				alert('강사명을 선택해 주세요.');
			} else if (this.rmselect == '') {
				alert('강의실을 선택해 주세요.');
			} else if (this.lectest == '') {
				alert('시험 종류를 입력해 주세요.');
			} else if (this.lecdays == '') {
				alert('과정 일수를 입력해 주세요.');
			} else if (this.lecst == '') {
				alert('시작 일자를 입력해 주세요.');
			} else {
				Swal.fire({
					title: '저장하시겠습니까?',
					icon: 'warning',
					
					showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
					confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
					cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
					confirmButtonText: '확인', // confirm 버튼 텍스트 지정
					cancelButtonText: '취소', // cancel 버튼 텍스트 지정
				
				}).then(result => {
					
					if (result.isConfirmed) {
					let params = new URLSearchParams();
					params.append('lecseq', this.slecseq);
					params.append('lecname', this.lecname);
					params.append('loginID', this.tchselect);
					params.append('rmseq', this.rmselect);
					params.append('leccont', this.leccont);
					params.append('lecmax', this.lecmax);
					params.append('lecdays', this.lecdays);
					params.append('lecst', this.lecst);
					params.append('leced', this.leced);
					params.append('lectest', this.lectest);
					params.append('action', this.action);
					params.append('week', this.week);

					this.axios
					.post('/lec/lecSave.do', params)
					.then((response) => {
						console.log(response);
						if(this.action == "I"){
							Swal.fire('강의 등록이 완료되었습니다.', '','success');
						} else {
							Swal.fire('강의 수정이 완료되었습니다.', '','success');
						}
							closeModal();
							this.selectlec();
						
					})
					.catch(function (error) {
						alert('에러! API 요청에 오류가 있습니다. ' + error);
					});
				} else if(result.isDismissed) {
					Swal.fire('취소하였습니다.', '','error');
					closeModal();

				}
			    })
			}
        },   // end of resumeSave

		// 시작일자 + 과정일수 = 종료일자(자동으로 종료일자 지정)
		addDays : function(){
			let lecdays = Number(this.lecdays) -1;	// 과정일수 형변환 후 -1
	
			let lecst = this.lecst;					// 시작일자
			
			if(lecdays != null || lecst != null){
				
				// new Date : 2023-04-06 => Thu Apr 06 2023 09:00:00 GMT+0900
				let result = new Date(lecst);
				console.log("result1111111"+result)
				
				// result.getDate() => 생성 된 date 에서 일수를 가져옴
				// result.setDate() => 변경 된 값으로 교체
				// 시작 일수 + 과정일수 
				result.setDate(result.getDate() + lecdays);
				console.log("result2222222"+result);
				result = this.changeDate(result);
				
				/* 종료일자 리드온리 변경 후 result로 값 출력 */
				
				this.leced = result;
				this.edreadonly = true;	
		
			}

		}, 	// end of addDays

		changeDate : function(result){	// 종료 일자 자동 계산
			// cnsDate : 시작 일수 + 과정일수 
			let cnsDate = new Date(result);
			cnsDate = cnsDate.toISOString();	// toISOString : 2011-10-05T14:48:00.000Z" 형식 반환
			let returnDate = cnsDate.slice(0,10);	// 2023-04-06 형식으로 자름
			this.leced = returnDate;
			return returnDate;

		},	// end of changeDate

		// 익일 날짜부터 선택 가능 => 모달창 onload 되었을때 메소드 실행
		dateLimit : function() {
			/* 86400000 더한 이유는 내일 날짜부터 제한하기 위해 */
			let now_utc = Date.now() + 86400000;	// 내일 날짜의 현재시간 계산
			let timeOff = new Date().getTimezoneOffset()*60000;	// UTC 타임존 시간대, 우리나라 현재시간 차이나는 시간 계산 
			let today = new Date(now_utc-timeOff).toISOString().split("T")[0];	// 내일 시간 - 시차 마이너스 후 문자 변환
																			    // T 문자 단위로 자른 후 2022-05-11 상태로 변환
			this.today = today;																	
		},	// end of dateLimit
		// 모달창 닫기
		close : function(){
			closeModal();
		}
		}
	}
    


</script>

<style>

</style>