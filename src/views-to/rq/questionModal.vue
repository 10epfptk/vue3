<template>
  <div class="layerPop layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>시험 문제 등록</strong>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력  -->
        <table class="row" style="display: table; margin: auto">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="100px" />
            <col width="*" />
            <col width="100px" />
            <col width="*" />
          </colgroup>

          <tbody>
            <tr>
              <th scope="row">문제</th>
              <td colspan="3">
                <input
                  type="text"
                  v-model="queQst"
                  class="inputTxt p100"
                  id="queQst"
                  name="queQst"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">정답</th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  v-model="queAns"
                  id="queAns"
                  name="queAns"
                />
              </td>
              <th scope="row">점수</th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  v-model="queSco"
                  name="queSco"
                  id="queSco"
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th scope="row">보기1</th>
              <td colspan="3">
                <input
                  type="text"
                  v-model="queOne"
                  class="inputTxt p100"
                  name="queOne"
                  id="queOne"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">보기2</th>
              <td colspan="3">
                <input
                  type="text"
                  v-model="queTwo"
                  class="inputTxt p100"
                  name="queTwo"
                  id="queTwo"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">보기3</th>
              <td colspan="3">
                <input
                  type="text"
                  v-model="queThree"
                  class="inputTxt p100"
                  name="queThree"
                  id="queThree"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">보기4</th>
              <td colspan="3">
                <input
                  type="text"
                  v-model="queFour"
                  class="inputTxt p100"
                  name="queFour"
                  id="queFour"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력  -->

        <div class="btn_areaC mt30">
          <a
            class="btnType blue"
            id="btnInsertQue"
            name="btn"
            v-show="insflag"
            @click="save()"
            ><span>등록하기</span></a
          >
          <a
            class="btnType blue"
            id="btnUpdateQue"
            name="btn"
            v-show="delflag"
            @click="updatecon()"
            ><span>수정하기</span></a
          >
          <a
            class="btnType gray"
            id="btnDeleteQueAll"
            name="btn"
            @click="btnDeleteQueAll()"
            style="margin: 0 10px"
            ><span>내용 전부 삭제</span></a
          >
          <a
            class="btnType blue"
            id="btnDeleteQue"
            name="btn"
            v-show="delflag"
            @click="deletecon()"
            ><span>문제 삭제</span></a
          >
        </div>
      </dd>
    </dl>
  </div>
</template>

<!-- <script src="sweetalert2.all.min.js"></script> -->
<script>
import { closeModal } from 'jenesius-vue-modal';
import Swal from 'sweetalert2';

export default {
  props: {
    ptitle: String,
    pscnsseq: Number,
    paction: String,
  },
  data: function () {
    return {
      action: '',
      queQst: '',
      queSeq: 0,
      queAns: '',
      queSco: 10,
      queOne: '',
      queTwo: '',
      queThree: '',
      queFour: '',
      delflag: false,
      insflag: true,
    };
  },
  mounted() {
    this.action = this.paction;
    this.queSeq = this.pscnsseq;
    this.init();
  },
  methods: {
    init: function () {
      if (this.action == 'I') {
        this.delflag = false;
      } else if (this.action == 'U') {
        this.insflag = false;
        this.delflag = true;
        this.fn_initQueForm();
      } else {
        this.delflag = true;
        this.fn_initQueForm();
      }
    },
    // data 존재 유무 확인 후 문제 등록 창 초기화 & 수정하기 클릭 시 해당하는 문제 번호 정보 출력
    fn_initQueForm: function () {
      let vm = this;

      console.log(this.pscnsseq);

      let params = new URLSearchParams();
      params.append('queSeq', this.pscnsseq);

      this.axios
        .post('/rq/vueselectQue.do', params)
        .then(function (response) {
          console.log(response);

          vm.queQst = response.data.selectedQue.quest_qst;
          vm.queAns = response.data.selectedQue.quest_ans;
          vm.queOne = response.data.selectedQue.quest_one;
          vm.queTwo = response.data.selectedQue.quest_two;
          vm.queThree = response.data.selectedQue.quest_three;
          vm.queFour = response.data.selectedQue.quest_four;
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
        alertmsg = '문제를 등록 하시겠습니까?';
        resultmsg = '문제를 등록 되었습니다.';
      } else if (this.action == 'U') {
        alertmsg = '문제를 수정 하시겠습니까?';
        resultmsg = '문제를 수정 되었습니다.';
      } else if (this.action == 'D') {
        alertmsg = '문제를 삭제 하시겠습니까?';
        resultmsg = '문제를 삭제 되었습니다.';
      }

      if (this.queAns > 4) {
        Swal.fire({
          title: '입력하신 정답이 보기 수를 초과했습니다.',
          icon: 'warning',
        });
        return;
      }

      if (this.queQst == '') {
        alert('문제를 입력해 주세요.');
      } else if (this.queAns == '') {
        alert('정답을 입력해 주세요.');
      } else if (this.queOne == '') {
        alert('보기1를 입력해 주세요.');
      } else if (this.queTwo == '') {
        alert('보기2를 입력해 주세요.');
      } else if (this.queThree == '') {
        alert('보기3을 입력해 주세요.');
      } else if (this.queFour == '') {
        alert('보기4를 입력해 주세요.');
      } else {
        if (confirm(alertmsg)) {
          let params = new URLSearchParams();

          params.append('action', this.action);
          params.append('queSeq', this.queSeq);
          params.append('queQst', this.queQst);
          params.append('queAns', this.queAns);
          params.append('queOne', this.queOne);
          params.append('queTow', this.queTwo);
          params.append('queThree', this.queThree);
          params.append('queFour', this.queFour);
          params.append('queSco', this.queSco);

          this.axios
            .post('/rq/saveQuestion.do', params)
            .then(function (response) {
              console.log(response);

              if (response.data.result == 1) {
                alert(resultmsg);
                closeModal(vm);
                vm.emitter.emit('result', 'success');
              }
            })
            .catch(function (error) {
              alert('에러! API 요청에 오류가 있습니다. ' + error);
            });
        } else {
          Swal.fire({
            title: '취소되었습니다.',
            icon: 'warning',
          });
        }
      }
    },
    updatecon: function () {
      this.action = 'U';
      console.log(this.action);
      this.save();
      console.log(this.result);
    },
    deletecon: function () {
      this.action = 'D';
      console.log(this.action);
      this.save();
    },
    btnDeleteQueAll: function () {
      let vm = this;

      console.log(this.pscnsseq);

      let params = new URLSearchParams();
      params.append('queSeq', this.pscnsseq);

      this.axios
        .post('/rq/vueselectQue.do', params)
        .then(function (response) {
          console.log(response);
          console.log(response.data.selectedQue);
          vm.queQst = '';
          vm.queAns = '';
          vm.queOne = '';
          vm.queTwo = '';
          vm.queThree = '';
          vm.queFour = '';
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
  },
};
</script>