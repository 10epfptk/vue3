<template>
  <div class="content">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">통계</span>
      <span class="btn_nav bold">과락 비율</span>
    </p>

    <!-- 제목 + 서치바 -->
    <p class="conTitle" id="conTitle">
      <span>과락 비율</span>
      <span class="fr">
        <div
          style="width: 650px; display: flex; justify-content: space-between"
        >
          <div>
            <span>강 의 명</span>&nbsp;
            <input
              type="text"
              id="lecName"
              class="searchKeyWord"
              v-model="lecName"
              @keyup.enter="searchFailureList"
            />
          </div>
          <div>
            <span>개 강 일</span>&nbsp;
            <input
              type="date"
              id="lecStart"
              v-model="lecStart"
              style="width: 96px; height: 24px"
            />
          </div>
          <div>
            <span>종 강 일</span>&nbsp;
            <input
              type="date"
              id="lecEnd"
              v-model="lecEnd"
              style="width: 96px; height: 24px"
            />
          </div>
          <a href="" @click.prevent="searchFailureList" class="btnType blue">
            <span>검 색</span>
          </a>
        </div>
      </span>
    </p>

    <!-- 테이블 -->
    <div id="failureTable" style="height: 20rem">
      <table class="col">
        <!-- 테이블간 간격 조정 전체 :: 100% -->
        <colgroup>
          <col width="30%" />
          <col width="25%" />
          <col width="25%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th colspan="5">강의 과락 비율</th>
          </tr>
          <tr>
            <th scope="col">과 정 명</th>
            <th scope="col">개 강 일</th>
            <th scope="col">종 강 일</th>
            <th scope="col">과 정 일 수</th>
            <th scope="col">수 강 인 원</th>
          </tr>
        </thead>
        <template v-if="totalCnt == 0">
          <tbody>
            <tr>
              <td colspan="5">조회된 데이터가 없습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody v-for="list in lecList" :key="list.lecSeq" id="lecListTr">
            <tr @Click="detailRatio(list.lecSeq)">
              <td>{{ list.lecName }}</td>
              <td>{{ list.lecStart }}</td>
              <td>{{ list.lecEnd }}</td>
              <td>{{ list.lecDays }} 일</td>
              <td>{{ list.lecNow }} 명</td>
            </tr>
          </tbody>
        </template>
      </table>
      <br />
      <div id="failurePaging">
        <paginate
          class="justify-content-center"
          v-model="currentPage"
          :page-count="totalPage"
          :page-range="5"
          :margin-pages="0"
          :click-handler="searchFailureList"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        >
        </paginate>
      </div>
    </div>
    <!-- chart를 그려보아요 -->
    <div
      style="
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        height: 650px;
        justify-content: center;
        border-style: solid 1px black;
      "
      v-show="graphShow"
    >
      <div id="graphLecName">
        <span>[{{ graphLecName }}]</span>
      </div>
      <div style="width: 700px text-align:center;">
        <canvas
          id="BarChart"
          style="width: 500px; height: 600px !important"
        ></canvas>
      </div>

      <!-- <barChart id="chart"></barChart> -->

      <!-- <span id="failureChart" style="width: 20rem"></span> -->
    </div>
  </div>
</template>

<script>
import paginate from 'vuejs-paginate-next';
//import barChart from '@/views/admin/VuefailureBarChart.vue';
import { Chart } from 'chart.js';
export default {
  data: function () {
    return {
      lecStart: '',
      lecEnd: '',

      lecList: [],
      totalCnt: 0,

      currentPage: 1,
      pageSize: 5,
      blockSize: 10,

      lecSeq: 0,
      lecName: '',

      graphLecName: '',
      upCount: 0,
      downCount: 0,
      graphShow: false,
    };
  },
  components: {
    paginate: paginate,
    //barChart: barChart,
  },
  mounted() {
    this.searchFailureList();
    this.graphShow = false;
    //this.makeFailureChart();
  },
  methods: {
    /** 강의 리스트 조회 */
    searchFailureList: function (pageNum) {
      this.currentPage = pageNum || 1;
      if (this.lecStart != '' && this.lecEnd != '') {
        if (
          this.lecEnd.replaceAll('-', '') - this.lecStart.replaceAll('-', '') <
          0
        )
          return this.$swal('올바른 기간을 선택해주세요.');
      }

      let params = new URLSearchParams();
      params.append('pageNum', this.currentPage);
      params.append('listCount', this.pageSize);
      params.append('lecName', this.lecName);
      params.append('lecStart', this.lecStart);
      params.append('lecEnd', this.lecEnd);

      this.axios
        .post('/admin/VuefailureList.do', params)
        .then((response) => {
          console.log('강의 목록');
          console.log(response);
          this.lecList = response.data.failureList;
          this.totalCnt = response.data.failureCount;
          this.totalPage = this.page(this.totalCnt, this.pageSize);
        })
        .catch((error) => {
          alert('searchFailureList() 에러:' + error);
        });
    },
    /**페이징 */
    page: function (total, page) {
      let remainder = total % page;
      let pageCnt = parseInt(total / page);

      if (remainder == 0) {
        return pageCnt;
      } else {
        return (pageCnt += 1);
      }
    },
    detailRatio: function (lecSeq) {
      const params = new URLSearchParams();
      params.append('lecSeq', lecSeq);
      this.graphShow = true;
      this.axios
        .post('/admin/failureRatio.do', params)
        .then((response) => {
          console.log('그래프 데이터');
          console.log(response);
          if (response.data.failureRatio.totalCount < 1) {
            this.$swal('데이터가 없습니다.');
            this.graphShow = false;
            this.searchFailureList();
            return;
          } else {
            this.upCount = response.data.failureRatio.upCount;
            this.downCount = response.data.failureRatio.downCount;
            this.graphLecName = response.data.failureRatio.lecName;
            console.log(`통과 ${this.upCount}명, 과락 ${this.downCount}명`);
            this.makeFailureChart();
          }
        })
        .catch((error) => {
          alert('detailRatio 에러: ' + error);
        });
    },
    makeFailureChart: function () {
      const canvas = document.getElementById('BarChart');
      console.log(canvas);
      const ctx = canvas.getContext('2d');
      console.log(
        `통과 ${this.upCount}명, 과락 ${this.downCount}명 그래프 그릴거임`
      );
      const BarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          //가로
          labels: ['통과', '과락'],
          //세로
          datasets: [
            {
              label: '통과/과락',
              data: [this.upCount, this.downCount],
              backgroundColor: [
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false, //캔버스 크기 조정
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  stepSize: 1,
                },
              },
            ],
          },
        },
      });
      BarChart;
    },
  },
};
</script>
<style>
#lecListTr tr:hover {
  cursor: pointer;
  background-color: rgba(184, 184, 184, 0.5);
}

#graphLecName {
  font-weight: bold;
  font-size: 20px;
  width: 700px;
  text-align: center;
}
</style>
