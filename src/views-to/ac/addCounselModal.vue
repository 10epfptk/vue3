<template>
  <div class="layerPop layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>{{ ptitle }}</strong>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <table class="row" style="margin: auto; display: table">
          <tbody>
            <tr>
              <th scope="row">과정명</th>
              <td>
                <input
                  type="text"
                  id="cLecName"
                  name="cLecName"
                  v-model="cLecName"
                  reaonly
                />
              </td>

              <th scope="row">학생명</th>
              <td>
                <select
                  id="cStuName"
                  name="cStuName"
                  v-model="cStuName"
                  v-show="selStuNameShow"
                >
                  <template v-if="stdList.length == 0"
                    ><option value="">수강생이 없습니다</option></template
                  >
                  <template v-else v-for="item in stdList" :key="item.stu_id">
                    <option :value="item.stu_id">
                      {{ item.stu_name }}
                    </option>
                  </template>
                </select>
                <input
                  type="text"
                  v-model="cStuName"
                  v-show="inputStuNameShow"
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th scope="row">상담일자</th>
              <td>
                <input
                  type="date"
                  class="inputTxt p100"
                  name="cnsDate"
                  id="cnsDate"
                  v-model="cnsDate"
                />
              </td>
              <th scope="row">상담장소</th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="cnsPlace"
                  id="cnsPlace"
                  v-model="cnsPlace"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">최종 수정일자</th>
              <td colspan="3">
                <input
                  type="date"
                  class="inputTxt p100"
                  id="cnsUpdate"
                  name="cnsUpdate"
                  v-model="cnsUpdate"
                />
              </td>
            </tr>

            <tr>
              <td colspan="4">
                <input
                  type="text"
                  style="height: 10rem"
                  class="inputTxt p100"
                  name="cnsCont2"
                  id="cnsCont1"
                  v-model="cnsCont"
                  placeholder="상담 내용을 입력해주세요."
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a
            href=""
            class="btnType blue"
            id="btnSaveCounsel"
            name="btn"
            @click.prevent="saveCounsel"
            ><span>{{ btnName }}</span></a
          >
          <a
            href=""
            class="btnType blue"
            id="btnDeleteCounsel"
            name="btn"
            v-show="delflag"
            @click.prevent="delCounsel"
            ><span>삭제</span></a
          >
          <a
            href=""
            class="btnType gray"
            id="btnCloseModal"
            name="btn"
            @click.prevent="cancelModal"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>
    <a href="" class="closePop" @click.prevent="cancelModal"
      ><span class="hidden">닫기</span></a
    >
  </div>
</template>

<script>
import { closeModal } from 'jenesius-vue-modal';

