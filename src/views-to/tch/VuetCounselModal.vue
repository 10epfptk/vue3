<template>
  <div id="addCounselModal" class="layerPop layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>{{ pTitle }}</strong>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <table class="row" style="margin: auto; display: table">
          <!-- <caption>
            caption
          </caption> -->
          <!-- <colgroup>
            <col width="170px" />
            <col width="*" />
            <col width="170px" />
            <col width="*" />
          </colgroup> -->

          <tbody>
            <tr>
              <th scope="row">과정명</th>
              <td>
                <select
                  id="cLecName"
                  name="cLecName"
                  v-model="selLecSeq"
                  v-show="lecSelBox"
                >
                  <option value="">과정 선택</option>
                  <option
                    v-for="list in myLecList"
                    :key="list.lec_seq"
                    :data-name="list.lec_name"
                    :value="list.lec_seq"
                  >
                    {{ list.lec_name }}
                  </option>
                </select>
                <input
                  type="text"
                  :value="cLecName"
                  v-show="lecNameShow"
                  readonly
                />
              </td>

              <th scope="row">학생명</th>
              <td>
                <select
                  id="selStuId"
                  name="selStuId"
                  v-model="selStuId"
                  v-show="stuSelBox"
                >
                  <template v-if="selLecSeq === ''">
                    <option value="">학생 선택</option>
                  </template>
                  <template v-else-if="selLecSeq > 0 && stuList.length == 0">
                    <option value="">수강생이 없습니다</option>
                  </template>
                  <template v-else>
                    <option value="">학생 선택</option>
                    <option
                      v-for="list in stuList"
                      :key="list.stu_id"
                      :value="list.stu_id"
                    >
                      {{ list.stu_name }}
                    </option>
                  </template>
                </select>
                <input
                  type="text"
                  :value="cStuName"
                  v-show="stuNameShow"
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
                  name="cnsCont"
                  id="cnsCont"
                  placeholder="상담 내용을 입력해주세요."
                  v-model="cnsCont"
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
            class="btnType gray"
            id="btndelCns"
            name="btn"
            @click.prevent="delCounsel"
            v-show="delflag"
            ><span>삭제</span></a
          >
          <a
            href=""
            class="btnType gray"
            id="btnClose"
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
    pTitle: String,
    pLecSeq: Number,
    pCnsSeq: Number,

    pAction: String,
  },
  data: function () {
    return {
      action: '',
      lecSeq: this.pLecSeq,
      myLecList: [],
      stuList: [],
      selLecSeq: '', //선택한 강의 번호
      selStuId: '', //선택한 학생 번호
      lecSelBox: true,
      stuSelBox: true,
      lecNameShow: false,
      stuNameShow: false,

      cnsSeq: '',
      cLecName: '',
      cStuName: '',
      btnName: '',
      cnsDate: '',
      cnsUpdate: '',
      cnsPlace: '',
      cnsCont: '',

      delflag: false,
    };
  },
  mounted() {
    this.dateLimit();
    this.action = this.pAction;
    if (this.action === 'I') {
      this.readLecList();
      this.init();
    } else {
      this.cnsSeq = this.pCnsSeq;
      this.selectCns();
    }
  },
  methods: {
    /** 데이터 입력란 초기화*/
    init: function (pobject) {
      if (this.action === 'I') {
        this.btnName = '저장';

        let today = this.changeDate(new Date());
        this.cnsDate = today;
        this.cnsUpdate = today;
        this.cnsPlace = '';
        this.cnsCont = '';
        this.lecSelBox = true;
        this.stuSelBox = true;
        this.lecNameShow = false;
        this.stuNameShow = false;
        this.delflag = false;
      } else {
        this.btnName = '수정';

        this.cnsSeq = this.pCnsSeq;
        this.selLecSeq = pobject.lec_seq;
        this.cLecName = pobject.lec_name;
        this.cStuName = pobject.stu_name;
        console.log(`강의 seq ${this.selLecSeq}, 학생명 ${this.cStuName}`);
        this.cnsDate = pobject.cns_date;
        this.cnsPlace = pobject.cns_place;
        this.cnsUpdate = pobject.cns_update;
        this.cnsCont = pobject.cns_cont;
        this.stuSelBox = false;
        this.lecSelBox = false;
        this.lecNameShow = true;
        this.stuNameShow = true;
        this.delflag = true;
      }
    },
    /** 강의 목록 */
    readLecList: function () {
      let params = new URLSearchParams();
      this.axios
        .post('/tch/vueselBoxLecList.do', params)
        .then((response) => {
          console.log('강의 목록');
          console.log(response);
          this.myLecList = response.data.result;
        })
        .catch(function (error) {
          alert('readLecList() 에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    /** 상담 한 건 조회*/
    selectCns: function () {
      let params = new URLSearchParams();
      params.append('cnsSeq', this.cnsSeq);

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
    /** 삭제 버튼 클릭 */
    delCounsel: function () {
      this.action = 'D';
      this.saveCounsel();
    },
    /** 상담 C U D */
    saveCounsel: function () {
      if (this.action == 'I') {
        console.log(`${this.action} 작업중`);
        let checkitem = [
          { itemname: 'selLecSeq', emptymsg: '강의를 선택해주세요.' },
          { itemname: 'selStuId', emptymsg: '학생을 선택해주세요.' },
          { itemname: 'cnsDate', emptymsg: '상담 날짜를 입력해주세요.' },
          { itemname: 'cnsPlace', emptymsg: '상담 장소를 입력해주세요.' },
          {
            itemname: 'cnsUpdate',
            emptymsg: '상담 수정 날짜를 입력해주세요.',
          },
          { itemname: 'cnsCont', emptymsg: '상담 내용을 입력해주세요.' },
        ];
        //console.log(this.$emptyValidation(checkitem));
        if (this.$emptyValidation(checkitem)) {
          console.log(`${this.action} 작업중`);
          this.sendCnsData();
        }
      } else if (this.action == 'U') {
        console.log(`${this.action} 작업중`);
        let checkitem = [
          { itemname: this.cnsDate, emptymsg: '상담 날짜를 입력해주세요.' },
          { itemname: this.cnsPlace, emptymsg: '상담 장소를 입력해주세요.' },
          {
            itemname: this.cnsUpdate,
            emptymsg: '상담 수정 날짜를 입력해주세요.',
          },
          { itemname: this.cnsCont, emptymsg: '상담 내용을 입력해주세요.' },
        ];
        console.log(this.$emptyValidation(checkitem));
        if (this.$emptyValidation(checkitem)) {
          this.sendCnsData();
        }
      } else {
        this.sendCnsData();
      }
    },
    /** 데이터 전송: 유효성 체크하려고 분리 */
    sendCnsData: function () {
      let lecSeq = this.selLecSeq;
      let action = this.action;
      let cnsCont = this.cnsCont;
      let cnsDate = this.cnsDate;
      let cnsUpdate = this.cnsUpdate;
      let cnsPlace = this.cnsPlace;
      let cnsSeq = this.cnsSeq;

      console.log(action + '작업 중입니다.');

      let alertmsg = '';

      if (action == 'I') {
        alertmsg = '등록';
      } else if (action == 'U') {
        alertmsg = '수정';
      } else if (action == 'D') {
        alertmsg = '삭제';
      }

      let params = new URLSearchParams();
      params.append('lecSeq', lecSeq);
      params.append('stuID', this.selStuId);
      params.append('cnsSeq', cnsSeq);
      params.append('action', action);
      params.append('cnsCont', cnsCont);
      params.append('cnsDate', cnsDate);
      params.append('cnsUpdate', cnsUpdate);
      params.append('cnsPlace', cnsPlace);

      //swal start
      this.$swal
        .fire({
          text: '상담을 ' + alertmsg + ' 하시겠습니까?',
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
                  this.$swal(alertmsg + ' 완료되었습니다.', {
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
    /**창 닫기 */
    cancelModal: function () {
      closeModal(this);
    },
  }, // methods end
  watch: {
    /** 과정명 변경시 */
    selLecSeq: function () {
      if (this.action === 'I') {
        let cLecName = document.querySelector('#cLecName');
        let params = new URLSearchParams();
        let lecName = cLecName.options[cLecName.selectedIndex].dataset.name;
        console.log(`선택한 과정명 ${lecName}`);
        params.append('lecName', lecName);
        this.axios
          .post('/ac/vuecomStuList.do', params)
          .then((response) => {
            console.log('학생 리스트');
            console.log(response);
            this.stuList = response.data.result;
          })
          .catch((error) => {
            alert(`selLecSeq() 에러, API요청 오류 ${error}`);
          });
      }
    },
  },
};
</script>
