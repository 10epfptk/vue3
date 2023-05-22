<template>
  <div class="content">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">학습 관리</span>
      <span class="btn_nav bold">시험 응시</span>
    </p>

    <p class="conTitle"><span>시험 관리</span> <span class="fr"> </span></p>

    <div id="testlist">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="15%" />
          <col width="15%" />
          <col width="15%" />
          <col width="15%" />
          <col width="20%" />
          <col width="20%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">과정명</th>
            <th scope="col">시험명</th>
            <th scope="col">강사명</th>
            <th scope="col">결과</th>
            <th scope="col">합격 여부</th>
            <th scope="col">시험 상태</th>
          </tr>
        </thead>
        <template v-if="totalcnt === 0">
          <tbody>
            <tr>
              <td colspan="6">수강중인 강의가 없습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody v-for="item in listitem" :key="item">
            <tr>
              <td>{{ item.lec_name }}</td>
              <td>{{ item.lec_test }}</td>
              <td>{{ item.tch_name }}</td>
              <td v-if="item.test_sco == null">-</td>
              <td v-if="item.test_sco != null">{{ item.test_sco }}</td>
              <td v-else-if="item.test_sco == null">미응시</td>
              <td v-if="item.test_sco == null && item.test_state == 'Y'">
                <a
                  href=""
                  class="btnType3 color2"
                  @click.prevent="
                    fn_testinfo(item.lec_seq, item.test_type, 'N')
                  "
                  ><span>시험 보기</span></a
                >
              </td>
              <td v-else-if="item.test_sco == null && item.test_state != 'Y'">
                {{ item.lec_test_state }}
              </td>
              <td v-if="item.test_sco != null && item.test_sco >= 80">합격</td>
              <td v-else-if="item.test_sco != null && item.test_sco < 80">
                불합격
              </td>
              <td v-if="item.test_sco != null && item.test_state != 'E'">
                <a
                  href=""
                  class="btnType3 color1"
                  @click.prevent="
                    fn_testinfo(item.lec_seq, item.test_type, 'R')
                  "
                  ><span>결과 보기</span></a
                >
              </td>
              <td v-else-if="item.test_sco != null && item.test_state == 'E'">
                {{ item.lec_test_state }}
              </td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
    <!-- 페이징 구간 -->
    <div id="testPagination">
      <paginate
        class="justify-content-center"
        v-model="cpage"
        :page-count="totalPage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="fn_testList"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      >
      </paginate>
    </div>
  </div>
</template>
<script>
import { openModal } from 'jenesius-vue-modal';
import mdTest from './mdTest.vue';
import Paginate from 'vuejs-paginate-next';

export default {
  data: function () {
    return {
      listitem: [],
      totalcnt: 0,
      cpage: 1,
      pageSizetest: 5,
      testPagination: '',
      totalPage: 1,
      //pagenavi: '',
      lecseq: 0,
      action: '',
      testtype: 0,

      rlecseq: 0,
      raction: '',
      rtesttype: 0,
      //lecteststate: '',
    };
  },
  components: {
    paginate: Paginate,
  },
  mounted() {
    this.fn_testList();
  },
  methods: {
    fn_testList: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append('pageSize', this.pageSizetest);
      params.append('pagenum', this.cpage);

      this.axios
        .post('/stu/vuetestlist.do', params)
        .then(function (response) {
          console.log(response);
          vm.totalcnt = response.data.totalcnt;
          vm.listitem = response.data.testlist;
          vm.totalPage = vm.page(vm.totalcnt, vm.pageSizetest);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    //fn_test(item.lec_seq, item.test_type, 'N')
    /**
    fn_test: function (lec_seq, test_type, action) {
      this.lecseq = lec_seq;
      this.testtype = test_type;
      this.action = action;

      this.fn_testinfo();
    },
    */
    fn_testinfo: async function (lec_seq, test_type, action) {
      this.lecseq = lec_seq;
      this.testtype = test_type;
      this.action = action;
      console.log('this.action : ' + this.action);

      const modal = await openModal(mdTest, {
        tlecseq: this.lecseq,
        ttesttype: this.testtype,
        taction: this.action,
      });

      modal.onclose = (popupparam) => {
        console.log('Close : ' + popupparam);
        this.fn_testList();
        //return false; //Modal will not be closed
      };
    },

    page: function (total, page) {
      var xx = total % page;
      var result = parseInt(total / page);

      if (xx == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
  },
};
</script>