export default {
  props: {
    ptitle: String,
    plecseq: Number,
    pcnsseq: Number,
    paction: String,
    plecname: String,
  },
  data: function () {
    return {
      lecseq: '',
      lecname: '',

      selStuNameShow: false,
      inputStuNameShow: false,

      cnsseq: 0,
      cLecName: '',
      cStuName: '',
      cnsDate: '',
      cnsPlace: '',
      cnsUpdate: '',
      cnsCont: '',

      action: '',

      delflag: false,
      btnName: '',

      stdList: [],
    };
  },
  mounted() {
    this.action = this.paction;
    this.lecseq = this.plecseq;

    this.lecname = this.plecname;

    this.dateLimit();

    if (this.action == 'I') {
      this.init();
      this.selectstucombo();
      this.selStuNameShow = true;
    } else {
      this.cnsseq = this.pcnsseq;
      this.inputStuNameShow = true;
      this.selectCns();
    }
  },
  methods: {
    init: function (pobject) {
      if (this.action == 'I') {
        this.btnName = '저장';
        this.cLecName = this.plecname;
        this.cStuName = '';
        let today = this.changeDate(new Date());
        this.cnsDate = today;
        this.cnsUpdate = today;
        this.cnsPlace = '';
        this.cnsCont = '';
        this.cnsseq = 0;
        this.delflag = false;
      } else {
        this.btnName = '수정';
        this.cnsseq = this.pcnsseq;
        this.cLecName = pobject.lec_name;
        this.cStuName = pobject.stu_id;
        this.cnsDate = pobject.cns_date;
        this.cnsPlace = pobject.cns_place;
        this.cnsUpdate = pobject.cns_update;
        this.cnsCont = pobject.cns_cont;
        this.delflag = true;
      }
    },
    /** 한 건 조회 */
    selectCns: function () {
      //let vm = this;

      let params = new URLSearchParams();
      params.append('cnsSeq', this.cnsseq);

      this.axios
        .post('/ac/selectedCounsel.do', params)
        .then((response) => {
          console.log(response);

          this.init(response.data.cnsInfo);
        })
        .catch(function (error) {
          alert('selectCns(): API 요청에 오류가 있습니다. ' + error);
        });
    },
    /** 학생 셀렉박스 */
    selectstucombo: function () {
      let params = new URLSearchParams();
      params.append('lecName', this.lecname);

      this.axios
        .post('/ac/vuecomStuList.do', params)
        .then((response) => {
          console.log(response);
          this.stdList = response.data.result;
          //TypeError: Cannot read properties of undefined 잡으려고 작성
          if (response?.response) {
            this.init(response.data.cnsInfo);
          }
        })
        .catch(function (error) {
          alert('selectstucombo(): API 요청에 오류가 있습니다. ' + error);
        });
    },
    /** 삭제 버튼 클릭 */
    delCounsel: function () {
      this.action = 'D';
      this.saveCounsel();
    },
    /** 상담 C U D */
    saveCounsel: function () {
      let lecSeq = this.lecseq;
      let action = this.action;
      let cnsCont = this.cnsCont;
      let cnsDate = this.cnsDate;
      let cnsUpdate = this.cnsUpdate;
      let cnsPlace = this.cnsPlace;
      let cnsSeq = this.cnsseq;
      console.log(action + '작업 중입니다.');

      let checkitem = [
        //itemname: v-model
        { itemname: this.cStuName, emptymsg: '상담 학생을 선택해주세요.' },
        { itemname: this.cnsDate, emptymsg: '상담 날짜를 입력해주세요.' },
        { itemname: this.cnsPlace, emptymsg: '상담 장소를 입력해주세요.' },
        {
          itemname: this.cnsUpdate,
          emptymsg: '상담 수정 날짜를 입력해주세요.',
        },
        { itemname: this.cnsCont, emptymsg: '상담 내용을 입력해주세요.' },
      ];
      //console.log(this.$emptyValidation(checkitem));

      if (this.$emptyValidation(checkitem)) {
        console.log('왜 여기로 안 들어 오냐구');
        let alertmsg = '';

        if (action == 'I') {
          alertmsg = '상담을 등록 하시겠습니까?';
        } else if (action == 'U') {
          alertmsg = '상담을 수정 하시겠습니까?';
        } else if (action == 'D') {
          alertmsg = '상담을 삭제 하시겠습니까?';
        }

        let params = new URLSearchParams();
        params.append('lecSeq', lecSeq);
        params.append('stuID', this.cStuName);
        params.append('cnsSeq', cnsSeq);
        params.append('action', action);
        params.append('cnsCont', cnsCont);
        params.append('cnsDate', cnsDate);
        params.append('cnsUpdate', cnsUpdate);
        params.append('cnsPlace', cnsPlace);

        //swal start
        this.$swal
          .fire({
            text: alertmsg,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            reverseButtons: false, // 버튼 순서 거꾸로
          })
          .then((data) => {
            if (data.isConfirmed) {
              this.axios
                .post('/ac/saveCounsel.do', params)
                .then((response) => {
                  console.log(response);
                  if (response.data.result === 1) {
                    this.$swal('저장이 완료되었습니다.', {
                      icon: 'success',
                      buttons: '확인',
                    });
                    closeModal(this);
                  } else {
                    this.$swal('오류가 발생했습니다.', {
                      icon: 'error',
                      buttons: '확인',
                    });
                  }
                })
                .catch((error) => {
                  alert('saveCounsel(): API 요청에 오류가 있습니다.' + error);
                });
            } else {
              this.$swal('취소되었습니다.', {
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: '확인',
              });
            }
          }); // swal end
      } // validation end
    },
    /** 날짜 제한 */
    dateLimit: function () {
      let now_utc = Date.now();
      let timeOff = new Date().getTimezoneOffset() * 60000;
      let today = new Date(now_utc - timeOff).toISOString().split('T')[0];
      document.getElementById('cnsUpdate').setAttribute('min', today);
    },
    /** 날짜 변환 */
    changeDate: function (date) {
      let cnsDate = new Date(date);
      cnsDate = cnsDate.toISOString();
      let returnDate = cnsDate.slice(0, 10);
      return returnDate;
    },
    cancelModal: function () {
      closeModal(this);
    },
  },
};
</script>

<style>
#searchArea {
  margin-top: 25px;
  margin-bottom: 25px;
}
#searchArea > * {
  height: auto;
}

#groupTitle {
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
}
</style>
