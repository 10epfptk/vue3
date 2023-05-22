<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">커뮤니티</span>
    <span class="btn_nav bold">설문조사 관리</span>
  </p>
  <p class="conTitle" id="selBoxArea">
    <span>설문조사 관리</span>
    <span class="fr">
      <select
        id="tchselect"
        name="tchselect"
        v-model="selectedcom"
        style="width: 150px"
      >
        <option value="">전체</option>
        <option
          v-for="(item, index) in comList.tchid"
          v-bind:value="item"
          :key="index"
        >
          {{ comList.tchname[index] }}
        </option>
      </select>
      <div v-for="(item, index) in idList" v-bind:key="item.id">
        <div v-bind:id="index"></div>
      </div>
    </span>
  </p>
  <!-- 강사 리스트 출력 -->
  <div id="teacherListArea">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="25%" />
        <col width="20%" />
        <col width="25%" />
        <col width="30%" />
      </colgroup>

      <thead>
        <tr>
          <th scope="col">강사ID</th>
          <th scope="col">강사명</th>
          <th scope="col">강사 전화번호</th>
          <th scope="col">강사 이메일</th>
        </tr>
      </thead>

      <template v-if="tchList.teacherCnt == 0">
        <tbody>
          <td colspan="4">데이터가 존재하지 않습니다.</td>
        </tbody>
      </template>

      <template v-else>
        <tbody v-for="list in tchList.teacherList" :key="list.email">
          <tr v-on:click="getlecList('', list.loginID)">
            <td>{{ list.loginID }}</td>
            <td>{{ list.name }}</td>
            <td>{{ list.hp }}</td>
            <td>{{ list.email }}</td>
          </tr>
        </tbody>
      </template>

      <tbody id="tbodyteacherList"></tbody>
    </table>
    <div id="tchPagination">
      <Paginate
        class="justify-content-center"
        v-model="tchList.currentPage"
        :page-count="tchList.totalpage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="getechList"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      />
    </div>
  </div>
  <br />
  <!-- 강의 리스트 출력 -->
  <div id="lecListArea" v-if="lecListShow">
    <p class="conTitle"><span>강사</span> <span class="fr"> </span></p>

    <div id="tDetailist">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="20%" />
          <col width="20%" />
          <col width="20%" />
          <col width="20%" />
          <col width="20%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">과목</th>
            <th scope="col">강사명</th>
            <th scope="col">강의 시작일</th>
            <th scope="col">강의 종료일</th>
            <th scope="col">설문인원/수강인원</th>
          </tr>
        </thead>

        <template v-if="lecList.tDetailCnt == 0">
          <tbody>
            <td colspan="5">데이터가 존재하지 않습니다.</td>
          </tbody>
        </template>

        <template v-else>
          <tbody v-for="list in lecList.tDetailList" :key="list.lec_seq">
            <tr v-on:click="drawdatasel(list.lec_seq)">
              <td>{{ list.lec_name }}</td>
              <td>{{ list.name }}</td>
              <td>{{ list.lec_st }}</td>
              <td>{{ list.lec_ed }}</td>
              <td>{{ list.sendq }}/{{ list.lec_now }}</td>
            </tr>
          </tbody>
        </template>
      </table>
      <div id="lecPagination">
        <Paginate
          class="justify-content-center"
          v-model="lecList.currentPage"
          :page-count="lecList.totalpage"
          :page-range="5"
          :margin-pages="0"
          :click-handler="getlecList"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        />
      </div>
    </div>
  </div>
  <br />
  <!-- 설문조사 그래프 영역 drawdatasel-->
  <div id="graphArea" v-show="grapInfo.isgraphshow">
    <select
      id="queselectbox"
      name="queselectbox"
      v-model="selectedque"
      style="width: 150px; float: right"
    >
      <option v-for="num in 10" :value="num" :key="num">
        {{ num }}번 문항
      </option>
    </select>
    <div
      id="columnchart_material"
      :style="{
        width: '100%',
        height: '500px',
        marginTop: '40px',
        clear: 'both',
      }"
    >
      <GChart
        type="ColumnChart"
        :data="grapInfo.drawdata"
        :options="chartOptions"
        :style="{ width: '100%', height: '500px' }"
      />
      {{ chartOptions }}
    </div>
  </div>
