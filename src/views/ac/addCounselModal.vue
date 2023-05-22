<template>
  <dl>
    <dt>
      <strong>{{ ptitle }}</strong>
    </dt>
    <dd class="content">
      <!-- s : 여기에 내용입력 -->
      <table>
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="170px" />
          <col width="*" />
          <col width="170px" />
          <col width="*" />
        </colgroup>

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
              <select id="cStuName" name="cStuName" v-model="cStuName">
                <option value="">학생 선택</option>

                <template v-for="item in stdlist" :key="item.stu_id">
                  <option :value="item.stu_id">{{ item.stu_name }}</option>
                </template>
              </select>
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
                v-model="cnsCont"
                placeholder="상담 내용을 입력해주세요."
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- e : 여기에 내용입력 -->

      <div class="btn_areaC mt30">
        <a class="btnType blue" id="btnSaveCounsel" name="btn" @click="save()"
          ><span>저장</span></a
        >
        <a
          class="btnType blue"
          id="btnDeleteCounsel"
          name="btn"
          v-show="delflag"
          @click="deletecon()"
          ><span>삭제</span></a
        >
      </div>
    </dd>
  </dl>
</template>

<script>
import { closeModal } from 'jenesius-vue-modal';

export default {
  props: {
    ptitle: String,
    pslecseq: Number,
    pscnsseq: Number,
    paction: String,
    pslecname: String,
  },
  data: function () {
    return {
      cLecName: '',
      cStuName: '',
      cStuHanName: '',
      cnsDate: '',
      cnsPlace: '',
      cnsUpdate: '',
      cnsCont: '',
      action: '',
      cnsseq: 0,
      delflag: false,
      slecseq: 0,
      slecname: '',
      stdlist: [],
    };
  },
  mounted() {
    this.action = this.paction;
    this.slecseq = this.pslecseq;
    this.slecname = this.pslecname;

    //alert(this.pslecname);

    this.selectstucombo();

    if (this.action == 'I') {
      this.init();
    } else {
      this.cnsseq = this.pscnsseq;
      this.selectcon();
    }
  },
  methods: {
    init: function (pobject) {
      if (this.action == 'I') {
        this.cLecName = this.slecname;
        this.cStuName = '';
        this.cnsDate = '';
        this.cnsPlace = '';
        this.cnsUpdate = '';
        this.cnsCont = '';
        this.cnsseq = 0;
        this.delflag = false;
      } else {
        this.cLecName = pobject.lec_name;

        // alert(pobject.stu_id);

        this.cStuName = pobject.stu_id;
        this.cStuHanName = pobject.stu_name;
        this.cnsDate = pobject.cns_date;
        this.cnsPlace = pobject.cns_place;
        this.cnsUpdate = pobject.cns_update;
        this.cnsCont = pobject.cns_cont;
        this.delflag = true;
      }

      //cns_cont: "상담 테스트"
      //cns_date: "2023-04-04"
      //cns_place: "1004강의실"
      //cns_seq: 0
      //cns_update: "2023-04-04"
      //lec_name: "222"
      //lec_seq: 0
      //loginID: "admin"
      //name: "관리자"
      //stu_id: "student8"
      //stu_name "학생8"
      //ts_sco: "0"
    },
    selectcon: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append('cnsSeq', this.cnsseq);

      this.axios
        .post('/ac/selectedCounsel.do', params)
        .then(function (response) {
          console.log(response);

          vm.init(response.data.cnsInfo);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    selectstucombo: function () {
      let vm = this;

      //alert(this.slecname);

      let params = new URLSearchParams();
      params.append('lecName', this.slecname);

      this.axios
        .post('/ac/vuecomStuList.do', params)
        .then(function (response) {
          console.log(response);
          vm.stdlist = response.data.result;

          vm.cStuName = '';
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    save: function () {
      let vm = this;

      let alertmsg = '';
      let resultmsg = '';

      if (this.action == 'I') {
        alertmsg = '상담을 등록 하시겠습니까?';
        resultmsg = '상담을 등록 되었습니다.';
      } else if (this.action == 'U') {
        alertmsg = '상담을 수정 하시겠습니까?';
        resultmsg = '상담을 수정 되었습니다.';
      } else if (this.action == 'D') {
        alertmsg = '상담을 삭제 하시겠습니까?';
        resultmsg = '상담을 삭제 되었습니다.';
      }

      if (this.cnsCont == '') {
        alert('상담 내용을 입력해 주세요.');
      } else if (this.cnsDate == '') {
        alert('상담 일자를 입력해 주세요.');
      } else if (this.cnsUpdate == '') {
        alert('상담 최종수정일자를 입력해 주세요.');
      } else if (this.cnsPlace == '') {
        alert('상담 장소를 입력해 주세요.');
      } else if (this.cStuName == '') {
        alert('상담 학생을 입력해 주세요.');
      } else {
        if (confirm(alertmsg)) {
          let params = new URLSearchParams();

          params.append('action', this.action);
          params.append('lecName', this.cLecName);
          params.append('lecSeq', this.slecseq);
          params.append('cnsSeq', this.cnsseq);
          params.append('stuName', this.cStuHanName);
          params.append('stuID', this.cStuName);
          params.append('cnsCont', this.cnsCont);
          params.append('cnsDate', this.cnsDate);
          params.append('cnsUpdate', this.cnsUpdate);
          params.append('cnsPlace', this.cnsPlace);

          this.axios
            .post('/ac/saveCounsel.do', params)
            .then(function (response) {
              console.log(response);

              if (response.data.result == 1) {
                alert(resultmsg);
                closeModal(vm);
              }
            })
            .catch(function (error) {
              alert('에러! API 요청에 오류가 있습니다. ' + error);
            });
        }
      }
    },
    deletecon: function () {
      this.action = 'D';
      this.save();
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
