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
                <th style="background-color: #ffffff" v-text="testname"></th>
                <th scope="col">점수</th>
                <th style="background-color: #ffffff" v-text="testsco"></th>
              </tr>
              <tr>
                <th scope="col">과정명</th>
                <th style="background-color: #ffffff" v-text="lecname"></th>
                <th scope="col">강사명</th>
                <th style="background-color: #ffffff" v-text="tchname"></th>
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
                      <template v-if="type == 'R'">
                        <input
                          type="radio"
                          :name="'ans' + index"
                          value="1"
                          onclick="return false;"
                          v-model="ans[index]"
                        />{{ item.quest_one }}<br />
                        <input
                          type="radio"
                          :name="'ans' + index"
                          value="2"
                          onclick="return false;"
                          v-model="ans[index]"
                        />{{ item.quest_two }}<br />
                        <input
                          type="radio"
                          :name="'ans' + index"
                          value="3"
                          onclick="return false;"
                          v-model="ans[index]"
                        />{{ item.quest_three }}<br />
                        <input
                          type="radio"
                          :name="'ans' + index"
                          value="4"
                          onclick="return false;"
                          v-model="ans[index]"
                        />{{ item.quest_four }}<br />
                      </template>
                      <template v-else>
                        <input
                          type="radio"
                          :name="'ans' + index"
                          value="1"
                          v-model="ans[index]"
                        />{{ item.quest_one }}<br />
                        <input
                          type="radio"
                          :name="'ans' + index"
                          value="2"
                          v-model="ans[index]"
                        />{{ item.quest_two }}<br />
                        <input
                          type="radio"
                          :name="'ans' + index"
                          value="3"
                          v-model="ans[index]"
                        />{{ item.quest_three }}<br />
                        <input
                          type="radio"
                          :name="'ans' + index"
                          value="4"
                          v-model="ans[index]"
                        />{{ item.quest_four }}<br />
                      </template>

                      <template v-if="ans[index] != rans[index] && type == 'R'">
                        <span class="font_red"
                          >정답 : {{ item.quest_ans }}</span
                        >
                      </template>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
        <!--값이 들어오는지 확인하는 용도
        <div>{{ ans }}</div>-->

        <div class="btn_areaC mt30">
          <template v-if="type != 'R'">
            <a
              href=""
              class="btnType blue"
              id="test1"
              name="btn"
              @click.prevent="fn_testinsertchk()"
              ><span>제출</span></a
            >
          </template>
          <a
            href=""
            class="btnType gray"
            id="btnClose"
            name="btn"
            @click.prevent="fn_close()"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>
    <!-- <a href="" class="closePop"><span class="hidden">닫기</span></a> -->
  </div>
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';
import Swal from 'sweetalert2';

export default {
  props: {
    tlecseq: Number,
    ttesttype: String,
    taction: String,
  },
  data: function () {
    return {
      radioValues: '',
      testname: '',
      testsco: '',
      lecname: '',
      tchname: '',
      totalcnt: 0,
      listitems: [],
      type: '',
      testresult: [], //타입 모름 나중에 확인
      //input 쪽  model
      rans: [],
      sco: [],
      seq: [],
      ans: [],
      read: 'return false;',
    };
  },
  components: {},
  //   초기값 mounted에서 설정
  mounted() {
    console.log(this.tlecseq);
    console.log(this.ttesttype);
    console.log(this.taction);

    this.type = this.taction;
    if (this.type == 'R') {
      this.read = 'return false;';
    } else {
      this.read = 'return true;';
    }
    this.fn_testinfo();
  },
  methods: {
    fn_pre: function () {
      //시험 결과 뜨면 라디오 버튼 클릭 안 되도록하기
    },
    fn_testinsertchk: function () {
      //제출버튼 누르면 유효성 검사 및 전송
      for (let i = 0; i < 10; i++) {
        if (!this.ans[i]) {
          // false true

          Swal.fire({
            text: i + 1 + '번 째 문제를 체크해 주세요.',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
          });

          //alert(i + 1 + '번 째 문제를 체크해 주세요.');

          return true;
        }
      }
      //유효성 검사 후 fn_testinsert 함수타게하기
      this.fn_testinsert();
    },

    fn_close: function () {
      closeModal(this);
    },

    fn_testinfo: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('lec_seq', this.tlecseq);
      params.append('type', this.ttesttype);

      vm.axios
        .post('/stu/vuetestinfo.do', params)
        .then(function (response) {
          console.log(response);

          let res = response.data.testin;
          vm.testname = res.test_name;
          vm.testsco = res.test_sco;
          vm.lecname = res.lec_name;
          vm.tchname = res.tch_name;
          vm.totalcnt = response.data.totalcnt;
          vm.listitems = response.data.testinfo;

          for (let i = 0; i < 10; i++) {
            vm.sco[i] = response.data.testinfo[i].quest_sco;
            vm.seq[i] = response.data.testinfo[i].test_seq; //test_seq, quest_num 문제번호
            vm.rans[i] = response.data.testinfo[i].quest_ans; //quest_ans 문제정답
            vm.ans[i] = response.data.testresult[i]; //답한 결과보기
            console.log('10번 돈다~ : ' + vm.ans[i]);
          }
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    fn_testinsert: function () {
      let vm = this;

      let params = new URLSearchParams();

      params.append('lec_seq', this.tlecseq);
      params.append('testtype', this.ttesttype);
      params.append('rans', this.rans); //정답
      params.append('ans', this.ans); //학생이 체크한 답
      params.append('sco', this.sco); //문항점수
      params.append('seq', this.seq); //문제 일련 번호
      params.append('testresult', this.testresult);

      console.log(this.tlecseq);
      console.log(this.ttesttype);
      console.log('정답 : ');
      console.log(this.rans);
      console.log('학생이 체크한 답 : ');
      console.log(this.ans);
      console.log('문항점수 : ');
      console.log(this.sco);
      console.log('문제일련번호 : ');
      console.log(this.seq);
      console.log('테스트결과 : ');
      console.log(this.testresult);

      this.axios
        .post('/stu/Vuechejum2.do', params)
        .then(function (response) {
          console.log(response);

          vm.listitems = response.data.testinfo;

          if (response.data >= 80) {
            //alert('합격 축하합니다.');
            Swal.fire({
              text: '합격 축하합니다',
              icon: 'success',
              showCancelButton: true,
              cancelButtonColor: '#d33',
            });
            vm.fn_close();
          } else {
            //alert('불합격입니다.');
            Swal.fire({
              text: '아쉬워요..불합격입니다',
              icon: 'warning',
              showCancelButton: true,
              cancelButtonColor: '#d33',
            });
            vm.fn_close();
          }
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
  },
};
</script>