</template>
<script>
import { GChart } from 'vue-google-charts';
import Paginate from 'vuejs-paginate-next';
import { onMounted, ref, reactive, watch } from 'vue';
import axios from 'axios';

export default {
  components: {
    Paginate,
    GChart,
  },
  setup() {
    onMounted(() => {
      getechList();
    });

    const selectedcom = ref('');
    const selectedque = ref(1);
    const lecListShow = ref(false);

    watch(selectedcom, () => {
      tchList.currentPage = 1;
      getechList();
    });

    const comList = reactive({
      tchid: [],
      tchname: [],
    });

    const tchList = reactive({
      teacherCnt: 0,
      teacherList: [],
      pageSize: 1,
      currentPage: 1,
      totalpage: 0,
      loginID: '',
    });

    const lecList = reactive({
      tDetailCnt: 0,
      tDetailList: [],
      pageSize: 1,
      currentPage: 1,
      totalpage: 0,
      lecseq: 0,
    });

    const grapInfo = reactive({
      drawdata: [],
      drawtitle: '',
      queseq: 1,
      isgraphshow: false,
    });

    const chartOptions = reactive({
      title: grapInfo.drawtitle,
    });

    function getechList(currentPage) {
      lecList.currentPage = 1;
      currentPage = currentPage || tchList.currentPage;

      const params = new URLSearchParams();
      params.append('loginID', selectedcom.value);
      params.append('currentPage', currentPage);
      params.append('pageSize', tchList.pageSize);

      // for(let [key, value] of params.entries()) {
      //     console.log(key, value)
      // }

      // 강사목록 초기화
      axios.post('/admin/vueteacherList.do', params).then((response) => {
        console.log(response);
        comList.tchid = response.data.tchid;
        comList.tchname = response.data.tchname;

        tchList.teacherCnt = response.data.teacherCnt;
        tchList.teacherList = response.data.teacherList;
        tchList.totalpage = page(tchList.teacherCnt, tchList.pageSize);

        lecListShow.value = false;
        grapInfo.isgraphshow = false;
      });
    }

    function getlecList(currentPage, loginID) {
      currentPage = currentPage || lecList.currentPage;
      tchList.loginID = loginID || tchList.loginID;

      const params = new URLSearchParams();
      params.append('loginID', tchList.loginID);
      params.append('currentPage', lecList.currentPage);
      params.append('pageSize', lecList.pageSize);

      axios.post('/admin/vuetDetailList.do', params).then((response) => {
        lecList.tDetailCnt = response.data.tDetailCnt;
        lecList.tDetailList = response.data.tDetailList;
        lecList.totalpage = page(lecList.tDetailCnt, lecList.pageSize);

        lecListShow.value = true;
        grapInfo.isgraphshow = false;
      });
    }

    function drawdatasel(lecseq, queseq) {
      grapInfo.isgraphshow = true;

      lecList.lecseq = lecseq || lecList.lecseq;
      queseq = queseq || 1;

      const params = new URLSearchParams();
      params.append('lecseq', lecList.lecseq);
      params.append('queseq', queseq);

      axios.post('/admin/drawGraph.do', params).then((response) => {
        const arr = ['매우 만족', '만족', '보통', '불만', '매우 불만'];
        grapInfo.drawdata = [
          ...response.data.drawdata.map((ele, idx) => {
            return idx === 0
              ? Object.values(ele)
              : [arr[idx - 1], parseInt(Object.values(ele)[1])];
          }),
        ];
        chartOptions.title = `${response.data.queseq}번 문항 : ${response.data.drawtitle}`;
        selectedque.value = response.data.queseq;
      });
    }

    watch(selectedque, function (newValue) {
      drawdatasel('', newValue);
    });

    /**
     *
     * @param {*} total 총 데이터 개수
     * @param {*} page  한 화면에 뿌려질 최대 데이터 개수
     */
    function page(total, page) {
      // 총 만들어지는 페이지 개수
      const result = parseInt(total / page);
      // 만들어지고 남는 페이지 개수
      const etc = total % page;
      return etc === 0 ? result : result + 1;
    }

    return {
      comList,
      tchList,
      selectedcom,
      lecListShow,
      getechList,
      getlecList,
      lecList,
      drawdatasel,
      chartOptions,
      grapInfo,
      selectedque,
    };
  },
};
</script>
<style lang="" scoped></style>
