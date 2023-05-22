<template>
  <div id="layer1" class="layerPop layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>시험 응시</strong>
      </dt>
      <dd class="content">
        <div style="overflow: auto; width: 550px; height: 700px">
          <table class="col">
            <caption>
              caption
            </caption>
            <colgroup>
              <col width="15%" />
              <col width="35%" />
              <col width="15%" />
              <col width="35%" />
            </colgroup>
            <thead>
              <tr>
                <th scope="row">시험명</th>
                <th style="background-color: #ffffff" v-html="testname"></th>
                <th scope="col">점수</th>
                <th style="background-color: #ffffff" v-html="testsco"></th>
              </tr>
              <tr>
                <th scope="col">과정명</th>
                <th style="background-color: #ffffff" v-html="lecname"></th>
                <th scope="col">강사명</th>
                <th style="background-color: #ffffff" v-html="tchname"></th>
              </tr>
              <tr>
                <th scope="row" colspan="4">시험 문제</th>
              </tr>
            </thead>
            <tbody id="testinfo">
              <template v-if="totalcnt == 0">
                <tr>
                  <td colspan="4">등록된 문제가 없습니다.</td>
                </tr>
              </template>
              <template v-else>
                <tr></tr>
                <template v-for="(item, index) in listitems" :key="item">
                  <template v-if="type == 'R'">
                    <!-- <script>
                      $("input:radio[name='ans${status.index}']").click(function(event) {
                  															event.preventDefault();
                  															//event.stopPropagation();
                  														}); 
                    </script> -->
                  </template>
                  <tr>
                    <td colspan="4" style="text-align: left">
                      {{ item.quest_num }}번. {{ item.quest_qst }}
                      <input type="hidden" v-model="rans[index]" />
                      <input type="hidden" v-model="sco[index]" />
                      <input type="hidden" v-model="seq[index]" />
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" style="text-align: left">
                      <!-- <input type="radio" :name="'ans' + index" value="1" onclick="reads" v-model="ans[index]">{{
                        item.quest_one }}<br>
                      <input type="radio" :name="'ans' + index" value="2" onclick="reads" v-model="ans[index]">{{
                        item.quest_two }}<br>
                      <input type="radio" :name="'ans' + index" value="3" onclick="reads" v-model="ans[index]">{{
                        item.quest_three }}<br>
                      <input type="radio" :name="'ans' + index" value="4" onclick="reads" v-model="ans[index]">{{
                        item.quest_four }}<br> -->
                      <template v-if="types == 'R'">
                        <input type="radio" :name="'ans' + index" value="1" onclick="return false;"
                          v-model="ans[index]">{{
                            item.quest_one }}<br>
                        <input type="radio" :name="'ans' + index" value="2" onclick="return false;"
                          v-model="ans[index]">{{
                            item.quest_two }}<br>
                        <input type="radio" :name="'ans' + index" value="3" onclick="return false;"
                          v-model="ans[index]">{{
                            item.quest_three }}<br>
                        <input type="radio" :name="'ans' + index" value="4" onclick="return false;"
                          v-model="ans[index]">{{
                            item.quest_four }}<br>
                      </template>
                      <template v-else>
                        <input type="radio" :name="'ans' + index" value="1" v-model="ans[index]">{{
                          item.quest_one }}<br>
                        <input type="radio" :name="'ans' + index" value="2" v-model="ans[index]">{{
                          item.quest_two }}<br>
                        <input type="radio" :name="'ans' + index" value="3" v-model="ans[index]">{{
                          item.quest_three }}<br>
                        <input type="radio" :name="'ans' + index" value="4" v-model="ans[index]">{{
                          item.quest_four }}<br>
                      </template>
                      <template v-if="ans[index] != rans[index] && types == 'R'">
                        <span class="font_red">정답 : {{ item.quest_ans }}</span>
                      </template>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
        <div class="btn_areaC mt30">
          <template v-if="types != 'R'">
            <a href="" class="btnType blue" id="test1" name="btn" @click.prevent="fn_testinsertchk()"><span>제출</span></a>
          </template>
          <a href="" class="btnType gray" id="btnClose" name="btn" @click.prevent="close()"><span>취소</span></a>
        </div>
      </dd>
    </dl>
    <a href="" class="closePop"><span class="hidden" @click.prevent="close()">닫기</span></a>
  </div>
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';
import Swal from 'sweetalert2';

export default {
  props: {
    lecseqs: Number,
    action: String,
    read: String,
    testtypes: Number,
  },
  data: function () {
    return {
      lecseq: 0,
      testname: '',
      testsco: '',
      lecname: '',
      tchname: '',
      totalcnt: 0,
      listitems: [],
      types: '',
      testtype: 0,
      testresult: [],
      rans: [],
      sco: [],
      seq: [],
      ans: [],
      reads: "return false;",
      checkflex: false,
    };
  },
  mounted() {
    this.lecseq = this.lecseqs;
    this.types = this.action;
    this.reads = this.read;
    this.testtype = this.testtypes;
    this.fn_testinfo();
  },
  methods: {
    close: function () {
      closeModal(this);
    },
    fn_testinfo: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('lec_seq', this.lecseqs);
      params.append('type', this.types);

      this.axios.post('/stu/vuetestinfo.do', params).then(function (response) {
        vm.testname = response.data.testin.test_name;
        vm.testsco = response.data.testin.test_sco;
        vm.lecname = response.data.testin.lec_name;
        vm.tchname = response.data.testin.tch_name;
        vm.totalcnt = response.data.totalcnt;
        vm.listitems = response.data.testinfo;
        for (var i = 0; i < 10; i++) {
          vm.sco[i] = response.data.testinfo[i].quest_sco;
          vm.seq[i] = response.data.testinfo[i].test_seq;
          vm.rans[i] = response.data.testinfo[i].quest_ans;
          vm.ans[i] = response.data.testresult[i];
        }
      });
    },
    fn_testinsertchk: function () {
      for (var i = 0; i < 10; i++) {
        if (this.ans[i] == null || this.ans[i] == undefined) {
          Swal.fire({
            text: i + 1 + '번째 문제를 체크해 주세요.',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
          });
          return true;
        }
      }
      this.fn_testinsert();
    },
    fn_testinsert: function () {
      let params = new URLSearchParams();
      params.append('lec_seq', this.lecseq);
      params.append('testtype', this.testtype);
      params.append('rans', this.rans);
      params.append('ans', this.ans);
      params.append('sco', this.sco);
      params.append('seq', this.seq);
      console.log("################" + this.rans);
      this.axios.post('/stu/Vuechejum2.do', params).then(function (response) {
        console.log("####################" + JSON.stringify(response.data));
        if (response.data >= 80) {
          Swal.fire({
            text: "합격을 축하합니다.",
            icon: 'success',
            showCancelButton: true,
            cancelButtonColor: '#d33',
          });
        } else {
          Swal.fire({
            text: "불합격이다. 다시 공부해라",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
          });
        }
      });
      this.close();

    },

    fn_reads: function () {
      return 'return false';
    },
  },
};
</script>
