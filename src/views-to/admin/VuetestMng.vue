<!-- eslint-disable no-undef -->
<template>
  <div id="comnCodMgr">
    <p class="Location">
      <a href="/dashboard/home" class="btn_set home"></a>
      <span class="btn_nav bold">학습 관리</span>
      <span class="btn_nav bold">시험 관리</span>
    </p>
    <p class="conTitle" id="testsel">
      <span>시험 문제 관리</span>
      <span class="fr">
        <span id="testdiv">
          <!-- selectbox 출력공간 -->
          <select v-model="testseq" id="testseq">
            <option value="all">선택</option>
            <template v-for="(code, index) in detailcode" :key="index">
              <option :value="code">{{ detailname[index] }}</option>
            </template>
          </select>
        </span>
        <a
          class="btnType blue"
          @click="CounselRegPopup('I')"
          name="modal"
          style="margin-left: 10px"
          ><span>시험 등록</span></a
        >
      </span>
    </p>
    <div id="testtotal" v-show="displayflag">
      <div id="btnpocket" class="fr" v-show="testyorn === 'Y'">
        <a class="btnType blue" @click="CounselRegPopup('U')"
          ><span>시험 수정</span></a
        >
        <a
          class="btnType blue"
          @click="CounselRegPopup('D')"
          style="margin-left: 10px"
          ><span>시험 삭제</span></a
        >
      </div>
      <br /><br />

      <div id="testList">
        <table class="col">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="5%" />
            <col width="22%" />
            <col width="5%" />
            <col width="17%" />
            <col width="17%" />
            <col width="17%" />
            <col width="17%" />
          </colgroup>
          <thead>
            <tr>
              <th colspan="7">문제 목록</th>
            </tr>
            <tr>
              <th scope="col">문제 번호</th>
              <th scope="col">문제</th>
              <th scope="col">정답</th>
              <th scope="col">보기1</th>
              <th scope="col">보기2</th>
              <th scope="col">보기3</th>
              <th scope="col">보기4</th>
            </tr>
          </thead>

          <tbody
            id="tbodytestlist"
            v-for="test in testlist"
            :key="test.test_seq"
          >
            <tr>
              <td>{{ test.test_seq }}</td>
              <td>{{ test.quest_qst }}</td>
              <td>{{ test.quest_ans }}</td>
              <td>{{ test.quest_one }}</td>
              <td>{{ test.quest_two }}</td>
              <td>{{ test.quest_three }}</td>
              <td>{{ test.quest_four }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!--// content -->
</template>

<script>
import { openModal } from 'jenesius-vue-modal';
import VuetestMngModal from './VuetestMngModal.vue';

export default {
  data: function () {
    return {
      // vueinit
      detailcode: '',
      detailname: '',
      testseq: 'all',
      // testtotal
      displayflag: false,
      testlist: [],
      testyorn: 'N',
      action: '',
    };
  },
  mounted() {
    this.init();

    this.emitter.on('result', () => {
      console.log('불러졌냐');
      this.init();
      //watch testseq
      this.testseq = 'all';
    });
  },
  methods: {
    init: function () {
      let vm = this;

      this.axios
        .post('/admin/vueselBox.do')
        .then(function (call) {
          console.log(call);
          console.log(call.data.detailname);
          vm.detailcode = call.data.detailcode;
          vm.detailname = call.data.detailname;
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    displaycon: function () {
      this.displayflag = this.testseq === 'all' ? false : true;
    },
    inittest: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append('testtype', this.testseq);

      this.axios
        .post('/admin/vuetestList.do', params)
        .then(function (response) {
          console.log(response);
          vm.testlist = response.data.testlist;
          vm.testyorn = response.data.testyorn;
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    CounselRegPopup: async function (action) {
      this.action = action;

      let paramtitle = '';

      if (action == 'I') {
        paramtitle = '시험 등록';
      } else if (action == 'U') {
        paramtitle = '시험 수정';
        alert('시험 수정');
      } else {
        paramtitle = '시험 삭제';
        alert('시험 삭제');
      }

      const modal = await openModal(VuetestMngModal, {
        ptitle: paramtitle,
        paction: this.action,
        ptestseq: this.testseq,
        pdetailname: this.detailname,
        select: document.querySelector('#testseq').selectedIndex,
        refresh: this.init(),
      });

      modal.onclose = (popupparam) => {
        console.log('Close : ' + popupparam);
        //this.listsearch();
        //return false; //Modal will not be closed
      };
    },
  },
  watch: {
    testseq: function () {
      //본문
      this.inittest();
      //시험 selectbox 선택시 밑에 시험 문제 보임
      this.displaycon();
    },
  },
};
</script>
